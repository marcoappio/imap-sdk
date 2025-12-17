import type { TlsOptions } from 'tls'

import type { ConnectionId, Logger } from './common'
import type { MailboxInfo } from './mailbox'

export type ConnectionState =
  | { readonly state: 'DISCONNECTED' }
  | { readonly state: 'CONNECTING'; readonly startedAt: number }
  | { readonly state: 'NOT_AUTHENTICATED'; readonly greeting: string }
  | { readonly state: 'AUTHENTICATED'; readonly user: string | true }
  | { readonly state: 'SELECTED'; readonly mailbox: MailboxInfo; readonly user: string | true }
  | { readonly state: 'LOGOUT' }

export type ConnectionEventType =
  | 'CONNECT_START'
  | 'GREETING_RECEIVED'
  | 'PREAUTH_RECEIVED'
  | 'AUTHENTICATED'
  | 'MAILBOX_SELECTED'
  | 'MAILBOX_CLOSED'
  | 'LOGOUT_INITIATED'
  | 'CONNECTION_CLOSED'
  | 'ERROR'

export type ConnectionEvent =
  | { readonly type: 'CONNECT_START' }
  | { readonly type: 'GREETING_RECEIVED'; readonly greeting: string }
  | { readonly type: 'PREAUTH_RECEIVED' }
  | { readonly type: 'AUTHENTICATED'; readonly user: string }
  | { readonly type: 'MAILBOX_SELECTED'; readonly mailbox: MailboxInfo }
  | { readonly type: 'MAILBOX_CLOSED' }
  | { readonly type: 'LOGOUT_INITIATED' }
  | { readonly type: 'CONNECTION_CLOSED' }
  | { readonly type: 'ERROR'; readonly error: Error }

export type AuthOptions = {
  readonly user: string
  readonly pass?: string
  readonly accessToken?: string
  readonly loginMethod?: string
  readonly authzid?: string
}

export type IdInfo = {
  readonly name?: string
  readonly version?: string
  readonly os?: string
  readonly vendor?: string
  readonly 'support-url'?: string
  readonly date?: Date
  [key: string]: string | Date | undefined
}

export type ConnectionOptions = {
  readonly host: string
  readonly port: number
  readonly secure?: boolean
  readonly doSTARTTLS?: boolean
  readonly servername?: string
  readonly auth?: AuthOptions
  readonly tls?: TlsOptions
  readonly proxy?: string
  readonly disableCompression?: boolean
  readonly disableAutoIdle?: boolean
  readonly disableBinary?: boolean
  readonly disableAutoEnable?: boolean
  readonly qresync?: boolean
  readonly maxIdleTime?: number
  readonly missingIdleCommand?: 'NOOP' | 'SELECT' | 'STATUS'
  readonly connectionTimeout?: number
  readonly greetingTimeout?: number
  readonly socketTimeout?: number
  readonly verifyOnly?: boolean
  readonly clientInfo?: IdInfo
  readonly logger?: Logger | false
  readonly logRaw?: boolean
  readonly emitLogs?: boolean
}

export type ConnectionInfo = {
  readonly id: ConnectionId
  readonly host: string
  readonly port: number
  readonly secure: boolean
  readonly greeting?: string
  readonly serverInfo?: IdInfo
  readonly capabilities: ReadonlySet<string>
  readonly enabled: ReadonlySet<string>
}
