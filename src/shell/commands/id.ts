import type { IdInfo } from '@imap-sdk/types/connection'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, IdResult } from './types'

const WHITESPACE_RUN = /\s+/g

const formatDate = (date: Date): string => {
  const pad = (n: number): string => n.toString().padStart(2, '0')

  const day = pad(date.getDate())
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  const offset = -date.getTimezoneOffset()
  const offsetSign = offset >= 0 ? '+' : '-'
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60))
  const offsetMinutes = pad(Math.abs(offset) % 60)

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${offsetSign}${offsetHours}${offsetMinutes}`
}

const formatValue = (key: string, value: string | Date | undefined): string | null => {
  if (value === undefined) {
    return null
  }

  if (key.toLowerCase() === 'date' && value instanceof Date) {
    return formatDate(value)
  }

  return String(value).replace(WHITESPACE_RUN, ' ')
}

export const id = async (ctx: CommandContext, clientInfo?: IdInfo): Promise<IdResult> => {
  if (!ctx.capabilities.has('ID')) {
    return null
  }

  try {
    const serverInfo: Record<string, string> = {}

    let formattedClientInfo: (string | { type: 'ATOM'; value: string })[] | null = null

    if (clientInfo) {
      const entries: { type: 'ATOM'; value: string }[] = []

      for (const key of Object.keys(clientInfo)) {
        const formattedValue = formatValue(key, clientInfo[key])
        if (formattedValue) {
          entries.push({ type: 'ATOM', value: key })
          entries.push({ type: 'ATOM', value: formattedValue })
        }
      }

      formattedClientInfo = entries.length > 0 ? entries : null
    }

    const response = await ctx.exec('ID', [formattedClientInfo as never], {
      untagged: {
        ID: untagged => {
          const params = untagged.attributes?.[0]

          if (!params) {
            return
          }

          const entries = Array.isArray(params) ? params : [params]
          let key: string | undefined

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i] as Token
            if (i % 2 === 0) {
              key = typeof entry.value === 'string' ? entry.value : undefined
            } else if (key && typeof entry.value === 'string') {
              serverInfo[key.toLowerCase().trim()] = entry.value
            }
          }
        },
      },
    })

    response.next()

    return serverInfo as IdInfo
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return null
  }
}
