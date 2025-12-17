import type { FlagColor, ModSeq, SequenceNumber, UID } from './common'

export type Address = {
  readonly name?: string
  readonly address?: string
}

export type MessageEnvelope = {
  readonly date?: Date
  readonly subject?: string
  readonly messageId?: string
  readonly inReplyTo?: string
  readonly from?: readonly Address[]
  readonly sender?: readonly Address[]
  readonly replyTo?: readonly Address[]
  readonly to?: readonly Address[]
  readonly cc?: readonly Address[]
  readonly bcc?: readonly Address[]
}

export type MessageStructure = {
  readonly part?: string
  readonly type: string
  readonly parameters?: Readonly<Record<string, string>>
  readonly id?: string
  readonly description?: string
  readonly encoding?: string
  readonly size?: number
  readonly envelope?: MessageEnvelope
  readonly disposition?: string
  readonly dispositionParameters?: Readonly<Record<string, string>>
  readonly md5?: string
  readonly language?: readonly string[]
  readonly location?: string
  readonly lineCount?: number
  readonly childNodes?: readonly MessageStructure[]
}

export type FetchedMessage = {
  readonly seq: SequenceNumber
  readonly uid: UID
  readonly id?: string
  readonly source?: Buffer
  readonly modseq?: ModSeq
  readonly emailId?: string
  readonly threadId?: string
  readonly labels?: ReadonlySet<string>
  readonly size?: number
  readonly flags?: ReadonlySet<string>
  readonly flagColor?: FlagColor
  readonly envelope?: MessageEnvelope
  readonly bodyStructure?: MessageStructure
  readonly internalDate?: Date
  readonly bodyParts?: ReadonlyMap<string, Buffer>
  readonly headers?: Buffer
}

export type FetchQuery = {
  readonly uid?: boolean
  readonly flags?: boolean
  readonly bodyStructure?: boolean
  readonly envelope?: boolean
  readonly internalDate?: boolean
  readonly size?: boolean
  readonly source?: boolean | { readonly start?: number; readonly maxLength?: number }
  readonly headers?: boolean | readonly string[]
  readonly bodyParts?: readonly string[]
  readonly labels?: boolean
  readonly threadId?: boolean
  readonly emailId?: boolean
  readonly modseq?: boolean
}

export type AppendOptions = {
  readonly flags?: readonly string[]
  readonly date?: Date
}

export type CopyResponse = {
  readonly path: string
  readonly uidValidity: bigint
  readonly uidMap: ReadonlyMap<number, number>
}

export type SearchOptions = {
  readonly uid?: boolean
}
