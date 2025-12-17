import type { FetchedMessage, FetchQuery } from '@imap-sdk/types/message'
import type { ParsedResponse, Token } from '@imap-sdk/types/protocol'

import type { CommandContext } from './types'

const DIGITS_ONLY = /^\d+$/

export type FetchOptions = {
  readonly uid?: boolean
  readonly binary?: boolean
  readonly changedSince?: bigint
  readonly onUntaggedFetch?: (message: FetchedMessage, done: (err?: Error) => void) => void
}

export type FetchResult = {
  readonly count: number
  readonly list: FetchedMessage[]
}

type QueryAtom = {
  type: 'ATOM'
  value: string
  section?: unknown[]
  partial?: number[]
}

const buildQueryStructure = (
  ctx: CommandContext,
  query: FetchQuery,
  commandKey: string,
): (QueryAtom | QueryAtom[])[] => {
  const result: (QueryAtom | QueryAtom[])[] = []

  const setBodyPeek = (attributes: unknown, partial?: number[]): void => {
    const section: unknown[] = []

    if (Array.isArray(attributes)) {
      for (const attr of attributes) {
        section.push(attr)
      }
    } else if (attributes) {
      section.push(attributes)
    }

    result.push({
      partial,
      section,
      type: 'ATOM',
      value: `${commandKey}.PEEK`,
    })
  }

  const standardKeys = ['uid', 'flags', 'bodyStructure', 'envelope', 'internalDate'] as const

  for (const key of standardKeys) {
    if (query[key]) {
      result.push({ type: 'ATOM', value: key.toUpperCase() })
    }
  }

  if (query.size) {
    result.push({ type: 'ATOM', value: 'RFC822.SIZE' })
  }

  if (query.source) {
    let partial: number[] | undefined

    if (typeof query.source === 'object') {
      partial = [query.source.start ?? 0]
      if (query.source.maxLength !== undefined) {
        partial.push(query.source.maxLength)
      }
    }

    result.push({ partial, section: [], type: 'ATOM', value: `${commandKey}.PEEK` })
  }

  if (ctx.capabilities.has('OBJECTID')) {
    result.push({ type: 'ATOM', value: 'EMAILID' })
  } else if (ctx.capabilities.has('X-GM-EXT-1')) {
    result.push({ type: 'ATOM', value: 'X-GM-MSGID' })
  }

  if (query.threadId) {
    if (ctx.capabilities.has('OBJECTID')) {
      result.push({ type: 'ATOM', value: 'THREADID' })
    } else if (ctx.capabilities.has('X-GM-EXT-1')) {
      result.push({ type: 'ATOM', value: 'X-GM-THRID' })
    }
  }

  if (query.labels && ctx.capabilities.has('X-GM-EXT-1')) {
    result.push({ type: 'ATOM', value: 'X-GM-LABELS' })
  }

  if (query.modseq && ctx.enabled.has('CONDSTORE') && !ctx.mailbox?.noModseq) {
    result.push({ type: 'ATOM', value: 'MODSEQ' })
  }

  if (!query.uid) {
    result.push({ type: 'ATOM', value: 'UID' })
  }

  if (query.headers) {
    if (Array.isArray(query.headers)) {
      setBodyPeek([{ type: 'ATOM', value: 'HEADER.FIELDS' }, query.headers.map(h => ({ type: 'ATOM', value: h }))])
    } else {
      setBodyPeek({ type: 'ATOM', value: 'HEADER' })
    }
  }

  if (query.bodyParts?.length) {
    for (const part of query.bodyParts) {
      if (part) {
        setBodyPeek({ type: 'ATOM', value: part.toUpperCase() })
      }
    }
  }

  return result
}

const parseMessage = (response: ParsedResponse): FetchedMessage => {
  const seq = Number(response.command) || 0
  let uid = 0
  let flags: Set<string> | undefined
  let modseq: bigint | undefined
  let emailId: string | undefined
  let threadId: string | undefined
  let size: number | undefined
  let internalDate: Date | undefined
  let dataList: Token[] | null = null

  if (response.attributes) {
    const firstAttr = response.attributes[0] as Token | undefined
    if (firstAttr?.type === 'ATOM' && firstAttr.value === 'FETCH' && Array.isArray(response.attributes[1])) {
      dataList = response.attributes[1] as Token[]
    } else {
      dataList = response.attributes as Token[]
    }
  }

  if (dataList) {
    for (let i = 0; i < dataList.length; i += 2) {
      const key = dataList[i] as Token
      const value = dataList[i + 1] as Token | Token[]

      if (typeof key?.value !== 'string') {
        continue
      }

      const keyName = key.value.toUpperCase()

      switch (keyName) {
        case 'UID': {
          if (typeof (value as Token).value === 'string') {
            uid = Number((value as Token).value) || 0
          }

          break
        }
        case 'FLAGS': {
          if (Array.isArray(value)) {
            flags = new Set((value as Token[]).map(t => String(t.value)).filter(Boolean))
          }

          break
        }
        case 'MODSEQ': {
          if (Array.isArray(value) && (value as Token[])[0]) {
            const modseqStr = String((value as Token[])[0].value)

            if (DIGITS_ONLY.test(modseqStr)) {
              modseq = BigInt(modseqStr)
            }
          }

          break
        }
        case 'EMAILID':
        case 'X-GM-MSGID': {
          if (typeof (value as Token).value === 'string') {
            emailId = (value as Token).value as string
          }

          break
        }
        case 'THREADID':
        case 'X-GM-THRID': {
          if (typeof (value as Token).value === 'string') {
            threadId = (value as Token).value as string
          }

          break
        }
        case 'RFC822.SIZE': {
          if (typeof (value as Token).value === 'string') {
            size = Number((value as Token).value) || 0
          }

          break
        }
        case 'INTERNALDATE': {
          if (typeof (value as Token).value === 'string') {
            internalDate = new Date((value as Token).value as string)
          }

          break
        }
        default: {
          break
        }
      }
    }
  }

  return {
    emailId,
    flags,
    internalDate,
    modseq: modseq as never,
    seq: seq as never,
    size,
    threadId,
    uid: uid as never,
  }
}

