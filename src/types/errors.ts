export const IMAPSDKErrorCode = {
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  COMMAND_FAILED: 'COMMAND_FAILED',
  CONNECT_TIMEOUT: 'CONNECT_TIMEOUT',
  CONNECTION_CLOSED: 'CONNECTION_CLOSED',
  DISPOSED: 'DISPOSED',
  GREETING_TIMEOUT: 'GREETING_TIMEOUT',
  INTERNAL: 'INTERNAL',
  INVALID_STATE: 'INVALID_STATE',
  MISSING_EXTENSION: 'MISSING_EXTENSION',
  NO_CONNECTION: 'NO_CONNECTION',
  PARSER_ERROR: 'PARSER_ERROR',
  PROTOCOL_ERROR: 'PROTOCOL_ERROR',
  SOCKET_TIMEOUT: 'SOCKET_TIMEOUT',
  THROTTLED: 'THROTTLED',
  TLS_FAILED: 'TLS_FAILED',
  UNKNOWN: 'UNKNOWN',
  UPGRADE_TIMEOUT: 'UPGRADE_TIMEOUT',
} as const

export type IMAPSDKErrorCode = (typeof IMAPSDKErrorCode)[keyof typeof IMAPSDKErrorCode]

export type IMAPSDKErrorOptions = {
  readonly cause?: unknown
  readonly serverResponseCode?: string
  readonly oauthError?: unknown
  readonly responseStatus?: 'NO' | 'BAD'
  readonly responseText?: string
  readonly throttleReset?: number
  readonly extension?: string
  readonly parserPosition?: number
  readonly parserInput?: string
}

export class IMAPSDKError extends Error {
  override readonly name: string = 'IMAPSDKError'
  readonly code: IMAPSDKErrorCode | `PARSER_${string}`
  readonly serverResponseCode?: string
  readonly oauthError?: unknown
  readonly responseStatus?: 'NO' | 'BAD'
  readonly responseText?: string
  readonly throttleReset?: number
  readonly extension?: string
  readonly parserPosition?: number
  readonly parserInput?: string

  constructor(code: IMAPSDKErrorCode, message: string, options: IMAPSDKErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.code = code
    this.serverResponseCode = options.serverResponseCode
    this.oauthError = options.oauthError
    this.responseStatus = options.responseStatus
    this.responseText = options.responseText
    this.throttleReset = options.throttleReset
    this.extension = options.extension
    this.parserPosition = options.parserPosition
    this.parserInput = options.parserInput
  }

  static connection(
    code:
      | typeof IMAPSDKErrorCode.NO_CONNECTION
      | typeof IMAPSDKErrorCode.CONNECTION_CLOSED
      | typeof IMAPSDKErrorCode.CONNECT_TIMEOUT
      | typeof IMAPSDKErrorCode.GREETING_TIMEOUT
      | typeof IMAPSDKErrorCode.SOCKET_TIMEOUT
      | typeof IMAPSDKErrorCode.UPGRADE_TIMEOUT
      | typeof IMAPSDKErrorCode.TLS_FAILED,
    message: string,
  ): IMAPSDKError {
    return new IMAPSDKError(code, message)
  }

  static authentication(message: string, serverResponseCode?: string, oauthError?: unknown): IMAPSDKError {
    return new IMAPSDKError(IMAPSDKErrorCode.AUTHENTICATION_FAILED, message, {
      oauthError,
      serverResponseCode,
    })
  }

  static protocol(
    message: string,
    responseStatus?: 'NO' | 'BAD',
    responseText?: string,
    serverResponseCode?: string,
  ): IMAPSDKError {
    return new IMAPSDKError(IMAPSDKErrorCode.PROTOCOL_ERROR, message, {
      responseStatus,
      responseText,
      serverResponseCode,
    })
  }

  static commandFailed(message: string, serverResponseCode?: string, responseText?: string): IMAPSDKError {
    return new IMAPSDKError(IMAPSDKErrorCode.COMMAND_FAILED, message, {
      responseText,
      serverResponseCode,
    })
  }

  static parser(message: string, position?: number, input?: string): IMAPSDKError {
    return new IMAPSDKError(IMAPSDKErrorCode.PARSER_ERROR, message, {
      parserInput: input,
      parserPosition: position,
    })
  }

