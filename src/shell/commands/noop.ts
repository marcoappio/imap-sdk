import type { CommandContext, NoopResult } from './types'

export const noop = async (ctx: CommandContext): Promise<NoopResult> => {
  try {
    const response = await ctx.exec('NOOP', undefined, { comment: 'Requested by command' })
    response.next()
    return true
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
