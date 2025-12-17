import { ConnectionId, MailboxPath, ModSeq, SequenceNumber, Tag, UID, UIDValidity } from './common'

describe('UID', () => {
  it('should create a branded UID', () => {
    const uid = UID(12_345)

    expect(uid).toBe(12_345)
    expect(typeof uid).toBe('number')
  })

  it('should preserve numeric operations', () => {
    const uid = UID(100)

    expect(uid + 1).toBe(101)
    expect(uid > 50).toBe(true)
  })
})

describe('SequenceNumber', () => {
  it('should create a branded SequenceNumber', () => {
    const seq = SequenceNumber(1)

    expect(seq).toBe(1)
    expect(typeof seq).toBe('number')
  })

  it('should work with array indices', () => {
    const seq = SequenceNumber(5)
    const messages = ['a', 'b', 'c', 'd', 'e', 'f']

    expect(messages[seq]).toBe('f')
  })
})

describe('ModSeq', () => {
  it('should create a branded ModSeq', () => {
    const modseq = ModSeq(BigInt(9_876_543_210))

    expect(modseq).toBe(BigInt(9_876_543_210))
    expect(typeof modseq).toBe('bigint')
  })

  it('should handle large values', () => {
    const largeModseq = ModSeq(BigInt('18446744073709551615'))

    expect(largeModseq > BigInt(0)).toBe(true)
  })

  it('should support bigint operations', () => {
    const modseq = ModSeq(BigInt(100))

    expect(modseq + BigInt(1)).toBe(BigInt(101))
  })
})

describe('UIDValidity', () => {
  it('should create a branded UIDValidity', () => {
    const validity = UIDValidity(BigInt(1_234_567_890))

    expect(validity).toBe(BigInt(1_234_567_890))
    expect(typeof validity).toBe('bigint')
  })

  it('should compare UIDValidity values', () => {
    const validity1 = UIDValidity(BigInt(100))
    const validity2 = UIDValidity(BigInt(200))

    expect(validity1 < validity2).toBe(true)
    expect(validity1 === UIDValidity(BigInt(100))).toBe(true)
  })
})

describe('MailboxPath', () => {
  it('should create a branded MailboxPath', () => {
    const path = MailboxPath('INBOX')

    expect(path).toBe('INBOX')
    expect(typeof path).toBe('string')
  })

  it('should handle nested paths', () => {
    const path = MailboxPath('INBOX/Subfolder/Deep')

    expect(path.split('/')).toEqual(['INBOX', 'Subfolder', 'Deep'])
  })

  it('should preserve string methods', () => {
    const path = MailboxPath('inbox')

    expect(path.toUpperCase()).toBe('INBOX')
    expect(path.length).toBe(5)
  })
})

describe('Tag', () => {
  it('should create a branded Tag', () => {
    const tag = Tag('A001')

    expect(tag).toBe('A001')
    expect(typeof tag).toBe('string')
  })

  it('should handle various tag formats', () => {
    const tags = ['A001', 'B123', '*', '+']

    for (const t of tags) {
      const tag = Tag(t)
      expect(tag).toBe(t)
    }
  })
})

describe('ConnectionId', () => {
  it('should create a branded ConnectionId', () => {
    const id = ConnectionId('conn-abc123')

    expect(id).toBe('conn-abc123')
    expect(typeof id).toBe('string')
  })

  it('should work with UUID-like values', () => {
    const id = ConnectionId('550e8400-e29b-41d4-a716-446655440000')

    expect(id.length).toBe(36)
  })
})
