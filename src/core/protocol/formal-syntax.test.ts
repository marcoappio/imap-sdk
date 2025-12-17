import { formalIMAPSyntax, verify } from './formal-syntax'

describe('formalIMAPSyntax', () => {
  describe('ALPHA', () => {
    it('should contain uppercase letters A-Z', () => {
      for (let i = 0x41; i <= 0x5a; i++) {
        expect(formalIMAPSyntax.ALPHA).toContain(String.fromCharCode(i))
      }
    })

    it('should contain lowercase letters a-z', () => {
      for (let i = 0x61; i <= 0x7a; i++) {
        expect(formalIMAPSyntax.ALPHA).toContain(String.fromCharCode(i))
      }
    })

    it('should not contain digits', () => {
      for (let i = 0; i <= 9; i++) {
        expect(formalIMAPSyntax.ALPHA).not.toContain(String(i))
      }
    })
  })

  describe('DIGIT', () => {
    it('should contain digits 0-9', () => {
      for (let i = 0; i <= 9; i++) {
        expect(formalIMAPSyntax.DIGIT).toContain(String(i))
      }
    })

    it('should have length of 10', () => {
      expect(formalIMAPSyntax.DIGIT.length).toBe(10)
    })
  })

  describe('SP', () => {
    it('should be a space character', () => {
      expect(formalIMAPSyntax.SP).toBe(' ')
    })
  })

  describe('DQUOTE', () => {
    it('should be a double quote character', () => {
      expect(formalIMAPSyntax.DQUOTE).toBe('"')
    })
  })

  describe('CHAR', () => {
    it('should contain ASCII characters 0x01-0x7F', () => {
      expect(formalIMAPSyntax.CHAR.length).toBe(127)
      expect(formalIMAPSyntax.CHAR.charCodeAt(0)).toBe(0x01)
      expect(formalIMAPSyntax.CHAR.charCodeAt(126)).toBe(0x7f)
    })

    it('should not contain NUL character', () => {
      expect(formalIMAPSyntax.CHAR).not.toContain('\x00')
    })
  })

  describe('CHAR8', () => {
    it('should contain characters 0x01-0xFF', () => {
      expect(formalIMAPSyntax.CHAR8.length).toBe(255)
      expect(formalIMAPSyntax.CHAR8.charCodeAt(0)).toBe(0x01)
      expect(formalIMAPSyntax.CHAR8.charCodeAt(254)).toBe(0xff)
    })
  })

  describe('CTL', () => {
    it('should contain control characters 0x00-0x1F', () => {
      for (let i = 0x00; i <= 0x1f; i++) {
        expect(formalIMAPSyntax.CTL).toContain(String.fromCharCode(i))
      }
    })

    it('should contain DEL character 0x7F', () => {
      expect(formalIMAPSyntax.CTL).toContain('\x7F')
    })
  })

  describe('LIST_WILDCARDS', () => {
    it('should contain % and *', () => {
      expect(formalIMAPSyntax.LIST_WILDCARDS).toBe('%*')
    })
  })

  describe('QUOTED_SPECIALS', () => {
    it('should contain double quote and backslash', () => {
      expect(formalIMAPSyntax.QUOTED_SPECIALS).toContain('"')
      expect(formalIMAPSyntax.QUOTED_SPECIALS).toContain('\\')
    })
  })

  describe('RESP_SPECIALS', () => {
    it('should be closing bracket', () => {
      expect(formalIMAPSyntax.RESP_SPECIALS).toBe(']')
    })
  })

  describe('ATOM_SPECIALS', () => {
    it('should contain parentheses', () => {
      expect(formalIMAPSyntax.ATOM_SPECIALS).toContain('(')
      expect(formalIMAPSyntax.ATOM_SPECIALS).toContain(')')
    })

    it('should contain curly braces', () => {
      expect(formalIMAPSyntax.ATOM_SPECIALS).toContain('{')
      expect(formalIMAPSyntax.ATOM_SPECIALS).toContain('}')
    })

    it('should contain space', () => {
      expect(formalIMAPSyntax.ATOM_SPECIALS).toContain(' ')
    })

    it('should contain list wildcards', () => {
      expect(formalIMAPSyntax.ATOM_SPECIALS).toContain('%')
      expect(formalIMAPSyntax.ATOM_SPECIALS).toContain('*')
    })

    it('should contain quoted specials', () => {
      expect(formalIMAPSyntax.ATOM_SPECIALS).toContain('"')
      expect(formalIMAPSyntax.ATOM_SPECIALS).toContain('\\')
    })

    it('should contain resp specials', () => {
      expect(formalIMAPSyntax.ATOM_SPECIALS).toContain(']')
    })
  })

  describe('ATOM_CHAR', () => {
    it('should contain alphanumeric characters', () => {
      expect(formalIMAPSyntax.ATOM_CHAR).toContain('A')
      expect(formalIMAPSyntax.ATOM_CHAR).toContain('Z')
      expect(formalIMAPSyntax.ATOM_CHAR).toContain('a')
      expect(formalIMAPSyntax.ATOM_CHAR).toContain('z')
      expect(formalIMAPSyntax.ATOM_CHAR).toContain('0')
      expect(formalIMAPSyntax.ATOM_CHAR).toContain('9')
    })

    it('should not contain ATOM_SPECIALS', () => {
      expect(formalIMAPSyntax.ATOM_CHAR).not.toContain('(')
      expect(formalIMAPSyntax.ATOM_CHAR).not.toContain(')')
      expect(formalIMAPSyntax.ATOM_CHAR).not.toContain('{')
      expect(formalIMAPSyntax.ATOM_CHAR).not.toContain('}')
      expect(formalIMAPSyntax.ATOM_CHAR).not.toContain(' ')
      expect(formalIMAPSyntax.ATOM_CHAR).not.toContain('%')
      expect(formalIMAPSyntax.ATOM_CHAR).not.toContain('*')
      expect(formalIMAPSyntax.ATOM_CHAR).not.toContain('"')
      expect(formalIMAPSyntax.ATOM_CHAR).not.toContain('\\')
      expect(formalIMAPSyntax.ATOM_CHAR).not.toContain(']')
    })
  })

  describe('ASTRING_CHAR', () => {
    it('should include ATOM_CHAR', () => {
      for (const char of formalIMAPSyntax.ATOM_CHAR) {
        expect(formalIMAPSyntax.ASTRING_CHAR).toContain(char)
      }
    })

    it('should include RESP_SPECIALS (])', () => {
      expect(formalIMAPSyntax.ASTRING_CHAR).toContain(']')
    })
  })

  describe('TEXT_CHAR', () => {
    it('should not contain CR', () => {
      expect(formalIMAPSyntax.TEXT_CHAR).not.toContain('\r')
    })

    it('should not contain LF', () => {
      expect(formalIMAPSyntax.TEXT_CHAR).not.toContain('\n')
    })

    it('should contain printable characters', () => {
      expect(formalIMAPSyntax.TEXT_CHAR).toContain('A')
      expect(formalIMAPSyntax.TEXT_CHAR).toContain(' ')
    })
  })

  describe('TAG_CHAR', () => {
    it('should not contain +', () => {
      expect(formalIMAPSyntax.TAG_CHAR).not.toContain('+')
    })

    it('should contain alphanumeric characters', () => {
      expect(formalIMAPSyntax.TAG_CHAR).toContain('A')
      expect(formalIMAPSyntax.TAG_CHAR).toContain('0')
    })
  })

  describe('COMMAND_CHAR', () => {
    it('should contain ALPHA', () => {
      expect(formalIMAPSyntax.COMMAND_CHAR).toContain('A')
      expect(formalIMAPSyntax.COMMAND_CHAR).toContain('Z')
      expect(formalIMAPSyntax.COMMAND_CHAR).toContain('a')
      expect(formalIMAPSyntax.COMMAND_CHAR).toContain('z')
    })

    it('should contain DIGIT', () => {
      expect(formalIMAPSyntax.COMMAND_CHAR).toContain('0')
      expect(formalIMAPSyntax.COMMAND_CHAR).toContain('9')
    })

    it('should contain hyphen', () => {
      expect(formalIMAPSyntax.COMMAND_CHAR).toContain('-')
    })
  })
})

