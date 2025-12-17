import { encodePath, normalizePath } from '@imap-sdk/core/encoding/path'
import type { MailboxPath } from '@imap-sdk/types/common'
import { IMAPSDKError } from '@imap-sdk/types/errors'

import type { CommandContext, RenameResult } from './types'
import { createCommandError } from './utils'

export const rename = async (ctx: CommandContext, path: string, newPath: string): Promise<RenameResult> => {
  if (ctx.state !== 'AUTHENTICATED' && ctx.state !== 'SELECTED') {
    throw IMAPSDKError.invalidState('Cannot rename mailbox: not in AUTHENTICATED or SELECTED state')
  }

  const normalizedPath = normalizePath(path) as MailboxPath
  const normalizedNewPath = normalizePath(newPath) as MailboxPath

  if (ctx.state === 'SELECTED' && ctx.mailbox?.path === normalizedPath) {
    await ctx.run('CLOSE')
  }

  const encodedPath = encodePath({ enabled: ctx.enabled }, normalizedPath)
  const encodedNewPath = encodePath({ enabled: ctx.enabled }, normalizedNewPath)

  try {
    const response = await ctx.exec('RENAME', [
      { type: 'ATOM', value: encodedPath },
      { type: 'ATOM', value: encodedNewPath },
    ])

    response.next()

    return { newPath: normalizedNewPath, path: normalizedPath }
  } catch (error) {
    const cmdError = createCommandError(error)
    ctx.log.warn({ cid: ctx.id, error: cmdError })
    throw cmdError
  }
}
