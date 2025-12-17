import { ModSeq } from '@imap-sdk/types/common'
import type { MailboxInfo } from '@imap-sdk/types/mailbox'

import { expunge } from './expunge'
import {
  createMockContext,
  createMockLoggerWithWarn,
  createMockMailbox,
  createMockResponse,
  createThrowingExec,
  createToken,
} from './test-utils'

describe('expunge command', () => {
  describe('preconditions', () => {
    it('should return false if state is NOT_AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'NOT_AUTHENTICATED' })
      const result = await expunge(ctx, '1:*')
      expect(result).toBe(false)
    })

    it('should return false if state is AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await expunge(ctx, '1:*')
      expect(result).toBe(false)
    })

    it('should return false if state is LOGOUT', async () => {
      const ctx = createMockContext({ state: 'LOGOUT' })
      const result = await expunge(ctx, '1:*')
      expect(result).toBe(false)
    })

    it('should return false if range is empty', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      const result = await expunge(ctx, '')
      expect(result).toBe(false)
    })

    it('should work in SELECTED state', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      const result = await expunge(ctx, '1:*')
      expect(result).toBe(true)
    })
  })

  describe('flag deletion', () => {
    it('should call STORE to set Deleted flag first', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      await expunge(ctx, '1:10')

      expect(ctx.mockRunCalls).toHaveLength(1)
      expect(ctx.mockRunCalls[0].command).toBe('STORE')
      expect(ctx.mockRunCalls[0].args[0]).toBe('1:10')
      expect(ctx.mockRunCalls[0].args[1]).toEqual(['\\Deleted'])
    })

    it('should pass options to STORE command', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      await expunge(ctx, '1:10', { uid: true })

      expect(ctx.mockRunCalls[0].args[2]).toMatchObject({
        silent: true,
        uid: true,
      })
    })
  })

  describe('EXPUNGE command', () => {
    it('should send EXPUNGE command after STORE', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      await expunge(ctx, '1:*')

      expect(ctx.mockExecCalls).toHaveLength(1)
      expect(ctx.mockExecCalls[0].command).toBe('EXPUNGE')
    })

    it('should send UID EXPUNGE when uid option is true and UIDPLUS is available', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'UIDPLUS']),
        state: 'SELECTED',
      })

      await expunge(ctx, '1:10', { uid: true })

      expect(ctx.mockExecCalls[0].command).toBe('UID EXPUNGE')
      expect(ctx.mockExecCalls[0].attributes).toHaveLength(1)
      expect(ctx.mockExecCalls[0].attributes[0]).toMatchObject({
        type: 'SEQUENCE',
        value: '1:10',
      })
    })

    it('should send regular EXPUNGE when uid is true but UIDPLUS is not available', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        state: 'SELECTED',
      })

      await expunge(ctx, '1:10', { uid: true })

      expect(ctx.mockExecCalls[0].command).toBe('EXPUNGE')
      expect(ctx.mockExecCalls[0].attributes).toHaveLength(0)
    })

    it('should send regular EXPUNGE without attributes when uid is false', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      await expunge(ctx, '1:10', { uid: false })

      expect(ctx.mockExecCalls[0].command).toBe('EXPUNGE')
      expect(ctx.mockExecCalls[0].attributes).toHaveLength(0)
    })
  })

  describe('response parsing', () => {
    it('should update mailbox highestModseq from response', async () => {
      const mailbox = createMockMailbox({ highestModseq: ModSeq(100n) })
      let updatedMailbox: MailboxInfo | null = null

      const ctx = createMockContext({
        mailbox,
        setMailbox: (m: MailboxInfo | null) => {
          updatedMailbox = m
        },
        state: 'SELECTED',
      })

      ctx.setMockExecResponse({
        response: createMockResponse({
          attributes: [
            {
              section: [createToken('HIGHESTMODSEQ'), createToken('9999')],
              type: 'SECTION',
              value: '',
            },
          ] as never,
        }),
      })

      await expunge(ctx, '1:10')

      expect(updatedMailbox).not.toBeNull()
      expect((updatedMailbox as unknown as MailboxInfo).highestModseq).toBe(ModSeq(9999n))
    })

    it('should not update highestModseq if new value is lower', async () => {
      const mailbox = createMockMailbox({ highestModseq: ModSeq(10000n) })
      let updatedMailbox: MailboxInfo | null = null

      const ctx = createMockContext({
        mailbox,
        setMailbox: (m: MailboxInfo | null) => {
          updatedMailbox = m
        },
        state: 'SELECTED',
      })

      ctx.setMockExecResponse({
        response: createMockResponse({
          attributes: [
            {
              section: [createToken('HIGHESTMODSEQ'), createToken('5000')],
              type: 'SECTION',
              value: '',
            },
          ] as never,
        }),
      })

      await expunge(ctx, '1:10')

      expect(updatedMailbox).toBeNull()
    })

    it('should return true on success', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      const result = await expunge(ctx, '1:10')
      expect(result).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should return false on error', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      ctx.exec = createThrowingExec('Server error')

      const result = await expunge(ctx, '1:10')
      expect(result).toBe(false)
    })

    it('should log warning on error', async () => {
      const warnCalls: unknown[] = []
      const ctx = createMockContext({
        log: createMockLoggerWithWarn(warnCalls),
        state: 'SELECTED',
      })
      ctx.exec = createThrowingExec('Server error')

      await expunge(ctx, '1:10')
      expect(warnCalls.length).toBeGreaterThan(0)
    })
  })
})
