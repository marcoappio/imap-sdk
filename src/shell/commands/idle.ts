import type { ParsedResponse } from '@imap-sdk/types/protocol'

import type { CommandContext, ExecResponse } from './types'

const NOOP_INTERVAL = 2 * 60 * 1000

export type IDLEEvent =
  | { type: 'exists'; count: number; prevCount: number }
  | { type: 'expunge'; seq: number }
  | { type: 'fetch'; seq: number; flags?: Set<string>; modseq?: bigint }

export type IDLEOptions = {
  readonly timeout?: number
}

export type IDLEContext = CommandContext & {
  idling: boolean
  preCheck: (() => Promise<void>) | false
  currentLock?: { lockId: string }
  currentSelectCommand?: {
    command: string
    arguments: unknown[]
  }
  missingIdleCommand?: 'SELECT' | 'STATUS' | 'NOOP'
}

type IDLEController = {
  stop: () => void
  events: AsyncGenerator<IDLEEvent, void, unknown>
}

type IDLEState = {
  ctx: IDLEContext
  options: IDLEOptions
  eventQueue: IDLEEvent[]
  stopped: boolean
  idleTimer?: ReturnType<typeof setTimeout>
}

const enqueueEvent = (state: IDLEState, event: IDLEEvent): void => {
  if (state.stopped) {
    return
  }
  state.eventQueue.push(event)
}

const createUntaggedHandlers = (state: IDLEState) => ({
  EXISTS: (response: ParsedResponse) => {
    const count = Number(response.command)

    if (!Number.isNaN(count)) {
      const prevCount = state.ctx.mailbox?.exists ?? 0
      enqueueEvent(state, { count, prevCount, type: 'exists' })
    }
  },
  EXPUNGE: (response: ParsedResponse) => {
    const seq = Number(response.command)

    if (!Number.isNaN(seq)) {
      enqueueEvent(state, { seq, type: 'expunge' })
    }
  },
  FETCH: (response: ParsedResponse) => {
    const seq = Number(response.command)

    if (!Number.isNaN(seq)) {
      enqueueEvent(state, { seq, type: 'fetch' })
    }
  },
})

