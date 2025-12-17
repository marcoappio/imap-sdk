import { IMAPSDKError, IMAPSDKErrorCode } from '@imap-sdk/types/errors'
import type { ParsedResponse, Token } from '@imap-sdk/types/protocol'

export const getStatusCode = (response: ParsedResponse | undefined): string | false => {
  if (!response?.attributes?.[0]) {
    return false
  }

  const attr = response.attributes[0]

  if ('section' in attr && attr.section?.[0]) {
    const section = attr.section[0] as Token

    if (typeof section.value === 'string') {
      return section.value.toUpperCase().trim()
    }
  }

  return false
}

export const getErrorText = (response: ParsedResponse | undefined): string | false => {
  if (!response) {
    return false
  }

  if (response.humanReadable) {
    return response.humanReadable
  }

  const parts: string[] = []

  if (response.tag && response.tag !== '*' && response.tag !== '+') {
    parts.push(String(response.tag))
  }

  if (response.command) {
    parts.push(response.command)
  }

  return parts.join(' ')
}

export const IMAPAuthError = class extends IMAPSDKError {
  override readonly name = 'IMAPAuthError'
  readonly authenticationFailed = true

  constructor(message: string, serverResponseCode?: string, oauthError?: unknown) {
    super(IMAPSDKErrorCode.AUTHENTICATION_FAILED, message, { oauthError, serverResponseCode })
  }
}

export const IMAPCommandError = class extends IMAPSDKError {
  override readonly name = 'IMAPCommandError'

  constructor(message: string, serverResponseCode?: string, response?: string) {
    super(IMAPSDKErrorCode.COMMAND_FAILED, message, { responseText: response, serverResponseCode })
  }

  get response(): string | undefined {
    return this.responseText
  }
}

export type IMAPAuthError = InstanceType<typeof IMAPAuthError>
export type IMAPCommandError = InstanceType<typeof IMAPCommandError>

export type ErrorResponseInfo = {
  readonly response?: ParsedResponse
}

export const extractResponseInfo = (
  error: unknown,
): { statusCode: string | false; errorText: string | false; response?: ParsedResponse } => {
  if (error && typeof error === 'object' && 'response' in error && error.response) {
    const response = error.response as ParsedResponse

    return {
      errorText: getErrorText(response),
      response,
      statusCode: getStatusCode(response),
    }
  }
  return { errorText: false, statusCode: false }
}

export const createAuthError = (err: unknown, oauthError?: unknown): IMAPAuthError => {
  const error = err instanceof Error ? err : new Error(String(err))
  const { errorText, statusCode } = extractResponseInfo(err)
  const message = errorText || error.message
  return new IMAPAuthError(message, statusCode || undefined, oauthError)
}

export const createCommandError = (err: unknown): IMAPCommandError => {
  const error = err instanceof Error ? err : new Error(String(err))
  const { errorText, statusCode } = extractResponseInfo(err)
  const message = errorText || error.message
  return new IMAPCommandError(message, statusCode || undefined, errorText || undefined)
}
