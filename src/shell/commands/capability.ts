import type { CapabilityResult, CommandContext } from './types'

export const capability = async (ctx: CommandContext): Promise<CapabilityResult> => {
  if (ctx.capabilities.size > 0 && !ctx.expectCapabilityUpdate) {
    return ctx.capabilities
  }

  try {
    const response = await ctx.exec('CAPABILITY')
    response.next()
    return ctx.capabilities
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
