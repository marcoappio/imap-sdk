import type { ConnectionCapabilities, MailboxInfo, SearchQuery } from './compiler'
import { compileSearch } from './compiler'

const makeConnection = (
  opts: { capabilities?: string[]; enabled?: string[]; mailbox?: MailboxInfo } = {},
): ConnectionCapabilities => ({
  capabilities: new Set(opts.capabilities ?? []),
  enabled: new Set(opts.enabled ?? []),
  mailbox: opts.mailbox,
})

describe('compileSearch', () => {
  describe('boolean flags', () => {
    it('should compile SEEN flag', () => {
      const result = compileSearch(makeConnection(), { seen: true })

      expect(result).toEqual([{ type: 'ATOM', value: 'SEEN' }])
    })

    it('should compile UNSEEN for seen: false', () => {
      const result = compileSearch(makeConnection(), { seen: false })

      expect(result).toEqual([{ type: 'ATOM', value: 'UNSEEN' }])
    })

    it('should compile SEEN for unseen: false', () => {
      const result = compileSearch(makeConnection(), { unSeen: false })

      expect(result).toEqual([{ type: 'ATOM', value: 'SEEN' }])
    })

    it('should compile ANSWERED flag', () => {
      const result = compileSearch(makeConnection(), { answered: true })

      expect(result).toEqual([{ type: 'ATOM', value: 'ANSWERED' }])
    })

    it('should compile DELETED flag', () => {
      const result = compileSearch(makeConnection(), { deleted: true })

      expect(result).toEqual([{ type: 'ATOM', value: 'DELETED' }])
    })

    it('should compile DRAFT flag', () => {
      const result = compileSearch(makeConnection(), { draft: true })

      expect(result).toEqual([{ type: 'ATOM', value: 'DRAFT' }])
    })

    it('should compile FLAGGED flag', () => {
      const result = compileSearch(makeConnection(), { flagged: true })

      expect(result).toEqual([{ type: 'ATOM', value: 'FLAGGED' }])
    })

    it('should compile multiple flags', () => {
      const result = compileSearch(makeConnection(), { deleted: false, seen: true })

      expect(result).toHaveLength(2)
      expect(result).toContainEqual({ type: 'ATOM', value: 'SEEN' })
      expect(result).toContainEqual({ type: 'ATOM', value: 'UNDELETED' })
    })
  })

  describe('simple boolean flags', () => {
    it('should compile ALL', () => {
      const result = compileSearch(makeConnection(), { all: true })

      expect(result).toEqual([{ type: 'ATOM', value: 'ALL' }])
    })

    it('should compile NEW', () => {
      const result = compileSearch(makeConnection(), { new: true })

      expect(result).toEqual([{ type: 'ATOM', value: 'NEW' }])
    })

    it('should compile OLD', () => {
      const result = compileSearch(makeConnection(), { old: true })

      expect(result).toEqual([{ type: 'ATOM', value: 'OLD' }])
    })

    it('should compile RECENT', () => {
      const result = compileSearch(makeConnection(), { recent: true })

      expect(result).toEqual([{ type: 'ATOM', value: 'RECENT' }])
    })

    it('should not compile ALL if false', () => {
      const result = compileSearch(makeConnection(), { all: false })

      expect(result).toEqual([])
    })
  })

  describe('numeric comparisons', () => {
    it('should compile LARGER', () => {
      const result = compileSearch(makeConnection(), { larger: 1024 })

      expect(result).toEqual([
        { type: 'ATOM', value: 'LARGER' },
        { type: 'ATOM', value: '1024' },
      ])
    })

    it('should compile SMALLER', () => {
      const result = compileSearch(makeConnection(), { smaller: 500 })

      expect(result).toEqual([
        { type: 'ATOM', value: 'SMALLER' },
        { type: 'ATOM', value: '500' },
      ])
    })

    it('should compile MODSEQ', () => {
      const result = compileSearch(makeConnection(), { modseq: 12_345 })

      expect(result).toEqual([
        { type: 'ATOM', value: 'MODSEQ' },
        { type: 'ATOM', value: '12345' },
      ])
    })
  })

  describe('text search fields', () => {
    it('should compile FROM', () => {
      const result = compileSearch(makeConnection(), { from: 'sender@example.com' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'FROM' },
        { type: 'ATOM', value: 'sender@example.com' },
      ])
    })

    it('should compile TO', () => {
      const result = compileSearch(makeConnection(), { to: 'recipient@example.com' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'TO' },
        { type: 'ATOM', value: 'recipient@example.com' },
      ])
    })

    it('should compile SUBJECT', () => {
      const result = compileSearch(makeConnection(), { subject: 'test subject' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'SUBJECT' },
        { type: 'ATOM', value: 'test subject' },
      ])
    })

    it('should compile BODY', () => {
      const result = compileSearch(makeConnection(), { body: 'search term' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'BODY' },
        { type: 'ATOM', value: 'search term' },
      ])
    })

    it('should compile TEXT', () => {
      const result = compileSearch(makeConnection(), { text: 'anywhere' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'TEXT' },
        { type: 'ATOM', value: 'anywhere' },
      ])
    })

    it('should compile CC', () => {
      const result = compileSearch(makeConnection(), { cc: 'cc@example.com' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'CC' },
        { type: 'ATOM', value: 'cc@example.com' },
      ])
    })

    it('should compile BCC', () => {
      const result = compileSearch(makeConnection(), { bcc: 'bcc@example.com' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'BCC' },
        { type: 'ATOM', value: 'bcc@example.com' },
      ])
    })
  })

  describe('Unicode handling', () => {
    it('should add CHARSET UTF-8 for Unicode strings', () => {
      const result = compileSearch(makeConnection(), { subject: 'Tëst Sübject' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'CHARSET' },
        { type: 'ATOM', value: 'UTF-8' },
        { type: 'ATOM', value: 'SUBJECT' },
        { type: 'ATOM', value: 'Tëst Sübject' },
      ])
    })

    it('should not add CHARSET if UTF8=ACCEPT is enabled', () => {
      const result = compileSearch(makeConnection({ enabled: ['UTF8=ACCEPT'] }), { subject: 'Tëst' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'SUBJECT' },
        { type: 'ATOM', value: 'Tëst' },
      ])
    })

    it('should not add CHARSET for ASCII-only strings', () => {
      const result = compileSearch(makeConnection(), { subject: 'Test Subject' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'SUBJECT' },
        { type: 'ATOM', value: 'Test Subject' },
      ])
    })
  })

  describe('UID', () => {
    it('should compile single UID', () => {
      const result = compileSearch(makeConnection(), { uid: '123' })

      expect(result).toEqual([
        { type: 'SEQUENCE', value: 'UID' },
        { type: 'SEQUENCE', value: '123' },
      ])
    })

    it('should compile UID range', () => {
      const result = compileSearch(makeConnection(), { uid: '1:100' })

      expect(result).toEqual([
        { type: 'SEQUENCE', value: 'UID' },
        { type: 'SEQUENCE', value: '1:100' },
      ])
    })

    it('should compile multiple UIDs as array', () => {
      const result = compileSearch(makeConnection(), { uid: [1, 2, 3] })

      expect(result).toEqual([
        { type: 'SEQUENCE', value: 'UID' },
        { type: 'SEQUENCE', value: '1' },
        { type: 'SEQUENCE', value: '2' },
        { type: 'SEQUENCE', value: '3' },
      ])
    })
  })

  describe('sequence', () => {
    it('should compile SEQ', () => {
      const result = compileSearch(makeConnection(), { seq: '1:*' })

      expect(result).toEqual([{ type: 'SEQUENCE', value: '1:*' }])
    })

    it('should compile numeric SEQ', () => {
      const result = compileSearch(makeConnection(), { seq: 42 })

      expect(result).toEqual([{ type: 'SEQUENCE', value: '42' }])
    })

    it('should ignore invalid SEQ with whitespace', () => {
      const result = compileSearch(makeConnection(), { seq: '1 :*' })

      expect(result).toEqual([])
    })
  })

  describe('OBJECTID extension', () => {
    it('should compile EMAILID with OBJECTID capability', () => {
      const result = compileSearch(makeConnection({ capabilities: ['OBJECTID'] }), { emailId: 'abc123' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'EMAILID' },
        { type: 'ATOM', value: 'abc123' },
      ])
    })

    it('should compile THREADID with OBJECTID capability', () => {
      const result = compileSearch(makeConnection({ capabilities: ['OBJECTID'] }), { threadId: 'thread123' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'THREADID' },
        { type: 'ATOM', value: 'thread123' },
      ])
    })

    it('should fall back to Gmail extension for EMAILID', () => {
      const result = compileSearch(makeConnection({ capabilities: ['X-GM-EXT-1'] }), { emailId: 'abc123' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'X-GM-MSGID' },
        { type: 'ATOM', value: 'abc123' },
      ])
    })

    it('should fall back to Gmail extension for THREADID', () => {
      const result = compileSearch(makeConnection({ capabilities: ['X-GM-EXT-1'] }), { threadId: 'thread123' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'X-GM-THRID' },
        { type: 'ATOM', value: 'thread123' },
      ])
    })
  })

  describe('Gmail extensions', () => {
    it('should compile X-GM-RAW search', () => {
      const result = compileSearch(makeConnection({ capabilities: ['X-GM-EXT-1'] }), { gmRaw: 'is:starred' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'X-GM-RAW' },
        { type: 'ATOM', value: 'is:starred' },
      ])
    })

    it('should compile gmailRaw alias', () => {
      const result = compileSearch(makeConnection({ capabilities: ['X-GM-EXT-1'] }), { gmailRaw: 'has:attachment' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'X-GM-RAW' },
        { type: 'ATOM', value: 'has:attachment' },
      ])
    })

    it('should throw error without X-GM-EXT-1 capability', () => {
      expect(() => compileSearch(makeConnection(), { gmRaw: 'is:starred' })).toThrow(
        'Server does not support X-GM-EXT-1 extension required for X-GM-RAW',
      )
    })

    it('should add CHARSET for Unicode Gmail search', () => {
      const result = compileSearch(makeConnection({ capabilities: ['X-GM-EXT-1'] }), { gmRaw: 'tëst' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'CHARSET' },
        { type: 'ATOM', value: 'UTF-8' },
        { type: 'ATOM', value: 'X-GM-RAW' },
        { type: 'ATOM', value: 'tëst' },
      ])
    })
  })

  describe('date searches', () => {
    it('should compile BEFORE date', () => {
      const result = compileSearch(makeConnection(), { before: new Date('2024-01-15T00:00:00.000Z') })

      expect(result).toEqual([
        { type: 'ATOM', value: 'BEFORE' },
        { type: 'ATOM', value: '15-Jan-2024' },
      ])
    })

    it('should compile SINCE date', () => {
      const result = compileSearch(makeConnection(), { since: new Date('2024-01-01T00:00:00.000Z') })

      expect(result).toEqual([
        { type: 'ATOM', value: 'SINCE' },
        { type: 'ATOM', value: '01-Jan-2024' },
      ])
    })

    it('should compile ON date', () => {
      const result = compileSearch(makeConnection(), { on: new Date('2024-06-15T00:00:00.000Z') })

      expect(result).toEqual([
        { type: 'ATOM', value: 'ON' },
        { type: 'ATOM', value: '15-Jun-2024' },
      ])
    })

    it('should compile SENTBEFORE date', () => {
      const result = compileSearch(makeConnection(), { sentBefore: new Date('2024-03-20T00:00:00.000Z') })

      expect(result).toEqual([
        { type: 'ATOM', value: 'SENTBEFORE' },
        { type: 'ATOM', value: '20-Mar-2024' },
      ])
    })

    it('should compile SENTSINCE date', () => {
      const result = compileSearch(makeConnection(), { sentSince: new Date('2024-12-01T00:00:00.000Z') })

      expect(result).toEqual([
        { type: 'ATOM', value: 'SENTSINCE' },
        { type: 'ATOM', value: '01-Dec-2024' },
      ])
    })

    it('should compile SENTON date', () => {
      const result = compileSearch(makeConnection(), { sentOn: new Date('2024-07-04T00:00:00.000Z') })

      expect(result).toEqual([
        { type: 'ATOM', value: 'SENTON' },
        { type: 'ATOM', value: '04-Jul-2024' },
      ])
    })

    it('should use WITHIN extension for BEFORE when available', () => {
      const date = new Date(Date.now() - 86_400_000)
      const result = compileSearch(makeConnection({ capabilities: ['WITHIN'] }), { before: date })

      expect(result.length).toBe(2)
      expect(result[0]).toEqual({ type: 'ATOM', value: 'OLDER' })
      expect(result[1].type).toBe('ATOM')
    })

    it('should use WITHIN extension for SINCE when available', () => {
      const date = new Date(Date.now() - 86_400_000)
      const result = compileSearch(makeConnection({ capabilities: ['WITHIN'] }), { since: date })

      expect(result.length).toBe(2)
      expect(result[0]).toEqual({ type: 'ATOM', value: 'YOUNGER' })
    })

    it('should adjust BEFORE date for non-midnight times', () => {
      const result = compileSearch(makeConnection(), { before: new Date('2024-01-15T12:30:00.000Z') })

      expect(result).toEqual([
        { type: 'ATOM', value: 'BEFORE' },
        { type: 'ATOM', value: '16-Jan-2024' },
      ])
    })

    it('should accept string dates', () => {
      const result = compileSearch(makeConnection(), { since: '2024-01-01' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'SINCE' },
        { type: 'ATOM', value: '01-Jan-2024' },
      ])
    })
  })

  describe('KEYWORD searches', () => {
    it('should compile KEYWORD with valid flag', () => {
      const mailbox: MailboxInfo = { flags: new Set(['custom-flag']), permanentFlags: new Set(['\\*']) }
      const result = compileSearch(makeConnection({ mailbox }), { keyword: 'custom-flag' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'KEYWORD' },
        { type: 'ATOM', value: 'custom-flag' },
      ])
    })

    it('should compile UNKEYWORD', () => {
      const mailbox: MailboxInfo = { flags: new Set(['custom-flag']), permanentFlags: new Set(['\\*']) }
      const result = compileSearch(makeConnection({ mailbox }), { unKeyword: 'custom-flag' })

      expect(result).toEqual([
        { type: 'ATOM', value: 'UNKEYWORD' },
        { type: 'ATOM', value: 'custom-flag' },
      ])
    })

    it('should skip KEYWORD if flag not available', () => {
      const mailbox: MailboxInfo = { flags: new Set(), permanentFlags: new Set() }
      const result = compileSearch(makeConnection({ mailbox }), { keyword: 'unavailable-flag' })

      expect(result).toEqual([])
    })
  })

  describe('HEADER search', () => {
    it('should compile HEADER search', () => {
      const result = compileSearch(makeConnection(), { header: { 'X-Custom': 'value' } })

      expect(result).toEqual([
        { type: 'ATOM', value: 'HEADER' },
        { type: 'ATOM', value: 'X-CUSTOM' },
        { type: 'ATOM', value: 'value' },
      ])
    })

    it('should compile HEADER existence check', () => {
      const result = compileSearch(makeConnection(), { header: { 'X-Priority': true } })

      expect(result).toEqual([
        { type: 'ATOM', value: 'HEADER' },
        { type: 'ATOM', value: 'X-PRIORITY' },
        { type: 'ATOM', value: '' },
      ])
    })

    it('should compile multiple headers', () => {
      const result = compileSearch(makeConnection(), { header: { From: 'test@example.com', 'X-Spam': 'yes' } })

      expect(result).toHaveLength(6)
    })

    it('should add CHARSET for Unicode header values', () => {
      const result = compileSearch(makeConnection(), { header: { Subject: 'Tëst' } })

      expect(result[0]).toEqual({ type: 'ATOM', value: 'CHARSET' })
      expect(result[1]).toEqual({ type: 'ATOM', value: 'UTF-8' })
    })
  })

  describe('NOT operator', () => {
    it('should compile NOT with nested query', () => {
      const result = compileSearch(makeConnection(), { not: { seen: true } })

      expect(result).toEqual([
        { type: 'ATOM', value: 'NOT' },
        { type: 'ATOM', value: 'SEEN' },
      ])
    })

    it('should compile complex NOT query', () => {
      const result = compileSearch(makeConnection(), { not: { from: 'spam@example.com' } })

      expect(result).toEqual([
        { type: 'ATOM', value: 'NOT' },
        { type: 'ATOM', value: 'FROM' },
        { type: 'ATOM', value: 'spam@example.com' },
      ])
    })

    it('should ignore empty NOT', () => {
      const result = compileSearch(makeConnection(), { not: undefined } as unknown as SearchQuery)

      expect(result).toEqual([])
    })
  })

  describe('OR operator', () => {
    it('should compile simple OR', () => {
      const result = compileSearch(makeConnection(), {
        or: [{ from: 'alice@example.com' }, { from: 'bob@example.com' }],
      })

      expect(result).toEqual([
        { type: 'ATOM', value: 'OR' },
        { type: 'ATOM', value: 'FROM' },
        { type: 'ATOM', value: 'alice@example.com' },
        { type: 'ATOM', value: 'FROM' },
        { type: 'ATOM', value: 'bob@example.com' },
      ])
    })

    it('should compile single element OR (no OR keyword)', () => {
      const result = compileSearch(makeConnection(), { or: [{ seen: true }] })

      expect(result).toEqual([{ type: 'ATOM', value: 'SEEN' }])
    })

    it('should compile three-way OR as nested binary', () => {
      const result = compileSearch(makeConnection(), {
        or: [{ from: 'a@example.com' }, { from: 'b@example.com' }, { from: 'c@example.com' }],
      })

      expect(result.filter(x => x.value === 'OR')).toHaveLength(2)
    })

    it('should ignore empty OR array', () => {
      const result = compileSearch(makeConnection(), { or: [] })

      expect(result).toEqual([])
    })
  })

  describe('complex queries', () => {
    it('should compile multiple criteria', () => {
      const result = compileSearch(makeConnection(), {
        from: 'test@example.com',
        larger: 1024,
        seen: true,
      })

      expect(result).toHaveLength(5)
    })

    it('should compile nested query', () => {
      const result = compileSearch(makeConnection(), {
        not: { seen: true },
        or: [{ from: 'alice@example.com' }, { from: 'bob@example.com' }],
      })

      expect(result.filter(x => x.value === 'NOT')).toHaveLength(1)
      expect(result.filter(x => x.value === 'OR')).toHaveLength(1)
    })
  })
})
