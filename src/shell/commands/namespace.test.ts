import { namespace } from './namespace'
import {
  createMockContext,
  createMockLoggerWithWarn,
  createMockResponse,
  createThrowingExec,
  createToken,
} from './test-utils'

describe('namespace command', () => {
  describe('preconditions', () => {
    it('should return undefined if state is NOT_AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'NOT_AUTHENTICATED' })
      const result = await namespace(ctx)
      expect(result).toBeUndefined()
    })

    it('should return undefined if state is LOGOUT', async () => {
      const ctx = createMockContext({ state: 'LOGOUT' })
      const result = await namespace(ctx)
      expect(result).toBeUndefined()
    })

    it('should work in AUTHENTICATED state', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await namespace(ctx)
      expect(result).not.toBeUndefined()
    })

    it('should work in SELECTED state', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      const result = await namespace(ctx)
      expect(result).not.toBeUndefined()
    })
  })

  describe('without NAMESPACE capability', () => {
    it('should fall back to LIST command when NAMESPACE not supported', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        state: 'AUTHENTICATED',
      })

      await namespace(ctx)

      expect(ctx.mockExecCalls).toHaveLength(1)
      expect(ctx.mockExecCalls[0].command).toBe('LIST')
    })

    it('should use LIST with empty reference and mailbox', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        state: 'AUTHENTICATED',
      })

      await namespace(ctx)

      const call = ctx.mockExecCalls[0]
      expect(call.attributes[0]).toEqual({ type: 'ATOM', value: '' })
      expect(call.attributes[1]).toEqual({ type: 'ATOM', value: '' })
    })

    it('should return namespace info from LIST response', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        state: 'AUTHENTICATED',
      })

      const execPromise = namespace(ctx)

      await ctx.triggerUntagged(
        'LIST',
        createMockResponse({
          attributes: [[], createToken('/'), createToken('INBOX.')] as never,
        }),
      )

      const result = await execPromise

      expect(result).toBeDefined()
      expect(result?.delimiter).toBe('/')
      expect(result?.prefix).toBe('INBOX./')
    })

    it('should strip leading delimiter from prefix', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        state: 'AUTHENTICATED',
      })

      const execPromise = namespace(ctx)

      await ctx.triggerUntagged(
        'LIST',
        createMockResponse({
          attributes: [[], createToken('/'), createToken('/Users')] as never,
        }),
      )

      const result = await execPromise

      expect(result?.prefix).toBe('Users/')
    })

    it('should handle empty LIST response', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        state: 'AUTHENTICATED',
      })

      const result = await namespace(ctx)

      expect(result).toBeDefined()
      expect(result?.delimiter).toBe('')
      expect(result?.prefix).toBe('')
    })
  })

  describe('with NAMESPACE capability', () => {
    it('should use NAMESPACE command when supported', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'NAMESPACE']),
        state: 'AUTHENTICATED',
      })

      await namespace(ctx)

      expect(ctx.mockExecCalls).toHaveLength(1)
      expect(ctx.mockExecCalls[0].command).toBe('NAMESPACE')
    })

    it('should parse personal namespace', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'NAMESPACE']),
        state: 'AUTHENTICATED',
      })

      const execPromise = namespace(ctx)

      await ctx.triggerUntagged(
        'NAMESPACE',
        createMockResponse({
          attributes: [[[createToken(''), createToken('/')]], null, null] as never,
        }),
      )

      const result = await execPromise

      expect(result).toBeDefined()
      expect(result?.prefix).toBe('')
      expect(result?.delimiter).toBe('/')
    })

    it('should parse namespace with prefix', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'NAMESPACE']),
        state: 'AUTHENTICATED',
      })

      const execPromise = namespace(ctx)

      await ctx.triggerUntagged(
        'NAMESPACE',
        createMockResponse({
          attributes: [[[createToken('INBOX.'), createToken('.')]], null, null] as never,
        }),
      )

      const result = await execPromise

      expect(result).toBeDefined()
      expect(result?.prefix).toBe('INBOX.')
      expect(result?.delimiter).toBe('.')
    })

    it('should add delimiter to prefix if missing', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'NAMESPACE']),
        state: 'AUTHENTICATED',
      })

      const execPromise = namespace(ctx)

      await ctx.triggerUntagged(
        'NAMESPACE',
        createMockResponse({
          attributes: [[[createToken('INBOX'), createToken('/')]], null, null] as never,
        }),
      )

      const result = await execPromise

      expect(result).toBeDefined()
      expect(result?.prefix).toBe('INBOX/')
    })

    it('should provide default namespace when response is empty', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'NAMESPACE']),
        state: 'AUTHENTICATED',
      })

      const result = await namespace(ctx)

      expect(result).toBeDefined()
      expect(result?.prefix).toBe('')
      expect(result?.delimiter).toBe('.')
    })

    it('should return first personal namespace when multiple exist', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'NAMESPACE']),
        state: 'AUTHENTICATED',
      })

      const execPromise = namespace(ctx)

      await ctx.triggerUntagged(
        'NAMESPACE',
        createMockResponse({
          attributes: [
            [
              [createToken(''), createToken('/')],
              [createToken('Users/'), createToken('/')],
            ],
            null,
            null,
          ] as never,
        }),
      )

      const result = await execPromise

      expect(result).toBeDefined()
      expect(result?.prefix).toBe('')
      expect(result?.delimiter).toBe('/')
    })
  })

  describe('error handling', () => {
    it('should return undefined on error', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'NAMESPACE']),
        state: 'AUTHENTICATED',
      })
      ctx.exec = createThrowingExec('Server error')

      const result = await namespace(ctx)
      expect(result).toBeUndefined()
    })

    it('should log warning on error', async () => {
      const warnCalls: unknown[] = []
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'NAMESPACE']),
        log: createMockLoggerWithWarn(warnCalls),
        state: 'AUTHENTICATED',
      })
      ctx.exec = createThrowingExec('Server error')

      await namespace(ctx)
      expect(warnCalls.length).toBeGreaterThan(0)
    })

    it('should handle LIST error in fallback mode', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        state: 'AUTHENTICATED',
      })
      ctx.exec = createThrowingExec('LIST failed')

      const result = await namespace(ctx)

      expect(result).toBeDefined()
      expect(result?.prefix).toBe('')
      expect(result?.delimiter).toBe('')
    })
  })
})
