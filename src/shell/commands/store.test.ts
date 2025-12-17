import { ModSeq } from '@imap-sdk/types/common'

import { store } from './store'
import { createMockContext, createMockLoggerWithWarn, createMockMailbox, createThrowingExec } from './test-utils'

describe('store command', () => {
  describe('preconditions', () => {
    it('should return false if state is NOT_AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'NOT_AUTHENTICATED' })
      const result = await store(ctx, '1:*', '\\Seen')
      expect(result).toBe(false)
    })

    it('should return false if state is AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await store(ctx, '1:*', '\\Seen')
      expect(result).toBe(false)
    })

    it('should return false if range is empty', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      const result = await store(ctx, '', '\\Seen')
      expect(result).toBe(false)
    })

    it('should work in SELECTED state', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      const result = await store(ctx, '1:*', '\\Seen')
      expect(result).toBe(true)
    })
  })

  describe('command structure', () => {
    it('should send STORE command with range', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await store(ctx, '1:10', '\\Seen')

      expect(ctx.mockExecCalls).toHaveLength(1)
      expect(ctx.mockExecCalls[0].command).toBe('STORE')
      expect(ctx.mockExecCalls[0].attributes[0]).toMatchObject({
        type: 'SEQUENCE',
        value: '1:10',
      })
    })

    it('should send UID STORE when uid option is true', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await store(ctx, '1:10', '\\Seen', { uid: true })

      expect(ctx.mockExecCalls[0].command).toBe('UID STORE')
    })
  })

  describe('flag operations', () => {
    it('should use +FLAGS by default (add)', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await store(ctx, '1:*', '\\Seen')

      expect(ctx.mockExecCalls[0].attributes[1]).toMatchObject({
        value: '+FLAGS',
      })
    })

    it('should use +FLAGS for add operation', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await store(ctx, '1:*', '\\Seen', { operation: 'add' })

      expect(ctx.mockExecCalls[0].attributes[1]).toMatchObject({
        value: '+FLAGS',
      })
    })

    it('should use -FLAGS for remove operation', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await store(ctx, '1:*', '\\Seen', { operation: 'remove' })

      expect(ctx.mockExecCalls[0].attributes[1]).toMatchObject({
        value: '-FLAGS',
      })
    })

    it('should use FLAGS for set operation', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await store(ctx, '1:*', '\\Seen', { operation: 'set' })

      expect(ctx.mockExecCalls[0].attributes[1]).toMatchObject({
        value: 'FLAGS',
      })
    })

    it('should use FLAGS.SILENT for silent mode', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await store(ctx, '1:*', '\\Seen', { silent: true })

      expect(ctx.mockExecCalls[0].attributes[1]).toMatchObject({
        value: '+FLAGS.SILENT',
      })
    })
  })

  describe('flags handling', () => {
    it('should accept single flag as string', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await store(ctx, '1:*', '\\Seen')

      const flags = ctx.mockExecCalls[0].attributes[2] as { value: string }[]
      expect(flags.some(f => f.value === '\\Seen')).toBe(true)
    })

    it('should accept multiple flags as array', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await store(ctx, '1:*', ['\\Seen', '\\Flagged'])

      const flags = ctx.mockExecCalls[0].attributes[2] as { value: string }[]
      expect(flags.some(f => f.value === '\\Seen')).toBe(true)
      expect(flags.some(f => f.value === '\\Flagged')).toBe(true)
    })

    it('should convert color flags to special flags', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await store(ctx, '1:*', ['red', 'blue', 'green'])

      const flags = ctx.mockExecCalls[0].attributes[2] as { value: string }[]
      expect(flags.some(f => f.value === '$MailFlagBit0')).toBe(true)
      expect(flags.some(f => f.value === '$MailFlagBit2')).toBe(true)
      expect(flags.some(f => f.value === '$MailFlagBit1')).toBe(true)
    })

    it('should filter out invalid flags based on mailbox permanent flags', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({
          permanentFlags: new Set(['\\Seen', '\\Answered']),
        }),
        state: 'SELECTED',
      })
      await store(ctx, '1:*', ['\\Seen', '\\Custom'])

      const flags = ctx.mockExecCalls[0].attributes[2] as { value: string }[]
      expect(flags.some(f => f.value === '\\Seen')).toBe(true)
      expect(flags.some(f => f.value === '\\Custom')).toBe(false)
    })

    it('should allow any flag when \\* is in permanent flags', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({
          permanentFlags: new Set(['\\*']),
        }),
        state: 'SELECTED',
      })
      await store(ctx, '1:*', ['\\Seen', '\\Custom', 'MyFlag'])

      const flags = ctx.mockExecCalls[0].attributes[2] as { value: string }[]
      expect(flags).toHaveLength(3)
    })

    it('should allow any flag for remove operation', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({
          permanentFlags: new Set(),
        }),
        state: 'SELECTED',
      })
      await store(ctx, '1:*', ['\\Seen', '\\Custom'], { operation: 'remove' })

      const flags = ctx.mockExecCalls[0].attributes[2] as { value: string }[]
      expect(flags).toHaveLength(2)
    })

    it('should return false if no valid flags for non-set operation', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({
          permanentFlags: new Set(),
        }),
        state: 'SELECTED',
      })
      const result = await store(ctx, '1:*', ['\\Custom'])

      expect(result).toBe(false)
    })

    it('should allow empty flags for set operation', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({
          permanentFlags: new Set(),
        }),
        state: 'SELECTED',
      })
      const result = await store(ctx, '1:*', [], { operation: 'set' })

      expect(result).toBe(true)
    })
  })

  describe('Gmail labels', () => {
    it('should use X-GM-LABELS when useLabels is true', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'X-GM-EXT-1']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      await store(ctx, '1:*', 'Important', { useLabels: true })

      expect(ctx.mockExecCalls[0].attributes[1]).toMatchObject({
        value: '+X-GM-LABELS',
      })
    })

    it('should return false if useLabels but X-GM-EXT-1 not available', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      const result = await store(ctx, '1:*', 'Important', { useLabels: true })

      expect(result).toBe(false)
    })
  })

  describe('UNCHANGEDSINCE modifier', () => {
    it('should include UNCHANGEDSINCE when provided', async () => {
      const ctx = createMockContext({
        enabled: new Set(['CONDSTORE']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      await store(ctx, '1:*', '\\Seen', { unchangedSince: ModSeq(12345n) })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('UNCHANGEDSINCE')
      expect(str).toContain('12345')
    })

    it('should not include UNCHANGEDSINCE when CONDSTORE not enabled', async () => {
      const ctx = createMockContext({
        enabled: new Set(),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      await store(ctx, '1:*', '\\Seen', { unchangedSince: ModSeq(12345n) })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).not.toContain('UNCHANGEDSINCE')
    })
  })

  describe('error handling', () => {
    it('should return false on error', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      ctx.exec = createThrowingExec('Server error')

      const result = await store(ctx, '1:*', '\\Seen')
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

      await store(ctx, '1:*', '\\Seen')
      expect(warnCalls.length).toBeGreaterThan(0)
    })
  })
})
