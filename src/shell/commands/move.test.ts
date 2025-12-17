import type { MailboxPath } from '@imap-sdk/types/common'

import { move } from './move'
import {
  createMockContext,
  createMockLoggerWithWarn,
  createMockMailbox,
  createMockResponse,
  createThrowingExec,
  createToken,
} from './test-utils'

describe('move command', () => {
  describe('preconditions', () => {
    it('should return false if state is NOT_AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'NOT_AUTHENTICATED' })
      const result = await move(ctx, '1:*', 'Archive')
      expect(result).toBe(false)
    })

    it('should return false if state is AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await move(ctx, '1:*', 'Archive')
      expect(result).toBe(false)
    })

    it('should return false if state is LOGOUT', async () => {
      const ctx = createMockContext({ state: 'LOGOUT' })
      const result = await move(ctx, '1:*', 'Archive')
      expect(result).toBe(false)
    })

    it('should return false if range is empty', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      const result = await move(ctx, '', 'Archive')
      expect(result).toBe(false)
    })

    it('should return false if destination is empty', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      const result = await move(ctx, '1:*', '')
      expect(result).toBe(false)
    })

    it('should work in SELECTED state', async () => {
      const ctx = createMockContext({ mailbox: createMockMailbox(), state: 'SELECTED' })
      const result = await move(ctx, '1:*', 'Archive')
      expect(result).not.toBe(false)
    })
  })

  describe('command structure', () => {
    it('should send MOVE command with range and destination when MOVE capability exists', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'MOVE']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      await move(ctx, '1:10', 'Archive')

      expect(ctx.mockExecCalls).toHaveLength(1)
      expect(ctx.mockExecCalls[0].command).toBe('MOVE')
      expect(ctx.mockExecCalls[0].attributes[0]).toMatchObject({
        type: 'SEQUENCE',
        value: '1:10',
      })
      expect(ctx.mockExecCalls[0].attributes[1]).toMatchObject({
        type: 'ATOM',
        value: 'Archive',
      })
    })

    it('should send UID MOVE when uid option is true', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'MOVE']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      await move(ctx, '1:10', 'Archive', { uid: true })

      expect(ctx.mockExecCalls[0].command).toBe('UID MOVE')
    })

    it('should normalize destination path', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'MOVE']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      await move(ctx, '1:*', 'inbox')

      expect(ctx.mockExecCalls[0].attributes[1]).toMatchObject({
        value: 'INBOX',
      })
    })
  })

  describe('MOVE fallback without MOVE capability', () => {
    it('should use COPY + DELETE when MOVE capability is missing', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })

      ctx.setMockRunResponse({ destination: 'Archive' as MailboxPath, path: 'INBOX' as MailboxPath })

      await move(ctx, '1:10', 'Archive')

      expect(ctx.mockRunCalls).toHaveLength(2)
      expect(ctx.mockRunCalls[0].command).toBe('COPY')
      expect(ctx.mockRunCalls[0].args).toEqual(['1:10', 'Archive', {}])
      expect(ctx.mockRunCalls[1].command).toBe('DELETE')
    })

    it('should pass uid option to COPY and DELETE in fallback', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })

      ctx.setMockRunResponse({ destination: 'Archive' as MailboxPath, path: 'INBOX' as MailboxPath })

      await move(ctx, '1:10', 'Archive', { uid: true })

      expect(ctx.mockRunCalls[0].args[2]).toMatchObject({ uid: true })
      expect(ctx.mockRunCalls[1].args[1]).toMatchObject({ silent: true, uid: true })
    })
  })

  describe('result', () => {
    it('should return destination in result', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'MOVE']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      const result = await move(ctx, '1:*', 'Archive')

      expect(result).not.toBe(false)
      if (result !== false) {
        expect(result.destination).toBe('Archive')
      }
    })

    it('should return path from current mailbox', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'MOVE']),
        mailbox: createMockMailbox({ path: 'INBOX' as MailboxPath }),
        state: 'SELECTED',
      })
      const result = await move(ctx, '1:*', 'Archive')

      expect(result).not.toBe(false)
      if (result !== false) {
        expect(result.path).toBe('INBOX')
      }
    })
  })

  describe('COPYUID response parsing', () => {
    it('should parse COPYUID from tagged response', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'MOVE']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })

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

      const result = await move(ctx, '1:3', 'Archive')

      expect(result).not.toBe(false)
      if (result !== false) {
        expect(result.uidValidity).toBe(12345n)
      }
    })

    it('should parse COPYUID with uidMap', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'MOVE']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })

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

      const result = await move(ctx, '1:3', 'Archive')

      expect(result).not.toBe(false)
      if (result !== false && result.uidMap) {
        expect(result.uidMap.get(1)).toBe(100)
        expect(result.uidMap.get(2)).toBe(101)
        expect(result.uidMap.get(3)).toBe(102)
      }
    })

    it('should parse COPYUID from OK untagged response', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'MOVE']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })

      const execPromise = move(ctx, '1:3', 'Archive')

      await ctx.triggerUntagged(
        'OK',
        createMockResponse({
          attributes: [
            {
              section: [createToken('COPYUID'), createToken('99999'), createToken('1:3'), createToken('200:202')],
              type: 'SECTION',
              value: '',
            },
          ] as never,
        }),
      )

      const result = await execPromise

      expect(result).not.toBe(false)
      if (result !== false) {
        expect(result.uidValidity).toBe(99999n)
        if (result.uidMap) {
          expect(result.uidMap.get(1)).toBe(200)
        }
      }
    })
  })

  describe('error handling', () => {
    it('should return false on error', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'MOVE']),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      ctx.exec = createThrowingExec('Server error')

      const result = await move(ctx, '1:*', 'Archive')
      expect(result).toBe(false)
    })

    it('should log warning on error', async () => {
      const warnCalls: unknown[] = []
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'MOVE']),
        log: createMockLoggerWithWarn(warnCalls),
        mailbox: createMockMailbox(),
        state: 'SELECTED',
      })
      ctx.exec = createThrowingExec('Server error')

      await move(ctx, '1:*', 'Archive')
      expect(warnCalls.length).toBeGreaterThan(0)
    })
  })
})
