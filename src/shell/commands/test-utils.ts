import type { Logger, MailboxPath, ModSeq, UIDValidity } from '@imap-sdk/types/common'
import type { MailboxInfo } from '@imap-sdk/types/mailbox'
import type { ParsedResponse, Token, TokenType } from '@imap-sdk/types/protocol'

import type { CommandContext, CommandContextState, ExecOptions, ExecResponse } from './types'

export type MockExecCall = {
  command: string
  attributes: unknown[]
  options?: ExecOptions
}

export type MockCommandContext = CommandContext & {
  mockExecCalls: MockExecCall[]
  mockExecResponse: ExecResponse
  mockRunCalls: { command: string; args: unknown[] }[]
  mockRunResponse: unknown
  setMockExecResponse: (response: Partial<ExecResponse>) => void
  setMockRunResponse: (response: unknown) => void
  triggerUntagged: (handler: string, response: ParsedResponse) => Promise<void>
  triggerPlusTag: (response: ParsedResponse) => Promise<void>
}

export const createMockMailbox = (overrides: Partial<MailboxInfo> = {}): MailboxInfo => ({
  delimiter: '/',
  exists: 100,
  flags: new Set(['\\Seen', '\\Answered', '\\Flagged', '\\Deleted', '\\Draft']),
  highestModseq: 12345n as ModSeq,
  path: 'INBOX' as MailboxPath,
  permanentFlags: new Set(['\\Seen', '\\Answered', '\\Flagged', '\\Deleted', '\\Draft', '\\*']),
  uidNext: 1234,
  uidValidity: 12345n as UIDValidity,
  ...overrides,
})

export const createMockResponse = (overrides: Partial<ParsedResponse> = {}): ParsedResponse => ({
  attributes: [],
  command: 'OK',
  tag: '*',
  ...overrides,
})

const createMockLogger = (): Logger => {
  const logger: Logger = {
    child: () => logger,
    debug: () => undefined,
    error: () => undefined,
    info: () => undefined,
    trace: () => undefined,
    warn: () => undefined,
  }
  return logger
}

export const createMockLoggerWithWarn = (warnCalls: unknown[]): Logger => {
  const logger: Logger = {
    child: () => logger,
    debug: () => undefined,
    error: () => undefined,
    info: () => undefined,
    trace: () => undefined,
    warn: (...args: unknown[]) => {
      warnCalls.push(args)
    },
  }
  return logger
}

export const createMockContext = (overrides: Partial<CommandContext> = {}): MockCommandContext => {
  const mockExecCalls: MockExecCall[] = []
  const mockRunCalls: { command: string; args: unknown[] }[] = []
  let currentExecOptions: ExecOptions | undefined
  let mockRunResponse: unknown

  let mockExecResponse: ExecResponse = {
    next: () => undefined,
    response: createMockResponse(),
    tag: 'A001' as never,
  }

  const ctx: MockCommandContext = {
    addEnabled: () => undefined,
    authCapabilities: new Map(),
    capabilities: new Set(['IMAP4rev1', 'IDLE', 'NAMESPACE', 'QUOTA', 'UIDPLUS', 'MOVE', 'CONDSTORE']),
    emitExists: () => undefined,
    emitExpunge: () => undefined,
    emitFlags: () => undefined,
    emitMailboxClose: () => undefined,
    emitMailboxOpen: () => undefined,
    enabled: new Set(['CONDSTORE']),
    exec: (command, attributes = [], options) => {
      mockExecCalls.push({ attributes: attributes as unknown[], command, options })
      currentExecOptions = options
      return Promise.resolve(mockExecResponse)
    },
    expectCapabilityUpdate: false,
    folders: new Map(),
    id: 'test-connection-id',
    log: createMockLogger(),
    mailbox: null,
    mockExecCalls,
    mockExecResponse,
    mockRunCalls,
    mockRunResponse,
    run: (command, ...args) => {
      mockRunCalls.push({ args, command })
      return Promise.resolve(mockRunResponse as never)
    },
    servername: 'imap.example.com',
    setAuthCapability: () => undefined,
    setCapabilities: () => undefined,
    setExpectCapabilityUpdate: () => undefined,
    setFolder: () => undefined,
    setMailbox: () => undefined,
    setMockExecResponse: response => {
      mockExecResponse = { ...mockExecResponse, ...response }
      ctx.mockExecResponse = mockExecResponse
    },
    setMockRunResponse: response => {
      mockRunResponse = response
      ctx.mockRunResponse = response
    },
    state: 'SELECTED' as CommandContextState,
    triggerPlusTag: async response => {
      if (currentExecOptions?.onPlusTag) {
        await currentExecOptions.onPlusTag(response)
      }
    },
    triggerUntagged: async (handler, response) => {
      if (currentExecOptions?.untagged?.[handler]) {
        await currentExecOptions.untagged[handler](response)
      }
    },
    write: () => undefined,
    ...overrides,
  }

  return ctx
}

export const createToken = (value: string | number, type: TokenType = 'ATOM'): Token => ({
  type,
  value: String(value),
})

export const createTokenArray = (values: (string | number)[]): Token[] => values.map(v => createToken(v))

export const createNestedToken = (tokens: Token[]): Token => tokens as unknown as Token

export const createSectionToken = (section: Token[], value = ''): Token => ({
  section,
  type: 'SECTION',
  value,
})

export const createThrowingExec = (errorMessage: string) => (): Promise<never> =>
  Promise.reject(new Error(errorMessage))
