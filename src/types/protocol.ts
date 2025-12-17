import type { Tag } from './common'

export type TokenType = 'ATOM' | 'STRING' | 'LITERAL' | 'NUMBER' | 'SEQUENCE' | 'SECTION' | 'PARTIAL' | 'TEXT' | 'NIL'

export type Token = {
  readonly type: TokenType
  readonly value: string | Buffer | null
  readonly section?: readonly Token[]
  readonly partial?: readonly [number] | readonly [number, number]
}

export type ParsedResponse = {
  readonly tag: Tag | '*' | '+'
  readonly command: string
  readonly attributes?: readonly Token[]
  readonly humanReadable?: string
  readonly nullBytesRemoved?: number
}

export type CommandAttributeType = 'ATOM' | 'STRING' | 'LITERAL' | 'SEQUENCE' | 'NUMBER' | 'SECTION' | 'TEXT'

export type CommandAttribute =
  | { readonly type: 'ATOM'; readonly value: string; readonly sensitive?: boolean }
  | { readonly type: 'STRING'; readonly value: string }
  | { readonly type: 'LITERAL'; readonly value: Buffer; readonly isLiteral8?: boolean }
  | { readonly type: 'SEQUENCE'; readonly value: string }
  | { readonly type: 'NUMBER'; readonly value: number }
  | { readonly type: 'SECTION'; readonly value: string; readonly section?: readonly CommandAttribute[] }
  | { readonly type: 'TEXT'; readonly value: string }
  | readonly CommandAttribute[]

export type Command = {
  readonly tag: Tag
  readonly command: string
  readonly attributes?: readonly CommandAttribute[]
}

export type ResponseStatus = 'OK' | 'NO' | 'BAD' | 'BYE' | 'PREAUTH'

export type CompilerOptions = {
  readonly asArray?: boolean
  readonly literalPlus?: boolean
  readonly literalMinus?: boolean
  readonly isLogging?: boolean
}

export const IMAP_STATES = {
  AUTHENTICATED: 0x02,
  LOGOUT: 0x04,
  NOT_AUTHENTICATED: 0x01,
  SELECTED: 0x03,
} as const

export type IMAPState = (typeof IMAP_STATES)[keyof typeof IMAP_STATES]
