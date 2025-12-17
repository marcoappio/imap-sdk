import { encodePath, normalizePath } from '@imap-sdk/core/encoding/path'
import type { MailboxPath } from '@imap-sdk/types/common'
import { IMAPSDKError } from '@imap-sdk/types/errors'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, CreateResult } from './types'
import { createCommandError, extractResponseInfo } from './utils'

export const create = async (ctx: CommandContext, path: string): Promise<CreateResult> => {
  if (ctx.state !== 'AUTHENTICATED' && ctx.state !== 'SELECTED') {
    throw IMAPSDKError.invalidState('Cannot create mailbox: not in AUTHENTICATED or SELECTED state')
  }

  const normalizedPath = normalizePath(path) as MailboxPath
  const encodedPath = encodePath({ enabled: ctx.enabled }, normalizedPath)

  try {
    const result: CreateResult = {
      created: true,
      path: normalizedPath,
    }

    const response = await ctx.exec('CREATE', [{ type: 'ATOM', value: encodedPath }])
    const section = response.response.attributes?.[0]

    if (section && 'section' in section && section.section?.length) {
      let key: string | undefined

      for (let i = 0; i < section.section.length; i++) {
        const attr = section.section[i] as Token | Token[]

        if (i % 2 === 0) {
          key = 'value' in attr && typeof attr.value === 'string' ? attr.value.toLowerCase() : undefined
        } else if (key === 'mailboxid' && Array.isArray(attr) && attr[0] && typeof attr[0].value === 'string') {
          return { ...result, mailboxId: attr[0].value }
        }
      }
    }

    response.next()

    await ctx.run('SUBSCRIBE', path)

    return result
  } catch (err) {
    const { statusCode } = extractResponseInfo(err)

    if (statusCode === 'ALREADYEXISTS') {
      return { created: false, path: normalizedPath }
    }

    const cmdError = createCommandError(err)
    ctx.log.warn({ cid: ctx.id, error: cmdError })
    throw cmdError
  }
}
