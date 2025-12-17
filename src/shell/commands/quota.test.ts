import { quota } from './quota'
import {
  createMockContext,
  createMockLoggerWithWarn,
  createMockResponse,
  createThrowingExec,
  createToken,
} from './test-utils'

describe('quota command', () => {
  describe('preconditions', () => {
    it('should return null if state is NOT_AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'NOT_AUTHENTICATED' })
      const result = await quota(ctx, 'INBOX')
      expect(result).toBeNull()
    })

    it('should return null if state is LOGOUT', async () => {
      const ctx = createMockContext({ state: 'LOGOUT' })
      const result = await quota(ctx, 'INBOX')
      expect(result).toBeNull()
    })

    it('should return null if path is empty', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await quota(ctx, '')
      expect(result).toBeNull()
    })

    it('should return null if QUOTA capability is not present', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        state: 'AUTHENTICATED',
      })
      const result = await quota(ctx, 'INBOX')
      expect(result).toBeNull()
    })

    it('should work in AUTHENTICATED state with QUOTA capability', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })
      const result = await quota(ctx, 'INBOX')
      expect(result).not.toBeNull()
    })

    it('should work in SELECTED state with QUOTA capability', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'SELECTED',
      })
      const result = await quota(ctx, 'INBOX')
      expect(result).not.toBeNull()
    })
  })

  describe('GETQUOTAROOT command', () => {
    it('should send GETQUOTAROOT command with encoded path', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })

      await quota(ctx, 'INBOX')

      expect(ctx.mockExecCalls).toHaveLength(1)
      expect(ctx.mockExecCalls[0].command).toBe('GETQUOTAROOT')
      expect(ctx.mockExecCalls[0].attributes[0]).toMatchObject({
        type: 'ATOM',
        value: 'INBOX',
      })
    })

    it('should normalize path', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })

      await quota(ctx, 'inbox')

      expect(ctx.mockExecCalls[0].attributes[0]).toMatchObject({
        value: 'INBOX',
      })
    })
  })

  describe('response parsing', () => {
    it('should parse QUOTAROOT response', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })

      const execPromise = quota(ctx, 'INBOX')

      await ctx.triggerUntagged(
        'QUOTAROOT',
        createMockResponse({
          attributes: [createToken('INBOX'), createToken('user.test')],
        }),
      )

      const result = await execPromise

      expect(result).not.toBeNull()
      expect(result?.quotaRoot).toBe('user.test')
    })

    it('should parse QUOTA response with storage', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })

      const execPromise = quota(ctx, 'INBOX')

      await ctx.triggerUntagged(
        'QUOTA',
        createMockResponse({
          attributes: [
            createToken('user.test'),
            [createToken('STORAGE'), createToken('5000'), createToken('10000')],
          ] as never,
        }),
      )

      const result = await execPromise

      expect(result).not.toBeNull()
      expect(result?.storage?.usage).toBe(5000 * 1024)
      expect(result?.storage?.limit).toBe(10_000 * 1024)
      expect(result?.storage?.status).toBe('50%')
    })

    it('should parse QUOTA response with message count', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })

      const execPromise = quota(ctx, 'INBOX')

      await ctx.triggerUntagged(
        'QUOTA',
        createMockResponse({
          attributes: [
            createToken('user.test'),
            [createToken('MESSAGE'), createToken('100'), createToken('1000')],
          ] as never,
        }),
      )

      const result = await execPromise

      expect(result).not.toBeNull()
      expect((result as unknown as Record<string, { usage: number; limit: number }>).message?.usage).toBe(100)
      expect((result as unknown as Record<string, { usage: number; limit: number }>).message?.limit).toBe(1000)
    })

    it('should calculate status percentage correctly', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })

      const execPromise = quota(ctx, 'INBOX')

      await ctx.triggerUntagged(
        'QUOTA',
        createMockResponse({
          attributes: [
            createToken('user.test'),
            [createToken('STORAGE'), createToken('7500'), createToken('10000')],
          ] as never,
        }),
      )

      const result = await execPromise

      expect(result?.storage?.status).toBe('75%')
    })

    it('should return path in result', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })

      const result = await quota(ctx, 'INBOX')

      expect(result?.path).toBe('INBOX')
    })
  })

  describe('GETQUOTA fallback', () => {
    it('should send GETQUOTA when quotaRoot exists but no QUOTA response', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })

      const execPromise = quota(ctx, 'INBOX')

      await ctx.triggerUntagged(
        'QUOTAROOT',
        createMockResponse({
          attributes: [createToken('INBOX'), createToken('user.test')],
        }),
      )

      await execPromise

      expect(ctx.mockExecCalls).toHaveLength(2)
      expect(ctx.mockExecCalls[1].command).toBe('GETQUOTA')
      expect(ctx.mockExecCalls[1].attributes[0]).toMatchObject({
        type: 'ATOM',
        value: 'user.test',
      })
    })

    it('should not send GETQUOTA when QUOTA response was received', async () => {
      let quotaHandlerCalled = false
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })

      const originalExec = ctx.exec
      ctx.exec = async (command, attributes, options) => {
        const result = await originalExec(command, attributes, options)

        if (command === 'GETQUOTAROOT' && options?.untagged) {
          if (options.untagged.QUOTAROOT) {
            await options.untagged.QUOTAROOT(
              createMockResponse({
                attributes: [createToken('INBOX'), createToken('user.test')],
              }),
            )
          }
          if (options.untagged.QUOTA) {
            quotaHandlerCalled = true
            await options.untagged.QUOTA(
              createMockResponse({
                attributes: [
                  createToken('user.test'),
                  [createToken('STORAGE'), createToken('1000'), createToken('10000')],
                ] as never,
              }),
            )
          }
        }
        return result
      }

      await quota(ctx, 'INBOX')

      expect(quotaHandlerCalled).toBe(true)
      expect(ctx.mockExecCalls.filter(c => c.command === 'GETQUOTA')).toHaveLength(0)
    })
  })

  describe('error handling', () => {
    it('should return null on error', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        state: 'AUTHENTICATED',
      })
      ctx.exec = createThrowingExec('Server error')

      const result = await quota(ctx, 'INBOX')
      expect(result).toBeNull()
    })

    it('should log warning on error', async () => {
      const warnCalls: unknown[] = []
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'QUOTA']),
        log: createMockLoggerWithWarn(warnCalls),
        state: 'AUTHENTICATED',
      })
      ctx.exec = createThrowingExec('Server error')

      await quota(ctx, 'INBOX')
      expect(warnCalls.length).toBeGreaterThan(0)
    })
  })
})
