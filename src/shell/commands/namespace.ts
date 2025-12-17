import type { NamespaceEntry, NamespaceInfo } from '@imap-sdk/types/mailbox'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, NamespaceResult } from './types'

const getNamespaceInfo = (attribute: Token | Token[] | undefined): NamespaceEntry[] | false => {
  if (!(attribute && Array.isArray(attribute) && attribute.length > 0)) {
    return false
  }

  const result: NamespaceEntry[] = []

  for (const entry of attribute) {
    if (!Array.isArray(entry) || entry.length < 2) {
      continue
    }

    const prefixToken = (entry as Token[])[0]
    const delimiterToken = (entry as Token[])[1]

    if (typeof prefixToken?.value !== 'string' || typeof delimiterToken?.value !== 'string') {
      continue
    }

    let prefix = prefixToken.value
    const delimiter = delimiterToken.value

    if (delimiter && prefix && prefix.charAt(prefix.length - 1) !== delimiter) {
      prefix += delimiter
    }

    result.push({ delimiter, prefix })
  }

  return result.length > 0 ? result : false
}

const getListPrefix = async (ctx: CommandContext): Promise<{ prefix: string; delimiter: string }> => {
  try {
    let prefix = ''
    let delimiter = ''

    const response = await ctx.exec(
      'LIST',
      [
        { type: 'ATOM', value: '' },
        { type: 'ATOM', value: '' },
      ] as never,
      {
        untagged: {
          LIST: untagged => {
            if (!untagged.attributes?.length) {
              return
            }

            delimiter = String((untagged.attributes[1] as Token)?.value ?? '')
            prefix = String((untagged.attributes[2] as Token)?.value ?? '')

            if (delimiter && prefix.charAt(0) === delimiter) {
              prefix = prefix.slice(1)
            }
          },
        },
      },
    )

    response.next()
    return { delimiter, prefix }
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return { delimiter: '', prefix: '' }
  }
}

export const namespace = async (ctx: CommandContext): Promise<NamespaceResult | undefined> => {
  if (ctx.state !== 'AUTHENTICATED' && ctx.state !== 'SELECTED') {
    return undefined
  }

  if (!ctx.capabilities.has('NAMESPACE')) {
    const { prefix, delimiter } = await getListPrefix(ctx)

    let finalPrefix = prefix || ''
    if (delimiter && finalPrefix && finalPrefix.charAt(finalPrefix.length - 1) !== delimiter) {
      finalPrefix += delimiter
    }

    const map: NamespaceInfo = {
      other: false,
      personal: [{ delimiter, prefix: finalPrefix }],
      shared: false,
    }

    return map.personal[0]
  }

  try {
    const map: NamespaceInfo = {
      other: false,
      personal: [],
      shared: false,
    }

    const response = await ctx.exec('NAMESPACE', [], {
      untagged: {
        NAMESPACE: untagged => {
          if (!untagged.attributes?.length) {
            return
          }

          map.personal = getNamespaceInfo(untagged.attributes[0] as Token | Token[]) || []
          map.other = getNamespaceInfo(untagged.attributes[1] as Token | Token[])
          map.shared = getNamespaceInfo(untagged.attributes[2] as Token | Token[])
        },
      },
    })

    if (!map.personal[0]) {
      map.personal[0] = { delimiter: '.', prefix: '' }
    }

    map.personal[0].prefix = map.personal[0].prefix || ''

    response.next()

    return map.personal[0]
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return undefined
  }
}
