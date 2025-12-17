import { compileSearch, type SearchQuery } from '@imap-sdk/core/search/compiler'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, SearchOptions, SearchResult } from './types'

const DIGITS_ONLY = /^\d+$/

export const search = async (
  ctx: CommandContext,
  query: SearchQuery | true | undefined,
  options: SearchOptions = {},
): Promise<SearchResult> => {
  if (ctx.state !== 'SELECTED') {
    return false
  }

  let attributes: { type: 'ATOM' | 'SEQUENCE'; value: string }[]

  if (!query || query === true || (typeof query === 'object' && (!Object.keys(query).length || query.all))) {
    attributes = [{ type: 'ATOM', value: 'ALL' }]
  } else if (typeof query === 'object') {
    const connection = {
      capabilities: ctx.capabilities as Set<string>,
      enabled: ctx.enabled as Set<string>,
      mailbox: ctx.mailbox
        ? {
            flags: ctx.mailbox.flags as Set<string>,
            permanentFlags: ctx.mailbox.permanentFlags as Set<string> | undefined,
          }
        : undefined,
    }
    attributes = compileSearch(connection, query)
  } else {
    return false
  }

  const results = new Set<number>()

  try {
    const response = await ctx.exec(options.uid ? 'UID SEARCH' : 'SEARCH', attributes, {
      untagged: {
        SEARCH: untagged => {
          if (!untagged.attributes?.length) {
            return
          }
          for (const attr of untagged.attributes) {
            const token = attr as Token
            if (token.value && typeof token.value === 'string' && DIGITS_ONLY.test(token.value)) {
              results.add(Number(token.value))
            }
          }
        },
      },
    })
    response.next()

    return Array.from(results).sort((a, b) => a - b)
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
