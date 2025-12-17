import { encodePath, normalizePath } from '@imap-sdk/core/encoding/path'
import type { MailboxPath } from '@imap-sdk/types/common'
import { IMAPSDKError } from '@imap-sdk/types/errors'

import type { CommandContext, DeleteResult } from './types'
import { createCommandError } from './utils'

export const deleteMailbox = async (ctx: CommandContext, path: string): Promise<DeleteResult> => {
  if (ctx.state !== 'AUTHENTICATED' && ctx.state !== 'SELECTED') {
    throw IMAPSDKError.invalidState('Cannot delete mailbox: not in AUTHENTICATED or SELECTED state')
  }

  const normalizedPath = normalizePath(path) as MailboxPath

  if (ctx.state === 'SELECTED' && ctx.mailbox?.path === normalizedPath) {
    await ctx.run('CLOSE')
  }

  const encodedPath = encodePath({ enabled: ctx.enabled }, normalizedPath)

  try {
    const response = await ctx.exec('DELETE', [{ type: 'ATOM', value: encodedPath }])
    response.next()

    return { path: normalizedPath }
  } catch (err) {
    const cmdError = createCommandError(err)
    ctx.log.warn({ cid: ctx.id, error: cmdError })
    throw cmdError
  }
}
