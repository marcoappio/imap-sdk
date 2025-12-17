import { IMAPSDKError } from '@imap-sdk/types/errors'

import type { CommandContext, LoginResult } from './types'
import { createAuthError } from './utils'

export const login = async (ctx: CommandContext, username: string, password: string): Promise<LoginResult> => {
  if (ctx.state !== 'NOT_AUTHENTICATED') {
    throw IMAPSDKError.invalidState('Cannot login: not in NOT_AUTHENTICATED state')
  }

  try {
    const response = await ctx.exec('LOGIN', [
      { type: 'STRING', value: username },
      { type: 'STRING', value: password },
    ])

    response.next()

    ctx.setAuthCapability('LOGIN', true)

    return username
  } catch (err) {
    throw createAuthError(err)
  }
}
