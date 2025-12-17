import { format, isValid } from 'date-fns'

import { IMAPSDKError } from '@imap-sdk/types/errors'

export const formatIMAPDate = (date: Date): string => {
  if (!isValid(date)) {
    throw IMAPSDKError.internal('Invalid date')
  }
  return format(date, 'dd-MMM-yyyy')
}

export const formatIMAPDateTime = (date: Date): string => {
  if (!isValid(date)) {
    throw IMAPSDKError.internal('Invalid date')
  }
  return format(date, 'dd-MMM-yyyy HH:mm:ss xx')
}

export const parseDate = (value: Date | string | unknown): Date | undefined => {
  if (value instanceof Date) {
    return isValid(value) ? value : undefined
  }

  if (typeof value === 'string') {
    const parsed = new Date(value)
    return isValid(parsed) ? parsed : undefined
  }

  return undefined
}
