import libmime from 'libmime'

import type { TokenAttribute } from '@imap-sdk/core/protocol/tokenizer'

export type EmailAddress = {
  address: string
  name: string
}

export type Envelope = {
  bcc?: EmailAddress[]
  cc?: EmailAddress[]
  date?: Date | string
  from?: EmailAddress[]
  inReplyTo?: string
  messageId?: string
  replyTo?: EmailAddress[]
  sender?: EmailAddress[]
  subject?: string
  to?: EmailAddress[]
}

type EnvelopeEntry = TokenAttribute | EnvelopeEntry[] | null
type AddressEntry = EnvelopeEntry[]

const processName = (name: string | null | undefined): string => {
  if (!name) {
    return ''
  }

  return name.replace(/\s+/g, ' ').trim()
}

const getStrValue = (obj: EnvelopeEntry): string | false => {
  if (!obj || Array.isArray(obj)) {
    return false
  }

  if (typeof obj.value === 'string') {
    return obj.value
  }

  if (Buffer.isBuffer(obj.value)) {
    return obj.value.toString()
  }

  return false
}

const processAddresses = (list: EnvelopeEntry): EmailAddress[] => {
  if (!(list && Array.isArray(list))) {
    return []
  }

  return list
    .filter((x): x is AddressEntry => Array.isArray(x))
    .map(x => {
      const localPart = getStrValue(x[2] as EnvelopeEntry) || ''
      const domain = getStrValue(x[3] as EnvelopeEntry) || ''

      let address = `${localPart}@${domain}`

      if (address === '@') {
        address = ''
      }

      const rawName = getStrValue(x[0] as EnvelopeEntry)
      const name = processName(rawName ? libmime.decodeWords(rawName) : '')

      return { address, name }
    })
    .filter(x => x.name || x.address)
}

export const parseEnvelope = (entry: EnvelopeEntry[]): Envelope => {
  const envelope: Envelope = {}

  if (entry[0] && !Array.isArray(entry[0]) && entry[0].value) {
    const dateStr = getStrValue(entry[0])

    if (dateStr) {
      const date = new Date(dateStr)
      if (date.toString() === 'Invalid Date') {
        envelope.date = dateStr
      } else {
        envelope.date = date
      }
    }
  }

  if (entry[1] && !Array.isArray(entry[1]) && entry[1].value) {
    const subject = getStrValue(entry[1])

    if (subject) {
      envelope.subject = libmime.decodeWords(subject)
    }
  }

  if (entry[2] && Array.isArray(entry[2]) && entry[2].length) {
    envelope.from = processAddresses(entry[2])
  }

  if (entry[3] && Array.isArray(entry[3]) && entry[3].length) {
    envelope.sender = processAddresses(entry[3])
  }

  if (entry[4] && Array.isArray(entry[4]) && entry[4].length) {
    envelope.replyTo = processAddresses(entry[4])
  }

  if (entry[5] && Array.isArray(entry[5]) && entry[5].length) {
    envelope.to = processAddresses(entry[5])
  }

  if (entry[6] && Array.isArray(entry[6]) && entry[6].length) {
    envelope.cc = processAddresses(entry[6])
  }

  if (entry[7] && Array.isArray(entry[7]) && entry[7].length) {
    envelope.bcc = processAddresses(entry[7])
  }

  if (entry[8] && !Array.isArray(entry[8]) && entry[8].value) {
    const inReplyTo = getStrValue(entry[8])
    if (inReplyTo) {
      envelope.inReplyTo = inReplyTo.trim()
    }
  }

  if (entry[9] && !Array.isArray(entry[9]) && entry[9].value) {
    const messageId = getStrValue(entry[9])

    if (messageId) {
      envelope.messageId = messageId.trim()
    }
  }

  return envelope
}
