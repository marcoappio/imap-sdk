import { MailboxPath, UIDValidity } from '@imap-sdk/types/common'
import type { MailboxInfo } from '@imap-sdk/types/mailbox'

import {
  createConnectionActor,
  getStateValue,
  isAuthenticated,
  isConnected,
  isConnecting,
  isDisconnected,
  isLogout,
  isNotAuthenticated,
  isSelected,
} from './state-machine'

const createTestMailbox = (): MailboxInfo => ({
  delimiter: '/',
  exists: 100,
  flags: new Set(['\\Seen', '\\Answered', '\\Flagged', '\\Deleted', '\\Draft']),
  path: MailboxPath('INBOX'),
  uidNext: 1234,
  uidValidity: UIDValidity(12345n),
})

describe('connectionMachine', () => {
  describe('initial state', () => {
    it('should start in DISCONNECTED state', () => {
      const actor = createConnectionActor()
      actor.start()
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('DISCONNECTED')
      expect(snapshot.context.greeting).toBe('')
      expect(snapshot.context.user).toBe('')
      expect(snapshot.context.mailbox).toBeNull()
      expect(snapshot.context.error).toBeNull()
      expect(snapshot.context.startedAt).toBe(0)

      actor.stop()
    })
  })

  describe('DISCONNECTED -> CONNECTING transition', () => {
    it('should transition to CONNECTING on CONNECT_START', () => {
      const actor = createConnectionActor()
      actor.start()

      actor.send({ type: 'CONNECT_START' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('CONNECTING')
      expect(snapshot.context.startedAt).toBeGreaterThan(0)

      actor.stop()
    })
  })

  describe('CONNECTING -> NOT_AUTHENTICATED transition', () => {
    it('should transition to NOT_AUTHENTICATED on GREETING_RECEIVED', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })

      actor.send({ greeting: '* OK IMAP4rev1 Server Ready', type: 'GREETING_RECEIVED' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('NOT_AUTHENTICATED')
      expect(snapshot.context.greeting).toBe('* OK IMAP4rev1 Server Ready')

      actor.stop()
    })

    it('should transition to AUTHENTICATED on PREAUTH_RECEIVED', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })

      actor.send({ type: 'PREAUTH_RECEIVED', user: 'admin' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('AUTHENTICATED')
      expect(snapshot.context.user).toBe('admin')
      expect(snapshot.context.greeting).toBe('')

      actor.stop()
    })

    it('should transition to DISCONNECTED on ERROR', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })

      const error = new Error('Connection timeout')
      actor.send({ error, type: 'ERROR' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('DISCONNECTED')
      expect(snapshot.context.error).toBe(error)

      actor.stop()
    })

    it('should transition to DISCONNECTED on CONNECTION_CLOSED', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })

      actor.send({ type: 'CONNECTION_CLOSED' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('DISCONNECTED')
      expect(snapshot.context.startedAt).toBe(0)

      actor.stop()
    })
  })

  describe('NOT_AUTHENTICATED -> AUTHENTICATED transition', () => {
    it('should transition to AUTHENTICATED on AUTHENTICATED', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK Ready', type: 'GREETING_RECEIVED' })

      actor.send({ type: 'AUTHENTICATED', user: 'user@example.com' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('AUTHENTICATED')
      expect(snapshot.context.user).toBe('user@example.com')

      actor.stop()
    })

    it('should transition to LOGOUT on LOGOUT_INITIATED', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK Ready', type: 'GREETING_RECEIVED' })

      actor.send({ type: 'LOGOUT_INITIATED' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('LOGOUT')

      actor.stop()
    })
  })

  describe('AUTHENTICATED -> SELECTED transition', () => {
    it('should transition to SELECTED on MAILBOX_SELECTED', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK Ready', type: 'GREETING_RECEIVED' })
      actor.send({ type: 'AUTHENTICATED', user: 'user@example.com' })

      const mailbox = createTestMailbox()
      actor.send({ mailbox, type: 'MAILBOX_SELECTED' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('SELECTED')
      expect(snapshot.context.mailbox).toBe(mailbox)

      actor.stop()
    })

    it('should transition to LOGOUT on LOGOUT_INITIATED', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK Ready', type: 'GREETING_RECEIVED' })
      actor.send({ type: 'AUTHENTICATED', user: 'user@example.com' })

      actor.send({ type: 'LOGOUT_INITIATED' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('LOGOUT')

      actor.stop()
    })
  })

  describe('SELECTED -> AUTHENTICATED transition', () => {
    it('should transition to AUTHENTICATED on MAILBOX_CLOSED', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK Ready', type: 'GREETING_RECEIVED' })
      actor.send({ type: 'AUTHENTICATED', user: 'user@example.com' })
      actor.send({ mailbox: createTestMailbox(), type: 'MAILBOX_SELECTED' })

      actor.send({ type: 'MAILBOX_CLOSED' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('AUTHENTICATED')
      expect(snapshot.context.mailbox).toBeNull()
      expect(snapshot.context.user).toBe('user@example.com')

      actor.stop()
    })

    it('should allow selecting a different mailbox', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK Ready', type: 'GREETING_RECEIVED' })
      actor.send({ type: 'AUTHENTICATED', user: 'user@example.com' })
      actor.send({ mailbox: createTestMailbox(), type: 'MAILBOX_SELECTED' })

      const newMailbox: MailboxInfo = {
        delimiter: '/',
        exists: 50,
        flags: new Set(),
        path: MailboxPath('Sent'),
        uidNext: 100,
        uidValidity: UIDValidity(99999n),
      }
      actor.send({ mailbox: newMailbox, type: 'MAILBOX_SELECTED' })
      const snapshot = actor.getSnapshot()

      expect(snapshot.value).toBe('SELECTED')
      expect(snapshot.context.mailbox).toBe(newMailbox)

      actor.stop()
    })
  })

  describe('LOGOUT state', () => {
    it('should be a final state but transition to DISCONNECTED on CONNECTION_CLOSED', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK Ready', type: 'GREETING_RECEIVED' })
      actor.send({ type: 'AUTHENTICATED', user: 'user@example.com' })
      actor.send({ type: 'LOGOUT_INITIATED' })

      let snapshot = actor.getSnapshot()
      expect(snapshot.value).toBe('LOGOUT')

      actor.send({ type: 'CONNECTION_CLOSED' })
      snapshot = actor.getSnapshot()
      expect(snapshot.value).toBe('DISCONNECTED')

      actor.stop()
    })
  })

  describe('ERROR handling', () => {
    it('should transition to DISCONNECTED from any connected state on ERROR', () => {
      const states = [
        ['CONNECTING', ['CONNECT_START']],
        ['NOT_AUTHENTICATED', ['CONNECT_START', { greeting: '* OK', type: 'GREETING_RECEIVED' }]],
        [
          'AUTHENTICATED',
          ['CONNECT_START', { greeting: '* OK', type: 'GREETING_RECEIVED' }, { type: 'AUTHENTICATED', user: 'user' }],
        ],
        [
          'SELECTED',
          [
            'CONNECT_START',
            { greeting: '* OK', type: 'GREETING_RECEIVED' },
            { type: 'AUTHENTICATED', user: 'user' },
            { mailbox: createTestMailbox(), type: 'MAILBOX_SELECTED' },
          ],
        ],
      ] as const

      for (const [expectedState, events] of states) {
        const actor = createConnectionActor()
        actor.start()

        for (const event of events) {
          if (typeof event === 'string') {
            actor.send({ type: event as 'CONNECT_START' })
          } else {
            actor.send(event)
          }
        }

        expect(actor.getSnapshot().value).toBe(expectedState)

        const error = new Error('Test error')
        actor.send({ error, type: 'ERROR' })

        expect(actor.getSnapshot().value).toBe('DISCONNECTED')
        expect(actor.getSnapshot().context.error).toBe(error)

        actor.stop()
      }
    })
  })

  describe('helper functions', () => {
    it('getStateValue should return the current state', () => {
      const actor = createConnectionActor()
      actor.start()

      expect(getStateValue(actor.getSnapshot())).toBe('DISCONNECTED')

      actor.send({ type: 'CONNECT_START' })
      expect(getStateValue(actor.getSnapshot())).toBe('CONNECTING')

      actor.stop()
    })

    it('isDisconnected should return true only for DISCONNECTED state', () => {
      const actor = createConnectionActor()
      actor.start()

      expect(isDisconnected(actor.getSnapshot())).toBe(true)

      actor.send({ type: 'CONNECT_START' })
      expect(isDisconnected(actor.getSnapshot())).toBe(false)

      actor.stop()
    })

    it('isConnecting should return true only for CONNECTING state', () => {
      const actor = createConnectionActor()
      actor.start()

      expect(isConnecting(actor.getSnapshot())).toBe(false)

      actor.send({ type: 'CONNECT_START' })
      expect(isConnecting(actor.getSnapshot())).toBe(true)

      actor.stop()
    })

    it('isNotAuthenticated should return true only for NOT_AUTHENTICATED state', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })

      expect(isNotAuthenticated(actor.getSnapshot())).toBe(false)

      actor.send({ greeting: '* OK', type: 'GREETING_RECEIVED' })
      expect(isNotAuthenticated(actor.getSnapshot())).toBe(true)

      actor.stop()
    })

    it('isAuthenticated should return true for AUTHENTICATED and SELECTED states', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK', type: 'GREETING_RECEIVED' })

      expect(isAuthenticated(actor.getSnapshot())).toBe(false)

      actor.send({ type: 'AUTHENTICATED', user: 'user' })
      expect(isAuthenticated(actor.getSnapshot())).toBe(true)

      actor.send({ mailbox: createTestMailbox(), type: 'MAILBOX_SELECTED' })
      expect(isAuthenticated(actor.getSnapshot())).toBe(true)

      actor.stop()
    })

    it('isSelected should return true only for SELECTED state', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK', type: 'GREETING_RECEIVED' })
      actor.send({ type: 'AUTHENTICATED', user: 'user' })

      expect(isSelected(actor.getSnapshot())).toBe(false)

      actor.send({ mailbox: createTestMailbox(), type: 'MAILBOX_SELECTED' })
      expect(isSelected(actor.getSnapshot())).toBe(true)

      actor.stop()
    })

    it('isLogout should return true only for LOGOUT state', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK', type: 'GREETING_RECEIVED' })

      expect(isLogout(actor.getSnapshot())).toBe(false)

      actor.send({ type: 'LOGOUT_INITIATED' })
      expect(isLogout(actor.getSnapshot())).toBe(true)

      actor.stop()
    })

    it('isConnected should return true for all states except DISCONNECTED and LOGOUT', () => {
      const actor = createConnectionActor()
      actor.start()

      expect(isConnected(actor.getSnapshot())).toBe(false)

      actor.send({ type: 'CONNECT_START' })
      expect(isConnected(actor.getSnapshot())).toBe(true)

      actor.send({ greeting: '* OK', type: 'GREETING_RECEIVED' })
      expect(isConnected(actor.getSnapshot())).toBe(true)

      actor.send({ type: 'AUTHENTICATED', user: 'user' })
      expect(isConnected(actor.getSnapshot())).toBe(true)

      actor.send({ mailbox: createTestMailbox(), type: 'MAILBOX_SELECTED' })
      expect(isConnected(actor.getSnapshot())).toBe(true)

      actor.send({ type: 'LOGOUT_INITIATED' })
      expect(isConnected(actor.getSnapshot())).toBe(false)

      actor.stop()
    })
  })

  describe('context preservation', () => {
    it('should preserve user and greeting when selecting mailbox', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK IMAP Ready', type: 'GREETING_RECEIVED' })
      actor.send({ type: 'AUTHENTICATED', user: 'test@example.com' })
      actor.send({ mailbox: createTestMailbox(), type: 'MAILBOX_SELECTED' })

      const snapshot = actor.getSnapshot()
      expect(snapshot.context.greeting).toBe('* OK IMAP Ready')
      expect(snapshot.context.user).toBe('test@example.com')
      expect(snapshot.context.mailbox).not.toBeNull()

      actor.stop()
    })

    it('should preserve user and greeting when closing mailbox', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })
      actor.send({ greeting: '* OK IMAP Ready', type: 'GREETING_RECEIVED' })
      actor.send({ type: 'AUTHENTICATED', user: 'test@example.com' })
      actor.send({ mailbox: createTestMailbox(), type: 'MAILBOX_SELECTED' })
      actor.send({ type: 'MAILBOX_CLOSED' })

      const snapshot = actor.getSnapshot()
      expect(snapshot.context.greeting).toBe('* OK IMAP Ready')
      expect(snapshot.context.user).toBe('test@example.com')
      expect(snapshot.context.mailbox).toBeNull()

      actor.stop()
    })
  })

  describe('invalid transitions', () => {
    it('should ignore invalid events in DISCONNECTED state', () => {
      const actor = createConnectionActor()
      actor.start()

      actor.send({ greeting: '* OK', type: 'GREETING_RECEIVED' })
      expect(actor.getSnapshot().value).toBe('DISCONNECTED')

      actor.send({ type: 'AUTHENTICATED', user: 'user' })
      expect(actor.getSnapshot().value).toBe('DISCONNECTED')

      actor.send({ mailbox: createTestMailbox(), type: 'MAILBOX_SELECTED' })
      expect(actor.getSnapshot().value).toBe('DISCONNECTED')

      actor.stop()
    })

    it('should ignore AUTHENTICATED in CONNECTING state', () => {
      const actor = createConnectionActor()
      actor.start()
      actor.send({ type: 'CONNECT_START' })

      actor.send({ type: 'AUTHENTICATED', user: 'user' })
      expect(actor.getSnapshot().value).toBe('CONNECTING')

      actor.stop()
    })
  })
})
