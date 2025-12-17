import { formatIMAPDateTime } from '@imap-sdk/core/encoding/date'
import { encodePath, normalizePath } from '@imap-sdk/core/encoding/path'
import type { MailboxPath, UIDValidity } from '@imap-sdk/types/common'
import { IMAPSDKError } from '@imap-sdk/types/errors'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext } from './types'

const FLAG_COLORS: Record<string, string> = {
  blue: '$MailFlagBit2',
  green: '$MailFlagBit1',
  grey: '$MailFlagBit3',
  orange: '$MailFlagBit4',
  purple: '$MailFlagBit6',
  red: '$MailFlagBit0',
  yellow: '$MailFlagBit5',
}

const formatFlag = (flag: string): string => {
  if (flag in FLAG_COLORS) {
    return FLAG_COLORS[flag]
  }

  return flag
}

const canUseFlag = (
  mailbox: { permanentFlags?: ReadonlySet<string>; flags?: ReadonlySet<string> } | null,
  flag: string,
): boolean => {
  if (!mailbox) {
    return true
  }

  if (mailbox.permanentFlags?.has('\\*')) {
    return true
  }

  if (mailbox.permanentFlags?.has(flag)) {
    return true
  }

  if (mailbox.flags?.has(flag)) {
    return true
  }

  return true
}

export type AppendOptions = {
  readonly flags?: string | readonly string[]
  readonly internalDate?: Date
}

export type AppendResult = {
  readonly destination: MailboxPath
  readonly path?: MailboxPath
  readonly seq?: number
  readonly uid?: number
  readonly uidValidity?: UIDValidity
}

export const append = async (
  ctx: CommandContext,
  destination: string,
  content: string | Buffer,
  options: AppendOptions = {},
): Promise<AppendResult> => {
  if ((ctx.state !== 'AUTHENTICATED' && ctx.state !== 'SELECTED') || !destination) {
    throw IMAPSDKError.invalidState('Invalid state for APPEND')
  }

  const contentBuffer = typeof content === 'string' ? Buffer.from(content) : content

  const normalizedDest = normalizePath(destination) as MailboxPath
  const encodedDest = encodePath({ enabled: ctx.enabled }, normalizedDest)

  const expectExists = ctx.mailbox?.path && ctx.mailbox.path.toUpperCase() === normalizedDest.toUpperCase()

  let flagsArray: string[]

  if (Array.isArray(options.flags)) {
    flagsArray = options.flags.map(f => f)
  } else if (typeof options.flags === 'string') {
    flagsArray = [options.flags]
  } else {
    flagsArray = []
  }

  const formattedFlags = flagsArray.map(f => formatFlag(f)).filter(f => f && canUseFlag(ctx.mailbox, f))

  const attributes: unknown[] = [{ type: 'ATOM', value: encodedDest }]

  const idate = options.internalDate ? formatIMAPDateTime(options.internalDate) : undefined

  if (formattedFlags.length > 0 || idate) {
    attributes.push(formattedFlags.map(flag => ({ type: 'ATOM', value: flag })))
  }

  if (idate) {
    attributes.push({ type: 'STRING', value: idate })
  }

  let isLiteral8 = false

  if (ctx.capabilities.has('BINARY')) {
    isLiteral8 = contentBuffer.includes(0)
  }

  attributes.push({ isLiteral8, type: 'LITERAL', value: contentBuffer })

  const map: AppendResult = { destination: normalizedDest }

  if (ctx.mailbox?.path) {
    ;(map as Record<string, unknown>).path = ctx.mailbox.path
  }

  try {
    const response = await ctx.exec('APPEND', attributes as never, {
      untagged: expectExists
        ? {
            EXISTS: untagged => {
              const seq = Number(untagged.command)
              ;(map as Record<string, unknown>).seq = seq

              if (expectExists && ctx.mailbox) {
                const prevCount = ctx.mailbox.exists ?? 0
                if (seq !== prevCount) {
                  ctx.emitExists({ count: seq, path: ctx.mailbox.path, prevCount })
                }
              }
            },
          }
        : {},
    })

    const section = response.response.attributes?.[0]

    if (section && 'section' in section && section.section?.length) {
      const tokens = section.section as Token[]
      const responseCode = typeof tokens[0]?.value === 'string' ? tokens[0].value : ''

      if (responseCode.toUpperCase() === 'APPENDUID') {
        const uidValidityValue = tokens[1]?.value
        const uidValue = tokens[2]?.value

        if (typeof uidValidityValue === 'string' && !Number.isNaN(Number(uidValidityValue))) {
          ;(map as Record<string, unknown>).uidValidity = BigInt(uidValidityValue) as UIDValidity
        }

        if (typeof uidValue === 'string' && !Number.isNaN(Number(uidValue))) {
          ;(map as Record<string, unknown>).uid = Number(uidValue)
        }
      }
    }

    response.next()

    if (expectExists && !map.seq) {
      try {
        const noopResponse = await ctx.exec('NOOP', [], {
          comment: 'Sequence not found from APPEND output',
          untagged: {
            EXISTS: untagged => {
              const seq = Number(untagged.command)
              ;(map as Record<string, unknown>).seq = seq

              if (expectExists && ctx.mailbox) {
                const prevCount = ctx.mailbox.exists ?? 0
                if (seq !== prevCount) {
                  ctx.emitExists({ count: seq, path: ctx.mailbox.path, prevCount })
                }
              }
            },
          },
        })

        noopResponse.next()
      } catch (error) {
        ctx.log.warn({ cid: ctx.id, error })
      }
    }

    if (map.seq && !map.uid) {
      const list = await ctx.run<readonly number[] | false>('SEARCH', { seq: map.seq }, { uid: true })
      if (list && list.length > 0) {
        ;(map as Record<string, unknown>).uid = list[0]
      }
    }

    return map
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    throw error
  }
}