export type FetchStreamOptions = {
  readonly uid?: boolean
  readonly binary?: boolean
  readonly changedSince?: bigint
}

const buildFetchAttributes = (
  ctx: CommandContext,
  range: string,
  query: FetchQuery,
  options: FetchStreamOptions,
): unknown[] => {
  const commandKey = ctx.capabilities.has('BINARY') && options.binary ? 'BINARY' : 'BODY'
  const attributes: unknown[] = [{ type: 'SEQUENCE', value: range }]
  const queryStructure = buildQueryStructure(ctx, query, commandKey)

  if (queryStructure.length === 1) {
    attributes.push(queryStructure[0])
  } else {
    attributes.push(queryStructure)
  }

  if (options.changedSince && ctx.enabled.has('CONDSTORE') && !ctx.mailbox?.noModseq) {
    const changedSinceArgs: QueryAtom[] = [
      { type: 'ATOM', value: 'CHANGEDSINCE' },
      { type: 'ATOM', value: options.changedSince.toString() },
    ]

    if (options.uid && ctx.enabled.has('QRESYNC')) {
      changedSinceArgs.push({ type: 'ATOM', value: 'VANISHED' })
    }

    attributes.push(changedSinceArgs)
  }

  return attributes
}

export const fetch = async (
  ctx: CommandContext,
  range: string,
  query: FetchQuery,
  options: FetchOptions = {},
): Promise<FetchResult | undefined> => {
  if (ctx.state !== 'SELECTED' || !range) {
    return undefined
  }

  const attributes = buildFetchAttributes(ctx, range, query, options)

  const messages: { count: number; list: FetchedMessage[] } = {
    count: 0,
    list: [],
  }

  try {
    const response = await ctx.exec(options.uid ? 'UID FETCH' : 'FETCH', attributes as never, {
      untagged: {
        FETCH: async untagged => {
          messages.count += 1
          const parsed = parseMessage(untagged)

          if (options.onUntaggedFetch) {
            await new Promise<void>((resolve, reject) => {
              options.onUntaggedFetch?.(parsed, err => {
                if (err) {
                  reject(err)
                } else {
                  resolve()
                }
              })
            })
          } else {
            messages.list.push(parsed)
          }
        },
      },
    })

    response.next()

    return messages
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    throw error
  }
}

export async function* fetchStream(
  ctx: CommandContext,
  range: string,
  query: FetchQuery,
  options: FetchStreamOptions = {},
): AsyncGenerator<FetchedMessage, void, undefined> {
  if (ctx.state !== 'SELECTED' || !range) {
    return
  }

  const attributes = buildFetchAttributes(ctx, range, query, options)

  const queue: FetchedMessage[] = []
  let resolveWait: (() => void) | null = null
  let done = false
  let error: Error | null = null

  const execPromise = ctx
    .exec(options.uid ? 'UID FETCH' : 'FETCH', attributes as never, {
      untagged: {
        FETCH: untagged => {
          const parsed = parseMessage(untagged)
          queue.push(parsed)
          if (resolveWait) {
            resolveWait()
            resolveWait = null
          }
        },
      },
    })
    .then(response => {
      response.next()
      done = true
      if (resolveWait) {
        resolveWait()
        resolveWait = null
      }
    })
    .catch(err => {
      error = err instanceof Error ? err : new Error(String(err))
      done = true
      if (resolveWait) {
        resolveWait()
        resolveWait = null
      }
    })

  while (!done || queue.length > 0) {
    const message = queue.shift()
    if (message) {
      yield message
    } else if (!done) {
      await new Promise<void>(resolve => {
        resolveWait = resolve
      })
    }
  }

  await execPromise

  if (error) {
    throw error
  }
}
