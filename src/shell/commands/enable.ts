import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, EnableResult } from './types'

export const enable = async (ctx: CommandContext, extensionList: readonly string[]): Promise<EnableResult> => {
  if (!ctx.capabilities.has('ENABLE') || ctx.state !== 'AUTHENTICATED') {
    return new Set()
  }

  const filteredExtensions = extensionList.filter(ext => ctx.capabilities.has(ext.toUpperCase()))

  if (filteredExtensions.length === 0) {
    return new Set()
  }

  try {
    const enabled = new Set<string>()

    const response = await ctx.exec(
      'ENABLE',
      filteredExtensions.map(ext => ({ type: 'ATOM' as const, value: ext.toUpperCase() })),
      {
        untagged: {
          ENABLED: untagged => {
            if (!untagged.attributes?.length) {
              return
            }
            for (const attr of untagged.attributes) {
              const token = attr as Token
              if (token.value && typeof token.value === 'string') {
                const ext = token.value.toUpperCase().trim()
                enabled.add(ext)
                ctx.addEnabled(ext)
              }
            }
          },
        },
      },
    )

    response.next()

    return enabled
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return new Set()
  }
}
