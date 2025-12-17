import type { MailboxPath, ModSeq, UIDValidity } from './common'

export type MailboxInfo = {
  readonly path: MailboxPath
  readonly delimiter: string
  readonly flags: ReadonlySet<string>
  readonly permanentFlags?: ReadonlySet<string>
  readonly specialUse?: string
  readonly listed?: boolean
  readonly subscribed?: boolean
  readonly mailboxId?: string
  readonly highestModseq?: ModSeq
  readonly noModseq?: boolean
  readonly uidValidity: UIDValidity
  readonly uidNext: number
  readonly exists: number
  readonly readOnly?: boolean
}

export type MailboxListEntry = {
  readonly path: MailboxPath
  readonly pathAsListed: string
  readonly name: string
  readonly delimiter: string
  readonly parent: readonly string[]
  readonly parentPath: string
  readonly flags: ReadonlySet<string>
  readonly specialUse?: string
  readonly listed: boolean
  readonly subscribed: boolean
  readonly status?: StatusInfo
}

export type StatusInfo = {
  readonly path: MailboxPath
  readonly messages?: number
  readonly recent?: number
  readonly uidNext?: number
  readonly uidValidity?: UIDValidity
  readonly unseen?: number
  readonly highestModseq?: ModSeq
}

export type QuotaResource = {
  usage?: number
  limit?: number
  status?: string
}

export type QuotaInfo = {
  readonly path: MailboxPath
  quotaRoot?: string
  storage?: QuotaResource
  messages?: QuotaResource
}

export type NamespaceInfo = {
  personal: NamespaceEntry[]
  other: NamespaceEntry[] | false
  shared: NamespaceEntry[] | false
}

export type NamespaceEntry = {
  prefix: string
  delimiter: string
}
