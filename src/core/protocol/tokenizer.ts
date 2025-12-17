import { formalIMAPSyntax } from '@imap-sdk/core/protocol/formal-syntax'
import { ParserError } from '@imap-sdk/types/errors'
import type { Result } from '@imap-sdk/types/result'
import { Err, Ok } from '@imap-sdk/types/result'

const STATE_ATOM = 0x0_01
const STATE_LITERAL = 0x0_02
const STATE_NORMAL = 0x0_03
const STATE_PARTIAL = 0x0_04
const STATE_SEQUENCE = 0x0_05
const STATE_STRING = 0x0_06

const RE_DIGITS = /^\d+$/
const RE_SINGLE_DIGIT = /^\d$/

const MAX_NODE_DEPTH = 25

type TokenNode = {
  childNodes: TokenNode[]
  chBuffer?: Buffer
  chPos?: number
  depth: number
  endPos?: number
  isClosed: boolean
  literalLength?: string | number
  literalPlus?: boolean
  literalType?: string
  parentNode?: TokenNode
  partial?: number[]
  section?: TokenAttribute[]
  started?: boolean
  startPos?: number
  type: string | false
  value: string | Buffer
}

export type TokenAttribute = {
  partial?: number[]
  section?: TokenAttribute[]
  type: string
  value: string | Buffer | null
}

export type TokenizerOptions = {
  command?: string
  literalPlus?: boolean
  literals?: Buffer[]
}

type ParseContext = {
  command: string
  currentNode: TokenNode
  expectedLiteralType: string | false
  i: number
  options: TokenizerOptions
  pos: number
  state: number
  str: string
  tree: TokenNode
}

const createNode = (parentNode: TokenNode | undefined, startPos: number | undefined, depth: number): TokenNode => ({
  childNodes: [],
  depth,
  isClosed: true,
  type: false,
  value: '',
  ...(parentNode && { parentNode }),
  ...(typeof startPos === 'number' && { startPos }),
})

const checkMaxDepth = (depth: number, str: string): void => {
  if (depth > MAX_NODE_DEPTH) {
    const error = new Error('Too much nesting in IMAP string')
    ;(error as Error & { _imapStr: string; code: string }).code = 'MAX_IMAP_NESTING_REACHED'
    ;(error as Error & { _imapStr: string; code: string })._imapStr = str
    throw error
  }
}

const getParent = (node: TokenNode): TokenNode => {
  if (!node.parentNode) {
    throw new ParserError('E_INTERNAL', 'Expected parent node but none found')
  }

  return node.parentNode
}

const getGrandparent = (node: TokenNode): TokenNode => getParent(getParent(node))

type Branch = (TokenAttribute | TokenAttribute[] | null)[]

const handleListOrSequenceNode = (node: TokenNode, branch: Branch): void => {
  const type = (node.type || '').toString().toUpperCase()
  switch (type) {
    case 'LITERAL':
    case 'STRING':
    case 'SEQUENCE': {
      branch.push({ type, value: node.value })

      break
    }
    case 'ATOM': {
      if ((node.value as string).toUpperCase() === 'NIL') {
        branch.push(null)
      } else {
        branch.push({ type, value: node.value })
      }

      break
    }
    default: {
      break
    }
  }
}

const handleSectionNode = (branch: Branch): Branch => {
  const lastItem = branch[branch.length - 1] as TokenAttribute

  if (lastItem) {
    lastItem.section = []
    return lastItem.section
  }

  return branch
}

const handleListNode = (branch: Branch): Branch => {
  const elm: TokenAttribute[] = []
  branch.push(elm as unknown as TokenAttribute)
  return elm
}

const handlePartialNode = (node: TokenNode, branch: Branch): void => {
  const lastItem = branch[branch.length - 1] as TokenAttribute

  if (lastItem) {
    lastItem.partial = (node.value as string).split('.').map(Number)
  }
}