  static throttled(message: string, throttleReset: number): IMAPSDKError {
    return new IMAPSDKError(IMAPSDKErrorCode.THROTTLED, message, { throttleReset })
  }

  static missingExtension(message: string, extension: string): IMAPSDKError {
    return new IMAPSDKError(IMAPSDKErrorCode.MISSING_EXTENSION, message, { extension })
  }

  static invalidState(message: string): IMAPSDKError {
    return new IMAPSDKError(IMAPSDKErrorCode.INVALID_STATE, message)
  }

  static disposed(resource: string): IMAPSDKError {
    return new IMAPSDKError(IMAPSDKErrorCode.DISPOSED, `${resource} has been disposed`)
  }

  static internal(message: string, cause?: unknown): IMAPSDKError {
    return new IMAPSDKError(IMAPSDKErrorCode.INTERNAL, message, { cause })
  }

  static isIMAPSDKError(error: unknown): error is IMAPSDKError {
    return error instanceof IMAPSDKError
  }
}

export const wrapError = (error: unknown, code: IMAPSDKErrorCode, message?: string): IMAPSDKError => {
  if (IMAPSDKError.isIMAPSDKError(error)) {
    return error
  }

  const actualMessage = message ?? (error instanceof Error ? error.message : String(error))
  return new IMAPSDKError(code, actualMessage, { cause: error })
}

export const catchAsIMAPError = async <T>(
  fn: () => Promise<T> | T,
  code: IMAPSDKErrorCode,
  message?: string,
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    throw wrapError(error, code, message)
  }
}

export type ConnectionErrorCode =
  | typeof IMAPSDKErrorCode.NO_CONNECTION
  | typeof IMAPSDKErrorCode.CONNECTION_CLOSED
  | typeof IMAPSDKErrorCode.CONNECT_TIMEOUT
  | typeof IMAPSDKErrorCode.GREETING_TIMEOUT
  | typeof IMAPSDKErrorCode.SOCKET_TIMEOUT
  | typeof IMAPSDKErrorCode.UPGRADE_TIMEOUT
  | typeof IMAPSDKErrorCode.TLS_FAILED

export class ConnectionError extends IMAPSDKError {
  override readonly name = 'ConnectionError'

  // biome-ignore lint/complexity/noUselessConstructor: narrows code type to ConnectionErrorCode
  constructor(code: ConnectionErrorCode, message: string) {
    super(code, message)
  }
}

export class AuthenticationError extends IMAPSDKError {
  override readonly name = 'AuthenticationError'

  constructor(message: string, serverResponseCode?: string, oauthError?: unknown) {
    super(IMAPSDKErrorCode.AUTHENTICATION_FAILED, message, { oauthError, serverResponseCode })
  }
}

export class ProtocolError extends IMAPSDKError {
  override readonly name = 'ProtocolError'

  constructor(message: string, responseStatus?: 'NO' | 'BAD', responseText?: string, serverResponseCode?: string) {
    super(IMAPSDKErrorCode.PROTOCOL_ERROR, message, { responseStatus, responseText, serverResponseCode })
  }
}

export class ParserError extends IMAPSDKError {
  override readonly name = 'ParserError'
  override readonly code: `PARSER_${string}`

  constructor(code: string, message: string, position?: number, input?: string) {
    super(IMAPSDKErrorCode.PARSER_ERROR, message, { parserInput: input, parserPosition: position })
    this.code = `PARSER_${code}`
  }

  get position(): number | undefined {
    return this.parserPosition
  }

  get input(): string | undefined {
    return this.parserInput
  }
}

export class ThrottleError extends IMAPSDKError {
  override readonly name = 'ThrottleError'

  constructor(message: string, throttleReset: number) {
    super(IMAPSDKErrorCode.THROTTLED, message, { throttleReset })
  }
}

export class MissingExtensionError extends IMAPSDKError {
  override readonly name = 'MissingExtensionError'

  constructor(message: string, extension: string) {
    super(IMAPSDKErrorCode.MISSING_EXTENSION, message, { extension })
  }
}

export type IMAPError = IMAPSDKError
