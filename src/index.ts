export type { IMAPClientEvents, IMAPClientOptions } from '@imap-sdk/shell/client/index'
export { createIMAPClient, IMAPClient } from '@imap-sdk/shell/client/index'
export type { Lock } from '@imap-sdk/shell/client/mailbox-lock'
export type {
  CommandContext,
  CommandContextState,
  CopyOptions,
  CopyResult,
  ExecOptions,
  ExecResponse,
  ExpungeOptions,
  ListOptions,
  MoveOptions,
  MoveResult,
  PlusTagHandler,
  SelectOptions,
  SpecialUseHints,
  StatusQueryOptions,
  StoreOptions,
  UntaggedHandler,
  UntaggedHandlers,
} from '@imap-sdk/shell/commands/types'
export type { Brand } from '@imap-sdk/types/brand'
export { brand } from '@imap-sdk/types/brand'
export type { FlagColor, Logger, SequenceRange } from '@imap-sdk/types/common'
export {
  ConnectionId,
  MailboxPath,
  ModSeq,
  SequenceNumber,
  Tag,
  UID,
  UIDValidity,
} from '@imap-sdk/types/common'
export type {
  AuthOptions,
  ConnectionEvent,
  ConnectionEventType,
  ConnectionInfo,
  ConnectionOptions,
  ConnectionState,
  IdInfo,
} from '@imap-sdk/types/connection'
export type { ConnectionErrorCode, IMAPError, IMAPSDKErrorOptions } from '@imap-sdk/types/errors'
export {
  AuthenticationError,
  ConnectionError,
  IMAPSDKError,
  IMAPSDKErrorCode,
  MissingExtensionError,
  ParserError,
  ProtocolError,
  ThrottleError,
  wrapError,
} from '@imap-sdk/types/errors'
export type {
  MailboxInfo,
  MailboxListEntry,
  NamespaceEntry,
  NamespaceInfo,
  QuotaInfo,
  QuotaResource,
  StatusInfo,
} from '@imap-sdk/types/mailbox'
export type {
  Address,
  AppendOptions,
  CopyResponse,
  FetchedMessage,
  FetchQuery,
  MessageEnvelope,
  MessageStructure,
  SearchOptions,
} from '@imap-sdk/types/message'
export type { CommandAttribute, ParsedResponse, Token, TokenType } from '@imap-sdk/types/protocol'
export type { ErrResult, OkResult, Result } from '@imap-sdk/types/result'
export {
  Err,
  flatMapResult,
  isErr,
  isOk,
  mapResult,
  Ok,
  tryAsync,
  trySync,
  unwrap,
  unwrapOr,
} from '@imap-sdk/types/result'
export type {
  SearchAllTerm,
  SearchDateTerm,
  SearchEmailIdTerm,
  SearchFlagTerm,
  SearchGmailRawTerm,
  SearchKeywordTerm,
  SearchModseqTerm,
  SearchNotTerm,
  SearchOrTerm,
  SearchQuery,
  SearchSeqTerm,
  SearchSizeTerm,
  SearchTerm,
  SearchTextTerm,
  SearchThreadIdTerm,
  SearchUidTerm,
  SearchWithinTerm,
} from '@imap-sdk/types/search'
