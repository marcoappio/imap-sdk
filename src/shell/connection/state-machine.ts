import { type ActorRefFrom, assign, createActor, type SnapshotFrom, setup } from 'xstate'

import type { MailboxInfo } from '@imap-sdk/types/mailbox'

export type ConnectionContext = {
  readonly greeting: string
  readonly user: string
  readonly mailbox: MailboxInfo | null
  readonly error: Error | null
  readonly startedAt: number
}

export type ConnectionEvents =
  | { readonly type: 'CONNECT_START' }
  | { readonly type: 'GREETING_RECEIVED'; readonly greeting: string }
  | { readonly type: 'PREAUTH_RECEIVED'; readonly user: string }
  | { readonly type: 'AUTHENTICATED'; readonly user: string }
  | { readonly type: 'MAILBOX_SELECTED'; readonly mailbox: MailboxInfo }
  | { readonly type: 'MAILBOX_CLOSED' }
  | { readonly type: 'LOGOUT_INITIATED' }
  | { readonly type: 'CONNECTION_CLOSED' }
  | { readonly type: 'ERROR'; readonly error: Error }

export type ConnectionStateValue =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'NOT_AUTHENTICATED'
  | 'AUTHENTICATED'
  | 'SELECTED'
  | 'LOGOUT'

const initialContext: ConnectionContext = {
  error: null,
  greeting: '',
  mailbox: null,
  startedAt: 0,
  user: '',
}

export const connectionMachine = setup({
  actions: {
    clearContext: assign(() => initialContext),
    clearMailbox: assign({ mailbox: null }),
    recordStartTime: assign({ startedAt: () => Date.now() }),
    setError: assign({ error: (_, params: { error: Error }) => params.error }),
    setGreeting: assign({ greeting: (_, params: { greeting: string }) => params.greeting }),
    setMailbox: assign({ mailbox: (_, params: { mailbox: MailboxInfo }) => params.mailbox }),
    setUser: assign({ user: (_, params: { user: string }) => params.user }),
  },
  guards: {
    hasMailbox: ({ context }) => context.mailbox !== null,
    hasUser: ({ context }) => context.user !== '',
    isAuthenticated: ({ context }) => context.user !== '',
  },
  types: {
    context: {} as ConnectionContext,
    events: {} as ConnectionEvents,
  },
}).createMachine({
  context: initialContext,
  id: 'imapConnection',
  initial: 'DISCONNECTED',
  states: {
    AUTHENTICATED: {
      on: {
        CONNECTION_CLOSED: {
          actions: { params: {}, type: 'clearContext' },
          target: 'DISCONNECTED',
        },
        ERROR: {
          actions: { params: ({ event }) => ({ error: event.error }), type: 'setError' },
          target: 'DISCONNECTED',
        },
        LOGOUT_INITIATED: {
          target: 'LOGOUT',
        },
        MAILBOX_SELECTED: {
          actions: { params: ({ event }) => ({ mailbox: event.mailbox }), type: 'setMailbox' },
          target: 'SELECTED',
        },
      },
    },
    CONNECTING: {
      on: {
        CONNECTION_CLOSED: {
          actions: { params: {}, type: 'clearContext' },
          target: 'DISCONNECTED',
        },
        ERROR: {
          actions: { params: ({ event }) => ({ error: event.error }), type: 'setError' },
          target: 'DISCONNECTED',
        },
        GREETING_RECEIVED: {
          actions: { params: ({ event }) => ({ greeting: event.greeting }), type: 'setGreeting' },
          target: 'NOT_AUTHENTICATED',
        },
        PREAUTH_RECEIVED: {
          actions: [
            { params: () => ({ greeting: '' }), type: 'setGreeting' },
            { params: ({ event }) => ({ user: event.user }), type: 'setUser' },
          ],
          target: 'AUTHENTICATED',
        },
      },
    },
    DISCONNECTED: {
      on: {
        CONNECT_START: {
          actions: { params: {}, type: 'recordStartTime' },
          target: 'CONNECTING',
        },
      },
    },
    LOGOUT: {
      on: {
        CONNECTION_CLOSED: {
          actions: { params: {}, type: 'clearContext' },
          target: 'DISCONNECTED',
        },
      },
    },
    NOT_AUTHENTICATED: {
      on: {
        AUTHENTICATED: {
          actions: { params: ({ event }) => ({ user: event.user }), type: 'setUser' },
          target: 'AUTHENTICATED',
        },
        CONNECTION_CLOSED: {
          actions: { params: {}, type: 'clearContext' },
          target: 'DISCONNECTED',
        },
        ERROR: {
          actions: { params: ({ event }) => ({ error: event.error }), type: 'setError' },
          target: 'DISCONNECTED',
        },
        LOGOUT_INITIATED: {
          target: 'LOGOUT',
        },
      },
    },
    SELECTED: {
      on: {
        CONNECTION_CLOSED: {
          actions: { params: {}, type: 'clearContext' },
          target: 'DISCONNECTED',
        },
        ERROR: {
          actions: { params: ({ event }) => ({ error: event.error }), type: 'setError' },
          target: 'DISCONNECTED',
        },
        LOGOUT_INITIATED: {
          target: 'LOGOUT',
        },
        MAILBOX_CLOSED: {
          actions: { params: {}, type: 'clearMailbox' },
          target: 'AUTHENTICATED',
        },
        MAILBOX_SELECTED: {
          actions: { params: ({ event }) => ({ mailbox: event.mailbox }), type: 'setMailbox' },
          target: 'SELECTED',
        },
      },
    },
  },
})

export type ConnectionMachine = typeof connectionMachine
export type ConnectionActor = ActorRefFrom<ConnectionMachine>
export type ConnectionSnapshot = SnapshotFrom<ConnectionMachine>

export const createConnectionActor = (id?: string): ConnectionActor => createActor(connectionMachine, { id })

export const getStateValue = (snapshot: ConnectionSnapshot): ConnectionStateValue =>
  snapshot.value as ConnectionStateValue

export const isDisconnected = (snapshot: ConnectionSnapshot): boolean => snapshot.value === 'DISCONNECTED'
export const isConnecting = (snapshot: ConnectionSnapshot): boolean => snapshot.value === 'CONNECTING'
export const isNotAuthenticated = (snapshot: ConnectionSnapshot): boolean => snapshot.value === 'NOT_AUTHENTICATED'
export const isAuthenticated = (snapshot: ConnectionSnapshot): boolean =>
  snapshot.value === 'AUTHENTICATED' || snapshot.value === 'SELECTED'
export const isSelected = (snapshot: ConnectionSnapshot): boolean => snapshot.value === 'SELECTED'
export const isLogout = (snapshot: ConnectionSnapshot): boolean => snapshot.value === 'LOGOUT'
export const isConnected = (snapshot: ConnectionSnapshot): boolean =>
  snapshot.value !== 'DISCONNECTED' && snapshot.value !== 'LOGOUT'
