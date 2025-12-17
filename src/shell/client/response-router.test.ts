import type { Tag } from '@imap-sdk/types/common'
import type { ParsedResponse } from '@imap-sdk/types/protocol'

import { CommandQueue } from './command-queue'
import { createResponseRouter, ResponseRouter } from './response-router'

const createMockResponse = (overrides: Partial<ParsedResponse> = {}): ParsedResponse => ({
  attributes: [],
  command: 'OK',
  tag: '*',
  ...overrides,
})

describe('ResponseRouter', () => {
  let commandQueue: CommandQueue

  beforeEach(() => {
    commandQueue = new CommandQueue()
  })

  afterEach(() => {
    commandQueue.dispose()
  })

  describe('constructor', () => {
    it('should create with required options', () => {
      const router = new ResponseRouter({ commandQueue })
      expect(router.isDisposed).toBe(false)
    })

    it('should create via factory function', () => {
      const router = createResponseRouter({ commandQueue })
      expect(router).toBeInstanceOf(ResponseRouter)
    })
  })

  describe('registerHandler', () => {
    it('should register handler for tag', () => {
      const router = new ResponseRouter({ commandQueue })
      const handler = { untagged: {} }

      router.registerHandler('A0001' as Tag, handler)

      expect(router.isDisposed).toBe(false)
    })

    it('should not register when disposed', () => {
      const router = new ResponseRouter({ commandQueue })
      router.dispose()

      const handler = { untagged: {} }
      router.registerHandler('A0001' as Tag, handler)

      expect(router.isDisposed).toBe(true)
    })
  })

  describe('route - untagged responses', () => {
    it('should call registered untagged handler', async () => {
      const router = new ResponseRouter({ commandQueue })
      const calls: ParsedResponse[] = []

      router.registerHandler('A0001' as Tag, {
        untagged: {
          EXISTS: resp => {
            calls.push(resp)
          },
        },
      })

      const response = createMockResponse({ command: 'EXISTS', tag: '*' })
      await router.route(response)

      expect(calls).toHaveLength(1)
      expect(calls[0]).toBe(response)
    })

    it('should call global untagged handler if no specific handler', async () => {
      const calls: Array<{ cmd: string; resp: ParsedResponse }> = []

      const router = new ResponseRouter({
        commandQueue,
        onUntagged: (cmd, resp) => {
          calls.push({ cmd, resp })
        },
      })

      const response = createMockResponse({ command: 'EXISTS', tag: '*' })
      await router.route(response)

      expect(calls).toHaveLength(1)
      expect(calls[0].cmd).toBe('EXISTS')
    })

    it('should return handled: false when no handler matches', async () => {
      const router = new ResponseRouter({ commandQueue })

      const response = createMockResponse({ command: 'UNKNOWN', tag: '*' })
      const result = await router.route(response)

      expect(result.handled).toBe(false)
    })
  })

  describe('route - tagged responses', () => {
    it('should resolve command on OK response', async () => {
      const router = new ResponseRouter({ commandQueue })

      const tag = await commandQueue.acquire()
      const responsePromise = commandQueue.register(tag, 'SELECT')
      router.registerHandler(tag, {})

      const response = createMockResponse({ command: 'OK', tag })
      const result = await router.route(response)

      expect(result.handled).toBe(true)
      expect(result.status).toBe('OK')
      expect(result.tag).toBe(tag)
      await expect(responsePromise).resolves.toBe(response)
    })

    it('should reject command on NO response', async () => {
      const router = new ResponseRouter({ commandQueue })

      const tag = await commandQueue.acquire()
      const responsePromise = commandQueue.register(tag, 'SELECT')
      router.registerHandler(tag, {})

      const response = createMockResponse({
        command: 'NO',
        humanReadable: 'Mailbox not found',
        tag,
      })
      await router.route(response)

      await expect(responsePromise).rejects.toThrow('Mailbox not found')
    })

    it('should reject command on BAD response', async () => {
      const router = new ResponseRouter({ commandQueue })

      const tag = await commandQueue.acquire()
      const responsePromise = commandQueue.register(tag, 'SELECT')
      router.registerHandler(tag, {})

      const response = createMockResponse({ command: 'BAD', tag })
      await router.route(response)

      await expect(responsePromise).rejects.toThrow()
    })

    it('should unregister handler after tagged response', async () => {
      const router = new ResponseRouter({ commandQueue })
      const calls: ParsedResponse[] = []

      const tag = await commandQueue.acquire()
      commandQueue.register(tag, 'SELECT')
      router.registerHandler(tag, {
        untagged: {
          EXISTS: resp => {
            calls.push(resp)
          },
        },
      })

      await router.route(createMockResponse({ command: 'OK', tag }))

      await router.route(createMockResponse({ command: 'EXISTS', tag: '*' }))

      expect(calls).toHaveLength(0)
    })
  })

  describe('route - plus tag responses', () => {
    it('should call registered plus tag handler', async () => {
      const router = new ResponseRouter({ commandQueue })
      const calls: ParsedResponse[] = []

      router.registerHandler('A0001' as Tag, {
        onPlusTag: resp => {
          calls.push(resp)
        },
      })

      const response = createMockResponse({ command: '', tag: '+' })
      await router.route(response)

      expect(calls).toHaveLength(1)
    })

    it('should call global plus tag handler', async () => {
      const calls: ParsedResponse[] = []

      const router = new ResponseRouter({
        commandQueue,
        onPlusTag: resp => {
          calls.push(resp)
        },
      })

      const response = createMockResponse({ command: '', tag: '+' })
      await router.route(response)

      expect(calls).toHaveLength(1)
    })
  })

  describe('unregisterHandler', () => {
    it('should remove registered handler', async () => {
      const router = new ResponseRouter({ commandQueue })
      const calls: ParsedResponse[] = []

      router.registerHandler('A0001' as Tag, {
        untagged: {
          EXISTS: resp => {
            calls.push(resp)
          },
        },
      })

      router.unregisterHandler('A0001' as Tag)

      await router.route(createMockResponse({ command: 'EXISTS', tag: '*' }))

      expect(calls).toHaveLength(0)
    })
  })

  describe('dispose', () => {
    it('should set isDisposed to true', () => {
      const router = new ResponseRouter({ commandQueue })
      router.dispose()
      expect(router.isDisposed).toBe(true)
    })

    it('should clear handlers', async () => {
      const router = new ResponseRouter({ commandQueue })
      const calls: ParsedResponse[] = []

      router.registerHandler('A0001' as Tag, {
        untagged: {
          EXISTS: resp => {
            calls.push(resp)
          },
        },
      })

      router.dispose()

      const result = await router.route(createMockResponse({ command: 'EXISTS', tag: '*' }))

      expect(result.handled).toBe(false)
      expect(calls).toHaveLength(0)
    })

    it('should be idempotent', () => {
      const router = new ResponseRouter({ commandQueue })
      router.dispose()
      router.dispose()
      expect(router.isDisposed).toBe(true)
    })
  })

  describe('Symbol.asyncDispose', () => {
    it('should dispose the router', async () => {
      const router = new ResponseRouter({ commandQueue })
      await router[Symbol.asyncDispose]()
      expect(router.isDisposed).toBe(true)
    })
  })
})
