import libmime from 'libmime'

import type { Envelope } from '@imap-sdk/core/envelope/parser'
import { parseEnvelope } from '@imap-sdk/core/envelope/parser'
import type { TokenAttribute } from '@imap-sdk/core/protocol/tokenizer'

export type BodyStructure = {
  childNodes?: BodyStructure[]
  description?: string
  disposition?: string
  dispositionParameters?: Record<string, string>
  encoding?: string
  envelope?: Envelope
  id?: string
  language?: string[]
  lineCount?: number
  location?: string
  md5?: string
  parameters?: Record<string, string>
  part?: string
  size?: number
  type: string
}

type BodyNode = TokenAttribute | BodyNode[] | null

const getStructuredParams = (arr: BodyNode): Record<string, string> => {
  if (!Array.isArray(arr)) {
    return {}
  }

  const params: Record<string, string> = {}
  let key = ''

  for (let i = 0; i < arr.length; i += 1) {
    const val = arr[i]
    if (i % 2 === 1) {
      const value = val && !Array.isArray(val) && val.value ? val.value.toString() : ''
      params[key] = libmime.decodeWords(value)
    } else {
      key = val && !Array.isArray(val) && val.value ? val.value.toString().toLowerCase() : ''
    }
  }

  return params
}

const getStringValue = (node: BodyNode): string => {
  if (!node || Array.isArray(node)) {
    return ''
  }
  return (node.value ?? '').toString()
}

const getNumberValue = (node: BodyNode): number => {
  if (!node || Array.isArray(node)) {
    return 0
  }
  return Number(node.value) || 0
}

const parseMultipart = (
  node: BodyNode[],
  path: number[],
  walk: (n: BodyNode[], p: number[]) => BodyStructure,
): BodyStructure => {
  const curNode: BodyStructure = { type: '' }
  let idx = 0
  let part = 0

  if (path.length) {
    curNode.part = path.join('.')
  }

  curNode.childNodes = []
  while (Array.isArray(node[idx])) {
    part += 1
    curNode.childNodes.push(walk(node[idx] as BodyNode[], [...path, part]))
    idx += 1
  }

  curNode.type = `multipart/${getStringValue(node[idx]).toLowerCase()}`
  idx += 1

  if (idx < node.length - 1) {
    if (node[idx]) {
      curNode.parameters = getStructuredParams(node[idx])
    }
    idx += 1
  }

  return parseExtensionData(curNode, node, idx)
}

const parseSinglePart = (
  node: BodyNode[],
  path: number[],
  walk: (n: BodyNode[], p: number[]) => BodyStructure,
): BodyStructure => {
  const curNode: BodyStructure = { type: '' }
  let idx = 0

  if (path.length) {
    curNode.part = path.join('.')
  }

  const majorType = getStringValue(node[idx]).toLowerCase()
  idx += 1
  const minorType = getStringValue(node[idx]).toLowerCase()
  idx += 1
  curNode.type = `${majorType}/${minorType}`

  if (node[idx]) {
    curNode.parameters = getStructuredParams(node[idx])
  }
  idx += 1

  if (node[idx]) {
    curNode.id = getStringValue(node[idx])
  }
  idx += 1

  if (node[idx]) {
    curNode.description = getStringValue(node[idx])
  }
  idx += 1

  if (node[idx]) {
    curNode.encoding = getStringValue(node[idx]).toLowerCase()
  }
  idx += 1

  if (node[idx]) {
    curNode.size = getNumberValue(node[idx])
  }
  idx += 1

  if (curNode.type === 'message/rfc822') {
    if (node[idx] && Array.isArray(node[idx])) {
      curNode.envelope = parseEnvelope(node[idx] as TokenAttribute[])
    }
    idx += 1

    if (node[idx] && Array.isArray(node[idx])) {
      curNode.childNodes = [walk(node[idx] as BodyNode[], path)]
    }
    idx += 1

    if (node[idx]) {
      curNode.lineCount = getNumberValue(node[idx])
    }
    idx += 1
  }

  if (curNode.type.startsWith('text/')) {
    const isInvalidStructure = node.length === 11 && Array.isArray(node[idx + 1]) && !Array.isArray(node[idx + 2])
    if (!isInvalidStructure) {
      if (node[idx]) {
        curNode.lineCount = getNumberValue(node[idx])
      }
      idx += 1
    }
  }

  if (idx < node.length - 1) {
    if (node[idx]) {
      curNode.md5 = getStringValue(node[idx]).toLowerCase()
    }
    idx += 1
  }

  return parseExtensionData(curNode, node, idx)
}

const parseExtensionData = (curNode: BodyStructure, node: BodyNode[], startIdx: number): BodyStructure => {
  let idx = startIdx

  if (idx < node.length - 1) {
    if (Array.isArray(node[idx]) && (node[idx] as BodyNode[]).length) {
      const dispNode = node[idx] as BodyNode[]
      curNode.disposition = getStringValue(dispNode[0]).toLowerCase()
      if (Array.isArray(dispNode[1])) {
        curNode.dispositionParameters = getStructuredParams(dispNode[1])
      }
    }
    idx += 1
  }

  if (idx < node.length - 1) {
    if (node[idx]) {
      const langNode = node[idx]
      if (Array.isArray(langNode)) {
        curNode.language = langNode.map(x => getStringValue(x).toLowerCase()).filter(Boolean)
      } else {
        const lang = getStringValue(langNode).toLowerCase()
        if (lang) {
          curNode.language = [lang]
        }
      }
    }
    idx += 1
  }

  if (idx < node.length - 1 && node[idx]) {
    curNode.location = getStringValue(node[idx])
  }

  return curNode
}

export const parseBodystructure = (entry: BodyNode): BodyStructure => {
  const walk = (node: BodyNode[], path: number[]): BodyStructure => {
    if (Array.isArray(node[0])) {
      return parseMultipart(node, path, walk)
    }
    return parseSinglePart(node, path, walk)
  }

  if (!Array.isArray(entry)) {
    return { type: '' }
  }

  return walk(entry, [])
}