const buildAttributes = (tree: TokenNode): TokenAttribute[] => {
  const attributes: TokenAttribute[] = []
  let branch: Branch = attributes

  const processNode = (node: TokenNode, curBranch: Branch): Branch => {
    if (!node.isClosed && node.type === 'SEQUENCE' && node.value === '*') {
      node.isClosed = true
      node.type = 'ATOM'
    }

    if (!node.isClosed) {
      throw new ParserError('E9', 'Unexpected end of input', node.endPos)
    }

    const type = (node.type || '').toString().toUpperCase()

    switch (type) {
      case 'LITERAL':
      case 'STRING':
      case 'SEQUENCE':
      case 'ATOM': {
        handleListOrSequenceNode(node, curBranch)
        return curBranch
      }
      case 'SECTION': {
        return handleSectionNode(curBranch)
      }
      case 'LIST': {
        return handleListNode(curBranch)
      }
      case 'PARTIAL': {
        handlePartialNode(node, curBranch)
        return curBranch
      }
      default: {
        return curBranch
      }
    }
  }

  const walk = (node: TokenNode): void => {
    const curBranch = branch
    branch = processNode(node, branch)

    for (const childNode of node.childNodes) {
      walk(childNode)
    }

    branch = curBranch
  }

  walk(tree)
  return attributes
}

const skipSpaces = (str: string, idx: number): number => {
  let result = idx

  while (str.charAt(result + 1) === ' ') {
    result += 1
  }

  return result
}

const closeCurrentNode = (ctx: ParseContext): void => {
  ctx.currentNode.isClosed = true
  ctx.currentNode = getParent(ctx.currentNode)
  ctx.state = STATE_NORMAL
  ctx.i = skipSpaces(ctx.str, ctx.i)
}

const handleStringChar = (chr: string, ctx: ParseContext): Result<boolean, ParserError> => {
  if (chr === '"') {
    ctx.currentNode.endPos = ctx.pos + ctx.i
    closeCurrentNode(ctx)
    return Ok(true)
  }

  if (chr === '\\') {
    ctx.i += 1
    if (ctx.i >= ctx.str.length) {
      return Err(
        new ParserError('E18', `Unexpected end of input at position ${ctx.pos + ctx.i}`, ctx.pos + ctx.i, ctx.str),
      )
    }
    ctx.currentNode.value += ctx.str.charAt(ctx.i)
    return Ok(true)
  }

  ctx.currentNode.value += chr
  return Ok(true)
}

const handlePartialChar = (chr: string, ctx: ParseContext): Result<boolean, ParserError> => {
  const nodeValue = ctx.currentNode.value as string
  const errPos = ctx.pos + ctx.i

  if (chr === '>') {
    if (nodeValue.at(-1) === '.') {
      return Err(new ParserError('E19', `Unexpected end of partial at position ${errPos}`, errPos, ctx.str))
    }

    ctx.currentNode.endPos = errPos
    closeCurrentNode(ctx)
    return Ok(true)
  }

  if (chr === '.' && (!nodeValue.length || nodeValue.includes('.'))) {
    return Err(new ParserError('E20', `Unexpected partial separator . at position ${errPos}`, errPos, ctx.str))
  }

  if (!formalIMAPSyntax.DIGIT.includes(chr) && chr !== '.') {
    return Err(new ParserError('E21', `Unexpected char at position ${errPos}: ${JSON.stringify(chr)}`, errPos, ctx.str))
  }

  if ((nodeValue === '0' || nodeValue.endsWith('.0')) && chr !== '.') {
    return Err(new ParserError('E22', `Invalid partial at position ${errPos}: ${JSON.stringify(chr)}`, errPos, ctx.str))
  }

  ctx.currentNode.value += chr
  return Ok(true)
}

