import type { Logger, MailboxPath, ModSeq, Tag, UIDValidity } from '@imap-sdk/types/common'
import type { AuthOptions, IdInfo } from '@imap-sdk/types/connection'
import type { MailboxInfo, MailboxListEntry, NamespaceEntry, QuotaInfo, StatusInfo } from '@imap-sdk/types/mailbox'
import type { CommandAttribute, ParsedResponse } from '@imap-sdk/types/protocol'

export type UntaggedHandler = (response: ParsedResponse) => Promise<void> | void

export type UntaggedHandlers = {
  readonly [key: string]: UntaggedHandler
}

export type PlusTagHandler = (response: ParsedResponse) => Promise<void> | void

export type ExecOptions = {
  readonly untagged?: UntaggedHandlers
  readonly onPlusTag?: PlusTagHandler
  readonly comment?: string
}

export type ExecResponse = {
  readonly tag: Tag
  readonly response: ParsedResponse
  readonly next: () => void
}

export type CommandContext = {
  readonly id: string
  readonly log: Logger

  readonly capabilities: ReadonlySet<string>
  readonly enabled: ReadonlySet<string>
  readonly authCapabilities: ReadonlyMap<string, boolean>
  readonly servername: string

  readonly state: CommandContextState

  readonly mailbox: MailboxInfo | null
  readonly folders: ReadonlyMap<MailboxPath, MailboxListEntry>

  setCapabilities: (capabilities: Set<string>) => void
  addEnabled: (extension: string) => void
  setAuthCapability: (method: string, success: boolean) => void

  setExpectCapabilityUpdate: (expect: boolean) => void
  readonly expectCapabilityUpdate: boolean

  exec: (command: string, attributes?: readonly CommandAttribute[], options?: ExecOptions) => Promise<ExecResponse>
  write: (data: string | Buffer) => void
  run: <T>(command: string, ...args: unknown[]) => Promise<T>

  setMailbox: (mailbox: MailboxInfo | null) => void
  setFolder: (path: MailboxPath, folder: MailboxListEntry) => void

  emitMailboxOpen: (mailbox: MailboxInfo) => void
  emitMailboxClose: (mailbox: MailboxInfo) => void
  emitExists: (info: { path: MailboxPath; count: number; prevCount: number }) => void
  emitExpunge: (info: { path: MailboxPath; seq: number; vanished: boolean }) => void
  emitFlags: (info: { path: MailboxPath; seq: number; uid?: number; flags: Set<string>; modseq?: ModSeq }) => void
}

export type CommandContextState = 'NOT_AUTHENTICATED' | 'AUTHENTICATED' | 'SELECTED' | 'LOGOUT'

export type CapabilityResult = ReadonlySet<string> | false

export type AuthenticateOptions = AuthOptions

export type AuthenticateResult = string

export type LoginResult = string

export type SelectOptions = {
  readonly readOnly?: boolean
  readonly changedSince?: ModSeq
  readonly uidValidity?: UIDValidity
}

export type SelectResult = MailboxInfo

export type SpecialUseHints = {
  readonly sent?: string
  readonly junk?: string
  readonly trash?: string
  readonly drafts?: string
  readonly archive?: string
}

export type ListOptions = {
  readonly statusQuery?: StatusQueryOptions
  readonly specialUseHints?: SpecialUseHints
  readonly listOnly?: boolean
}

export type StatusQueryOptions = {
  readonly messages?: boolean
  readonly recent?: boolean
  readonly uidNext?: boolean
  readonly uidValidity?: boolean
  readonly unseen?: boolean
  readonly highestModseq?: boolean
}

export type ListResult = readonly MailboxListEntry[]

export type StatusResult = StatusInfo

export type CreateResult = {
  readonly path: MailboxPath
  readonly mailboxId?: string
  readonly created: boolean
}

export type DeleteResult = {
  readonly path: MailboxPath
}

export type RenameResult = {
  readonly path: MailboxPath
  readonly newPath: MailboxPath
}

export type SubscribeResult = boolean

export type ExpungeResult = boolean

export type NoopResult = boolean

export type LogoutResult = boolean

export type IdResult = IdInfo | null

export type NamespaceResult = NamespaceEntry

export type QuotaResult = QuotaInfo | null

export type EnableResult = ReadonlySet<string>

export type CompressResult = boolean

export type StartTlsResult = boolean

export type CloseResult = boolean

export type CopyOptions = {
  readonly uid?: boolean
}

export type CopyResult =
  | {
      readonly path: MailboxPath
      readonly destination: MailboxPath
      readonly uidValidity?: UIDValidity
      readonly uidMap?: ReadonlyMap<number, number>
    }
  | false

export type MoveOptions = {
  readonly uid?: boolean
}

export type MoveResult = CopyResult

export type SearchOptions = {
  readonly uid?: boolean
}

export type SearchResult = readonly number[] | false

export type StoreOptions = {
  readonly uid?: boolean
  readonly silent?: boolean
  readonly useLabels?: boolean
  readonly operation?: 'add' | 'remove' | 'set'
  readonly unchangedSince?: ModSeq
}

export type StoreResult = boolean

export type ExpungeOptions = {
  readonly uid?: boolean
}
