export type SearchDateTerm =
  | { readonly before: Date }
  | { readonly since: Date }
  | { readonly on: Date }
  | { readonly sentBefore: Date }
  | { readonly sentSince: Date }
  | { readonly sentOn: Date }

export type SearchSizeTerm = { readonly larger: number } | { readonly smaller: number }

export type SearchFlagTerm =
  | { readonly seen: boolean }
  | { readonly answered: boolean }
  | { readonly flagged: boolean }
  | { readonly deleted: boolean }
  | { readonly draft: boolean }

export type SearchTextTerm =
  | { readonly from: string }
  | { readonly to: string }
  | { readonly cc: string }
  | { readonly bcc: string }
  | { readonly subject: string }
  | { readonly body: string }
  | { readonly text: string }
  | { readonly header: { readonly field: string; readonly value: string } }

export type SearchKeywordTerm = { readonly keyword: string } | { readonly unkeyword: string }

export type SearchUidTerm = { readonly uid: string }
export type SearchSeqTerm = { readonly seq: string }
export type SearchModseqTerm = { readonly modseq: bigint }
export type SearchEmailIdTerm = { readonly emailId: string }
export type SearchThreadIdTerm = { readonly threadId: string }
export type SearchGmailRawTerm = { readonly gmailRaw: string }

export type SearchWithinTerm = { readonly younger: number } | { readonly older: number }

export type SearchOrTerm = {
  readonly or: readonly [SearchQuery, SearchQuery]
}
export type SearchNotTerm = { readonly not: SearchQuery }
export type SearchAllTerm = { readonly all: true }

export type SearchTerm =
  | SearchDateTerm
  | SearchSizeTerm
  | SearchFlagTerm
  | SearchTextTerm
  | SearchKeywordTerm
  | SearchUidTerm
  | SearchSeqTerm
  | SearchModseqTerm
  | SearchEmailIdTerm
  | SearchThreadIdTerm
  | SearchGmailRawTerm
  | SearchWithinTerm
  | SearchOrTerm
  | SearchNotTerm
  | SearchAllTerm

export type SearchQuery = SearchTerm | readonly SearchTerm[]
