import { decodePath, encodePath, normalizePath } from '@imap-sdk/core/encoding/path'
import { detectSpecialUse, type SpecialUseFlag } from '@imap-sdk/core/special-use'
import type { MailboxPath, ModSeq, UIDValidity } from '@imap-sdk/types/common'
import type { StatusInfo } from '@imap-sdk/types/mailbox'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, ListOptions, ListResult, StatusQueryOptions } from './types'

const FLAG_SORT_ORDER: readonly string[] = [
  '\\Inbox',
  '\\Flagged',
  '\\Sent',
  '\\Drafts',
  '\\All',
  '\\Archive',
  '\\Junk',
  '\\Trash',
]
const SOURCE_SORT_ORDER: readonly string[] = ['user', 'extension', 'name']

type SpecialUseSource = 'user' | 'extension' | 'name'

type ListEntry = {
  path: MailboxPath
  pathAsListed: string
  flags: Set<string>
  delimiter: string
  listed?: boolean
  subscribed?: boolean
  parentPath: string
  parent: string[]
  name: string
  specialUse?: SpecialUseFlag
  specialUseSource?: SpecialUseSource
  status?: StatusInfo | { error: unknown }
}

type SpecialUseMatch = {
  entry: ListEntry
  source: SpecialUseSource
}

const buildStatusQueryAttributes = (
  ctx: CommandContext,
  statusQuery?: StatusQueryOptions,
): { type: 'ATOM'; value: string }[] => {
  const attrs: { type: 'ATOM'; value: string }[] = []

  if (!statusQuery) {
    return attrs
  }

  for (const [key, enabled] of Object.entries(statusQuery)) {
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
        attrs.push({ type: 'ATOM', value: upperKey })

        break
      }
      case 'HIGHESTMODSEQ': {
        if (ctx.capabilities.has('CONDSTORE')) {
          attrs.push({ type: 'ATOM', value: upperKey })
        }

        break
      }
      default: {
        break
      }
    }
  }

  return attrs
}

const parseStatusList = (statusPath: MailboxPath, statusList: Token[]): StatusInfo => {
  const result: Record<string, unknown> = { path: statusPath }

  let key: string | undefined

  for (let i = 0; i < statusList.length; i += 1) {
    const entry = statusList[i]

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
        result.messages = Number.isNaN(Number(value)) ? undefined : Number(value)

        break
      }
      case 'RECENT': {
        result.recent = Number.isNaN(Number(value)) ? undefined : Number(value)

        break
      }
      case 'UIDNEXT': {
        result.uidNext = Number.isNaN(Number(value)) ? undefined : Number(value)

        break
      }
      case 'UIDVALIDITY': {
        result.uidValidity = Number.isNaN(Number(value)) ? undefined : (BigInt(value) as UIDValidity)

        break
      }
      case 'UNSEEN': {
        result.unseen = Number.isNaN(Number(value)) ? undefined : Number(value)

        break
      }
      case 'HIGHESTMODSEQ': {
        result.highestModseq = Number.isNaN(Number(value)) ? undefined : (BigInt(value) as ModSeq)

        break
      }
      default: {
        break
      }
    }
  }

  return result as StatusInfo
}

