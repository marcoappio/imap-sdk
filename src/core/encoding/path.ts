import iconv from 'iconv-lite'

// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional for UTF-7 IMAP encoding detection
const UTF7_IMAP_CHARS = /[&\x00-\x08\x0b-\x0c\x0e-\x1f\u0080-\uffff]/
const UTF7_DECODE_CHARS = /[&]/

export type PathEncodingContext = {
  readonly enabled: ReadonlySet<string>
}

export const encodePath = (ctx: PathEncodingContext, path: string): string => {
  const normalized = path.toString()

  if (!ctx.enabled.has('UTF8=ACCEPT') && UTF7_IMAP_CHARS.test(normalized)) {
    try {
      return iconv.encode(normalized, 'utf-7-imap').toString()
    } catch {
      return normalized
    }
  }

  return normalized
}

export const decodePath = (ctx: PathEncodingContext, path: string): string => {
  const normalized = path.toString()

  if (!ctx.enabled.has('UTF8=ACCEPT') && UTF7_DECODE_CHARS.test(normalized)) {
    try {
      return iconv.decode(Buffer.from(normalized), 'utf-7-imap').toString()
    } catch {
      return normalized
    }
  }

  return normalized
}

export type NamespaceInfo = {
  readonly prefix: string
  readonly delimiter: string
}

export const normalizePath = (
  path: string | readonly string[],
  namespace?: NamespaceInfo,
  skipNamespace?: boolean,
): string => {
  let normalized: string

  if (Array.isArray(path)) {
    const delimiter = namespace?.delimiter ?? ''
    normalized = (path as readonly string[]).join(delimiter)
  } else {
    normalized = path as string
  }

  if (normalized.toUpperCase() === 'INBOX') {
    return 'INBOX'
  }

  if (!skipNamespace && namespace?.prefix && !normalized.startsWith(namespace.prefix)) {
    return namespace.prefix + normalized
  }

  return normalized
}

export const comparePaths = (
  a: string | undefined | null,
  b: string | undefined | null,
  namespace?: NamespaceInfo,
): boolean => {
  if (!(a && b)) {
    return false
  }

  return normalizePath(a, namespace) === normalizePath(b, namespace)
}