const handleLiteralStarted = (chr: string, ctx: ParseContext): void => {
  const chBuffer = ctx.currentNode.chBuffer
  const chPos = ctx.currentNode.chPos ?? 0

  if (chBuffer) {
    chBuffer[chPos] = chr.charCodeAt(0)
  }

  ctx.currentNode.chPos = chPos + 1

  const literalLength = ctx.currentNode.literalLength as number
  if (ctx.currentNode.chPos >= literalLength) {
    ctx.currentNode.endPos = ctx.pos + ctx.i
    ctx.currentNode.isClosed = true
    ctx.currentNode.value = ctx.currentNode.chBuffer?.toString('binary') ?? ''
    ctx.currentNode.chBuffer = Buffer.alloc(0)
    ctx.currentNode = getParent(ctx.currentNode)
    ctx.state = STATE_NORMAL
    ctx.i = skipSpaces(ctx.str, ctx.i)
  }
}

const handleLiteralClose = (ctx: ParseContext): Result<boolean, ParserError> => {
  const errPos = ctx.pos + ctx.i

  if (!('literalLength' in ctx.currentNode) || ctx.currentNode.literalLength === undefined) {
    return Err(new ParserError('E23', `Unexpected literal prefix end char } at position ${errPos}`, errPos, ctx.str))
  }

  if (ctx.str.charAt(ctx.i + 1) === '\n') {
    ctx.i += 1
  } else if (ctx.str.charAt(ctx.i + 1) === '\r' && ctx.str.charAt(ctx.i + 2) === '\n') {
    ctx.i += 2
  } else {
    return Err(new ParserError('E24', `Unexpected char at position ${errPos}: "}"`, errPos, ctx.str))
  }

  ctx.currentNode.literalLength = Number(ctx.currentNode.literalLength)

  if (!ctx.currentNode.literalLength) {
    ctx.currentNode.endPos = ctx.pos + ctx.i
    ctx.currentNode.isClosed = true
    ctx.currentNode.value = ''
    ctx.currentNode = getParent(ctx.currentNode)
    ctx.state = STATE_NORMAL
    ctx.i = skipSpaces(ctx.str, ctx.i)
  } else if (ctx.options.literals && ctx.options.literals.length > 0) {
    const literal = ctx.options.literals.shift()

    if (literal) {
      ctx.currentNode.value = literal
      ctx.currentNode.endPos = ctx.pos + ctx.i + literal.length
    }

    ctx.currentNode.started = false
    ctx.currentNode.isClosed = true
    ctx.currentNode = getParent(ctx.currentNode)
    ctx.state = STATE_NORMAL
    ctx.i = skipSpaces(ctx.str, ctx.i)
  } else {
    ctx.currentNode.started = true
    ctx.currentNode.chBuffer = Buffer.alloc(ctx.currentNode.literalLength)
    ctx.currentNode.chPos = 0
  }

  return Ok(true)
}

const handleLiteralChar = (chr: string, ctx: ParseContext): Result<boolean, ParserError> => {
  if (ctx.currentNode.started) {
    handleLiteralStarted(chr, ctx)
    return Ok(true)
  }

  if (chr === '+' && ctx.options.literalPlus) {
    ctx.currentNode.literalPlus = true
    return Ok(true)
  }

  if (chr === '}') {
    return handleLiteralClose(ctx)
  }

  const errPos = ctx.pos + ctx.i

  if (!formalIMAPSyntax.DIGIT.includes(chr)) {
    return Err(new ParserError('E25', `Unexpected char at position ${errPos}: ${JSON.stringify(chr)}`, errPos, ctx.str))
  }

  if (ctx.currentNode.literalLength === '0') {
    return Err(new ParserError('E26', `Invalid literal at position ${errPos}`, errPos, ctx.str))
  }

  ctx.currentNode.literalLength = (ctx.currentNode.literalLength || '') + chr

  return Ok(true)
}

const validateSequenceSpace = (nodeValue: string, errPos: number, str: string): Result<boolean, ParserError> => {
  const lastChar = nodeValue.at(-1)

  if (!RE_SINGLE_DIGIT.test(lastChar || '') && lastChar !== '*') {
    return Err(new ParserError('E27', `Unexpected whitespace at position ${errPos}`, errPos, str))
  }

  const secondLastChar = nodeValue.at(-2)

  if (nodeValue !== '*' && lastChar === '*' && secondLastChar !== ':') {
    return Err(new ParserError('E28', `Unexpected whitespace at position ${errPos}`, errPos, str))
  }

  return Ok(true)
}

