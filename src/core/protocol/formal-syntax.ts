const expandRange = (start: number, end: number): string => {
  const chars: number[] = []

  for (let i = start; i <= end; i++) {
    chars.push(i)
  }

  return String.fromCharCode(...chars)
}

const excludeChars = (source: string, exclude: string): string => {
  const sourceArr = source.split('')

  for (let i = sourceArr.length - 1; i >= 0; i--) {
    if (exclude.includes(sourceArr[i])) {
      sourceArr.splice(i, 1)
    }
  }

  return sourceArr.join('')
}

const CHAR = expandRange(0x01, 0x7f)
const CHAR8 = expandRange(0x01, 0xff)
const SP = ' '
const CTL = `${expandRange(0x00, 0x1f)}\x7F`
const DQUOTE = '"'
const ALPHA = `${expandRange(0x41, 0x5a)}${expandRange(0x61, 0x7a)}`
const DIGIT = expandRange(0x30, 0x39)
const LIST_WILDCARDS = '%*'
const QUOTED_SPECIALS = `${DQUOTE}\\`
const RESP_SPECIALS = ']'
const ATOM_SPECIALS = `(){}${SP}${CTL}${LIST_WILDCARDS}${QUOTED_SPECIALS}${RESP_SPECIALS}`
const ATOM_CHAR = excludeChars(CHAR, ATOM_SPECIALS)
const ASTRING_CHAR = `${ATOM_CHAR}${RESP_SPECIALS}`
const TEXT_CHAR = excludeChars(CHAR, '\r\n')
const TAG_CHAR = excludeChars(ASTRING_CHAR, '+')
const COMMAND_CHAR = `${ALPHA}${DIGIT}-`

export const formalIMAPSyntax = {
  ALPHA,
  ASTRING_CHAR,
  ATOM_CHAR,
  ATOM_SPECIALS,
  CHAR,
  CHAR8,
  COMMAND_CHAR,
  CTL,
  DIGIT,
  DQUOTE,
  LIST_WILDCARDS,
  QUOTED_SPECIALS,
  RESP_SPECIALS,
  SP,
  TAG_CHAR,
  TEXT_CHAR,
} as const

export const verify = (str: string, allowedChars: string): number => {
  for (let i = 0; i < str.length; i++) {
    if (!allowedChars.includes(str.charAt(i))) {
      return i
    }
  }

  return -1
}
