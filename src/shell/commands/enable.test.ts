import { enable } from './enable'
import { createMockContext, createMockLoggerWithWarn, createMockResponse } from './test-utils'

describe('enable command', () => {
  describe('preconditions', () => {
    it('should return empty set if ENABLE capability is not present', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'CONDSTORE']),
        state: 'AUTHENTICATED',
      })

      const result = await enable(ctx, ['CONDSTORE'])

      expect(result).toEqual(new Set())
      expect(ctx.mockExecCalls.length).toBe(0)
    })

    it('should return empty set if state is not AUTHENTICATED', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE']),
        state: 'SELECTED',
      })

      const result = await enable(ctx, ['CONDSTORE'])

      expect(result).toEqual(new Set())
      expect(ctx.mockExecCalls.length).toBe(0)
    })

    it('should return empty set if no requested extensions are available', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'ENABLE']),
        state: 'AUTHENTICATED',
      })

      const result = await enable(ctx, ['CONDSTORE', 'QRESYNC'])

      expect(result).toEqual(new Set())
      expect(ctx.mockExecCalls.length).toBe(0)
    })
  })

  describe('success cases', () => {
    it('should send ENABLE command with available extensions', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE']),
        state: 'AUTHENTICATED',
      })

      await enable(ctx, ['CONDSTORE'])

      expect(ctx.mockExecCalls.length).toBe(1)
      expect(ctx.mockExecCalls[0].command).toBe('ENABLE')
      expect(ctx.mockExecCalls[0].attributes).toEqual([{ type: 'ATOM', value: 'CONDSTORE' }])
    })

    it('should filter out extensions not in capabilities', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE']),
        state: 'AUTHENTICATED',
      })

      await enable(ctx, ['CONDSTORE', 'QRESYNC', 'UTF8=ACCEPT'])

      expect(ctx.mockExecCalls.length).toBe(1)
      expect(ctx.mockExecCalls[0].attributes).toEqual([{ type: 'ATOM', value: 'CONDSTORE' }])
    })

    it('should enable multiple extensions when available', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE', 'QRESYNC']),
        state: 'AUTHENTICATED',
      })

      await enable(ctx, ['CONDSTORE', 'QRESYNC'])

      expect(ctx.mockExecCalls.length).toBe(1)
      expect(ctx.mockExecCalls[0].attributes).toEqual([
        { type: 'ATOM', value: 'CONDSTORE' },
        { type: 'ATOM', value: 'QRESYNC' },
      ])
    })

    it('should uppercase extension names', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE']),
        state: 'AUTHENTICATED',
      })

      await enable(ctx, ['condstore'])

      expect(ctx.mockExecCalls[0].attributes).toEqual([{ type: 'ATOM', value: 'CONDSTORE' }])
    })

    it('should parse ENABLED response and call addEnabled', async () => {
      const enabledExtensions: string[] = []
      const ctx = createMockContext({
        addEnabled: (ext: string) => {
          enabledExtensions.push(ext)
        },
        capabilities: new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE']),
        state: 'AUTHENTICATED',
      })

      const enablePromise = enable(ctx, ['CONDSTORE'])

      await ctx.triggerUntagged(
        'ENABLED',
        createMockResponse({
          attributes: [{ type: 'ATOM', value: 'CONDSTORE' }] as never,
          command: 'ENABLED',
          tag: '*',
        }),
      )

      const result = await enablePromise

      expect(result).toEqual(new Set(['CONDSTORE']))
      expect(enabledExtensions).toEqual(['CONDSTORE'])
    })

    it('should handle multiple enabled extensions in response', async () => {
      const enabledExtensions: string[] = []
      const ctx = createMockContext({
        addEnabled: (ext: string) => {
          enabledExtensions.push(ext)
        },
        capabilities: new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE', 'QRESYNC']),
        state: 'AUTHENTICATED',
      })

      const enablePromise = enable(ctx, ['CONDSTORE', 'QRESYNC'])

      await ctx.triggerUntagged(
        'ENABLED',
        createMockResponse({
          attributes: [
            { type: 'ATOM', value: 'CONDSTORE' },
            { type: 'ATOM', value: 'QRESYNC' },
          ] as never,
          command: 'ENABLED',
          tag: '*',
        }),
      )

      const result = await enablePromise

      expect(result).toEqual(new Set(['CONDSTORE', 'QRESYNC']))
      expect(enabledExtensions).toEqual(['CONDSTORE', 'QRESYNC'])
    })

    it('should ignore ENABLED response with no attributes', async () => {
      const enabledExtensions: string[] = []
      const ctx = createMockContext({
        addEnabled: (ext: string) => {
          enabledExtensions.push(ext)
        },
        capabilities: new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE']),
        state: 'AUTHENTICATED',
      })

      const enablePromise = enable(ctx, ['CONDSTORE'])

      await ctx.triggerUntagged(
        'ENABLED',
        createMockResponse({
          attributes: undefined,
          command: 'ENABLED',
          tag: '*',
        }),
      )

      const result = await enablePromise

      expect(result).toEqual(new Set())
      expect(enabledExtensions).toEqual([])
    })
  })

  describe('error cases', () => {
    it('should return empty set and log warning on exec error', async () => {
      const warnCalls: unknown[] = []
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE']),
        exec: () => Promise.reject(new Error('Connection failed')),
        log: createMockLoggerWithWarn(warnCalls),
        state: 'AUTHENTICATED',
      })

      const result = await enable(ctx, ['CONDSTORE'])

      expect(result).toEqual(new Set())
      expect(warnCalls.length).toBe(1)
    })
  })
})