type SeqCharInfo = {
  chr: string
  errPos: number
  lastChar: string | undefined
  secondLastChar: string | undefined
  str: string
}

const validateSeqColon = (info: SeqCharInfo): Result<boolean, ParserError> | null => {
  if (info.chr !== ':') {
    return null
  }

  if (!RE_SINGLE_DIGIT.test(info.lastChar || '') && info.lastChar !== '*') {
    return Err(new ParserError('E29', `Unexpected range separator : at position ${info.errPos}`, info.errPos, info.str))
  }

  return Ok(true)
}

const validateSeqAsterisk = (info: SeqCharInfo): Result<boolean, ParserError> | null => {
  if (info.chr !== '*') {
    return null
  }

  if (![',', ':'].includes(info.lastChar || '')) {
    return Err(new ParserError('E30', `Unexpected range wildcard at position ${info.errPos}`, info.errPos, info.str))
  }

  return Ok(true)
}

const validateSeqComma = (info: SeqCharInfo): Result<boolean, ParserError> | null => {
  if (info.chr !== ',') {
    return null
  }

  if (!RE_SINGLE_DIGIT.test(info.lastChar || '') && info.lastChar !== '*') {
    return Err(
      new ParserError('E31', `Unexpected sequence separator , at position ${info.errPos}`, info.errPos, info.str),
    )
  }

  if (info.lastChar === '*' && info.secondLastChar !== ':') {
    return Err(
      new ParserError('E32', `Unexpected sequence separator , at position ${info.errPos}`, info.errPos, info.str),
    )
  }

  return Ok(true)
}

const validateSeqDigit = (info: SeqCharInfo): Result<boolean, ParserError> => {
  if (!RE_SINGLE_DIGIT.test(info.chr)) {
    return Err(
      new ParserError(
        'E33',
        `Unexpected char at position ${info.errPos}: ${JSON.stringify(info.chr)}`,
        info.errPos,
        info.str,
      ),
    )
  }

  return Ok(true)
}

const validateSequenceSpecialChar = (info: SeqCharInfo): Result<boolean, ParserError> =>
  validateSeqColon(info) ?? validateSeqAsterisk(info) ?? validateSeqComma(info) ?? validateSeqDigit(info)

const handleSequenceChar = (chr: string, ctx: ParseContext): Result<boolean, ParserError> => {
  const nodeValue = ctx.currentNode.value as string
  const errPos = ctx.pos + ctx.i

  if (chr === ' ') {
    const validationResult = validateSequenceSpace(nodeValue, errPos, ctx.str)

    if (!validationResult.ok) {
      return validationResult
    }

    ctx.currentNode.isClosed = true
    ctx.currentNode.endPos = errPos - 1
    ctx.currentNode = getParent(ctx.currentNode)
    ctx.state = STATE_NORMAL

    return Ok(true)
  }

  if (ctx.currentNode.parentNode && chr === ']' && ctx.currentNode.parentNode.type === 'SECTION') {
    ctx.currentNode.endPos = errPos - 1
    ctx.currentNode.isClosed = true
    ctx.currentNode = ctx.currentNode.parentNode
    ctx.currentNode.isClosed = true
    ctx.currentNode.endPos = errPos
    ctx.currentNode = getParent(ctx.currentNode)
    ctx.state = STATE_NORMAL
    ctx.i = skipSpaces(ctx.str, ctx.i)

    return Ok(true)
  }

  const lastChar = nodeValue.at(-1)
  const secondLastChar = nodeValue.at(-2)

  const validationResult = validateSequenceSpecialChar({ chr, errPos, lastChar, secondLastChar, str: ctx.str })

  if (!validationResult.ok) {
    return validationResult
  }

  if (RE_SINGLE_DIGIT.test(chr) && lastChar === '*') {
    return Err(
      new ParserError('E34', `Unexpected number at position ${errPos}: ${JSON.stringify(chr)}`, errPos, ctx.str),
    )
  }

  ctx.currentNode.value += chr

  return Ok(true)
}

