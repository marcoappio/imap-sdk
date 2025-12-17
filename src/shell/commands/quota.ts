import { encodePath, normalizePath } from '@imap-sdk/core/encoding/path'
import type { MailboxPath } from '@imap-sdk/types/common'
import type { QuotaInfo, QuotaResource } from '@imap-sdk/types/mailbox'
import type { Token } from '@imap-sdk/types/protocol'

import type { CommandContext, QuotaResult } from './types'

export const quota = async (ctx: CommandContext, path: string): Promise<QuotaResult> => {
  if ((ctx.state !== 'AUTHENTICATED' && ctx.state !== 'SELECTED') || !path) {
    return null
  }

  if (!ctx.capabilities.has('QUOTA')) {
    return null
  }

  const normalizedPath = normalizePath(path) as MailboxPath
  const encodedPath = encodePath({ enabled: ctx.enabled }, normalizedPath)

  const map: QuotaInfo = { path: normalizedPath }

  const processQuotaResponse = (untagged: { attributes?: Token[] }): void => {
    const attributes = untagged.attributes?.[1]

    if (!(attributes && Array.isArray(attributes))) {
      return
    }

    let key: string | undefined
    const attrList = attributes as Token[]

    for (let i = 0; i < attrList.length; i += 1) {
      const attr = attrList[i]

      if (i % 3 === 0) {
        key = typeof attr?.value === 'string' ? attr.value.toLowerCase() : undefined
        continue
      }

      if (!key) {
        continue
      }

      const value =
        typeof attr?.value === 'string' && !Number.isNaN(Number(attr.value)) ? Number(attr.value) : undefined

      if (value === undefined) {
        continue
      }

      const resourceKey = key as keyof QuotaInfo

      if (!map[resourceKey] || typeof map[resourceKey] === 'string') {
        ;(map as Record<string, QuotaResource>)[resourceKey] = {} as QuotaResource
      }

      const resource = (map as Record<string, QuotaResource>)[resourceKey]

      if (i % 3 === 1) {
        resource.usage = value * (key === 'storage' ? 1024 : 1)
      }

      if (i % 3 === 2) {
        resource.limit = value * (key === 'storage' ? 1024 : 1)
        if (resource.limit) {
          resource.status = `${Math.round(((resource.usage || 0) / resource.limit) * 100)}%`
        }
      }
    }
  }

  let quotaFound = false

  try {
    const response = await ctx.exec('GETQUOTAROOT', [{ type: 'ATOM', value: encodedPath }] as never, {
      untagged: {
        QUOTA: untagged => {
          quotaFound = true
          processQuotaResponse(untagged as { attributes?: Token[] })
        },
        QUOTAROOT: untagged => {
          const quotaRoot =
            typeof untagged.attributes?.[1]?.value === 'string' ? untagged.attributes[1].value : undefined
          if (quotaRoot) {
            map.quotaRoot = quotaRoot
          }
        },
      },
    })

    response.next()

    if (map.quotaRoot && !quotaFound) {
      const quotaResponse = await ctx.exec('GETQUOTA', [{ type: 'ATOM', value: map.quotaRoot }] as never, {
        untagged: {
          QUOTA: untagged => {
            processQuotaResponse(untagged as { attributes?: Token[] })
          },
        },
      })
      quotaResponse.next()
    }

    return map
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return null
  }
}
