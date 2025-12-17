import { tokenize } from './tokenizer'

describe('tokenize', () => {
  describe('basic types', () => {
    describe('ATOM', () => {
      it('should parse a simple atom', () => {
        const result = tokenize('INBOX')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'ATOM', value: 'INBOX' }])
        }
      })

      it('should parse multiple atoms', () => {
        const result = tokenize('FOO BAR BAZ')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toHaveLength(3)
          expect(result.value[0]).toEqual({ type: 'ATOM', value: 'FOO' })
          expect(result.value[1]).toEqual({ type: 'ATOM', value: 'BAR' })
          expect(result.value[2]).toEqual({ type: 'ATOM', value: 'BAZ' })
        }
      })

      it('should parse atom with special characters', () => {
        const result = tokenize('\\Seen')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'ATOM', value: '\\Seen' }])
        }
      })

      it('should parse atom with wildcard flag', () => {
        const result = tokenize('\\*')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'ATOM', value: '\\*' }])
        }
      })
    })

    describe('NIL', () => {
      it('should parse NIL as null', () => {
        const result = tokenize('NIL')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([null])
        }
      })

      it('should parse nil (lowercase) as null', () => {
        const result = tokenize('nil')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([null])
        }
      })
    })

    describe('STRING', () => {
      it('should parse a quoted string', () => {
        const result = tokenize('"Hello World"')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'STRING', value: 'Hello World' }])
        }
      })

      it('should parse empty quoted string', () => {
        const result = tokenize('""')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'STRING', value: '' }])
        }
      })

      it('should parse string with escaped quote', () => {
        const result = tokenize('"Hello \\"World\\""')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'STRING', value: 'Hello "World"' }])
        }
      })

      it('should parse string with escaped backslash', () => {
        const result = tokenize('"path\\\\to\\\\file"')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'STRING', value: 'path\\to\\file' }])
        }
      })
    })

    describe('LITERAL', () => {
      it('should parse literal with content', () => {
        const result = tokenize('{5}\r\nHello')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'LITERAL', value: 'Hello' }])
        }
      })

      it('should parse empty literal', () => {
        const result = tokenize('{0}\r\n')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'LITERAL', value: '' }])
        }
      })

      it('should parse literal with pre-loaded buffer', () => {
        const literals = [Buffer.from('test data')]
        const result = tokenize('{9}\r\n', { literals })

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toHaveLength(1)
          expect(result.value[0].type).toBe('LITERAL')
          expect(Buffer.isBuffer(result.value[0].value)).toBe(true)
        }
      })

      it('should parse literal with + suffix when literalPlus option is set', () => {
        const result = tokenize('{5+}\r\nHello', { literalPlus: true })

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'LITERAL', value: 'Hello' }])
        }
      })
    })

    describe('SEQUENCE', () => {
      it('should parse simple sequence', () => {
        const result = tokenize('1:100')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'SEQUENCE', value: '1:100' }])
        }
      })

      it('should parse sequence with wildcard', () => {
        const result = tokenize('1:*')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'SEQUENCE', value: '1:*' }])
        }
      })

      it('should parse sequence set with commas', () => {
        const result = tokenize('1,2,3,4,5')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'SEQUENCE', value: '1,2,3,4,5' }])
        }
      })

      it('should parse complex sequence set', () => {
        const result = tokenize('1:10,15,20:*')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'SEQUENCE', value: '1:10,15,20:*' }])
        }
      })

      it('should parse standalone wildcard as sequence', () => {
        const result = tokenize('*')

        expect(result.ok).toBe(true)
        if (result.ok) {
          expect(result.value).toEqual([{ type: 'SEQUENCE', value: '*' }])
        }
      })
    })
  })

  describe('LIST', () => {
    it('should parse empty list', () => {
      const result = tokenize('()')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual([[]])
      }
    })

    it('should parse list with atoms', () => {
      const result = tokenize('(FOO BAR BAZ)')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual([
          [
            { type: 'ATOM', value: 'FOO' },
            { type: 'ATOM', value: 'BAR' },
            { type: 'ATOM', value: 'BAZ' },
          ],
        ])
      }
    })

    it('should parse nested lists', () => {
      const result = tokenize('((A B) (C D))')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual([
          [
            [
              { type: 'ATOM', value: 'A' },
              { type: 'ATOM', value: 'B' },
            ],
            [
              { type: 'ATOM', value: 'C' },
              { type: 'ATOM', value: 'D' },
            ],
          ],
        ])
      }
    })

    it('should parse list with mixed types', () => {
      const result = tokenize('(ATOM "string" NIL 123)')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual([
          [{ type: 'ATOM', value: 'ATOM' }, { type: 'STRING', value: 'string' }, null, { type: 'ATOM', value: '123' }],
        ])
      }
    })
  })

  describe('SECTION', () => {
    it('should parse BODY with section', () => {
      const result = tokenize('BODY[TEXT]')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(1)
        expect(result.value[0]).toMatchObject({
          section: [{ type: 'ATOM', value: 'TEXT' }],
          type: 'ATOM',
          value: 'BODY',
        })
      }
    })

    it('should parse BODY.PEEK with section', () => {
      const result = tokenize('BODY.PEEK[HEADER]')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(1)
        expect(result.value[0]).toMatchObject({
          section: [{ type: 'ATOM', value: 'HEADER' }],
          type: 'ATOM',
          value: 'BODY.PEEK',
        })
      }
    })

    it('should parse BODY with empty section', () => {
      const result = tokenize('BODY[]')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(1)
        expect(result.value[0]).toMatchObject({
          section: [],
          type: 'ATOM',
          value: 'BODY',
        })
      }
    })

    it('should parse BODY with section and fields', () => {
      const result = tokenize('BODY[HEADER.FIELDS (FROM TO SUBJECT)]')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].type).toBe('ATOM')
        expect(result.value[0].value).toBe('BODY')
        expect(Array.isArray(result.value[0].section)).toBe(true)
      }
    })

    it('should parse BODY with section number', () => {
      const result = tokenize('BODY[1.2.MIME]')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(1)
        expect(result.value[0]).toMatchObject({
          type: 'ATOM',
          value: 'BODY',
        })
      }
    })
  })

  describe('PARTIAL', () => {
    it('should parse BODY with partial', () => {
      const result = tokenize('BODY[]<0.1024>')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].partial).toEqual([0, 1024])
      }
    })

    it('should parse partial with large offset', () => {
      const result = tokenize('BODY[]<1000000.2000000>')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(1)
        expect(result.value[0].partial).toEqual([1_000_000, 2_000_000])
      }
    })
  })

  describe('response codes', () => {
    it('should parse OK response with bracketed code', () => {
      const result = tokenize('[CAPABILITY IMAP4rev1]', { command: 'OK' })

      expect(result.ok).toBe(true)
    })

    it('should parse NO response with bracketed code', () => {
      const result = tokenize('[NONEXISTENT]', { command: 'NO' })

      expect(result.ok).toBe(true)
    })

    it('should parse BAD response with bracketed code', () => {
      const result = tokenize('[PARSE]', { command: 'BAD' })

      expect(result.ok).toBe(true)
    })

    it('should parse response with REFERRAL', () => {
      const result = tokenize('[REFERRAL imap://server/mailbox]', { command: 'NO' })

      expect(result.ok).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should return error for unexpected character in atom', () => {
      const result = tokenize('ATOM)')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E16')
      }
    })

    it('should return error for unexpected character in normal state', () => {
      const result = tokenize('\x00')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E13')
      }
    })

    it('should return error for character after \\*', () => {
      const result = tokenize('\\*X')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E17')
      }
    })

    it('should return error for unexpected end of string input', () => {
      const result = tokenize('"unclosed\\')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E18')
      }
    })

    it('should return error for invalid partial ending', () => {
      const result = tokenize('BODY[]<0.>')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E19')
      }
    })

    it('should return error for double dot in partial', () => {
      const result = tokenize('BODY[]<0..1>')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E20')
      }
    })

    it('should return error for invalid char in partial', () => {
      const result = tokenize('BODY[]<0.x>')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E21')
      }
    })

    it('should return error for leading zero in partial', () => {
      const result = tokenize('BODY[]<01.100>')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E22')
      }
    })

    it('should return error for unexpected brace in normal state', () => {
      const result = tokenize('}')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E13')
      }
    })

    it('should return error for literal without CRLF', () => {
      const result = tokenize('{5}Hello')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E24')
      }
    })

    it('should return error for non-digit in literal length', () => {
      const result = tokenize('{5x}\r\n')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E25')
      }
    })

    it('should return error for leading zero in literal', () => {
      const result = tokenize('{05}\r\n')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E26')
      }
    })

    it('should return error for unexpected whitespace in sequence', () => {
      const result = tokenize('1: 100')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E27')
      }
    })

    it('should return error for invalid range separator in sequence', () => {
      const result = tokenize('1::100')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E29')
      }
    })

    it('should return error for invalid wildcard position', () => {
      const result = tokenize('1*')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E16')
      }
    })

    it('should return error for invalid comma position in sequence', () => {
      const result = tokenize('1:,2')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E31')
      }
    })

    it('should return error for digit after wildcard in sequence', () => {
      const result = tokenize('1:*1')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E34')
      }
    })

    it('should return error for unclosed input', () => {
      const result = tokenize('(UNCLOSED')

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.code).toBe('PARSER_E9')
      }
    })
  })

  describe('complex IMAP responses', () => {
    it('should parse FETCH response structure', () => {
      const result = tokenize('FLAGS (\\Seen \\Recent) UID 12345')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(4)
        expect(result.value[0]).toEqual({ type: 'ATOM', value: 'FLAGS' })
        expect(result.value[2]).toEqual({ type: 'ATOM', value: 'UID' })
        expect(result.value[3]).toEqual({ type: 'ATOM', value: '12345' })
      }
    })

    it('should parse ENVELOPE structure', () => {
      const result = tokenize(
        '("Mon, 01 Jan 2024 00:00:00 +0000" "Test Subject" ((NIL NIL "sender" "example.com")) NIL NIL ((NIL NIL "recipient" "example.com")) NIL NIL NIL "<msgid@example.com>")',
      )

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(1)
        expect(Array.isArray(result.value[0])).toBe(true)
      }
    })

    it('should parse deeply nested structure', () => {
      const result = tokenize('((((A))))')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(1)
      }
    })

    it('should parse LIST response', () => {
      const result = tokenize('(\\HasNoChildren) "/" "INBOX"')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(3)
        expect(result.value[1]).toEqual({ type: 'STRING', value: '/' })
        expect(result.value[2]).toEqual({ type: 'STRING', value: 'INBOX' })
      }
    })

    it('should parse BODYSTRUCTURE', () => {
      const result = tokenize('("TEXT" "PLAIN" ("CHARSET" "UTF-8") NIL NIL "7BIT" 100 5 NIL NIL NIL)')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(1)
        expect(Array.isArray(result.value[0])).toBe(true)
      }
    })

    it('should parse CAPABILITY response', () => {
      const result = tokenize('IMAP4rev1 LITERAL+ IDLE NAMESPACE UIDPLUS')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(5)
        expect(result.value.every(x => x?.type === 'ATOM')).toBe(true)
      }
    })
  })

  describe('nesting limits', () => {
    it('should return error for excessive nesting depth', () => {
      const deeplyNested = '('.repeat(30) + ')'.repeat(30)
      const result = tokenize(deeplyNested)

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error.message).toContain('Too much nesting')
      }
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const result = tokenize('')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual([])
      }
    })

    it('should handle whitespace only', () => {
      const result = tokenize('   ')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual([])
      }
    })

    it('should handle multiple spaces between tokens', () => {
      const result = tokenize('A    B    C')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toHaveLength(3)
      }
    })

    it('should handle high-bit characters in atom', () => {
      const result = tokenize('Tëst')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual([{ type: 'ATOM', value: 'Tëst' }])
      }
    })

    it('should handle percent in atom (list wildcard)', () => {
      const result = tokenize('%')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual([{ type: 'ATOM', value: '%' }])
      }
    })

    it('should handle tilde followed by valid atom char', () => {
      const result = tokenize('~test')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual([{ type: 'ATOM', value: '~test' }])
      }
    })

    it('should handle atom with closing bracket', () => {
      const result = tokenize('ATOM]')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toEqual([{ type: 'ATOM', value: 'ATOM]' }])
      }
    })
  })
})