const handleAtomChar = (chr: string, ctx: ParseContext): Result<boolean, ParserError> => {
  const nodeValue = ctx.currentNode.value as string
  const errPos = ctx.pos + ctx.i

  if (chr === ' ') {
    ctx.currentNode.endPos = errPos - 1
    closeCurrentNode(ctx)

    return Ok(true)
  }

  if (
    ctx.currentNode.parentNode &&
    ((chr === ')' && ctx.currentNode.parentNode.type === 'LIST') ||
      (chr === ']' && ctx.currentNode.parentNode.type === 'SECTION'))
  ) {
    ctx.currentNode.endPos = errPos - 1
    ctx.currentNode.isClosed = true
    ctx.currentNode = ctx.currentNode.parentNode
    ctx.currentNode.isClosed = true
    ctx.currentNode.endPos = errPos
    ctx.currentNode = getParent(ctx.currentNode)
    ctx.state = STATE_NORMAL
    ctx.i = skipSpaces(ctx.str, ctx.i)

    return Ok(true)
  }

  if ((chr === ',' || chr === ':') && RE_DIGITS.test(nodeValue)) {
    ctx.currentNode.type = 'SEQUENCE'
    ctx.currentNode.isClosed = true
    ctx.state = STATE_SEQUENCE
  }

  if (chr === '[' && ['BODY', 'BODY.PEEK', 'BINARY', 'BINARY.PEEK'].includes(nodeValue.toUpperCase())) {
    ctx.currentNode.endPos = errPos
    ctx.currentNode.isClosed = true

    const parent = getParent(ctx.currentNode)
    const sectionNode = createNode(parent, errPos, ctx.currentNode.depth)
    parent.childNodes.push(sectionNode)
    sectionNode.type = 'SECTION'
    sectionNode.isClosed = false
    ctx.currentNode = sectionNode
    ctx.state = STATE_NORMAL

    return Ok(true)
  }

  if (
    !formalIMAPSyntax.ATOM_CHAR.includes(chr) &&
    chr.charCodeAt(0) < 0x80 &&
    chr !== ']' &&
    !(chr === '*' && nodeValue === '\\') &&
    !['NO', 'BAD', 'OK'].includes(ctx.command)
  ) {
    return Err(new ParserError('E16', `Unexpected char at position ${errPos}: ${JSON.stringify(chr)}`, errPos, ctx.str))
  }

  if (nodeValue === '\\*') {
    return Err(new ParserError('E17', `Unexpected char at position ${errPos}: ${JSON.stringify(chr)}`, errPos, ctx.str))
  }

  ctx.currentNode.value += chr

  return Ok(true)
}

const createChildNode = (ctx: ParseContext, type: string, isClosed = true): TokenNode => {
  const newNode = createNode(ctx.currentNode, ctx.pos + ctx.i, ctx.currentNode.depth + 1)
  checkMaxDepth(newNode.depth, ctx.str)
  ctx.currentNode.childNodes.push(newNode)
  newNode.type = type
  newNode.isClosed = isClosed

  return newNode
}

const handleNormalQuote = (ctx: ParseContext): void => {
  ctx.currentNode = createChildNode(ctx, 'string', false)
  ctx.state = STATE_STRING
}

const handleNormalOpenParen = (ctx: ParseContext): void => {
  ctx.currentNode = createChildNode(ctx, 'LIST', false)
}

const handleNormalCloseParen = (ctx: ParseContext): Result<boolean, ParserError> => {
  if (ctx.currentNode.type !== 'LIST') {
    return Err(
      new ParserError('E10', `Unexpected list terminator ) at position ${ctx.pos + ctx.i}`, ctx.pos + ctx.i, ctx.str),
    )
  }

  ctx.currentNode.endPos = ctx.pos + ctx.i
  closeCurrentNode(ctx)

  return Ok(true)
}

