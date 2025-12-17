import { compile } from './compiler'

describe('compile', () => {
  describe('basic response structure', () => {
    it('should compile a simple tagged response', () => {
      const result = compile({ command: 'OK', tag: 'A001' })

      expect(result).toBeInstanceOf(Buffer)
      expect(result.toString()).toBe('A001 OK')
    })

    it('should compile an untagged response', () => {
      const result = compile({ command: 'OK', tag: '*' })

      expect(result).toBeInstanceOf(Buffer)
      expect(result.toString()).toBe('* OK')
    })

    it('should compile a continuation response', () => {
      const result = compile({ tag: '+' })

      expect(result).toBeInstanceOf(Buffer)
      expect(result.toString()).toBe('+')
    })

    it('should compile response without tag', () => {
      const result = compile({ command: 'NOOP' })

      expect(result).toBeInstanceOf(Buffer)
      expect(result.toString()).toBe(' NOOP')
    })

    it('should return empty buffer for empty response', () => {
      const result = compile({})

      expect(result).toBeInstanceOf(Buffer)
      expect(result.toString()).toBe('')
    })
  })

  describe('attributes', () => {
    describe('null and NIL', () => {
      it('should compile null as NIL', () => {
        const result = compile({ attributes: [null], tag: '*' })

        expect(result.toString()).toBe('* NIL')
      })

      it('should compile multiple nulls', () => {
        const result = compile({ attributes: [null, null, null], tag: '*' })

        expect(result.toString()).toBe('* NIL NIL NIL')
      })

      it('should compile typed node with null value as NIL', () => {
        const result = compile({
          attributes: [{ type: 'STRING', value: null }],
          tag: '*',
        })

        expect(result.toString()).toBe('* NIL')
      })
    })

    describe('strings', () => {
      it('should compile raw string', () => {
        const result = compile({ attributes: ['hello'], tag: '*' })

        expect(result.toString()).toBe('* "hello"')
      })

      it('should compile string with quotes', () => {
        const result = compile({ attributes: ['hello "world"'], tag: '*' })

        expect(result.toString()).toBe('* "hello \\"world\\""')
      })

      it('should compile empty string', () => {
        const result = compile({ attributes: [''], tag: '*' })

        expect(result.toString()).toBe('* ""')
      })

      it('should compile typed STRING node', () => {
        const result = compile({
          attributes: [{ type: 'STRING', value: 'test' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* "test"')
      })

      it('should compile Buffer as string', () => {
        const result = compile({ attributes: [Buffer.from('buffer content')], tag: '*' })

        expect(result.toString()).toBe('* "buffer content"')
      })
    })

    describe('numbers', () => {
      it('should compile number', () => {
        const result = compile({ attributes: [12_345], tag: '*' })

        expect(result.toString()).toBe('* 12345')
      })

      it('should compile zero', () => {
        const result = compile({ attributes: [0], tag: '*' })

        expect(result.toString()).toBe('* 0')
      })

      it('should round floating point numbers', () => {
        const result = compile({ attributes: [3.7], tag: '*' })

        expect(result.toString()).toBe('* 4')
      })

      it('should compile typed NUMBER node', () => {
        const result = compile({
          attributes: [{ type: 'NUMBER', value: '999' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* 999')
      })
    })

    describe('atoms', () => {
      it('should compile simple ATOM', () => {
        const result = compile({
          attributes: [{ type: 'ATOM', value: 'INBOX' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* INBOX')
      })

      it('should compile ATOM with backslash flag', () => {
        const result = compile({
          attributes: [{ type: 'ATOM', value: '\\Seen' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* \\Seen')
      })

      it('should quote ATOM with special characters', () => {
        const result = compile({
          attributes: [{ type: 'ATOM', value: 'has space' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* "has space"')
      })

      it('should quote empty ATOM', () => {
        const result = compile({
          attributes: [{ type: 'ATOM', value: '' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* ""')
      })
    })

    describe('sequences', () => {
      it('should compile SEQUENCE', () => {
        const result = compile({
          attributes: [{ type: 'SEQUENCE', value: '1:100' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* 1:100')
      })

      it('should compile wildcard SEQUENCE', () => {
        const result = compile({
          attributes: [{ type: 'SEQUENCE', value: '*' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* *')
      })
    })

    describe('TEXT', () => {
      it('should compile TEXT without quotes', () => {
        const result = compile({
          attributes: [{ type: 'TEXT', value: 'some text content' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* some text content')
      })

      it('should handle empty TEXT', () => {
        const result = compile({
          attributes: [{ type: 'TEXT', value: '' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* ')
      })
    })

    describe('lists (arrays)', () => {
      it('should compile empty list', () => {
        const result = compile({ attributes: [[]], tag: '*' })

        expect(result.toString()).toBe('* ()')
      })

      it('should compile list with atoms', () => {
        const result = compile({
          attributes: [
            [
              { type: 'ATOM', value: 'FOO' },
              { type: 'ATOM', value: 'BAR' },
            ],
          ],
          tag: '*',
        })

        expect(result.toString()).toBe('* (FOO BAR)')
      })

      it('should compile nested lists', () => {
        const result = compile({
          attributes: [[[{ type: 'ATOM', value: 'A' }], [{ type: 'ATOM', value: 'B' }]]],
          tag: '*',
        })

        expect(result.toString()).toBe('* ((A)(B))')
      })

      it('should compile list with mixed types', () => {
        const result = compile({
          attributes: [[{ type: 'ATOM', value: 'FLAGS' }, null, 'string']],
          tag: '*',
        })

        expect(result.toString()).toBe('* (FLAGS NIL "string")')
      })

      it('should not add space after opening paren', () => {
        const result = compile({
          attributes: [[{ type: 'ATOM', value: 'X' }]],
          tag: '*',
        })

        expect(result.toString()).toBe('* (X)')
        expect(result.toString()).not.toBe('* ( X)')
      })
    })

    describe('sections', () => {
      it('should compile ATOM with section', () => {
        const result = compile({
          attributes: [
            {
              section: [{ type: 'ATOM', value: 'TEXT' }],
              type: 'ATOM',
              value: 'BODY',
            },
          ],
          tag: '*',
        })

        expect(result.toString()).toBe('* BODY[TEXT]')
      })

      it('should compile ATOM with empty section', () => {
        const result = compile({
          attributes: [
            {
              section: [],
              type: 'ATOM',
              value: 'BODY',
            },
          ],
          tag: '*',
        })

        expect(result.toString()).toBe('* BODY[]')
      })

      it('should compile BODY.PEEK with section', () => {
        const result = compile({
          attributes: [
            {
              section: [{ type: 'ATOM', value: 'HEADER' }],
              type: 'ATOM',
              value: 'BODY.PEEK',
            },
          ],
          tag: '*',
        })

        expect(result.toString()).toBe('* BODY.PEEK[HEADER]')
      })

      it('should compile section with list', () => {
        const result = compile({
          attributes: [
            {
              section: [
                { type: 'ATOM', value: 'HEADER.FIELDS' },
                [
                  { type: 'ATOM', value: 'FROM' },
                  { type: 'ATOM', value: 'TO' },
                ],
              ],
              type: 'ATOM',
              value: 'BODY',
            },
          ],
          tag: '*',
        })

        expect(result.toString()).toBe('* BODY[HEADER.FIELDS (FROM TO)]')
      })
    })

    describe('partials', () => {
      it('should compile partial specifier', () => {
        const result = compile({
          attributes: [
            {
              partial: [0, 1024],
              section: [],
              type: 'ATOM',
              value: 'BODY',
            },
          ],
          tag: '*',
        })

        expect(result.toString()).toBe('* BODY[]<0.1024>')
      })

      it('should compile section with partial', () => {
        const result = compile({
          attributes: [
            {
              partial: [1000, 500],
              section: [{ type: 'ATOM', value: 'TEXT' }],
              type: 'ATOM',
              value: 'BODY',
            },
          ],
          tag: '*',
        })

        expect(result.toString()).toBe('* BODY[TEXT]<1000.500>')
      })
    })

    describe('literals', () => {
      it('should compile literal without plus', () => {
        const result = compile({
          attributes: [{ type: 'LITERAL', value: 'Hello' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* {5}\r\nHello')
      })

      it('should compile empty literal', () => {
        const result = compile({
          attributes: [{ type: 'LITERAL', value: '' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* {0}\r\n')
      })

      it('should compile literal with literalPlus option', () => {
        const result = compile(
          {
            attributes: [{ type: 'LITERAL', value: 'test' }],
            tag: '*',
          },
          { literalPlus: true },
        )

        expect(result.toString()).toBe('* {4+}\r\ntest')
      })

      it('should compile literal with literalMinus (small literal)', () => {
        const result = compile(
          {
            attributes: [{ type: 'LITERAL', value: 'x'.repeat(100) }],
            tag: '*',
          },
          { literalMinus: true },
        )

        expect(result.toString()).toBe(`* {100+}\r\n${'x'.repeat(100)}`)
      })

      it('should compile literal with literalMinus (large literal)', () => {
        const largeContent = 'x'.repeat(5000)
        const result = compile(
          {
            attributes: [{ type: 'LITERAL', value: largeContent }],
            tag: '*',
          },
          { asArray: true, literalMinus: true },
        )

        expect(Array.isArray(result)).toBe(true)
        expect((result as Buffer[]).length).toBe(2)
        expect((result as Buffer[])[0].toString()).toBe('* {5000}\r\n')
        expect((result as Buffer[])[1].toString()).toBe(largeContent)
      })

      it('should compile literal8 with tilde prefix', () => {
        const result = compile({
          attributes: [{ isLiteral8: true, type: 'LITERAL', value: 'binary' }],
          tag: '*',
        })

        expect(result.toString()).toBe('* ~{6}\r\nbinary')
      })

      it('should compile Buffer literal', () => {
        const result = compile({
          attributes: [{ type: 'LITERAL', value: Buffer.from([0x00, 0x01, 0x02]) }],
          tag: '*',
        })

        expect(result.toString('latin1')).toBe('* {3}\r\n\x00\x01\x02')
      })
    })
  })

  describe('asArray option', () => {
    it('should return array when asArray is true', () => {
      const result = compile({ command: 'OK', tag: 'A001' }, { asArray: true })

      expect(Array.isArray(result)).toBe(true)
      expect((result as Buffer[]).length).toBe(1)
      expect((result as Buffer[])[0].toString()).toBe('A001 OK')
    })

    it('should split on literals without plus when asArray is true', () => {
      const result = compile(
        {
          attributes: [{ type: 'LITERAL', value: 'content' }],
          tag: '*',
        },
        { asArray: true },
      )

      expect(Array.isArray(result)).toBe(true)
      expect((result as Buffer[]).length).toBe(2)
      expect((result as Buffer[])[0].toString()).toBe('* {7}\r\n')
      expect((result as Buffer[])[1].toString()).toBe('content')
    })
  })

  describe('isLogging option', () => {
    it('should hide long strings when logging', () => {
      const longString = 'x'.repeat(150)
      const result = compile(
        {
          attributes: [longString],
          tag: '*',
        },
        { isLogging: true },
      )

      expect(result.toString()).toBe('* "(* 150B string *)"')
    })

    it('should show short strings when logging', () => {
      const result = compile(
        {
          attributes: ['short'],
          tag: '*',
        },
        { isLogging: true },
      )

      expect(result.toString()).toBe('* "short"')
    })

    it('should hide long typed STRING when logging', () => {
      const longValue = 'y'.repeat(200)
      const result = compile(
        {
          attributes: [{ type: 'STRING', value: longValue }],
          tag: '*',
        },
        { isLogging: true },
      )

      expect(result.toString()).toBe('* "(* 200B string *)"')
    })

    it('should hide literals when logging', () => {
      const result = compile(
        {
          attributes: [{ type: 'LITERAL', value: 'secret data' }],
          tag: '*',
        },
        { isLogging: true },
      )

      expect(result.toString()).toBe('* "(* 11B literal *)"')
    })

    it('should hide sensitive values when logging', () => {
      const result = compile(
        {
          attributes: [{ sensitive: true, type: 'STRING', value: 'password123' }],
          tag: '*',
        },
        { isLogging: true },
      )

      expect(result.toString()).toBe('* "(* value hidden *)"')
    })
  })

  describe('spacing rules', () => {
    it('should add space between attributes', () => {
      const result = compile({
        attributes: [
          { type: 'ATOM', value: 'A' },
          { type: 'ATOM', value: 'B' },
          { type: 'ATOM', value: 'C' },
        ],
        tag: '*',
      })

      expect(result.toString()).toBe('* A B C')
    })

    it('should add space after literal', () => {
      const result = compile({
        attributes: [
          { type: 'LITERAL', value: 'lit' },
          { type: 'ATOM', value: 'AFTER' },
        ],
        tag: '*',
      })

      expect(result.toString()).toBe('* {3}\r\nlit AFTER')
    })

    it('should not add space after opening bracket', () => {
      const result = compile({
        attributes: [
          {
            section: [{ type: 'ATOM', value: 'X' }],
            type: 'ATOM',
            value: 'BODY',
          },
        ],
        tag: '*',
      })

      expect(result.toString()).toContain('[X]')
      expect(result.toString()).not.toContain('[ X]')
    })

    it('should not add space after opening angle bracket (partial)', () => {
      const result = compile({
        attributes: [
          {
            partial: [0, 100],
            section: [],
            type: 'ATOM',
            value: 'BODY',
          },
        ],
        tag: '*',
      })

      expect(result.toString()).toContain('<0.100>')
    })
  })

  describe('complex IMAP structures', () => {
    it('should compile FETCH response', () => {
      const result = compile({
        attributes: [
          { type: 'ATOM', value: 'FLAGS' },
          [
            { type: 'ATOM', value: '\\Seen' },
            { type: 'ATOM', value: '\\Recent' },
          ],
          { type: 'ATOM', value: 'UID' },
          12_345,
        ],
        command: 'FETCH',
        tag: '*',
      })

      expect(result.toString()).toBe('* FETCH FLAGS (\\Seen \\Recent) UID 12345')
    })

    it('should compile LIST response', () => {
      const result = compile({
        attributes: [
          [{ type: 'ATOM', value: '\\HasNoChildren' }],
          { type: 'STRING', value: '/' },
          { type: 'STRING', value: 'INBOX' },
        ],
        command: 'LIST',
        tag: '*',
      })

      expect(result.toString()).toBe('* LIST (\\HasNoChildren) "/" "INBOX"')
    })

    it('should compile ENVELOPE', () => {
      const result = compile({
        attributes: [
          [
            { type: 'STRING', value: 'Mon, 01 Jan 2024' },
            { type: 'STRING', value: 'Subject' },
            [[null, null, { type: 'STRING', value: 'user' }, { type: 'STRING', value: 'example.com' }]],
          ],
        ],
        tag: '*',
      })

      expect(result.toString()).toContain('("Mon, 01 Jan 2024" "Subject"')
    })

    it('should compile BODYSTRUCTURE', () => {
      const result = compile({
        attributes: [
          [
            { type: 'STRING', value: 'TEXT' },
            { type: 'STRING', value: 'PLAIN' },
            [
              { type: 'STRING', value: 'CHARSET' },
              { type: 'STRING', value: 'UTF-8' },
            ],
            null,
            null,
            { type: 'STRING', value: '7BIT' },
            100,
          ],
        ],
        tag: '*',
      })

      expect(result.toString()).toBe('* ("TEXT" "PLAIN" ("CHARSET" "UTF-8") NIL NIL "7BIT" 100)')
    })
  })

  describe('single attribute (non-array)', () => {
    it('should handle single attribute not in array', () => {
      const result = compile({
        attributes: { type: 'ATOM', value: 'SINGLE' },
        tag: '*',
      })

      expect(result.toString()).toBe('* SINGLE')
    })
  })

  describe('edge cases', () => {
    it('should handle object with buffer property', () => {
      const result = compile({
        attributes: [{ buffer: Buffer.from('test') } as never],
        tag: '*',
      })

      expect(result.toString()).toBe('* "test"')
    })

    it('should handle very deeply nested structures', () => {
      let nested: unknown = { type: 'ATOM', value: 'DEEP' }
      for (let i = 0; i < 10; i++) {
        nested = [nested]
      }

      const result = compile({
        attributes: [nested] as never,
        tag: '*',
      })

      expect(result.toString()).toContain('DEEP')
      expect(result.toString().match(/\(/g)?.length).toBe(10)
    })

    it('should handle unknown type as no-op', () => {
      const result = compile({
        attributes: [{ type: 'UNKNOWN_TYPE', value: 'test' }],
        tag: '*',
      })

      expect(result.toString()).toBe('* ')
    })
  })
})
