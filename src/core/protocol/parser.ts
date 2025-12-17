import { formalIMAPSyntax, verify } from '@imap-sdk/core/protocol/formal-syntax'
import type { TokenAttribute, TokenizerOptions } from '@imap-sdk/core/protocol/tokenizer'
import { tokenize } from '@imap-sdk/core/protocol/tokenizer'
import { ParserError } from '@imap-sdk/types/errors'
import type { Result } from '@imap-sdk/types/result'
import { Err, Ok } from '@imap-sdk/types/result'

export type ParsedResponse = {
  attributes?: TokenAttribute[]
  command: string
  nullBytesRemoved?: number
  tag: string
}

export type ParserOptions = TokenizerOptions

type ParserContext = {
  humanReadable: string
  input: string
  options: ParserOptions
  pos: number
  remainder: string
  tag: string
}

const STATUS_COMMANDS = ['OK', 'NO', 'BAD', 'PREAUTH', 'BYE']
const COMPOUND_COMMANDS = ['UID', 'AUTHENTICATE']

const RE_WHITESPACE_START = /^\s/
const RE_ELEMENT = /^\s*[^\s]+(?=\s|$)/
const RE_BRACKET_START = /^\s+\[/

const removeNullBytes = (input: string): { cleaned: string; nullBytesRemoved: number } => {
  if (input.length === 0 || input.charCodeAt(0) !== 0) {
    return { cleaned: input, nullBytesRemoved: 0 }
  }

  let firstNonNull = -1

  for (let i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) !== 0) {
      firstNonNull = i
      break
    }
  }

  if (firstNonNull === -1) {
    return { cleaned: '', nullBytesRemoved: input.length }
  }

  return { cleaned: input.slice(firstNonNull), nullBytesRemoved: firstNonNull }
}

const getElement = (ctx: ParserContext, syntax: string): Result<string, ParserError> => {
  if (RE_WHITESPACE_START.test(ctx.remainder)) {
    return Err(new ParserError('E1', `Unexpected whitespace at position ${ctx.pos}`, ctx.pos, ctx.input))
  }

  const match = ctx.remainder.match(RE_ELEMENT)

  if (!match) {
    return Err(new ParserError('E3', `Unexpected end of input at position ${ctx.pos}`, ctx.pos, ctx.input))
  }

  const element = match[0]
  const errPos = verify(element, syntax)

  if (errPos >= 0) {
    if (ctx.tag === 'Server' && element === 'Unavailable.') {
      return Ok(element)
    }
    return Err(
      new ParserError(
        'E2',
        `Unexpected char at position ${ctx.pos + errPos}: ${JSON.stringify(element.charAt(errPos))}`,
        ctx.pos + errPos,
        ctx.input,
      ),
    )
  }

  ctx.pos += match[0].length
  ctx.remainder = ctx.remainder.slice(match[0].length)

  return Ok(element)
}

const getSpace = (ctx: ParserContext): Result<void, ParserError> => {
  if (ctx.remainder.length === 0) {
    if (ctx.tag === '+' && ctx.pos === 1) {
      return Ok(undefined)
    }
    return Err(new ParserError('E4', `Unexpected end of input at position ${ctx.pos}`, ctx.pos, ctx.input))
  }

  if (verify(ctx.remainder.charAt(0), formalIMAPSyntax.SP) >= 0) {
    return Err(
      new ParserError(
        'E5',
        `Unexpected char at position ${ctx.pos}: ${JSON.stringify(ctx.remainder.charAt(0))}`,
        ctx.pos,
        ctx.input,
      ),
    )
  }

  ctx.pos += 1
  ctx.remainder = ctx.remainder.slice(1)

  return Ok(undefined)
}

const getTag = (ctx: ParserContext): Result<string, ParserError> => {
  const syntax = `${formalIMAPSyntax.TAG_CHAR}*+`
  const result = getElement(ctx, syntax)

  if (!result.ok) {
    return result
  }

  ctx.tag = result.value
  return result
}

