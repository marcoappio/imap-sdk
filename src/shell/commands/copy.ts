import { encodePath, normalizePath } from '@imap-sdk/core/encoding/path'
import type { MailboxPath, UIDValidity } from '@imap-sdk/types/common'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, CopyOptions, CopyResult } from './types'

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

export const copy = async (
  ctx: CommandContext,
  range: string,
  destination: string,
  options: CopyOptions = {},
): Promise<CopyResult> => {
  if (ctx.state !== 'SELECTED' || !range || !destination) {
    return false
  }

  const normalizedDest = normalizePath(destination) as MailboxPath
  const encodedDest = encodePath({ enabled: ctx.enabled }, normalizedDest)

  const attributes = [
    { type: 'SEQUENCE' as const, value: range },
    { type: 'ATOM' as const, value: encodedDest },
  ]

  try {
    const response = await ctx.exec(options.uid ? 'UID COPY' : 'COPY', attributes)
    response.next()

    const result: CopyResult = {
      destination: normalizedDest,
      path: ctx.mailbox?.path ?? ('' as MailboxPath),
    }

    const section = response.response.attributes?.[0]

    if (section && 'section' in section && section.section?.length) {
      const tokens = section.section as Token[]
      const responseCode = tokens[0]?.value

      if (responseCode === 'COPYUID') {
        const uidValidityStr = tokens[1]?.value

        if (typeof uidValidityStr === 'string' && DIGITS_ONLY.test(uidValidityStr)) {
          const withUidValidity = { ...result, uidValidity: BigInt(uidValidityStr) as UIDValidity }

          const sourceUidsStr = tokens[2]?.value
          const destUidsStr = tokens[3]?.value

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
      }
    }

    return result
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
