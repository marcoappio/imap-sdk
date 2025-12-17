import type { CloseResult, CommandContext } from './types'

export const close = async (ctx: CommandContext): Promise<CloseResult> => {
  if (ctx.state !== 'SELECTED') {
    return false
  }

  try {
    const response = await ctx.exec('CLOSE')
    response.next()

    const currentMailbox = ctx.mailbox
    ctx.setMailbox(null)

    if (currentMailbox) {
      ctx.emitMailboxClose(currentMailbox)
    }

    return true
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