export const list = async (
  ctx: CommandContext,
  reference: string,
  mailbox: string,
  options: ListOptions = {},
): Promise<ListResult> => {
  const listCommand = ctx.capabilities.has('XLIST') && !ctx.capabilities.has('SPECIAL-USE') ? 'XLIST' : 'LIST'

  const entries: ListEntry[] = []
  const statusMap = new Map<MailboxPath, StatusInfo>()
  const specialUseMatches: Record<string, SpecialUseMatch[]> = {}

  const addSpecialUseMatch = (entry: ListEntry, type: string, source: SpecialUseSource): void => {
    if (!specialUseMatches[type]) {
      specialUseMatches[type] = []
    }
    specialUseMatches[type].push({ entry, source })
  }

  const specialUseHints: Record<string, SpecialUseFlag> = {}

  if (options.specialUseHints && typeof options.specialUseHints === 'object') {
    for (const type of ['sent', 'junk', 'trash', 'drafts', 'archive'] as const) {
      const hint = options.specialUseHints[type]
      if (hint && typeof hint === 'string') {
        const normalizedHint = normalizePath(hint) as MailboxPath
        specialUseHints[normalizedHint] = `\\${type.charAt(0).toUpperCase()}${type.slice(1)}` as SpecialUseFlag
      }
    }
  }

  const statusQueryAttributes = buildStatusQueryAttributes(ctx, options.statusQuery)

  const returnArgs: unknown[] = []

  if (listCommand === 'LIST' && ctx.capabilities.has('LIST-STATUS') && statusQueryAttributes.length > 0) {
    returnArgs.push({ type: 'ATOM', value: 'STATUS' }, statusQueryAttributes)

    if (ctx.capabilities.has('SPECIAL-USE')) {
      returnArgs.push({ type: 'ATOM', value: 'SPECIAL-USE' })
    }
  }

  const runList = async (ref: string, mb: string): Promise<void> => {
    const cmdArgs: unknown[] = [encodePath({ enabled: ctx.enabled }, ref), encodePath({ enabled: ctx.enabled }, mb)]

    if (returnArgs.length > 0) {
      cmdArgs.push({ type: 'ATOM', value: 'RETURN' }, returnArgs)
    }

    const response = await ctx.exec(listCommand, cmdArgs as never, {
      untagged: {
        [listCommand]: untagged => {
          if (!untagged.attributes?.length) {
            return
          }

          const pathValue = (untagged.attributes[2] as Token)?.value ?? ''
          const decodedPath = decodePath({ enabled: ctx.enabled }, String(pathValue))
          let path = normalizePath(decodedPath) as MailboxPath

          const flagsArr = untagged.attributes[0] as unknown as Token[]
          const entry: ListEntry = {
            delimiter: String((untagged.attributes[1] as Token)?.value ?? ''),
            flags: new Set(flagsArr.map(e => String(e.value))),
            listed: true,
            name: '',
            parent: [],
            parentPath: '',
            path,
            pathAsListed: String(pathValue),
          }

          if (specialUseHints[entry.path]) {
            addSpecialUseMatch(entry, specialUseHints[entry.path], 'user')
          }

          if (listCommand === 'XLIST' && entry.flags.has('\\Inbox')) {
            entry.flags.delete('\\Inbox')
            if (entry.path !== 'INBOX') {
              addSpecialUseMatch(entry, '\\Inbox', 'extension')
            }
          }

          if (entry.path.toUpperCase() === 'INBOX') {
            addSpecialUseMatch(entry, '\\Inbox', 'name')
          }

          if (entry.delimiter && entry.path.charAt(0) === entry.delimiter) {
            path = entry.path.slice(1) as MailboxPath
            entry.path = path
          }

          entry.parentPath =
            entry.delimiter && entry.path ? entry.path.slice(0, entry.path.lastIndexOf(entry.delimiter)) : ''
          entry.parent = entry.delimiter ? entry.path.split(entry.delimiter) : [entry.path]
          entry.name = entry.parent.pop() ?? ''

          const { flag: specialUseFlag, source: flagSource } = detectSpecialUse(
            ctx.capabilities.has('XLIST') || ctx.capabilities.has('SPECIAL-USE'),
            entry,
          )

          if (specialUseFlag && flagSource) {
            addSpecialUseMatch(entry, specialUseFlag, flagSource)
          }

          entries.push(entry)
        },
        STATUS: untagged => {
          const pathValue = (untagged.attributes?.[0] as Token)?.value
          if (typeof pathValue !== 'string') {
            return
          }

          const statusPath = normalizePath(decodePath({ enabled: ctx.enabled }, pathValue)) as MailboxPath
          const statusList = untagged.attributes?.[1]

          if (!(Array.isArray(statusList) && statusPath)) {
            return
          }

          const status = parseStatusList(statusPath, statusList as Token[])
          statusMap.set(statusPath, status)
        },
      },
    })

    response.next()
  }

  try {
    const normalizedReference = normalizePath(reference || '')
    await runList(normalizedReference, normalizePath(mailbox || '', undefined, true))

    if (options.listOnly) {
      return entries as unknown as ListResult
    }

    if (normalizedReference && !specialUseMatches['\\Inbox']) {
      await runList('', 'INBOX')
    }

    if (options.statusQuery) {
      for (const entry of entries) {
        if (!(entry.flags.has('\\Noselect') || entry.flags.has('\\NonExistent'))) {
          if (statusMap.has(entry.path)) {
            entry.status = statusMap.get(entry.path)
          } else if (statusMap.size === 0) {
            try {
              entry.status = await ctx.run<StatusInfo>('STATUS', entry.path, options.statusQuery)
            } catch (error) {
              entry.status = { error }
            }
          }
        }
      }
    }

    const lsubRef = encodePath({ enabled: ctx.enabled }, normalizePath(reference || ''))
    const lsubMb = encodePath({ enabled: ctx.enabled }, normalizePath(mailbox || '', undefined, true))

    const lsubResponse = await ctx.exec('LSUB', [lsubRef, lsubMb] as never, {
      untagged: {
        LSUB: untagged => {
          if (!untagged.attributes?.length) {
            return
          }

          const pathValue = (untagged.attributes[2] as Token)?.value ?? ''
          const decodedPath = decodePath({ enabled: ctx.enabled }, String(pathValue))
          let path = normalizePath(decodedPath) as MailboxPath

          const lsubFlagsArr = untagged.attributes[0] as unknown as Token[]
          const entry: ListEntry = {
            delimiter: String((untagged.attributes[1] as Token)?.value ?? ''),
            flags: new Set(lsubFlagsArr.map(e => String(e.value))),
            name: '',
            parent: [],
            parentPath: '',
            path,
            pathAsListed: String(pathValue),
            subscribed: true,
          }

          if (entry.path.toUpperCase() === 'INBOX') {
            addSpecialUseMatch(entry, '\\Inbox', 'name')
          }

          if (entry.delimiter && entry.path.charAt(0) === entry.delimiter) {
            path = entry.path.slice(1) as MailboxPath
            entry.path = path
          }

          entry.parentPath =
            entry.delimiter && entry.path ? entry.path.slice(0, entry.path.lastIndexOf(entry.delimiter)) : ''
          entry.parent = entry.delimiter ? entry.path.split(entry.delimiter) : [entry.path]
          entry.name = entry.parent.pop() ?? ''

          const existing = entries.find(e => e.path === entry.path)

          if (existing) {
            existing.subscribed = true
            for (const flag of entry.flags) {
              existing.flags.add(flag)
            }
          }
        },
      },
    })

    lsubResponse.next()

    for (const type of Object.keys(specialUseMatches)) {
      const sortedEntries = specialUseMatches[type].sort((a, b) => {
        const aSource = SOURCE_SORT_ORDER.indexOf(a.source)
        const bSource = SOURCE_SORT_ORDER.indexOf(b.source)
        if (aSource === bSource) {
          return a.entry.path.localeCompare(b.entry.path)
        }
        return aSource - bSource
      })

      if (!sortedEntries[0].entry.specialUse) {
        sortedEntries[0].entry.specialUse = type as SpecialUseFlag
        sortedEntries[0].entry.specialUseSource = sortedEntries[0].source
      }
    }

    const inboxEntry = entries.find(entry => entry.specialUse === '\\Inbox')

    if (inboxEntry && !inboxEntry.subscribed) {
      inboxEntry.subscribed = true
    }

    return entries.sort((a, b) => {
      if (a.specialUse && !b.specialUse) {
        return -1
      }

      if (!a.specialUse && b.specialUse) {
        return 1
      }

      if (a.specialUse && b.specialUse) {
        return FLAG_SORT_ORDER.indexOf(a.specialUse) - FLAG_SORT_ORDER.indexOf(b.specialUse)
      }

      const aList = [...a.parent, a.name]
      const bList = [...b.parent, b.name]

      for (let i = 0; i < aList.length; i += 1) {
        const aPart = aList[i]
        const bPart = bList[i]
        if (aPart !== bPart) {
          return aPart.localeCompare(bPart || '')
        }
      }

      return a.path.localeCompare(b.path)
    }) as unknown as ListResult
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error, msg: 'Failed to list folders' })
    throw error
  }
}
