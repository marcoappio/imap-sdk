import type { MailboxPath } from '@imap-sdk/types/common'

import { status } from './status'
import {
  createMockContext,
  createMockLoggerWithWarn,
  createMockResponse,
  createThrowingExec,
  createToken,
} from './test-utils'

describe('status command', () => {
  describe('preconditions', () => {
    it('should return false if state is NOT_AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'NOT_AUTHENTICATED' })
      const result = await status(ctx, 'INBOX', { messages: true })
      expect(result).toBe(false)
      expect(ctx.mockExecCalls).toHaveLength(0)
    })

    it('should return false if state is LOGOUT', async () => {
      const ctx = createMockContext({ state: 'LOGOUT' })
      const result = await status(ctx, 'INBOX', { messages: true })
      expect(result).toBe(false)
    })

    it('should return false if path is empty', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await status(ctx, '', { messages: true })
      expect(result).toBe(false)
    })

    it('should return false if no query attributes are provided', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await status(ctx, 'INBOX', {})
      expect(result).toBe(false)
    })

    it('should work in AUTHENTICATED state', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await status(ctx, 'INBOX', { messages: true })
      expect(result).not.toBe(false)
      expect(ctx.mockExecCalls).toHaveLength(1)
    })

    it('should work in SELECTED state', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      const result = await status(ctx, 'INBOX', { messages: true })
      expect(result).not.toBe(false)
    })
  })

  describe('query attributes', () => {
    it('should include MESSAGES in query when requested', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await status(ctx, 'INBOX', { messages: true })

      const call = ctx.mockExecCalls[0]
      expect(call.command).toBe('STATUS')
      const queryAttrs = call.attributes[1] as { type: string; value: string }[]
      expect(queryAttrs.some(a => a.value === 'MESSAGES')).toBe(true)
    })

    it('should include RECENT in query when requested', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await status(ctx, 'INBOX', { recent: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1] as { type: string; value: string }[]
      expect(queryAttrs.some(a => a.value === 'RECENT')).toBe(true)
    })

    it('should include UIDNEXT in query when requested', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await status(ctx, 'INBOX', { uidNext: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1] as { type: string; value: string }[]
      expect(queryAttrs.some(a => a.value === 'UIDNEXT')).toBe(true)
    })

    it('should include UIDVALIDITY in query when requested', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await status(ctx, 'INBOX', { uidValidity: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1] as { type: string; value: string }[]
      expect(queryAttrs.some(a => a.value === 'UIDVALIDITY')).toBe(true)
    })

    it('should include UNSEEN in query when requested', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await status(ctx, 'INBOX', { unseen: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1] as { type: string; value: string }[]
      expect(queryAttrs.some(a => a.value === 'UNSEEN')).toBe(true)
    })

    it('should include HIGHESTMODSEQ when CONDSTORE is enabled', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['CONDSTORE']),
        state: 'AUTHENTICATED',
      })
      await status(ctx, 'INBOX', { highestModseq: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1] as { type: string; value: string }[]
      expect(queryAttrs.some(a => a.value === 'HIGHESTMODSEQ')).toBe(true)
    })

    it('should not include HIGHESTMODSEQ when CONDSTORE is not enabled', async () => {
      const ctx = createMockContext({
        capabilities: new Set(),
        state: 'AUTHENTICATED',
      })
      const result = await status(ctx, 'INBOX', { highestModseq: true })
      expect(result).toBe(false)
    })

    it('should include multiple query attributes', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await status(ctx, 'INBOX', { messages: true, recent: true, unseen: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1] as { type: string; value: string }[]
      expect(queryAttrs).toHaveLength(3)
      expect(queryAttrs.some(a => a.value === 'MESSAGES')).toBe(true)
      expect(queryAttrs.some(a => a.value === 'RECENT')).toBe(true)
      expect(queryAttrs.some(a => a.value === 'UNSEEN')).toBe(true)
    })

    it('should skip disabled query attributes', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await status(ctx, 'INBOX', { messages: true, recent: false, unseen: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1] as { type: string; value: string }[]
      expect(queryAttrs).toHaveLength(2)
      expect(queryAttrs.some(a => a.value === 'RECENT')).toBe(false)
    })
  })

  describe('path encoding', () => {
    it('should normalize the path', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await status(ctx, 'inbox', { messages: true })

      const pathAttr = ctx.mockExecCalls[0].attributes[0] as { type: string; value: string }
      expect(pathAttr.value).toBe('INBOX')
    })

    it('should use STRING type for paths with special characters', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await status(ctx, 'Folder&Name', { messages: true })

      const pathAttr = ctx.mockExecCalls[0].attributes[0] as { type: string; value: string }
      expect(pathAttr.type).toBe('STRING')
    })

    it('should use ATOM type for simple paths', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await status(ctx, 'INBOX', { messages: true })

      const pathAttr = ctx.mockExecCalls[0].attributes[0] as { type: string; value: string }
      expect(pathAttr.type).toBe('ATOM')
    })
  })

  describe('response parsing', () => {
    it('should parse STATUS response with MESSAGES', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })

      ctx.setMockExecResponse({
        response: createMockResponse(),
      })

      const execPromise = status(ctx, 'INBOX', { messages: true })

      await ctx.triggerUntagged(
        'STATUS',
        createMockResponse({
          attributes: [createToken('INBOX'), [createToken('MESSAGES'), createToken('42')]] as never,
        }),
      )

      const result = await execPromise
      expect(result).not.toBe(false)
      if (result) {
        expect(result.messages).toBe(42)
      }
    })

    it('should parse STATUS response with multiple values', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })

      const execPromise = status(ctx, 'INBOX', { messages: true, recent: true, uidNext: true })

      await ctx.triggerUntagged(
        'STATUS',
        createMockResponse({
          attributes: [
            createToken('INBOX'),
            [
              createToken('MESSAGES'),
              createToken('100'),
              createToken('RECENT'),
              createToken('5'),
              createToken('UIDNEXT'),
              createToken('1234'),
            ],
          ] as never,
        }),
      )

      const result = await execPromise
      expect(result).not.toBe(false)
      if (result) {
        expect(result.messages).toBe(100)
        expect(result.recent).toBe(5)
        expect(result.uidNext).toBe(1234)
      }
    })

    it('should parse UIDVALIDITY as BigInt', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })

      const execPromise = status(ctx, 'INBOX', { uidValidity: true })

      await ctx.triggerUntagged(
        'STATUS',
        createMockResponse({
          attributes: [createToken('INBOX'), [createToken('UIDVALIDITY'), createToken('12345678901234')]] as never,
        }),
      )

      const result = await execPromise
      expect(result).not.toBe(false)
      if (result) {
        expect(result.uidValidity).toBe(12345678901234n)
      }
    })

    it('should parse HIGHESTMODSEQ as BigInt', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['CONDSTORE']),
        state: 'AUTHENTICATED',
      })

      const execPromise = status(ctx, 'INBOX', { highestModseq: true })

      await ctx.triggerUntagged(
        'STATUS',
        createMockResponse({
          attributes: [createToken('INBOX'), [createToken('HIGHESTMODSEQ'), createToken('98765432109876')]] as never,
        }),
      )

      const result = await execPromise
      expect(result).not.toBe(false)
      if (result) {
        expect(result.highestModseq).toBe(98765432109876n)
      }
    })

    it('should handle invalid numeric values gracefully', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })

      const execPromise = status(ctx, 'INBOX', { messages: true })

      await ctx.triggerUntagged(
        'STATUS',
        createMockResponse({
          attributes: [createToken('INBOX'), [createToken('MESSAGES'), createToken('invalid')]] as never,
        }),
      )

      const result = await execPromise
      expect(result).not.toBe(false)
      if (result) {
        expect(result.messages).toBeUndefined()
      }
    })

    it('should return path in result', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await status(ctx, 'INBOX', { messages: true })

      expect(result).not.toBe(false)
      if (result) {
        expect(result.path).toBe('INBOX')
      }
    })
  })

  describe('error handling', () => {
    it('should return false on error', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      ctx.exec = createThrowingExec('Server error')

      const result = await status(ctx, 'INBOX', { messages: true })
      expect(result).toBe(false)
    })

    it('should log warning on error', async () => {
      const warnCalls: unknown[] = []
      const ctx = createMockContext({
        log: createMockLoggerWithWarn(warnCalls),
        state: 'AUTHENTICATED',
      })
      ctx.exec = createThrowingExec('Server error')

      await status(ctx, 'INBOX', { messages: true })
      expect(warnCalls.length).toBeGreaterThan(0)
    })
  })

  describe('exists event emission', () => {
    it('should emit exists event when message count changes in current mailbox', async () => {
      const emitExistsCalls: unknown[] = []
      const ctx = createMockContext({
        emitExists: info => emitExistsCalls.push(info),
        mailbox: {
          delimiter: '/',
          exists: 50,
          flags: new Set(),
          path: 'INBOX' as MailboxPath,
          uidNext: 100,
          uidValidity: 1n as never,
        },
        state: 'SELECTED',
      })

      const execPromise = status(ctx, 'INBOX', { messages: true })

      await ctx.triggerUntagged(
        'STATUS',
        createMockResponse({
          attributes: [createToken('INBOX'), [createToken('MESSAGES'), createToken('75')]] as never,
        }),
      )

      await execPromise

      expect(emitExistsCalls).toHaveLength(1)
      expect(emitExistsCalls[0]).toMatchObject({
        count: 75,
        path: 'INBOX',
        prevCount: 50,
      })
    })

    it('should not emit exists event when message count is unchanged', async () => {
      const emitExistsCalls: unknown[] = []
      const ctx = createMockContext({
        emitExists: info => emitExistsCalls.push(info),
        mailbox: {
          delimiter: '/',
          exists: 50,
          flags: new Set(),
          path: 'INBOX' as MailboxPath,
          uidNext: 100,
          uidValidity: 1n as never,
        },
        state: 'SELECTED',
      })

      const execPromise = status(ctx, 'INBOX', { messages: true })

      await ctx.triggerUntagged(
        'STATUS',
        createMockResponse({
          attributes: [createToken('INBOX'), [createToken('MESSAGES'), createToken('50')]] as never,
        }),
      )

      await execPromise

      expect(emitExistsCalls).toHaveLength(0)
    })

    it('should not emit exists event for different mailbox', async () => {
      const emitExistsCalls: unknown[] = []
      const ctx = createMockContext({
        emitExists: info => emitExistsCalls.push(info),
        mailbox: {
          delimiter: '/',
          exists: 50,
          flags: new Set(),
          path: 'INBOX' as MailboxPath,
          uidNext: 100,
          uidValidity: 1n as never,
        },
        state: 'SELECTED',
      })

      const execPromise = status(ctx, 'Sent', { messages: true })

      await ctx.triggerUntagged(
        'STATUS',
        createMockResponse({
          attributes: [createToken('Sent'), [createToken('MESSAGES'), createToken('100')]] as never,
        }),
      )

      await execPromise

      expect(emitExistsCalls).toHaveLength(0)
    })
  })
})