const handleNormalCloseSquare = (ctx: ParseContext): Result<boolean, ParserError> => {
  if (ctx.currentNode.type !== 'SECTION') {
    return Err(
      new ParserError(
        'E11',
        `Unexpected section terminator ] at position ${ctx.pos + ctx.i}`,
        ctx.pos + ctx.i,
        ctx.str,
      ),
    )
  }

  ctx.currentNode.endPos = ctx.pos + ctx.i
  closeCurrentNode(ctx)

  return Ok(true)
}

const handleNormalLessThan = (ctx: ParseContext): void => {
  if (ctx.str.charAt(ctx.i - 1) !== ']') {
    const newNode = createChildNode(ctx, 'ATOM')
    newNode.value = '<'
    ctx.currentNode = newNode
    ctx.state = STATE_ATOM
  } else {
    ctx.currentNode = createChildNode(ctx, 'PARTIAL', false)
    ctx.state = STATE_PARTIAL
  }
}

const handleNormalTilde = (ctx: ParseContext): Result<boolean, ParserError> => {
  const nextChr = ctx.str.charAt(ctx.i + 1)

  if (nextChr !== '{') {
    if (formalIMAPSyntax.ATOM_CHAR.includes(nextChr)) {
      const newNode = createChildNode(ctx, 'ATOM')
      newNode.value = '~'
      ctx.currentNode = newNode
      ctx.state = STATE_ATOM
      return Ok(true)
    }
    return Err(
      new ParserError('E12', `Unexpected literal8 marker at position ${ctx.pos + ctx.i}`, ctx.pos + ctx.i, ctx.str),
    )
  }

  ctx.expectedLiteralType = 'literal8'

  return Ok(true)
}

const handleNormalOpenBrace = (ctx: ParseContext): void => {
  const newNode = createChildNode(ctx, 'LITERAL', false)
  newNode.literalType = ctx.expectedLiteralType || 'literal'
  ctx.expectedLiteralType = false
  ctx.currentNode = newNode
  ctx.state = STATE_LITERAL
}

const handleNormalAsterisk = (ctx: ParseContext): void => {
  const newNode = createChildNode(ctx, 'SEQUENCE', false)
  newNode.value = '*'
  ctx.currentNode = newNode
  ctx.state = STATE_SEQUENCE
}

const handleNormalOpenSquare = (ctx: ParseContext): void => {
  if (!['OK', 'NO', 'BAD', 'BYE', 'PREAUTH'].includes(ctx.command.toUpperCase()) || ctx.currentNode !== ctx.tree) {
    return
  }

  ctx.currentNode.endPos = ctx.pos + ctx.i

  const atomNode = createChildNode(ctx, 'ATOM')
  const sectionNode = createNode(atomNode, ctx.pos + ctx.i, atomNode.depth + 1)
  checkMaxDepth(sectionNode.depth, ctx.str)
  atomNode.childNodes.push(sectionNode)
  sectionNode.type = 'SECTION'
  sectionNode.isClosed = false
  ctx.currentNode = sectionNode

  if (ctx.str.substring(ctx.i + 1, ctx.i + 10).toUpperCase() !== 'REFERRAL ') {
    return
  }

  const referralNode = createNode(ctx.currentNode, ctx.pos + ctx.i + 1, ctx.currentNode.depth + 1)
  checkMaxDepth(referralNode.depth, ctx.str)
  ctx.currentNode.childNodes.push(referralNode)
  referralNode.type = 'ATOM'
  referralNode.endPos = ctx.pos + ctx.i + 8
  referralNode.value = 'REFERRAL'
  referralNode.isClosed = true

  const urlNode = createNode(ctx.currentNode, ctx.pos + ctx.i + 10, ctx.currentNode.depth + 1)
  checkMaxDepth(urlNode.depth, ctx.str)
  ctx.currentNode.childNodes.push(urlNode)
  urlNode.type = 'ATOM'

  const closeBracket = ctx.str.indexOf(']', ctx.i + 10)
  ctx.i = closeBracket
  urlNode.endPos = ctx.pos + ctx.i - 1
  const urlStartPos = urlNode.startPos ?? 0
  urlNode.value = ctx.str.substring(urlStartPos - ctx.pos, urlNode.endPos - ctx.pos + 1)
  urlNode.isClosed = true

  ctx.currentNode.isClosed = true
  ctx.currentNode = getGrandparent(ctx.currentNode)

  ctx.i = skipSpaces(ctx.str, ctx.i)
}