const extractHumanReadable = (ctx: ParserContext): void => {
  const match = ctx.remainder.match(RE_BRACKET_START)

  if (!match) {
    ctx.humanReadable = ctx.remainder.trim()
    ctx.remainder = ''
    return
  }

  let nesting = 1

  for (let i = match[0].length; i <= ctx.remainder.length; i++) {
    const c = ctx.remainder[i]
    if (c === '[') {
      nesting += 1
    } else if (c === ']') {
      nesting -= 1
    }
    if (nesting === 0) {
      ctx.humanReadable = ctx.remainder.slice(i + 1).trim()
      ctx.remainder = ctx.remainder.slice(0, i + 1)
      return
    }
  }

  ctx.humanReadable = ctx.remainder.trim()
  ctx.remainder = ''
}

const getCommand = (ctx: ParserContext): Result<string, ParserError> => {
  if (ctx.tag === '+') {
    ctx.humanReadable = ctx.remainder.trim()
    ctx.remainder = ''
    return Ok('')
  }

  const result = getElement(ctx, formalIMAPSyntax.COMMAND_CHAR)

  if (!result.ok) {
    return result
  }

  const command = result.value.toUpperCase()

  if (STATUS_COMMANDS.includes(command)) {
    extractHumanReadable(ctx)
  }

  return Ok(result.value)
}

const getAttributes = (ctx: ParserContext, command: string): Result<TokenAttribute[], ParserError> => {
  if (ctx.remainder.length === 0) {
    return Err(new ParserError('E6', `Unexpected end of input at position ${ctx.pos}`, ctx.pos, ctx.input))
  }

  if (RE_WHITESPACE_START.test(ctx.remainder)) {
    return Err(new ParserError('E7', `Unexpected whitespace at position ${ctx.pos}`, ctx.pos, ctx.input))
  }

  const tokenizerOptions: TokenizerOptions = {
    ...ctx.options,
    command,
  }

  return tokenize(ctx.remainder, tokenizerOptions)
}

export const parse = (input: string | Buffer, options: ParserOptions = {}): Result<ParsedResponse, ParserError> => {
  const inputStr = Buffer.isBuffer(input) ? input.toString() : input
  const { cleaned, nullBytesRemoved } = removeNullBytes(inputStr)

  if (cleaned.length === 0 && nullBytesRemoved > 0) {
    return Ok({ attributes: [], command: 'BAD', tag: '*' })
  }

  const ctx: ParserContext = {
    humanReadable: '',
    input: cleaned,
    options,
    pos: 0,
    remainder: cleaned,
    tag: '',
  }

  const response: ParsedResponse = { command: '', tag: '' }

  const tagResult = getTag(ctx)

  if (!tagResult.ok) {
    return tagResult
  }

  response.tag = tagResult.value

  const spaceResult = getSpace(ctx)

  if (!spaceResult.ok) {
    return spaceResult
  }

  const commandResult = getCommand(ctx)

  if (!commandResult.ok) {
    return commandResult
  }

  response.command = commandResult.value

  if (nullBytesRemoved > 0) {
    response.nullBytesRemoved = nullBytesRemoved
  }

  if (COMPOUND_COMMANDS.includes(response.command.toUpperCase())) {
    const spaceResult2 = getSpace(ctx)

    if (!spaceResult2.ok) {
      return spaceResult2
    }

    const subCommandResult = getElement(ctx, formalIMAPSyntax.COMMAND_CHAR)

    if (!subCommandResult.ok) {
      return subCommandResult
    }

    response.command = `${response.command} ${subCommandResult.value}`
  }

  if (ctx.remainder.trim().length > 0) {
    const spaceResult3 = getSpace(ctx)

    if (!spaceResult3.ok) {
      return spaceResult3
    }

    const attrsResult = getAttributes(ctx, response.command)

    if (!attrsResult.ok) {
      return attrsResult
    }

    response.attributes = attrsResult.value
  }

  if (ctx.humanReadable) {
    response.attributes = [...(response.attributes ?? []), { type: 'TEXT', value: ctx.humanReadable }]
  }

  return Ok(response)
}
