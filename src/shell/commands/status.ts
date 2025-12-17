import { encodePath, normalizePath } from '@imap-sdk/core/encoding/path'
import type { MailboxPath, ModSeq, UIDValidity } from '@imap-sdk/types/common'
import type { StatusInfo } from '@imap-sdk/types/mailbox'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, StatusQueryOptions, StatusResult } from './types'

export const status = async (
  ctx: CommandContext,
  path: string,
  query: StatusQueryOptions,
): Promise<StatusResult | false> => {
  if ((ctx.state !== 'AUTHENTICATED' && ctx.state !== 'SELECTED') || !path) {
    return false
  }

  const normalizedPath = normalizePath(path) as MailboxPath
  const encodedPath = encodePath({ enabled: ctx.enabled }, normalizedPath)

  const queryAttributes: { type: 'ATOM'; value: string }[] = []

  for (const [key, enabled] of Object.entries(query)) {
    if (!enabled) {
      continue
    }

    const upperKey = key.toUpperCase()
    switch (upperKey) {
      case 'MESSAGES':
      case 'RECENT':
      case 'UIDNEXT':
      case 'UIDVALIDITY':
      case 'UNSEEN': {
        queryAttributes.push({ type: 'ATOM', value: upperKey })

        break
      }
      case 'HIGHESTMODSEQ': {
        if (ctx.capabilities.has('CONDSTORE')) {
          queryAttributes.push({ type: 'ATOM', value: upperKey })
        }

        break
      }
      default: {
        break
      }
    }
  }

  if (queryAttributes.length === 0) {
    return false
  }

  const attributes = [{ type: encodedPath.includes('&') ? 'STRING' : 'ATOM', value: encodedPath }, queryAttributes]

  const map: StatusInfo = { path: normalizedPath }
  const updateCurrent = ctx.state === 'SELECTED' && normalizedPath === ctx.mailbox?.path

  try {
    const response = await ctx.exec('STATUS', attributes as never, {
      untagged: {
        STATUS: untagged => {
          const list =
            untagged.attributes && Array.isArray(untagged.attributes[1]) ? (untagged.attributes[1] as Token[]) : null

          if (!list) {
            return
          }

          let key: string | undefined

          for (let i = 0; i < list.length; i += 1) {
            const entry = list[i]

            if (i % 2 === 0) {
              key = typeof entry?.value === 'string' ? entry.value : undefined
              continue
            }

            if (!key || typeof entry?.value !== 'string') {
              continue
            }

            const value = entry.value

            switch (key.toUpperCase()) {
              case 'MESSAGES': {
                const messages = Number.isNaN(Number(value)) ? undefined : Number(value)

                if (messages !== undefined) {
                  ;(map as Record<string, unknown>).messages = messages
                  if (updateCurrent && ctx.mailbox) {
                    const prevCount = ctx.mailbox.exists ?? 0
                    if (prevCount !== messages) {
                      ctx.emitExists({ count: messages, path: normalizedPath, prevCount })
                    }
                  }
                }

                break
              }
              case 'RECENT':
                if (!Number.isNaN(Number(value))) {
                  ;(map as Record<string, unknown>).recent = Number(value)
                }

                break
              case 'UIDNEXT':
                if (!Number.isNaN(Number(value))) {
                  ;(map as Record<string, unknown>).uidNext = Number(value)
                }

                break
              case 'UIDVALIDITY':
                if (!Number.isNaN(Number(value))) {
                  ;(map as Record<string, unknown>).uidValidity = BigInt(value) as UIDValidity
                }

                break
              case 'UNSEEN':
                if (!Number.isNaN(Number(value))) {
                  ;(map as Record<string, unknown>).unseen = Number(value)
                }

                break
              case 'HIGHESTMODSEQ':
                if (!Number.isNaN(Number(value))) {
                  ;(map as Record<string, unknown>).highestModseq = BigInt(value) as ModSeq
                }

                break
              default: {
                break
              }
            }
          }
        },
      },
    })

    response.next()

    return map
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
