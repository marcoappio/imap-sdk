import type { MailboxPath } from '@imap-sdk/types/common'

import { append } from './append'
import {
  createMockContext,
  createMockLoggerWithWarn,
  createMockMailbox,
  createMockResponse,
  createThrowingExec,
  createToken,
} from './test-utils'

const DATE_PATTERN = /15-Jun-2024/

describe('append command', () => {
  describe('preconditions', () => {
    it('should throw if state is NOT_AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'NOT_AUTHENTICATED' })
      await expect(append(ctx, 'INBOX', 'test content')).rejects.toThrow('Invalid state for APPEND')
    })

    it('should throw if state is LOGOUT', async () => {
      const ctx = createMockContext({ state: 'LOGOUT' })
      await expect(append(ctx, 'INBOX', 'test content')).rejects.toThrow('Invalid state for APPEND')
    })

    it('should throw if destination is empty', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await expect(append(ctx, '', 'test content')).rejects.toThrow('Invalid state for APPEND')
    })

    it('should work in AUTHENTICATED state', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await append(ctx, 'INBOX', 'test content')
      expect(result).toBeDefined()
    })

    it('should work in SELECTED state', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      const result = await append(ctx, 'INBOX', 'test content')
      expect(result).toBeDefined()
    })
  })

  describe('content handling', () => {
    it('should convert string content to Buffer', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await append(ctx, 'INBOX', 'test message content')

      const attrs = ctx.mockExecCalls[0].attributes as { type: string; value: unknown }[]
      const literalAttr = attrs.find(a => a.type === 'LITERAL')
      expect(literalAttr).toBeDefined()
      expect(Buffer.isBuffer(literalAttr?.value)).toBe(true)
    })

    it('should accept Buffer content directly', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const content = Buffer.from('test message')
      await append(ctx, 'INBOX', content)

      const attrs = ctx.mockExecCalls[0].attributes as { type: string; value: unknown }[]
      const literalAttr = attrs.find(a => a.type === 'LITERAL')
      expect(literalAttr?.value).toBe(content)
    })
  })

  describe('command structure', () => {
    it('should send APPEND command with destination', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await append(ctx, 'INBOX', 'test')

      expect(ctx.mockExecCalls).toHaveLength(1)
      expect(ctx.mockExecCalls[0].command).toBe('APPEND')
      expect(ctx.mockExecCalls[0].attributes[0]).toMatchObject({
        type: 'ATOM',
        value: 'INBOX',
      })
    })

    it('should normalize destination path', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await append(ctx, 'inbox', 'test')

      expect(ctx.mockExecCalls[0].attributes[0]).toMatchObject({
        value: 'INBOX',
      })
    })

    it('should include flags when provided as array', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await append(ctx, 'INBOX', 'test', { flags: ['\\Seen', '\\Flagged'] })

      const attrs = ctx.mockExecCalls[0].attributes
      const flagsAttr = attrs[1] as { type: string; value: string }[]
      expect(Array.isArray(flagsAttr)).toBe(true)
      expect(flagsAttr.some(f => f.value === '\\Seen')).toBe(true)
      expect(flagsAttr.some(f => f.value === '\\Flagged')).toBe(true)
    })

    it('should include flags when provided as string', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await append(ctx, 'INBOX', 'test', { flags: '\\Seen' })

      const attrs = ctx.mockExecCalls[0].attributes
      const flagsAttr = attrs[1] as { type: string; value: string }[]
      expect(Array.isArray(flagsAttr)).toBe(true)
      expect(flagsAttr.some(f => f.value === '\\Seen')).toBe(true)
    })

    it('should convert color flags to special flags', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      await append(ctx, 'INBOX', 'test', { flags: ['red', 'blue'] })

      const attrs = ctx.mockExecCalls[0].attributes
      const flagsAttr = attrs[1] as { type: string; value: string }[]
      expect(flagsAttr.some(f => f.value === '$MailFlagBit0')).toBe(true)
      expect(flagsAttr.some(f => f.value === '$MailFlagBit2')).toBe(true)
    })

    it('should include internal date when provided', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const date = new Date('2024-06-15T10:30:00Z')
      await append(ctx, 'INBOX', 'test', { internalDate: date })

      const attrs = ctx.mockExecCalls[0].attributes as { type: string; value: unknown }[]
      const dateAttr = attrs.find(a => a.type === 'STRING')
      expect(dateAttr).toBeDefined()
      expect(dateAttr?.value).toMatch(DATE_PATTERN)
    })

    it('should mark literal as literal8 when content has NULL bytes and BINARY is available', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'BINARY']),
        state: 'AUTHENTICATED',
      })
      const content = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0x57, 0x6f, 0x72, 0x6c, 0x64])
      await append(ctx, 'INBOX', content)

      const attrs = ctx.mockExecCalls[0].attributes as { type: string; isLiteral8?: boolean }[]
      const literalAttr = attrs.find(a => a.type === 'LITERAL')
      expect(literalAttr?.isLiteral8).toBe(true)
    })

    it('should not mark literal as literal8 when content has no NULL bytes', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'BINARY']),
        state: 'AUTHENTICATED',
      })
      await append(ctx, 'INBOX', 'Hello World')

      const attrs = ctx.mockExecCalls[0].attributes as { type: string; isLiteral8?: boolean }[]
      const literalAttr = attrs.find(a => a.type === 'LITERAL')
      expect(literalAttr?.isLiteral8).toBe(false)
    })
  })

  describe('result', () => {
    it('should return destination in result', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await append(ctx, 'INBOX', 'test')

      expect(result.destination).toBe('INBOX')
    })

    it('should return path when mailbox is selected', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({ path: 'Sent' as MailboxPath }),
        state: 'SELECTED',
      })
      const result = await append(ctx, 'INBOX', 'test')

      expect(result.path).toBe('Sent')
    })

    it('should parse APPENDUID response', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })

      ctx.setMockExecResponse({
        response: createMockResponse({
          attributes: [
            {
              section: [createToken('APPENDUID'), createToken('12345'), createToken('999')],
              type: 'SECTION',
              value: '',
            },
          ] as never,
        }),
      })

      const result = await append(ctx, 'INBOX', 'test')

      expect(result.uidValidity).toBe(12345n)
      expect(result.uid).toBe(999)
    })
  })

  describe('EXISTS handling', () => {
    it('should capture seq from EXISTS response when appending to current mailbox', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({ path: 'INBOX' as MailboxPath }),
        state: 'SELECTED',
      })

      const execPromise = append(ctx, 'INBOX', 'test')

      await ctx.triggerUntagged(
        'EXISTS',
        createMockResponse({
          command: '150',
        }),
      )

      const result = await execPromise

      expect(result.seq).toBe(150)
    })

    it('should emit exists event when message count changes', async () => {
      const emitExistsCalls: unknown[] = []
      const ctx = createMockContext({
        emitExists: info => emitExistsCalls.push(info),
        mailbox: createMockMailbox({ exists: 100, path: 'INBOX' as MailboxPath }),
        state: 'SELECTED',
      })

      const execPromise = append(ctx, 'INBOX', 'test')

      await ctx.triggerUntagged(
        'EXISTS',
        createMockResponse({
          command: '101',
        }),
      )

      await execPromise

      expect(emitExistsCalls).toHaveLength(1)
      expect(emitExistsCalls[0]).toMatchObject({
        count: 101,
        path: 'INBOX',
        prevCount: 100,
      })
    })

    it('should not register EXISTS handler when appending to different mailbox', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({ path: 'INBOX' as MailboxPath }),
        state: 'SELECTED',
      })

      await append(ctx, 'Sent', 'test')

      const call = ctx.mockExecCalls[0]
      expect(call.options?.untagged?.EXISTS).toBeUndefined()
    })
  })

  describe('NOOP fallback for seq', () => {
    it('should send NOOP to get seq when EXISTS not received', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({ path: 'INBOX' as MailboxPath }),
        state: 'SELECTED',
      })

      await append(ctx, 'INBOX', 'test')

      expect(ctx.mockExecCalls).toHaveLength(2)
      expect(ctx.mockExecCalls[1].command).toBe('NOOP')
    })
  })

  describe('search fallback for UID', () => {
    it('should search for UID when seq is known but UID is not', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({ path: 'INBOX' as MailboxPath }),
        state: 'SELECTED',
      })

      ctx.setMockRunResponse([12_345])

      const firstExecPromise = append(ctx, 'INBOX', 'test')

      await ctx.triggerUntagged(
        'EXISTS',
        createMockResponse({
          command: '150',
        }),
      )

      const result = await firstExecPromise

      expect(ctx.mockRunCalls.some(c => c.command === 'SEARCH')).toBe(true)
      expect(result.uid).toBe(12_345)
    })
  })

  describe('error handling', () => {
    it('should throw on error', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      ctx.exec = createThrowingExec('Server error')

      await expect(append(ctx, 'INBOX', 'test')).rejects.toThrow('Server error')
    })

    it('should log warning on error', async () => {
      const warnCalls: unknown[] = []
      const ctx = createMockContext({
        log: createMockLoggerWithWarn(warnCalls),
        state: 'AUTHENTICATED',
      })
      ctx.exec = createThrowingExec('Server error')

      try {
        await append(ctx, 'INBOX', 'test')
      } catch {
        /* expected */
      }
      expect(warnCalls.length).toBeGreaterThan(0)
    })
  })
})
