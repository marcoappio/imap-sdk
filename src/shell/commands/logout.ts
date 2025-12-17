import type { CommandContext, LogoutResult } from './types'

export const logout = async (ctx: CommandContext): Promise<LogoutResult> => {
  try {
    const response = await ctx.exec('LOGOUT')

    response.next()

    return true
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
