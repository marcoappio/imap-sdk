import type { MailboxPath } from '@imap-sdk/types/common'

import { copy } from './copy'
import {
  createMockContext,
  createMockLoggerWithWarn,
  createMockMailbox,
  createMockResponse,
  createThrowingExec,
  createToken,
} from './test-utils'

describe('copy command', () => {
  describe('preconditions', () => {
    it('should return false if state is NOT_AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'NOT_AUTHENTICATED' })
      const result = await copy(ctx, '1:*', 'Archive')
      expect(result).toBe(false)
    })

    it('should return false if state is AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await copy(ctx, '1:*', 'Archive')
      expect(result).toBe(false)
    })

    it('should return false if state is LOGOUT', async () => {
      const ctx = createMockContext({ state: 'LOGOUT' })
      const result = await copy(ctx, '1:*', 'Archive')
      expect(result).toBe(false)
    })

    it('should return false if range is empty', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      const result = await copy(ctx, '', 'Archive')
      expect(result).toBe(false)
    })

    it('should return false if destination is empty', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      const result = await copy(ctx, '1:*', '')
      expect(result).toBe(false)
    })

    it('should work in SELECTED state', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      const result = await copy(ctx, '1:*', 'Archive')
      expect(result).not.toBe(false)
    })
  })

  describe('command structure', () => {
    it('should send COPY command with range and destination', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await copy(ctx, '1:10', 'Archive')

      expect(ctx.mockExecCalls).toHaveLength(1)
      expect(ctx.mockExecCalls[0].command).toBe('COPY')
      expect(ctx.mockExecCalls[0].attributes[0]).toMatchObject({
        type: 'SEQUENCE',
        value: '1:10',
      })
      expect(ctx.mockExecCalls[0].attributes[1]).toMatchObject({
        type: 'ATOM',
        value: 'Archive',
      })
    })

    it('should send UID COPY when uid option is true', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await copy(ctx, '1:10', 'Archive', { uid: true })

      expect(ctx.mockExecCalls[0].command).toBe('UID COPY')
    })

    it('should normalize destination path', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      await copy(ctx, '1:*', 'inbox')

      expect(ctx.mockExecCalls[0].attributes[1]).toMatchObject({
        value: 'INBOX',
      })
    })
  })

  describe('result', () => {
    it('should return destination in result', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      const result = await copy(ctx, '1:*', 'Archive')

      expect(result).not.toBe(false)
      if (result !== false) {
        expect(result.destination).toBe('Archive')
      }
    })

    it('should return path from current mailbox', async () => {
      const ctx = createMockContext({
        mailbox: createMockMailbox({ path: 'INBOX' as MailboxPath }),
        state: 'SELECTED',
      })
      const result = await copy(ctx, '1:*', 'Archive')

      expect(result).not.toBe(false)
      if (result !== false) {
        expect(result.path).toBe('INBOX')
      }
    })
  })

  describe('COPYUID response parsing', () => {
    it('should parse COPYUID response with uidValidity', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })

      ctx.setMockExecResponse({
        response: createMockResponse({
          attributes: [
            {
              section: [createToken('COPYUID'), createToken('12345'), createToken('1:3'), createToken('100:102')],
              type: 'SECTION',
              value: '',
            },
          ] as never,
        }),
      })

      const result = await copy(ctx, '1:3', 'Archive')

      expect(result).not.toBe(false)
      if (result !== false) {
        expect(result.uidValidity).toBe(12345n)
      }
    })

    it('should parse COPYUID response with uidMap', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })

      ctx.setMockExecResponse({
        response: createMockResponse({
          attributes: [
            {
              section: [createToken('COPYUID'), createToken('12345'), createToken('1:3'), createToken('100:102')],
              type: 'SECTION',
              value: '',
            },
          ] as never,
        }),
      })

      const result = await copy(ctx, '1:3', 'Archive')

      expect(result).not.toBe(false)
      if (result !== false && result.uidMap) {
        expect(result.uidMap.get(1)).toBe(100)
        expect(result.uidMap.get(2)).toBe(101)
        expect(result.uidMap.get(3)).toBe(102)
      }
    })

    it('should handle comma-separated ranges in COPYUID', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })

      ctx.setMockExecResponse({
        response: createMockResponse({
          attributes: [
            {
              section: [
                createToken('COPYUID'),
                createToken('12345'),
                createToken('1,5,10'),
                createToken('100,105,110'),
              ],
              type: 'SECTION',
              value: '',
            },
          ] as never,
        }),
      })

      const result = await copy(ctx, '1,5,10', 'Archive')

      expect(result).not.toBe(false)
      if (result !== false && result.uidMap) {
        expect(result.uidMap.get(1)).toBe(100)
        expect(result.uidMap.get(5)).toBe(105)
        expect(result.uidMap.get(10)).toBe(110)
      }
    })

    it('should handle no COPYUID in response', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })

      ctx.setMockExecResponse({
        response: createMockResponse({
          attributes: [],
        }),
      })

      const result = await copy(ctx, '1:*', 'Archive')

      expect(result).not.toBe(false)
      if (result !== false) {
        expect(result.uidValidity).toBeUndefined()
        expect(result.uidMap).toBeUndefined()
      }
    })
  })

  describe('error handling', () => {
    it('should return false on error', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      ctx.exec = createThrowingExec('Server error')

      const result = await copy(ctx, '1:*', 'Archive')
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

      await copy(ctx, '1:*', 'Archive')
      expect(warnCalls.length).toBeGreaterThan(0)
    })
  })
})
