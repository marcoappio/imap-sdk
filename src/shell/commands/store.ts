import type { CommandContext, StoreOptions, StoreResult } from './types'

const FLAG_COLORS: Record<string, string> = {
  blue: '$MailFlagBit2',
  green: '$MailFlagBit1',
  grey: '$MailFlagBit3',
  orange: '$MailFlagBit4',
  purple: '$MailFlagBit6',
  red: '$MailFlagBit0',
  yellow: '$MailFlagBit5',
}

const formatFlag = (flag: string): string => {
  if (flag in FLAG_COLORS) {
    return FLAG_COLORS[flag]
  }

  if (flag.startsWith('\\') || flag.startsWith('$')) {
    return flag
  }

  return flag
}

const canUseFlag = (
  mailbox: { permanentFlags?: ReadonlySet<string>; flags?: ReadonlySet<string> } | null,
  flag: string,
): boolean => {
  if (!mailbox) {
    return false
  }

  if (mailbox.permanentFlags?.has('\\*')) {
    return true
  }

  if (mailbox.permanentFlags?.has(flag)) {
    return true
  }

  if (mailbox.flags?.has(flag)) {
    return true
  }

  return false
}

export const store = async (
  ctx: CommandContext,
  range: string,
  flags: string | readonly string[],
  options: StoreOptions = {},
): Promise<StoreResult> => {
  if (ctx.state !== 'SELECTED' || !range) {
    return false
  }

  if (options.useLabels && !ctx.capabilities.has('X-GM-EXT-1')) {
    return false
  }

  let operation = 'FLAGS'

  if (options.useLabels) {
    operation = 'X-GM-LABELS'
  } else if (options.silent) {
    operation = `${operation}.SILENT`
  }

  switch (options.operation ?? 'add') {
    case 'set': {
      break
    }
    case 'remove': {
      operation = `-${operation}`

      break
    }
    default: {
      operation = `+${operation}`

      break
    }
  }

  const flagArray = Array.isArray(flags) ? flags : [flags]

  const formattedFlags = flagArray
    .map(formatFlag)
    .filter(x => {
      if (options.operation === 'remove') {
        return true
      }
      return canUseFlag(ctx.mailbox, x)
    })
    .filter(Boolean)

  if (formattedFlags.length === 0 && options.operation !== 'set') {
    return false
  }

  const attributes: unknown[] = [
    { type: 'SEQUENCE', value: range },
    { type: 'ATOM', value: operation },
    formattedFlags.map(flag => ({ type: 'ATOM', value: flag })),
  ]

  if (options.unchangedSince && ctx.enabled.has('CONDSTORE') && !ctx.mailbox?.noModseq) {
    attributes.push([
      { type: 'ATOM', value: 'UNCHANGEDSINCE' },
      { type: 'ATOM', value: options.unchangedSince.toString() },
    ])
  }

  try {
    const response = await ctx.exec(options.uid ? 'UID STORE' : 'STORE', attributes as never)
    response.next()
    return true
  } catch (error) {
    ctx.log.warn({ cid: ctx.id, error })
    return false
  }
}