async function* runIDLECommand(state: IDLEState): AsyncGenerator<IDLEEvent, void, unknown> {
  const { ctx, options } = state
  let doneRequested = false
  let doneSent = false
  let canEnd = false

  const sendDone = (): void => {
    doneRequested = true
    if (canEnd && !doneSent) {
      ctx.log.debug({
        comment: 'breaking IDLE',
        lockId: ctx.currentLock?.lockId,
        msg: 'DONE',
        path: ctx.mailbox?.path,
        src: 'c',
      })
      ctx.write('DONE')
      doneSent = true
      ctx.idling = false
      ctx.preCheck = false
    }
  }

  ctx.preCheck = () => {
    sendDone()
    return Promise.resolve()
  }

  try {
    ctx.idling = true

    const idlePromise = ctx.exec('IDLE', [], {
      onPlusTag: () => {
        ctx.log.debug({
          doneRequested,
          lockId: ctx.currentLock?.lockId,
          msg: 'Initiated IDLE, waiting for server input',
        })
        canEnd = true
        if (doneRequested) {
          sendDone()
        }
      },
      untagged: createUntaggedHandlers(state),
    })

    if (options.timeout) {
      state.idleTimer = setTimeout(() => {
        if (ctx.idling && typeof ctx.preCheck === 'function') {
          ctx.log.trace({ cid: ctx.id, msg: 'IDLE timeout reached' })
          ctx.preCheck().catch(err => ctx.log.warn({ cid: ctx.id, err }))
        }
      }, options.timeout)
    }

    let idleDone = false

    idlePromise.then(() => {
      idleDone = true
    })

    while (!(state.stopped || idleDone)) {
      const event = state.eventQueue.shift()

      if (event) {
        yield event
      } else {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    while (state.eventQueue.length > 0) {
      const event = state.eventQueue.shift()
      if (event) {
        yield event
      }
    }
  } finally {
    if (state.idleTimer) {
      clearTimeout(state.idleTimer)
    }
    if (!doneSent && canEnd) {
      sendDone()
    }
    ctx.idling = false
    ctx.preCheck = false
  }
}

async function* runNOOPFallback(state: IDLEState): AsyncGenerator<IDLEEvent, void, unknown> {
  const { ctx, options } = state

  if (!ctx.currentSelectCommand) {
    return
  }

  ctx.idling = true
  const selectCommand = ctx.currentSelectCommand
  const noopInterval = options.timeout ? Math.min(NOOP_INTERVAL, options.timeout) : NOOP_INTERVAL

  ctx.preCheck = () => {
    ctx.preCheck = false
    if (state.idleTimer) {
      clearTimeout(state.idleTimer)
      state.idleTimer = undefined
    }
    ctx.log.debug({ msg: 'breaking NOOP loop', src: 'c' })
    ctx.idling = false
    state.stopped = true
    return Promise.resolve()
  }

  const runCheck = async (): Promise<void> => {
    let response: ExecResponse

    switch (ctx.missingIdleCommand) {
      case 'SELECT': {
        ctx.log.debug({ msg: 'Running SELECT to detect changes in folder', src: 'c' })

        response = await ctx.exec(selectCommand.command, selectCommand.arguments as never, {
          untagged: { EXISTS: createUntaggedHandlers(state).EXISTS },
        })

        break
      }

      case 'STATUS': {
        const statusArgs = [selectCommand.arguments[0], [] as { type: string; value: string }[]]

        for (const key of ['MESSAGES', 'UIDNEXT', 'UIDVALIDITY', 'UNSEEN']) {
          ;(statusArgs[1] as { type: string; value: string }[]).push({ type: 'ATOM', value: key })
        }

        ctx.log.debug({ msg: 'Running STATUS to detect changes in folder', src: 'c' })
        response = await ctx.exec('STATUS', statusArgs as never)

        break
      }

      default: {
        response = await ctx.exec('NOOP', [], {
          comment: 'IDLE not supported',
          untagged: {
            EXISTS: createUntaggedHandlers(state).EXISTS,
            EXPUNGE: createUntaggedHandlers(state).EXPUNGE,
          },
        })

        break
      }
    }

    response.next()
  }

  try {
    ctx.log.debug({ msg: 'initiated NOOP loop', src: 'c' })

    while (!state.stopped && ctx.idling) {
      await runCheck()

      while (state.eventQueue.length > 0 && !state.stopped) {
        const event = state.eventQueue.shift()
        if (event) {
          yield event
        }
      }

      if (state.stopped || !ctx.idling) {
        break
      }

      await new Promise<void>(resolve => {
        state.idleTimer = setTimeout(resolve, noopInterval)
      })
    }
  } finally {
    if (state.idleTimer) {
      clearTimeout(state.idleTimer)
    }
    ctx.idling = false
    ctx.preCheck = false
  }
}

export const idle = (ctx: IDLEContext, options: IDLEOptions = {}): IDLEController => {
  if (ctx.state !== 'SELECTED') {
    const emptyGenerator: AsyncGenerator<IDLEEvent, void, unknown> = {
      [Symbol.asyncIterator]() {
        return this
      },
      [Symbol.asyncDispose]() {
        return Promise.resolve()
      },
      next() {
        return Promise.resolve({ done: true as const, value: undefined })
      },
      return() {
        return Promise.resolve({ done: true as const, value: undefined })
      },
      throw(e) {
        return Promise.reject(e)
      },
    }
    return { events: emptyGenerator, stop: () => {} }
  }

  const state: IDLEState = {
    ctx,
    eventQueue: [],
    options,
    stopped: false,
  }

  const generator = ctx.capabilities.has('IDLE') ? runIDLECommand(state) : runNOOPFallback(state)

  const wrappedGenerator: AsyncGenerator<IDLEEvent, void, unknown> = {
    [Symbol.asyncIterator]() {
      return this
    },
    [Symbol.asyncDispose]() {
      state.stopped = true
      if (typeof ctx.preCheck === 'function') {
        return ctx.preCheck()
      }
      return Promise.resolve()
    },
    next() {
      if (state.stopped) {
        return Promise.resolve({ done: true as const, value: undefined })
      }
      return generator.next()
    },
    return() {
      state.stopped = true
      if (typeof ctx.preCheck === 'function') {
        return ctx.preCheck().then(() => ({ done: true as const, value: undefined }))
      }
      return Promise.resolve({ done: true as const, value: undefined })
    },
    throw(e) {
      state.stopped = true
      if (typeof ctx.preCheck === 'function') {
        ctx.preCheck().catch(() => {})
      }
      return Promise.reject(e)
    },
  }

  return {
    events: wrappedGenerator,
    stop: () => {
      state.stopped = true
      if (typeof ctx.preCheck === 'function') {
        ctx.preCheck().catch(err => ctx.log.warn({ cid: ctx.id, err }))
      }
    },
  }
}

export type { IDLEContext as IdleContext, IDLEController, IDLEOptions as IdleOptions }
