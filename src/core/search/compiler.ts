import { addDays } from 'date-fns'

import { formatIMAPDate, parseDate } from '@imap-sdk/core/encoding/date'

type SearchAttribute = {
  type: 'ATOM' | 'SEQUENCE'
  value: string
}

export type MailboxInfo = {
  flags?: Set<string>
  permanentFlags?: Set<string>
}

export type ConnectionCapabilities = {
  capabilities: Set<string>
  enabled: Set<string>
  mailbox?: MailboxInfo
}

export type SearchQuery = {
  all?: boolean
  answered?: boolean
  bcc?: string
  before?: Date | string
  body?: string
  cc?: string
  deleted?: boolean
  draft?: boolean
  emailId?: string
  flagged?: boolean
  from?: string
  gmRaw?: string
  gmailRaw?: string
  header?: Record<string, string | boolean>
  keyword?: string
  larger?: number
  modseq?: number
  new?: boolean
  not?: SearchQuery
  old?: boolean
  on?: Date | string
  or?: SearchQuery[]
  recent?: boolean
  seen?: boolean
  sentBefore?: Date | string
  sentOn?: Date | string
  sentSince?: Date | string
  seq?: string | number
  since?: Date | string
  smaller?: number
  subject?: string
  text?: string
  threadId?: string
  to?: string
  uid?: string | number | (string | number)[]
  unAnswered?: boolean
  unDeleted?: boolean
  unDraft?: boolean
  unFlagged?: boolean
  unKeyword?: string
  unSeen?: boolean
}

const RE_VALID_SEQUENCE = /^\S+$/
const RE_UN_PREFIX = /^un/i
const RE_FLAG_BACKSLASH = /^\\/

const isDate = (obj: unknown): obj is Date => obj instanceof Date

const formatFlag = (flag: string): string | false => {
  switch (flag.toLowerCase()) {
    case '\\recent': {
      return false
    }
    case '\\seen':
    case '\\answered':
    case '\\flagged':
    case '\\deleted':
    case '\\draft': {
      return flag.toLowerCase().replace(RE_FLAG_BACKSLASH, c => c.toUpperCase())
    }
    default: {
      return flag
    }
  }
}

const canUseFlag = (mailbox: MailboxInfo | undefined, flag: string): boolean =>
  !mailbox?.permanentFlags || mailbox.permanentFlags.has('\\*') || mailbox.permanentFlags.has(flag)

const isUnicodeString = (str: unknown): boolean => {
  if (!str || typeof str !== 'string') {
    return false
  }

  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) {
      return true
    }
  }

  return false
}

const setBoolOpt = (attributes: SearchAttribute[], term: string, value: boolean): void => {
  let finalTerm = term

  if (!value) {
    if (RE_UN_PREFIX.test(term)) {
      finalTerm = term.slice(2)
    } else {
      finalTerm = `UN${term}`
    }
  }

  attributes.push({ type: 'ATOM', value: finalTerm.toUpperCase() })
}

const setOpt = (
  attributes: SearchAttribute[],
  term: string,
  value: string | number | (string | number)[] | false | null,
  type: 'ATOM' | 'SEQUENCE' = 'ATOM',
): void => {
  if (value === false || value === null) {
    attributes.push({ type, value: 'NOT' })
  }

  attributes.push({ type, value: term.toUpperCase() })

  if (Array.isArray(value)) {
    for (const entry of value) {
      attributes.push({ type, value: (entry ?? '').toString() })
    }
  } else {
    attributes.push({ type, value: (value ?? '').toString() })
  }
}

const processDateField = (attributes: SearchAttribute[], term: string, value: unknown): void => {
  let date = parseDate(value)

  if (!date) {
    return
  }

  if (['BEFORE', 'SENTBEFORE'].includes(term.toUpperCase())) {
    const isoTime = date.toISOString().substring(11)
    if (isoTime !== '00:00:00.000Z') {
      date = addDays(date, 1)
    }
  }

  setOpt(attributes, term, formatIMAPDate(date))
}

type OrTree = SearchQuery | OrTree[]

const genOrTree = (list: SearchQuery[]): OrTree[] => {
  let group: SearchQuery[] | false = false
  let groups: OrTree[] = []

  for (let i = 0; i < list.length; i++) {
    const entry = list[i]
    if (i % 2 === 0) {
      group = [entry]
    } else if (group) {
      group.push(entry)
      groups.push(group)
      group = false
    }
  }

  if (group !== false && group.length) {
    let g: OrTree[] = group

    while (g.length === 1 && Array.isArray(g[0])) {
      g = g[0] as OrTree[]
    }

    groups.push(g)
  }

  while (groups.length > 2) {
    groups = genOrTree(groups as SearchQuery[])
  }

  while (groups.length === 1 && Array.isArray(groups[0])) {
    groups = groups[0] as OrTree[]
  }

  return groups
}

