import { formalIMAPSyntax, verify } from '@imap-sdk/core/protocol/formal-syntax'
import type { TokenAttribute } from '@imap-sdk/core/protocol/tokenizer'

export type CompilerResponse = {
  attributes?: CompilerNode | CompilerNode[]
  command?: string
  tag?: string
}

export type CompilerNode =
  | TokenAttribute
  | CompilerNode[]
  | Buffer
  | null
  | number
  | string
  | {
      isLiteral8?: boolean
      partial?: number[]
      section?: CompilerNode[]
      sensitive?: boolean
      type: string
      value: Buffer | string
    }

export type CompilerOptions = {
  asArray?: boolean
  isLogging?: boolean
  literalMinus?: boolean
  literalPlus?: boolean
}

type CompilerContext = {
  isLogging: boolean
  lastType: string
  literalMinus: boolean
  literalPlus: boolean
  resp: Buffer[]
  respParts: Buffer[][]
  useArray: boolean
}

const toBuffer = (entry: Buffer | number | string | null, returnEmpty?: boolean): Buffer | null => {
  if (typeof entry === 'string') {
    return Buffer.from(entry)
  }

  if (typeof entry === 'number') {
    return Buffer.from(entry.toString())
  }

  if (Buffer.isBuffer(entry)) {
    return entry
  }

  if (returnEmpty) {
    return null
  }

  return Buffer.alloc(0)
}

const getLastByte = (resp: Buffer[]): string => {
  const lastEntry = resp.length > 0 ? resp[resp.length - 1] : null

  if (!lastEntry || lastEntry.length === 0) {
    return ''
  }

  const lastByte = lastEntry[lastEntry.length - 1]

  return typeof lastByte === 'number' ? String.fromCharCode(lastByte) : ''
}

const shouldAddSpace = (ctx: CompilerContext, subArray?: boolean): boolean => {
  if (ctx.lastType === 'LITERAL') {
    return true
  }

  if (ctx.resp.length === 0) {
    return false
  }

  if (subArray) {
    return false
  }

  const lastByte = getLastByte(ctx.resp)

  return !['(', '<', '['].includes(lastByte)
}

const compileArray = (node: CompilerNode[], ctx: CompilerContext): void => {
  ctx.lastType = 'LIST'
  ctx.resp.push(Buffer.from('('))

  let subArray = node.length > 1 && Array.isArray(node[0])

  for (const child of node) {
    if (subArray && !Array.isArray(child)) {
      subArray = false
    }

    compileNode(child, ctx, subArray)
  }

  ctx.resp.push(Buffer.from(')'))
}

const compileNull = (ctx: CompilerContext): void => {
  ctx.resp.push(Buffer.from('NIL'))
}

const compileStringOrBuffer = (node: Buffer | string, ctx: CompilerContext): void => {
  if (ctx.isLogging && node.length > 100) {
    ctx.resp.push(Buffer.from(`"(* ${node.length}B string *)"`))
  } else {
    ctx.resp.push(Buffer.from(JSON.stringify(node.toString())))
  }
}

const compileNumber = (node: number, ctx: CompilerContext): void => {
  ctx.resp.push(Buffer.from(String(Math.round(node) || 0)))
}

const compileLiteral = (node: { isLiteral8?: boolean; value: Buffer | string }, ctx: CompilerContext): void => {
  if (ctx.isLogging) {
    const len = node.value ? node.value.length : 0
    ctx.resp.push(Buffer.from(`"(* ${len}B literal *)"`))
    return
  }

  const literalLength = node.value ? Math.max(node.value.length, 0) : 0
  const canAppend = !ctx.useArray || ctx.literalPlus || (ctx.literalMinus && literalLength <= 4096)
  const usePlus = canAppend && (ctx.literalMinus || ctx.literalPlus)

  const prefix = node.isLiteral8 ? '~' : ''
  const suffix = usePlus ? '+' : ''

  ctx.resp.push(Buffer.from(`${prefix}{${literalLength}${suffix}}\r\n`))

  if (canAppend) {
    if (node.value && node.value.length > 0) {
      ctx.resp.push(toBuffer(node.value) ?? Buffer.alloc(0))
    }
  } else {
    ctx.respParts.push(ctx.resp)
    const valueBuffer = toBuffer(node.value, true)
    ctx.resp = valueBuffer ? [valueBuffer] : []
  }
}

