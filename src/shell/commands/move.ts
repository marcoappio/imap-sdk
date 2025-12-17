import { encodePath, normalizePath } from '@imap-sdk/core/encoding/path'
import type { MailboxPath, UIDValidity } from '@imap-sdk/types/common'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, MoveOptions, MoveResult } from './types'

const DIGITS_ONLY = /^\d+$/

const expandRange = (rangeStr: string): number[] => {
  const result: number[] = []
  const parts = rangeStr.split(',')

  for (const part of parts) {
    if (part.includes(':')) {
      const [start, end] = part.split(':').map(Number)

      if (!(Number.isNaN(start) || Number.isNaN(end))) {
        const min = Math.min(start, end)
        const max = Math.max(start, end)
        for (let i = min; i <= max; i++) {
          result.push(i)
        }
      }
    } else {
      const num = Number(part)

      if (!Number.isNaN(num)) {
        result.push(num)
      }
    }
  }

  return result
}

const parseCopyUidResponse = (
  section: readonly Token[],
  basePath: MailboxPath,
  destination: MailboxPath,
): MoveResult => {
  const result: MoveResult = { destination, path: basePath }
  const responseCode = section[0]?.value

  if (responseCode !== 'COPYUID') {
    return result
  }

  const uidValidityStr = section[1]?.value

  if (typeof uidValidityStr !== 'string' || !DIGITS_ONLY.test(uidValidityStr)) {
    return result
  }

  const withUidValidity = { ...result, uidValidity: BigInt(uidValidityStr) as UIDValidity }

  const sourceUidsStr = section[2]?.value
  const destUidsStr = section[3]?.value

  if (typeof sourceUidsStr === 'string' && typeof destUidsStr === 'string') {
    const sourceUids = expandRange(sourceUidsStr)
    const destUids = expandRange(destUidsStr)

    if (sourceUids.length === destUids.length) {
      const uidMap = new Map<number, number>()
      for (let i = 0; i < sourceUids.length; i++) {
        uidMap.set(sourceUids[i], destUids[i])
      }
      return { ...withUidValidity, uidMap }
    }
  }

  return withUidValidity
}

export const move = async (
  ctx: CommandContext,
  range: string,
  destination: string,
  options: MoveOptions = {},
): Promise<MoveResult> => {
  if (ctx.state !== 'SELECTED' || !range || !destination) {
    return false
  }

  const normalizedDest = normalizePath(destination) as MailboxPath
  const encodedDest = encodePath({ enabled: ctx.enabled }, normalizedDest)
  const basePath = ctx.mailbox?.path ?? ('' as MailboxPath)

  if (!ctx.capabilities.has('MOVE')) {
    const copyResult = await ctx.run<MoveResult>('COPY', range, destination, options)
    await ctx.run('DELETE', range, { ...options, silent: true })
    return copyResult
  }

  const attributes = [
    { type: 'SEQUENCE' as const, value: range },
    { type: 'ATOM' as const, value: encodedDest },
  ]

  let result: MoveResult = { destination: normalizedDest, path: basePath }

  try {
    const response = await ctx.exec(options.uid ? 'UID MOVE' : 'MOVE', attributes, {
      untagged: {
        OK: untagged => {
          const section = untagged.attributes?.[0]
          if (section && 'section' in section && section.section?.length) {
            result = parseCopyUidResponse(section.section as Token[], basePath, normalizedDest)
          }
        },
      },
    })

    response.next()

    const section = response.response.attributes?.[0]

    if (section && 'section' in section && section.section?.length) {
      result = parseCopyUidResponse(section.section as Token[], basePath, normalizedDest)
    }

    return result
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