describe('verify', () => {
  it('should return -1 for valid strings', () => {
    expect(verify('ABC', formalIMAPSyntax.ALPHA)).toBe(-1)
    expect(verify('123', formalIMAPSyntax.DIGIT)).toBe(-1)
    expect(verify('Hello', formalIMAPSyntax.ATOM_CHAR)).toBe(-1)
  })

  it('should return index of first invalid character', () => {
    expect(verify('AB1C', formalIMAPSyntax.ALPHA)).toBe(2)
    expect(verify('12a3', formalIMAPSyntax.DIGIT)).toBe(2)
    expect(verify('Hel lo', formalIMAPSyntax.ATOM_CHAR)).toBe(3)
  })

  it('should return 0 if first character is invalid', () => {
    expect(verify('1ABC', formalIMAPSyntax.ALPHA)).toBe(0)
    expect(verify('a123', formalIMAPSyntax.DIGIT)).toBe(0)
  })

  it('should return -1 for empty string', () => {
    expect(verify('', formalIMAPSyntax.ALPHA)).toBe(-1)
  })

  it('should work with TAG_CHAR validation', () => {
    expect(verify('A001', formalIMAPSyntax.TAG_CHAR)).toBe(-1)
    expect(verify('A+01', formalIMAPSyntax.TAG_CHAR)).toBe(1)
  })

  it('should work with COMMAND_CHAR validation', () => {
    expect(verify('LOGIN', formalIMAPSyntax.COMMAND_CHAR)).toBe(-1)
    expect(verify('UID-FETCH', formalIMAPSyntax.COMMAND_CHAR)).toBe(-1)
    expect(verify('LOGIN!', formalIMAPSyntax.COMMAND_CHAR)).toBe(5)
  })

  it('should handle special characters correctly', () => {
    expect(verify('test\r\nmore', formalIMAPSyntax.TEXT_CHAR)).toBe(4)
    expect(verify('test more', formalIMAPSyntax.TEXT_CHAR)).toBe(-1)
  })
})