export const compileSearch = (connection: ConnectionCapabilities, query: SearchQuery): SearchAttribute[] => {
  const attributes: SearchAttribute[] = []
  let hasUnicode = false
  const mailbox = connection.mailbox

  const walkOrTree = (entry: OrTree, walkFn: (params: SearchQuery) => void): void => {
    if (Array.isArray(entry)) {
      if (entry.length > 1) {
        attributes.push({ type: 'ATOM', value: 'OR' })
      }

      for (const leaf of entry) {
        walkOrTree(leaf, walkFn)
      }

      return
    }

    if (entry && typeof entry === 'object') {
      walkFn(entry)
    }
  }

  const walk = (params: SearchQuery): void => {
    for (const [key, value] of Object.entries(params)) {
      const term = key.toUpperCase()

      switch (term) {
        case 'SEQ': {
          let seqValue = value as string | number
          if (typeof seqValue === 'number') {
            seqValue = seqValue.toString()
          }
          if (typeof seqValue === 'string' && RE_VALID_SEQUENCE.test(seqValue)) {
            attributes.push({ type: 'SEQUENCE', value: seqValue })
          }
          break
        }

        case 'ANSWERED':
        case 'DELETED':
        case 'DRAFT':
        case 'FLAGGED':
        case 'SEEN':
        case 'UNANSWERED':
        case 'UNDELETED':
        case 'UNDRAFT':
        case 'UNFLAGGED':
        case 'UNSEEN': {
          setBoolOpt(attributes, term, !!value)

          break
        }

        case 'ALL':
        case 'NEW':
        case 'OLD':
        case 'RECENT': {
          if (value) {
            setBoolOpt(attributes, term, true)
          }

          break
        }

        case 'LARGER':
        case 'SMALLER':
        case 'MODSEQ': {
          if (value) {
            setOpt(attributes, term, value as number)
          }

          break
        }

        case 'BCC':
        case 'BODY':
        case 'CC':
        case 'FROM':
        case 'SUBJECT':
        case 'TEXT':
        case 'TO': {
          if (isUnicodeString(value)) {
            hasUnicode = true
          }

          if (value) {
            setOpt(attributes, term, value as string)
          }

          break
        }

        case 'UID': {
          if (value) {
            setOpt(attributes, term, value as string | number | (string | number)[], 'SEQUENCE')
          }

          break
        }

        case 'EMAILID': {
          if (connection.capabilities.has('OBJECTID')) {
            setOpt(attributes, 'EMAILID', value as string)
          } else if (connection.capabilities.has('X-GM-EXT-1')) {
            setOpt(attributes, 'X-GM-MSGID', value as string)
          }

          break
        }

        case 'THREADID': {
          if (connection.capabilities.has('OBJECTID')) {
            setOpt(attributes, 'THREADID', value as string)
          } else if (connection.capabilities.has('X-GM-EXT-1')) {
            setOpt(attributes, 'X-GM-THRID', value as string)
          }

          break
        }

        case 'GMRAW':
        case 'GMAILRAW': {
          if (connection.capabilities.has('X-GM-EXT-1')) {
            if (isUnicodeString(value)) {
              hasUnicode = true
            }
            setOpt(attributes, 'X-GM-RAW', value as string)
          } else {
            const error = new Error('Server does not support X-GM-EXT-1 extension required for X-GM-RAW')
            ;(error as Error & { code: string }).code = 'MissingServerExtension'
            throw error
          }

          break
        }

        case 'BEFORE':
        case 'SINCE': {
          const dateVal = value as Date | string

          if (connection.capabilities.has('WITHIN') && isDate(dateVal)) {
            const now = Date.now()
            const withinSeconds = Math.round(Math.max(0, now - dateVal.getTime()) / 1000)
            const withinKeyword = term === 'BEFORE' ? 'OLDER' : 'YOUNGER'
            setOpt(attributes, withinKeyword, withinSeconds.toString())
            break
          }

          processDateField(attributes, term, dateVal)

          break
        }

        case 'ON':
        case 'SENTBEFORE':
        case 'SENTON':
        case 'SENTSINCE': {
          processDateField(attributes, term, value)
          break
        }

        case 'KEYWORD':
        case 'UNKEYWORD': {
          const flag = formatFlag(value as string)

          if (flag && (canUseFlag(mailbox, flag) || mailbox?.flags?.has(flag))) {
            setOpt(attributes, term, flag)
          }

          break
        }

        case 'HEADER': {
          const headerObj = value as Record<string, string | boolean> | undefined
          if (headerObj && typeof headerObj === 'object') {
            for (const [header, headerValue] of Object.entries(headerObj)) {
              let val: string

              if (headerValue === true) {
                val = ''
              } else if (typeof headerValue === 'string') {
                val = headerValue
              } else {
                continue
              }

              if (isUnicodeString(val)) {
                hasUnicode = true
              }

              setOpt(attributes, term, [header.toUpperCase().trim(), val])
            }
          }

          break
        }

        case 'NOT': {
          const notQuery = value as SearchQuery | undefined

          if (!notQuery) {
            break
          }

          if (typeof notQuery === 'object') {
            attributes.push({ type: 'ATOM', value: 'NOT' })
            walk(notQuery)
          }

          break
        }

        case 'OR': {
          const orArray = value as SearchQuery[] | undefined

          if (!(orArray && Array.isArray(orArray)) || orArray.length === 0) {
            break
          }

          if (orArray.length === 1) {
            if (typeof orArray[0] === 'object' && orArray[0]) {
              walk(orArray[0])
            }

            break
          }

          walkOrTree(genOrTree(orArray), walk)

          break
        }

        default:
          break
      }
    }
  }

  walk(query)

  if (hasUnicode && !connection.enabled.has('UTF8=ACCEPT')) {
    attributes.unshift({ type: 'ATOM', value: 'UTF-8' })
    attributes.unshift({ type: 'ATOM', value: 'CHARSET' })
  }

  return attributes
}
