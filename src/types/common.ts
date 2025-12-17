import type { Brand } from './brand'
import { brand } from './brand'

export type UID = Brand<number, 'UID'>
export type SequenceNumber = Brand<number, 'SequenceNumber'>
export type ModSeq = Brand<bigint, 'ModSeq'>
export type UIDValidity = Brand<bigint, 'UIDValidity'>
export type MailboxPath = Brand<string, 'MailboxPath'>
export type Tag = Brand<string, 'Tag'>
export type ConnectionId = Brand<string, 'ConnectionId'>

export const UID = (n: number): UID => brand<number, 'UID'>(n)
export const SequenceNumber = (n: number): SequenceNumber => brand<number, 'SequenceNumber'>(n)
export const ModSeq = (n: bigint): ModSeq => brand<bigint, 'ModSeq'>(n)
export const UIDValidity = (n: bigint): UIDValidity => brand<bigint, 'UIDValidity'>(n)
export const MailboxPath = (s: string): MailboxPath => brand<string, 'MailboxPath'>(s)
export const Tag = (s: string): Tag => brand<string, 'Tag'>(s)
export const ConnectionId = (s: string): ConnectionId => brand<string, 'ConnectionId'>(s)

export type SequenceRange = UID | SequenceNumber | `${number}:${number}` | `${number}:*` | '*'

export type FlagColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'grey'

export type Logger = {
  trace: (obj: object, msg?: string) => void
  debug: (obj: object, msg?: string) => void
  info: (obj: object, msg?: string) => void
  warn: (obj: object, msg?: string) => void
  error: (obj: object, msg?: string) => void
  child: (bindings: object) => Logger
}
