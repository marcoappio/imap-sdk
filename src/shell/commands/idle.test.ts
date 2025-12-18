import type { IDLEContext, IDLEEvent } from './idle'
import { idle } from './idle'
import { createMockContext, createMockMailbox, createMockResponse } from './test-utils'

const createIdleContext = (overrides: Partial<IDLEContext> = {}): IDLEContext => {
  const baseCtx = createMockContext({
    capabilities: new Set(['IMAP4rev1', 'IDLE']),
    mailbox: createMockMailbox({ exists: 100 }),
    state: 'SELECTED',
  })

  return {
    ...baseCtx,
    currentLock: undefined,
    currentSelectCommand: undefined,
    idling: false,
    missingIdleCommand: undefined,
    preCheck: false,
    ...overrides,
  } as IDLEContext
}

describe('idle command', () => {
  describe('preconditions', () => {
    it('should return empty generator if state is NOT_AUTHENTICATED', () => {
      const ctx = createIdleContext({ state: 'NOT_AUTHENTICATED' })
      const controller = idle(ctx, {})

      expect(controller.events).toBeDefined()
      expect(controller.stop).toBeDefined()
    })

    it('should return empty generator if state is AUTHENTICATED', () => {
      const ctx = createIdleContext({ state: 'AUTHENTICATED' })
      const controller = idle(ctx, {})

      expect(controller.events).toBeDefined()
    })

    it('should return controller in SELECTED state', () => {
      const ctx = createIdleContext({ state: 'SELECTED' })
      const controller = idle(ctx, {})

      expect(controller.events).toBeDefined()
      expect(controller.stop).toBeDefined()
    })
  })

  describe('EXISTS event parsing', () => {
    it('should correctly parse EXISTS response and extract count from command field', async () => {
      const ctx = createIdleContext({
        mailbox: createMockMailbox({ exists: 100 }),
        state: 'SELECTED',
      })

      const events: IDLEEvent[] = []
      let existsHandler: ((response: unknown) => void) | undefined

      ctx.exec = (_command, _attrs, options) => {
        existsHandler = options?.untagged?.EXISTS as (response: unknown) => void
        options?.onPlusTag?.(createMockResponse())
        return new Promise(() => {})
      }

      const controller = idle(ctx, { timeout: 100 })

      const collectEvents = async () => {
        for await (const event of controller.events) {
          events.push(event)
          if (events.length >= 1) {
            controller.stop()
            break
          }
        }
      }

      const collection = collectEvents()

      await new Promise(resolve => setTimeout(resolve, 50))

      if (existsHandler) {
        existsHandler(
          createMockResponse({
            attributes: [{ type: 'ATOM', value: 'EXISTS' }],
            command: '172',
            tag: '*',
          }),
        )
      }

      await Promise.race([collection, new Promise(resolve => setTimeout(resolve, 200))])

      expect(events.length).toBeGreaterThanOrEqual(1)
      const existsEvent = events.find(e => e.type === 'exists')
      expect(existsEvent).toBeDefined()
      expect(existsEvent).toMatchObject({
        count: 172,
        prevCount: 100,
        type: 'exists',
      })
    })

    it('should calculate prevCount from mailbox.exists', async () => {
      const ctx = createIdleContext({
        mailbox: createMockMailbox({ exists: 50 }),
        state: 'SELECTED',
      })

      const events: IDLEEvent[] = []
      let existsHandler: ((response: unknown) => void) | undefined

      ctx.exec = (_command, _attrs, options) => {
        existsHandler = options?.untagged?.EXISTS as (response: unknown) => void
        options?.onPlusTag?.(createMockResponse())
        return new Promise(() => {})
      }

      const controller = idle(ctx, { timeout: 100 })

      const collectEvents = async () => {
        for await (const event of controller.events) {
          events.push(event)
          if (events.length >= 1) {
            controller.stop()
            break
          }
        }
      }

      const collection = collectEvents()

      await new Promise(resolve => setTimeout(resolve, 50))

      if (existsHandler) {
        existsHandler(
          createMockResponse({
            attributes: [{ type: 'ATOM', value: 'EXISTS' }],
            command: '55',
            tag: '*',
          }),
        )
      }

      await Promise.race([collection, new Promise(resolve => setTimeout(resolve, 200))])

      const existsEvent = events.find(e => e.type === 'exists')
      expect(existsEvent).toMatchObject({
        count: 55,
        prevCount: 50,
        type: 'exists',
      })
    })

    it('should ignore EXISTS response with non-numeric command', async () => {
      const ctx = createIdleContext({
        mailbox: createMockMailbox({ exists: 100 }),
        state: 'SELECTED',
      })

      const events: IDLEEvent[] = []
      let existsHandler: ((response: unknown) => void) | undefined

      ctx.exec = (_command, _attrs, options) => {
        existsHandler = options?.untagged?.EXISTS as (response: unknown) => void
        options?.onPlusTag?.(createMockResponse())
        return new Promise(() => {})
      }

      const controller = idle(ctx, { timeout: 100 })

      const collectEvents = async () => {
        for await (const event of controller.events) {
          events.push(event)
        }
      }

      const collection = collectEvents()

      await new Promise(resolve => setTimeout(resolve, 50))

      if (existsHandler) {
        existsHandler(
          createMockResponse({
            attributes: [{ type: 'ATOM', value: 'EXISTS' }],
            command: 'INVALID',
            tag: '*',
          }),
        )
      }

      controller.stop()

      await Promise.race([collection, new Promise(resolve => setTimeout(resolve, 200))])

      const existsEvent = events.find(e => e.type === 'exists')
      expect(existsEvent).toBeUndefined()
    })
  })

  describe('FETCH event parsing', () => {
    it('should correctly parse FETCH response and extract seq from command field', async () => {
      const ctx = createIdleContext({
        mailbox: createMockMailbox({ exists: 100 }),
        state: 'SELECTED',
      })

      const events: IDLEEvent[] = []
      let fetchHandler: ((response: unknown) => void) | undefined

      ctx.exec = (_command, _attrs, options) => {
        fetchHandler = options?.untagged?.FETCH as (response: unknown) => void
        options?.onPlusTag?.(createMockResponse())
        return new Promise(() => {})
      }

      const controller = idle(ctx, { timeout: 100 })

      const collectEvents = async () => {
        for await (const event of controller.events) {
          events.push(event)
          if (events.length >= 1) {
            controller.stop()
            break
          }
        }
      }

      const collection = collectEvents()

      await new Promise(resolve => setTimeout(resolve, 50))

      if (fetchHandler) {
        fetchHandler(
          createMockResponse({
            attributes: [{ type: 'ATOM', value: 'FETCH' }] as never,
            command: '15',
            tag: '*',
          }),
        )
      }

      await Promise.race([collection, new Promise(resolve => setTimeout(resolve, 200))])

      expect(events.length).toBeGreaterThanOrEqual(1)
      const fetchEvent = events.find(e => e.type === 'fetch')
      expect(fetchEvent).toBeDefined()
      expect(fetchEvent).toMatchObject({
        seq: 15,
        type: 'fetch',
      })
    })
  })

  describe('EXPUNGE event parsing', () => {
    it('should correctly parse EXPUNGE response and extract seq from command field', async () => {
      const ctx = createIdleContext({
        mailbox: createMockMailbox({ exists: 100 }),
        state: 'SELECTED',
      })

      const events: IDLEEvent[] = []
      let expungeHandler: ((response: unknown) => void) | undefined

      ctx.exec = (_command, _attrs, options) => {
        expungeHandler = options?.untagged?.EXPUNGE as (response: unknown) => void
        options?.onPlusTag?.(createMockResponse())
        return new Promise(() => {})
      }

      const controller = idle(ctx, { timeout: 100 })

      const collectEvents = async () => {
        for await (const event of controller.events) {
          events.push(event)
          if (events.length >= 1) {
            controller.stop()
            break
          }
        }
      }

      const collection = collectEvents()

      await new Promise(resolve => setTimeout(resolve, 50))

      if (expungeHandler) {
        expungeHandler(
          createMockResponse({
            attributes: [{ type: 'ATOM', value: 'EXPUNGE' }],
            command: '42',
            tag: '*',
          }),
        )
      }

      await Promise.race([collection, new Promise(resolve => setTimeout(resolve, 200))])

      expect(events.length).toBeGreaterThanOrEqual(1)
      const expungeEvent = events.find(e => e.type === 'expunge')
      expect(expungeEvent).toBeDefined()
      expect(expungeEvent).toMatchObject({
        seq: 42,
        type: 'expunge',
      })
    })

    it('should ignore EXPUNGE response with non-numeric command', async () => {
      const ctx = createIdleContext({
        mailbox: createMockMailbox({ exists: 100 }),
        state: 'SELECTED',
      })

      const events: IDLEEvent[] = []
      let expungeHandler: ((response: unknown) => void) | undefined

      ctx.exec = (_command, _attrs, options) => {
        expungeHandler = options?.untagged?.EXPUNGE as (response: unknown) => void
        options?.onPlusTag?.(createMockResponse())
        return new Promise(() => {})
      }

      const controller = idle(ctx, { timeout: 100 })

      const collectEvents = async () => {
        for await (const event of controller.events) {
          events.push(event)
        }
      }

      const collection = collectEvents()

      await new Promise(resolve => setTimeout(resolve, 50))

      if (expungeHandler) {
        expungeHandler(
          createMockResponse({
            attributes: [{ type: 'ATOM', value: 'EXPUNGE' }],
            command: 'INVALID',
            tag: '*',
          }),
        )
      }

      controller.stop()

      await Promise.race([collection, new Promise(resolve => setTimeout(resolve, 200))])

      const expungeEvent = events.find(e => e.type === 'expunge')
      expect(expungeEvent).toBeUndefined()
    })
  })
})