const handleNormalDefault = (chr: string, ctx: ParseContext): Result<boolean, ParserError> => {
  if (!formalIMAPSyntax.ATOM_CHAR.includes(chr) && chr !== '\\' && chr !== '%' && chr.charCodeAt(0) < 0x80) {
    return Err(
      new ParserError(
        'E13',
        `Unexpected char at position ${ctx.pos + ctx.i}: ${JSON.stringify(chr)}`,
        ctx.pos + ctx.i,
        ctx.str,
      ),
    )
  }

  const newNode = createChildNode(ctx, 'ATOM')
  newNode.value = chr
  ctx.currentNode = newNode
  ctx.state = STATE_ATOM

  return Ok(true)
}

const handleNormalChar = (chr: string, ctx: ParseContext): Result<boolean, ParserError> => {
  switch (chr) {
    case '"': {
      handleNormalQuote(ctx)
      return Ok(true)
    }
    case '(': {
      handleNormalOpenParen(ctx)
      return Ok(true)
    }
    case ')': {
      return handleNormalCloseParen(ctx)
    }
    case ']': {
      return handleNormalCloseSquare(ctx)
    }
    case '<': {
      handleNormalLessThan(ctx)
      return Ok(true)
    }
    case '~': {
      return handleNormalTilde(ctx)
    }
    case '{': {
      handleNormalOpenBrace(ctx)
      return Ok(true)
    }
    case '*': {
      handleNormalAsterisk(ctx)
      return Ok(true)
    }
    case ' ': {
      return Ok(true)
    }
    case '[': {
      handleNormalOpenSquare(ctx)
      return Ok(true)
    }
    default: {
      return handleNormalDefault(chr, ctx)
    }
  }
}

const processChar = (chr: string, ctx: ParseContext): Result<boolean, ParserError> => {
  switch (ctx.state) {
    case STATE_NORMAL: {
      return handleNormalChar(chr, ctx)
    }
    case STATE_ATOM: {
      return handleAtomChar(chr, ctx)
    }
    case STATE_STRING: {
      return handleStringChar(chr, ctx)
    }
    case STATE_PARTIAL: {
      return handlePartialChar(chr, ctx)
    }
    case STATE_LITERAL: {
      return handleLiteralChar(chr, ctx)
    }
    case STATE_SEQUENCE: {
      return handleSequenceChar(chr, ctx)
    }
    default: {
      return Ok(true)
    }
  }
}

export const tokenize = (str: string, options: TokenizerOptions = {}): Result<TokenAttribute[], ParserError> => {
  try {
    const tree = createNode(undefined, undefined, 0)
    tree.type = 'TREE'

    const ctx: ParseContext = {
      command: options.command || '',
      currentNode: tree,
      expectedLiteralType: false,
      i: 0,
      options,
      pos: 0,
      state: STATE_NORMAL,
      str,
      tree,
    }

    for (ctx.i = 0; ctx.i < str.length; ctx.i += 1) {
      const chr = str.charAt(ctx.i)
      const result = processChar(chr, ctx)
      if (!result.ok) {
        return result
      }
    }

    if (ctx.currentNode !== tree) {
      ctx.currentNode.isClosed = true
    }

    return Ok(buildAttributes(tree))
  } catch (error) {
    if (error instanceof ParserError) {
      return Err(error)
    }

    return Err(new ParserError('UNKNOWN', error instanceof Error ? error.message : String(error)))
  }
}