const compileString = (node: { value: Buffer | string }, ctx: CompilerContext): void => {
  if (ctx.isLogging && node.value && node.value.length > 100) {
    ctx.resp.push(Buffer.from(`"(* ${node.value.length}B string *)"`))
  } else {
    ctx.resp.push(Buffer.from(JSON.stringify((node.value || '').toString())))
  }
}

const compileText = (node: { value: Buffer | string }, ctx: CompilerContext): void => {
  if (node.value) {
    ctx.resp.push(toBuffer(node.value) ?? Buffer.alloc(0))
  }
}

const compileAtom = (
  node: { partial?: number[]; section?: CompilerNode[]; value: Buffer | string },
  ctx: CompilerContext,
): void => {
  let val = (node.value || '').toString()

  if (!node.section || val) {
    const checkVal = val.charAt(0) === '\\' ? val.slice(1) : val

    if (val === '' || verify(checkVal, formalIMAPSyntax.ATOM_CHAR) >= 0) {
      val = JSON.stringify(val)
    }

    ctx.resp.push(Buffer.from(val))
  }

  if (node.section) {
    ctx.resp.push(Buffer.from('['))

    for (const child of node.section) {
      compileNode(child, ctx)
    }

    ctx.resp.push(Buffer.from(']'))
  }

  if (node.partial) {
    ctx.resp.push(Buffer.from(`<${node.partial.join('.')}>`))
  }
}

const compileTypedNode = (
  node: {
    isLiteral8?: boolean
    partial?: number[]
    section?: CompilerNode[]
    sensitive?: boolean
    type: string
    value: Buffer | string
  },
  ctx: CompilerContext,
): void => {
  ctx.lastType = node.type

  if (ctx.isLogging && node.sensitive) {
    ctx.resp.push(Buffer.from('"(* value hidden *)"'))
    return
  }

  switch (node.type.toUpperCase()) {
    case 'LITERAL': {
      compileLiteral(node, ctx)

      break
    }
    case 'STRING': {
      compileString(node, ctx)

      break
    }
    case 'TEXT':
    case 'SEQUENCE': {
      compileText(node, ctx)

      break
    }
    case 'NUMBER': {
      ctx.resp.push(Buffer.from(String(node.value || 0)))

      break
    }
    case 'ATOM':
    case 'SECTION': {
      compileAtom(node, ctx)

      break
    }
    default: {
      break
    }
  }
}

const compileNode = (node: CompilerNode, ctx: CompilerContext, subArray?: boolean): void => {
  if (shouldAddSpace(ctx, subArray)) {
    ctx.resp.push(Buffer.from(' '))
  }

  let currentNode: CompilerNode = node

  if (currentNode && typeof currentNode === 'object' && 'buffer' in currentNode && !Buffer.isBuffer(currentNode)) {
    currentNode = (currentNode as { buffer: Buffer }).buffer
  }

  if (Array.isArray(currentNode)) {
    compileArray(currentNode, ctx)
    return
  }

  if (
    currentNode === null ||
    (typeof currentNode !== 'string' &&
      typeof currentNode !== 'number' &&
      !Buffer.isBuffer(currentNode) &&
      !currentNode)
  ) {
    compileNull(ctx)
    return
  }

  if (typeof currentNode === 'string' || Buffer.isBuffer(currentNode)) {
    compileStringOrBuffer(currentNode, ctx)
    return
  }

  if (typeof currentNode === 'number') {
    compileNumber(currentNode, ctx)
    return
  }

  if (currentNode.value === null) {
    compileNull(ctx)
    return
  }

  compileTypedNode(currentNode as typeof currentNode & { value: Buffer | string }, ctx)
}

export const compile = (response: CompilerResponse, options: CompilerOptions = {}): Buffer | Buffer[] => {
  const { asArray = false, isLogging = false, literalMinus = false, literalPlus = false } = options

  const ctx: CompilerContext = {
    isLogging,
    lastType: '',
    literalMinus,
    literalPlus,
    resp: [],
    respParts: [],
    useArray: asArray,
  }

  const tagBuffer = toBuffer(response.tag ?? null, true)

  if (tagBuffer) {
    ctx.resp.push(tagBuffer)
  }

  if (response.command) {
    ctx.resp.push(Buffer.from(` ${response.command}`))
  }

  if (response.attributes) {
    const attributes = Array.isArray(response.attributes) ? response.attributes : [response.attributes]
    for (const child of attributes) {
      compileNode(child, ctx)
    }
  }

  if (ctx.resp.length > 0) {
    ctx.respParts.push(ctx.resp)
  }

  const result = ctx.respParts.map(x => Buffer.concat(x))

  return asArray ? result : Buffer.concat(result)
}
