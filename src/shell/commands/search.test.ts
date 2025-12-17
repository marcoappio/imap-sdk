import { search } from './search'
import {
  createMockContext,
  createMockLoggerWithWarn,
  createMockMailbox,
  createMockResponse,
  createThrowingExec,
  createToken,
} from './test-utils'

describe('search command', () => {
  describe('preconditions', () => {
    it('should return false if state is NOT_AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'NOT_AUTHENTICATED' })
      const result = await search(ctx, { all: true })
      expect(result).toBe(false)
    })

    it('should return false if state is AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await search(ctx, { all: true })
      expect(result).toBe(false)
    })

    it('should return false if state is LOGOUT', async () => {
      const ctx = createMockContext({ state: 'LOGOUT' })
      const result = await search(ctx, { all: true })
      expect(result).toBe(false)
    })

    it('should work in SELECTED state', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      const result = await search(ctx, { all: true })
      expect(result).not.toBe(false)
    })
  })

  describe('query handling', () => {
    it('should use ALL for true query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, true)

      const attrs = ctx.mockExecCalls[0].attributes
      expect(JSON.stringify(attrs)).toContain('ALL')
    })

    it('should use ALL for undefined query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, undefined)

      const attrs = ctx.mockExecCalls[0].attributes
      expect(JSON.stringify(attrs)).toContain('ALL')
    })

    it('should use ALL for empty object query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, {})

      const attrs = ctx.mockExecCalls[0].attributes
      expect(JSON.stringify(attrs)).toContain('ALL')
    })

    it('should use ALL for { all: true } query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { all: true })

      const attrs = ctx.mockExecCalls[0].attributes
      expect(JSON.stringify(attrs)).toContain('ALL')
    })
  })

  describe('command structure', () => {
    it('should send SEARCH command', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { all: true })

      expect(ctx.mockExecCalls).toHaveLength(1)
      expect(ctx.mockExecCalls[0].command).toBe('SEARCH')
    })

    it('should send UID SEARCH when uid option is true', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { all: true }, { uid: true })

      expect(ctx.mockExecCalls[0].command).toBe('UID SEARCH')
    })
  })

  describe('query compilation', () => {
    it('should compile seen flag', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { seen: true })

      const attrs = ctx.mockExecCalls[0].attributes
      expect(JSON.stringify(attrs)).toContain('SEEN')
    })

    it('should compile unseen flag', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { unSeen: true })

      const attrs = ctx.mockExecCalls[0].attributes
      expect(JSON.stringify(attrs)).toContain('UNSEEN')
    })

    it('should compile flagged flag', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { flagged: true })

      const attrs = ctx.mockExecCalls[0].attributes
      expect(JSON.stringify(attrs)).toContain('FLAGGED')
    })

    it('should compile subject query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { subject: 'test' })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('SUBJECT')
      expect(str).toContain('test')
    })

    it('should compile from query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { from: 'user@example.com' })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('FROM')
      expect(str).toContain('user@example.com')
    })

    it('should compile to query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { to: 'user@example.com' })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('TO')
      expect(str).toContain('user@example.com')
    })

    it('should compile uid query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { uid: '1:100' })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('UID')
      expect(str).toContain('1:100')
    })

    it('should compile larger query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { larger: 10_000 })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('LARGER')
      expect(str).toContain('10000')
    })

    it('should compile smaller query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { smaller: 10_000 })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('SMALLER')
      expect(str).toContain('10000')
    })

    it('should compile date queries', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { since: '2024-06-01' })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('SINCE')
    })

    it('should compile NOT query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { not: { seen: true } })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('NOT')
      expect(str).toContain('SEEN')
    })

    it('should compile OR query', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await search(ctx, { or: [{ from: 'a@example.com' }, { from: 'b@example.com' }] })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('OR')
      expect(str).toContain('FROM')
    })
  })

  describe('response parsing', () => {
    it('should parse UIDs from SEARCH response', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })

      const execPromise = search(ctx, { all: true })

      await ctx.triggerUntagged(
        'SEARCH',
        createMockResponse({
          attributes: [createToken('1'), createToken('5'), createToken('10'), createToken('15')],
        }),
      )

      const result = await execPromise

      expect(result).toEqual([1, 5, 10, 15])
    })

    it('should sort results', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })

      const execPromise = search(ctx, { all: true })

      await ctx.triggerUntagged(
        'SEARCH',
        createMockResponse({
          attributes: [createToken('15'), createToken('1'), createToken('10'), createToken('5')],
        }),
      )

      const result = await execPromise

      expect(result).toEqual([1, 5, 10, 15])
    })

    it('should handle empty SEARCH response', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })

      const execPromise = search(ctx, { all: true })

      await ctx.triggerUntagged(
        'SEARCH',
        createMockResponse({
          attributes: [],
        }),
      )

      const result = await execPromise

      expect(result).toEqual([])
    })

    it('should deduplicate results', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })

      const execPromise = search(ctx, { all: true })

      await ctx.triggerUntagged(
        'SEARCH',
        createMockResponse({
          attributes: [createToken('1'), createToken('1'), createToken('5'), createToken('5')],
        }),
      )

      const result = await execPromise

      expect(result).toEqual([1, 5])
    })

    it('should ignore non-numeric values', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })

      const execPromise = search(ctx, { all: true })

      await ctx.triggerUntagged(
        'SEARCH',
        createMockResponse({
          attributes: [createToken('1'), createToken('abc'), createToken('5'), createToken('')],
        }),
      )

      const result = await execPromise

      expect(result).toEqual([1, 5])
    })
  })

  describe('Gmail extensions', () => {
    it('should use X-GM-MSGID for emailId when X-GM-EXT-1 is available', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'X-GM-EXT-1']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      await search(ctx, { emailId: '12345' })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('X-GM-MSGID')
    })

    it('should use X-GM-THRID for threadId when X-GM-EXT-1 is available', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'X-GM-EXT-1']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      await search(ctx, { threadId: '12345' })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('X-GM-THRID')
    })
  })

  describe('OBJECTID extension', () => {
    it('should use EMAILID for emailId when OBJECTID is available', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'OBJECTID']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      await search(ctx, { emailId: '12345' })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('EMAILID')
    })

    it('should use THREADID for threadId when OBJECTID is available', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'OBJECTID']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      await search(ctx, { threadId: '12345' })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('THREADID')
    })
  })

  describe('error handling', () => {
    it('should return false on error', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      ctx.exec = createThrowingExec('Server error')

      const result = await search(ctx, { all: true })
      expect(result).toBe(false)
    })

    it('should log warning on error', async () => {
      const warnCalls: unknown[] = []
      const ctx = createMockContext({
        log: createMockLoggerWithWarn(warnCalls),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      ctx.exec = createThrowingExec('Server error')

      await search(ctx, { all: true })
      expect(warnCalls.length).toBeGreaterThan(0)
    })
  })
})
