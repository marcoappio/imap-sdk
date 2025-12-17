import { encodePath, normalizePath } from '@imap-sdk/core/encoding/path'
import type { MailboxPath, ModSeq, UIDValidity } from '@imap-sdk/types/common'
import { IMAPSDKError } from '@imap-sdk/types/errors'
import type { MailboxInfo } from '@imap-sdk/types/mailbox'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, SelectOptions, SelectResult } from './types'
import { createCommandError } from './utils'

const DIGITS_ONLY = /^\d+$/

type SelectMap = {
  delimiter?: string
  exists?: number
  flags?: Set<string>
  highestModseq?: ModSeq
  listed?: boolean
  mailboxId?: string
  noModseq?: boolean
  path: MailboxPath
  permanentFlags?: Set<string>
  qresync?: boolean
  readOnly?: boolean
  specialUse?: string
  subscribed?: boolean
  uidNext?: number
  uidValidity?: UIDValidity
}

const parseOkSection = (map: SelectMap, section: readonly Token[]): void => {
  if (section.length > 1 && section[0].type === 'ATOM' && typeof section[0].value === 'string') {
    const key = section[0].value.toLowerCase()
    const secondToken = section[1]

    let rawValue: string | readonly string[] | undefined

    if (typeof secondToken.value === 'string') {
      rawValue = secondToken.value
    } else if (Array.isArray(secondToken)) {
      rawValue = secondToken.map(x => (typeof x.value === 'string' ? x.value : '')).filter(Boolean)
    }

    switch (key) {
      case 'highestmodseq': {
        if (typeof rawValue === 'string' && DIGITS_ONLY.test(rawValue)) {
          map.highestModseq = BigInt(rawValue) as ModSeq
        }

        break
      }

      case 'mailboxid': {
        if (Array.isArray(rawValue) && rawValue.length > 0) {
          map.mailboxId = rawValue[0]
        } else if (typeof rawValue === 'string') {
          map.mailboxId = rawValue
        }

        break
      }

      case 'permanentflags': {
        if (Array.isArray(rawValue)) {
          map.permanentFlags = new Set(rawValue)
        }

        break
      }

      case 'uidnext': {
        if (typeof rawValue === 'string') {
          map.uidNext = Number(rawValue)
        }

        break
      }

      case 'uidvalidity': {
        if (typeof rawValue === 'string' && DIGITS_ONLY.test(rawValue)) {
          map.uidValidity = BigInt(rawValue) as UIDValidity
        }

        break
      }

      default: {
        break
      }
    }
  } else if (section.length === 1 && section[0].type === 'ATOM' && typeof section[0].value === 'string') {
    const key = section[0].value.toLowerCase()

    if (key === 'nomodseq') {
      map.noModseq = true
    }
  }
}

export const select = async (ctx: CommandContext, path: string, options: SelectOptions = {}): Promise<SelectResult> => {
  if (ctx.state !== 'AUTHENTICATED' && ctx.state !== 'SELECTED') {
    throw IMAPSDKError.invalidState('Cannot select mailbox: not in AUTHENTICATED or SELECTED state')
  }

  const normalizedPath = normalizePath(path) as MailboxPath

  if (!ctx.folders.has(normalizedPath)) {
    const folders = await ctx.run<{ path: MailboxPath }[]>('LIST', '', path)
    if (folders) {
      for (const folder of folders) {
        ctx.setFolder(folder.path, folder as never)
      }
    }
  }

  const folderListData = ctx.folders.get(normalizedPath)

  const map: SelectMap = { path: normalizedPath }

  if (folderListData) {
    if (folderListData.delimiter) {
      map.delimiter = folderListData.delimiter
    }
    if (folderListData.specialUse) {
      map.specialUse = folderListData.specialUse
    }
    if (folderListData.subscribed) {
      map.subscribed = folderListData.subscribed
    }
    if (folderListData.listed) {
      map.listed = folderListData.listed
    }
  }

  const extraArgs: unknown[] = []

  if (ctx.enabled.has('QRESYNC') && options.changedSince && options.uidValidity) {
    extraArgs.push([
      { type: 'ATOM', value: 'QRESYNC' },
      [
        { type: 'ATOM', value: options.uidValidity.toString() },
        { type: 'ATOM', value: options.changedSince.toString() },
      ],
    ])
    map.qresync = true
  }

  const encodedPath = encodePath({ enabled: ctx.enabled }, normalizedPath)
  const command = options.readOnly ? 'EXAMINE' : 'SELECT'

  const args = [{ type: encodedPath.includes('&') ? 'STRING' : 'ATOM', value: encodedPath } as const, ...extraArgs]

  try {
    const response = await ctx.exec(command, args as never, {
      untagged: {
        EXISTS: untagged => {
          const num = Number(untagged.command)

          if (!Number.isNaN(num)) {
            map.exists = num
          }
        },
        FLAGS: untagged => {
          if (!(untagged.attributes?.length && Array.isArray(untagged.attributes[0]))) {
            return
          }

          const flagList = untagged.attributes[0] as Token[]
          const flags = flagList.map(x => (typeof x.value === 'string' ? x.value : '')).filter(Boolean)

          map.flags = new Set(flags)
        },
        OK: untagged => {
          if (!untagged.attributes?.length) {
            return
          }

          const attr = untagged.attributes[0] as Token

          if (!attr.value && attr.section) {
            parseOkSection(map, attr.section)
          }
        },
      },
    })

    const responseAttr = response.response.attributes?.[0] as Token | undefined

    if (responseAttr?.section?.length) {
      const section = responseAttr.section[0] as Token
      if (section.type === 'ATOM' && typeof section.value === 'string') {
        const status = section.value.toUpperCase()
        map.readOnly = status === 'READ-ONLY'
      }
    }

    if (map.qresync && (options.uidValidity !== map.uidValidity || !map.highestModseq || map.noModseq)) {
      map.qresync = false
    }

    const currentMailbox = ctx.mailbox

    if (currentMailbox && currentMailbox.path !== normalizedPath) {
      ctx.emitMailboxClose(currentMailbox)
    }

    const newMailbox: MailboxInfo = {
      delimiter: map.delimiter ?? '/',
      exists: map.exists ?? 0,
      flags: map.flags ?? new Set(),
      highestModseq: map.highestModseq,
      listed: map.listed,
      mailboxId: map.mailboxId,
      noModseq: map.noModseq,
      path: normalizedPath,
      permanentFlags: map.permanentFlags,
      readOnly: map.readOnly,
      specialUse: map.specialUse,
      subscribed: map.subscribed,
      uidNext: map.uidNext ?? 1,
      uidValidity: map.uidValidity ?? (0n as UIDValidity),
    }

    ctx.setMailbox(newMailbox)

    if (!currentMailbox || currentMailbox.path !== normalizedPath) {
      ctx.emitMailboxOpen(newMailbox)
    }

    response.next()

    return newMailbox
  } catch (error) {
    const cmdError = createCommandError(error)

    if (ctx.state === 'SELECTED') {
      const currentMailbox = ctx.mailbox
      ctx.setMailbox(null)

      if (currentMailbox) {
        ctx.emitMailboxClose(currentMailbox)
      }
    }

    ctx.log.warn({ cid: ctx.id, error: cmdError })
    throw cmdError
  }
}

export const examine = async (
  ctx: CommandContext,
  path: string,
  options: Omit<SelectOptions, 'readOnly'> = {},
): Promise<SelectResult> => select(ctx, path, { ...options, readOnly: true })
