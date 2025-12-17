import type { ModSeq } from '@imap-sdk/types/common'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, ExpungeOptions, ExpungeResult } from './types'

export const expunge = async (
  ctx: CommandContext,
  range: string,
  options: ExpungeOptions = {},
): Promise<ExpungeResult> => {
  if (ctx.state !== 'SELECTED' || !range) {
    return false
  }

  await ctx.run('STORE', range, ['\\Deleted'], { ...options, silent: true })

  const byUid = options.uid && ctx.capabilities.has('UIDPLUS')
  const command = byUid ? 'UID EXPUNGE' : 'EXPUNGE'
  const attributes = byUid ? [{ type: 'SEQUENCE' as const, value: range }] : []

  try {
    const response = await ctx.exec(command, attributes as never)
    const section = response.response.attributes?.[0]

    if (section && 'section' in section && section.section?.length) {
      const tokens = section.section as Token[]
      const responseCode = typeof tokens[0]?.value === 'string' ? tokens[0].value : ''

      if (responseCode.toUpperCase() === 'HIGHESTMODSEQ') {
        const modseqValue = tokens[1]?.value
        if (typeof modseqValue === 'string' && !Number.isNaN(Number(modseqValue))) {
          const highestModseq = BigInt(modseqValue) as ModSeq
          if (ctx.mailbox && (!ctx.mailbox.highestModseq || highestModseq > ctx.mailbox.highestModseq)) {
            ctx.setMailbox({ ...ctx.mailbox, highestModseq })
          }
        }
      }
    }

    response.next()

    return true
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
