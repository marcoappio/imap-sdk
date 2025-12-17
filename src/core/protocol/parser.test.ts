import { parse } from './parser'

describe('parse', () => {
  describe('basic response structure', () => {
    it('should parse a tagged OK response', () => {
      const result = parse('A001 OK NOOP completed')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('A001')
        expect(result.value.command).toBe('OK')
        expect(result.value.attributes).toBeDefined()
        expect(result.value.attributes?.[0]).toEqual({ type: 'TEXT', value: 'NOOP completed' })
      }
    })

    it('should parse an untagged response', () => {
      const result = parse('* OK Ready')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('*')
        expect(result.value.command).toBe('OK')
      }
    })

    it('should parse a continuation response', () => {
      const result = parse('+ ')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('+')
        expect(result.value.command).toBe('')
      }
    })

    it('should parse continuation with text', () => {
      const result = parse('+ Ready for additional command text')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('+')
        expect(result.value.command).toBe('')
        expect(result.value.attributes).toBeDefined()
        expect(result.value.attributes?.[0]).toEqual({ type: 'TEXT', value: 'Ready for additional command text' })
      }
    })

    it('should parse a NO response', () => {
      const result = parse('A001 NO Login failed')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('A001')
        expect(result.value.command).toBe('NO')
        expect(result.value.attributes?.[0]).toEqual({ type: 'TEXT', value: 'Login failed' })
      }
    })

    it('should parse a BAD response', () => {
      const result = parse('A001 BAD Unknown command')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('A001')
        expect(result.value.command).toBe('BAD')
      }
    })

    it('should parse PREAUTH response', () => {
      const result = parse('* PREAUTH [CAPABILITY IMAP4rev1] Authenticated')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('*')
        expect(result.value.command).toBe('PREAUTH')
      }
    })

    it('should parse BYE response', () => {
      const result = parse('* BYE Logging out')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('*')
        expect(result.value.command).toBe('BYE')
      }
    })
  })

  describe('compound commands', () => {
    it('should parse UID FETCH command', () => {
      const result = parse('A001 UID FETCH 1:*')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('A001')
        expect(result.value.command).toBe('UID FETCH')
      }
    })

    it('should parse AUTHENTICATE PLAIN', () => {
      const result = parse('A001 AUTHENTICATE PLAIN')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.command).toBe('AUTHENTICATE PLAIN')
      }
    })
  })

  describe('response codes', () => {
    it('should parse OK with CAPABILITY response code', () => {
      const result = parse('* OK [CAPABILITY IMAP4rev1 LITERAL+ IDLE] Ready')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.command).toBe('OK')
        expect(result.value.attributes).toBeDefined()
        expect(result.value.attributes?.length).toBeGreaterThan(1)
      }
    })

    it('should parse NO with NONEXISTENT response code', () => {
      const result = parse('A001 NO [NONEXISTENT] Mailbox does not exist')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.command).toBe('NO')
        expect(result.value.attributes?.[0]).toMatchObject({
          section: [{ type: 'ATOM', value: 'NONEXISTENT' }],
          type: 'ATOM',
          value: '',
        })
      }
    })

    it('should parse nested brackets in response code', () => {
      const result = parse('* OK [REFERRAL imap://server[1]/] Try other server')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.command).toBe('OK')
      }
    })

    it('should parse PERMANENTFLAGS response code', () => {
      const result = parse(
        '* OK [PERMANENTFLAGS (\\Answered \\Flagged \\Draft \\Deleted \\Seen $NotPhishing $Phishing \\*)]',
      )

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.command).toBe('OK')
        expect(result.value.attributes?.[0]).toMatchObject({
          section: [
            { type: 'ATOM', value: 'PERMANENTFLAGS' },
            expect.arrayContaining([
              { type: 'ATOM', value: '\\Answered' },
              { type: 'ATOM', value: '\\*' },
            ]),
          ],
          type: 'ATOM',
          value: '',
        })
      }
    })
  })

  describe('attributes with tokenization', () => {
    it('should parse CAPABILITY response', () => {
      const result = parse('* CAPABILITY IMAP4rev1 LITERAL+ IDLE')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.command).toBe('CAPABILITY')
        expect(result.value.attributes).toBeDefined()
        expect(result.value.attributes?.length).toBe(3)
      }
    })

    it('should parse EXISTS response', () => {
      const result = parse('* 172 EXISTS')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('*')
        expect(result.value.command).toBe('172')
        expect(result.value.attributes?.[0]).toEqual({ type: 'ATOM', value: 'EXISTS' })
      }
    })

    it('should parse FLAGS response', () => {
      const result = parse('* FLAGS (\\Answered \\Flagged \\Draft \\Deleted \\Seen)')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.command).toBe('FLAGS')
        expect(Array.isArray(result.value.attributes?.[0])).toBe(true)
      }
    })

    it('should parse LIST response', () => {
      const result = parse('* LIST (\\HasNoChildren) "/" "INBOX"')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.command).toBe('LIST')
        expect(result.value.attributes?.length).toBe(3)
      }
    })

    it('should parse FETCH response with UID and FLAGS', () => {
      const result = parse('* 1 FETCH (UID 12345 FLAGS (\\Seen))')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('*')
        expect(result.value.command).toBe('1')
        expect(result.value.attributes).toBeDefined()
        expect(result.value.attributes?.[0]).toEqual({ type: 'ATOM', value: 'FETCH' })
      }
    })
  })

  describe('null byte handling', () => {
    it('should remove leading null bytes', () => {
      const input = '\x00\x00\x00* OK Ready'
      const result = parse(input)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.nullBytesRemoved).toBe(3)
        expect(result.value.tag).toBe('*')
      }
    })

    it('should handle all null bytes', () => {
      const input = '\x00\x00\x00'
      const result = parse(input)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.command).toBe('BAD')
        expect(result.value.tag).toBe('*')
      }
    })

    it('should not affect input without null bytes', () => {
      const result = parse('* OK Ready')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.nullBytesRemoved).toBeUndefined()
      }
    })
  })

  describe('Buffer input', () => {
    it('should accept Buffer input', () => {
      const result = parse(Buffer.from('A001 OK Done'))

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('A001')
        expect(result.value.command).toBe('OK')
      }
    })
  })

  describe('error handling', () => {
    it('should return error for unexpected whitespace at start', () => {
      const result = parse(' A001 OK')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E1')
      }
    })

    it('should return error for missing space after tag', () => {
      const result = parse('A001OK')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E4')
      }
    })

    it('should return error for empty input after null byte removal', () => {
      const result = parse('')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E3')
      }
    })
  })

  describe('special cases', () => {
    it('should handle complex FETCH response', () => {
      const input = '* 1 FETCH (BODY[] {10}\r\nHello IMAP FLAGS (\\Seen))'
      const result = parse(input)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('*')
        expect(result.value.command).toBe('1')
        expect(result.value.attributes?.[0]).toEqual({ type: 'ATOM', value: 'FETCH' })
      }
    })

    it('should handle response without attributes', () => {
      const result = parse('A001 NOOP')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.tag).toBe('A001')
        expect(result.value.command).toBe('NOOP')
        expect(result.value.attributes).toBeUndefined()
      }
    })

    it('should pass options to tokenizer', () => {
      const literals = [Buffer.from('test data')]
      const result = parse('* FETCH (BODY[] {9}\r\n)', { literals })

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.command).toBe('FETCH')
      }
    })
  })

  describe('human-readable extraction', () => {
    it('should extract human-readable text from OK response', () => {
      const result = parse('A001 OK [READ-WRITE] SELECT completed')

      expect(result.ok).toBe(true)
      if (result.ok) {
        const attrs = result.value.attributes
        const textAttr = attrs?.find(x => x && typeof x === 'object' && !Array.isArray(x) && x.type === 'TEXT')
        expect(textAttr).toBeDefined()
        expect(textAttr?.value).toBe('SELECT completed')
      }
    })

    it('should handle OK without response code', () => {
      const result = parse('A001 OK Login successful')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.attributes?.[0]).toEqual({ type: 'TEXT', value: 'Login successful' })
      }
    })
  })
})
