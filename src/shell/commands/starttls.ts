import type { CommandContext, StartTlsResult } from './types'

export type StartTlsContext = CommandContext & {
  readonly isSecure: boolean
}

export const starttls = async (ctx: StartTlsContext): Promise<StartTlsResult> => {
  if (!ctx.capabilities.has('STARTTLS') || ctx.isSecure) {
    return false
  }

  try {
    const response = await ctx.exec('STARTTLS')
    response.next()
    return true
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
