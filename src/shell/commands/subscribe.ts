import { encodePath, normalizePath } from '@imap-sdk/core/encoding/path'

import type { CommandContext, SubscribeResult } from './types'

export const subscribe = async (ctx: CommandContext, path: string): Promise<SubscribeResult> => {
  if (ctx.state !== 'AUTHENTICATED' && ctx.state !== 'SELECTED') {
    return false
  }

  const normalizedPath = normalizePath(path)
  const encodedPath = encodePath({ enabled: ctx.enabled }, normalizedPath)

  try {
    const response = await ctx.exec('SUBSCRIBE', [{ type: 'ATOM', value: encodedPath }])
    response.next()
    return true
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}

export const unsubscribe = async (ctx: CommandContext, path: string): Promise<SubscribeResult> => {
  if (ctx.state !== 'AUTHENTICATED' && ctx.state !== 'SELECTED') {
    return false
  }

  const normalizedPath = normalizePath(path)
  const encodedPath = encodePath({ enabled: ctx.enabled }, normalizedPath)

  try {
    const response = await ctx.exec('UNSUBSCRIBE', [{ type: 'ATOM', value: encodedPath }])
    response.next()
    return true
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
