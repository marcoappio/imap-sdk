import type { CommandContext, CompressResult } from './types'

export type CompressContext = CommandContext & {
  readonly isCompressed: boolean
  readonly enableCompression: () => void
}

export const compress = async (ctx: CompressContext): Promise<CompressResult> => {
  if (!ctx.capabilities.has('COMPRESS=DEFLATE') || ctx.isCompressed) {
    return false
  }

  try {
    const response = await ctx.exec('COMPRESS', [{ type: 'ATOM', value: 'DEFLATE' }])
    response.next()

    ctx.enableCompression()

    return true
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
