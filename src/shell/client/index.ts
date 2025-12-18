import { EventEmitter } from 'events'

import { compile } from '@imap-sdk/core/protocol/compiler'
import { parse } from '@imap-sdk/core/protocol/parser'
import { ListenerTracker } from '@imap-sdk/resources/listener-tracker'
import { TimerManager } from '@imap-sdk/resources/timer-manager'
import { type CommandQueue, createCommandQueue } from '@imap-sdk/shell/client/command-queue'
import { createMailboxLock, type Lock, type MailboxLock } from '@imap-sdk/shell/client/mailbox-lock'
import {
  createResponseRouter,
  type ResponseRouter,
  type TaggedResponseHandler,
} from '@imap-sdk/shell/client/response-router'
import { getCommand } from '@imap-sdk/shell/commands/registry'
import type { CommandContext, CommandContextState, ExecOptions, ExecResponse } from '@imap-sdk/shell/commands/types'
import {
  createSocketManager,
  type SocketManager,
  type SocketManagerOptions,
} from '@imap-sdk/shell/connection/socket-manager'
import { type ConnectionActor, createConnectionActor, getStateValue } from '@imap-sdk/shell/connection/state-machine'
import { createIMAPStream, type IMAPStream, type IMAPStreamOutput } from '@imap-sdk/shell/connection/stream-handler'
import type { ConnectionId, Logger, MailboxPath, ModSeq, Tag } from '@imap-sdk/types/common'
import type { AuthOptions, ConnectionOptions } from '@imap-sdk/types/connection'
import { IMAPSDKError } from '@imap-sdk/types/errors'
import type { MailboxInfo, MailboxListEntry } from '@imap-sdk/types/mailbox'
import type { CommandAttribute, ParsedResponse } from '@imap-sdk/types/protocol'

export type IMAPClientOptions = ConnectionOptions & {
  readonly id?: string
}

export type IMAPClientEvents = {
  close: []
  error: [Error]
  exists: [{ path: MailboxPath; count: number; prevCount: number }]
  expunge: [{ path: MailboxPath; seq: number; vanished: boolean }]
  flags: [{ path: MailboxPath; seq: number; uid?: number; flags: Set<string>; modseq?: ModSeq }]
  log: [object]
  mailboxClose: [MailboxInfo]
  mailboxOpen: [MailboxInfo]
}

const DEFAULT_GREETING_TIMEOUT = 30_000
const CRLF = '\r\n'

let connectionCounter = 0

const createDefaultLogger = (): Logger => ({
  child: () => createDefaultLogger(),
  debug: () => undefined,
  error: () => undefined,
  info: () => undefined,
  trace: () => undefined,
  warn: () => undefined,
})

export class IMAPClient extends EventEmitter implements CommandContext, AsyncDisposable {
  readonly id: ConnectionId

  private readonly options: IMAPClientOptions
  private readonly listenerTracker = new ListenerTracker()
  private readonly timerManager = new TimerManager()
  private readonly stateMachine: ConnectionActor
  private readonly commandQueue: CommandQueue
  private responseRouter: ResponseRouter
  private readonly mailboxLock: MailboxLock

  private socketManager: SocketManager | null = null
  private imapStream: IMAPStream | null = null
  private disposed = false
  private greeting = ''

  private _capabilities = new Set<string>()
  private readonly _enabled = new Set<string>()
  private readonly _authCapabilities = new Map<string, boolean>()
  private _mailbox: MailboxInfo | null = null
  private readonly _folders = new Map<MailboxPath, MailboxListEntry>()
  private _expectCapabilityUpdate = false
  private readonly _log: Logger

  constructor(options: IMAPClientOptions) {
    super()
    connectionCounter += 1
    this.id = (options.id ?? `c${connectionCounter}`) as ConnectionId
    this.options = options

    const baseLog = options.logger === false ? createDefaultLogger() : (options.logger ?? createDefaultLogger())
    this._log = baseLog.child({ cid: this.id })

    this.stateMachine = createConnectionActor(this.id)
    this.commandQueue = createCommandQueue({ prefix: 'A' })
    this.mailboxLock = createMailboxLock()
    this.responseRouter = createResponseRouter({
      commandQueue: this.commandQueue,
      onUntagged: (cmd, resp) => this.handleGlobalUntagged(cmd, resp),
    })
  }

  get log(): Logger {
    return this._log
  }

  get capabilities(): ReadonlySet<string> {
    return this._capabilities
  }

  get enabled(): ReadonlySet<string> {
    return this._enabled
  }

  get authCapabilities(): ReadonlyMap<string, boolean> {
    return this._authCapabilities
  }

  get servername(): string {
    return this.options.servername ?? this.options.host
  }

  get state(): CommandContextState {
    const value = getStateValue(this.stateMachine.getSnapshot())
    switch (value) {
      case 'NOT_AUTHENTICATED': {
        return 'NOT_AUTHENTICATED'
      }
      case 'AUTHENTICATED': {
        return 'AUTHENTICATED'
      }
      case 'SELECTED': {
        return 'SELECTED'
      }
      case 'LOGOUT': {
        return 'LOGOUT'
      }
      default: {
        return 'NOT_AUTHENTICATED'
      }
    }
  }

  get mailbox(): MailboxInfo | null {
    return this._mailbox
  }

  get folders(): ReadonlyMap<MailboxPath, MailboxListEntry> {
    return this._folders
  }

  get expectCapabilityUpdate(): boolean {
    return this._expectCapabilityUpdate
  }

  get isDisposed(): boolean {
    return this.disposed
  }

  get isCompressed(): boolean {
    return this.socketManager?.isCompressed ?? false
  }

  enableCompression = (): void => {
    this.socketManager?.enableCompression()
  }

  setCapabilities = (capabilities: Set<string>): void => {
    this._capabilities = capabilities
    this._expectCapabilityUpdate = false
  }

  addEnabled = (extension: string): void => {
    this._enabled.add(extension)
  }

  setAuthCapability = (method: string, success: boolean): void => {
    this._authCapabilities.set(method, success)
  }

  setExpectCapabilityUpdate = (expect: boolean): void => {
    this._expectCapabilityUpdate = expect
  }

  setMailbox = (mailbox: MailboxInfo | null): void => {
    this._mailbox = mailbox

    if (mailbox) {
      this.stateMachine.send({ mailbox, type: 'MAILBOX_SELECTED' })
    } else {
      this.stateMachine.send({ type: 'MAILBOX_CLOSED' })
    }
  }

  setFolder = (path: MailboxPath, folder: MailboxListEntry): void => {
    this._folders.set(path, folder)
  }

  emitMailboxOpen = (mailbox: MailboxInfo): void => {
    this.emit('mailboxOpen', mailbox)
  }

  emitMailboxClose = (mailbox: MailboxInfo): void => {
    this.emit('mailboxClose', mailbox)
  }

  emitExists = (info: { path: MailboxPath; count: number; prevCount: number }): void => {
    this.emit('exists', info)
  }

  emitExpunge = (info: { path: MailboxPath; seq: number; vanished: boolean }): void => {
    this.emit('expunge', info)
  }

  emitFlags = (info: { path: MailboxPath; seq: number; uid?: number; flags: Set<string>; modseq?: ModSeq }): void => {
    this.emit('flags', info)
  }

  async connect(): Promise<void> {
    if (this.disposed) {
      throw IMAPSDKError.disposed('IMAPClient')
    }

    this.stateMachine.start()
    this.stateMachine.send({ type: 'CONNECT_START' })

    const socketOptions: SocketManagerOptions = {
      cid: this.id,
      connectionTimeout: this.options.connectionTimeout,
      host: this.options.host,
      keepAliveInterval: 5000,
      logger: this._log,
      port: this.options.port,
      secure: this.options.secure,
      servername: this.options.servername,
      socketTimeout: this.options.socketTimeout,
      tls: this.options.tls as SocketManagerOptions['tls'],
    }

    this.socketManager = createSocketManager(socketOptions)
    this.imapStream = createIMAPStream({
      cid: this.id,
      logger: this._log,
      logRaw: this.options.logRaw,
      secureConnection: this.options.secure,
    })

    this.setupSocketListeners()
    this.setupStreamListeners()

    await this.socketManager.connect()

    if (this.socketManager.isConnected) {
      this.socketManager.pipe(this.imapStream)
    }

    await this.waitForGreeting()

    if (this._capabilities.size === 0) {
      await this.exec('CAPABILITY', [])
    }

    if (this.options.doSTARTTLS && !this.options.secure && this._capabilities.has('STARTTLS')) {
      const starttlsResult = await this.run<boolean>('STARTTLS')

      if (starttlsResult && this.socketManager && this.imapStream) {
        await this.socketManager.upgradeToTls()
        this.socketManager.pipe(this.imapStream)
        this._capabilities.clear()
        await this.exec('CAPABILITY', [])
      }
    }

    if (this.options.auth) {
      await this.authenticate(this.options.auth)
    }
  }

  async authenticate(auth: AuthOptions): Promise<string> {
    let user: string

    if (auth.accessToken) {
      user = await this.run<string>('AUTHENTICATE', auth)
    } else if (auth.pass) {
      user = await this.run<string>('LOGIN', auth.user, auth.pass)
    } else {
      throw IMAPSDKError.authentication('No authentication credentials provided')
    }

    this.stateMachine.send({ type: 'AUTHENTICATED', user })

    await this.enableExtensions()

    return user
  }

  private async enableExtensions(): Promise<void> {
    const extensionsToEnable: string[] = []

    if (this._capabilities.has('CONDSTORE')) {
      extensionsToEnable.push('CONDSTORE')
    }

    if (this._capabilities.has('QRESYNC')) {
      extensionsToEnable.push('QRESYNC')
    }

    if (this._capabilities.has('UTF8=ACCEPT')) {
      extensionsToEnable.push('UTF8=ACCEPT')
    }

    if (extensionsToEnable.length > 0) {
      await this.run('ENABLE', extensionsToEnable)
    }
  }

  async exec(
    command: string,
    attributes: readonly CommandAttribute[] = [],
    options: ExecOptions = {},
  ): Promise<ExecResponse> {
    if (this.disposed) {
      throw IMAPSDKError.disposed('IMAPClient')
    }

    const tag = await this.commandQueue.acquire()
    const compiled = compile({
      attributes: attributes as never,
      command,
      tag,
    })

    const handler: TaggedResponseHandler = {
      onPlusTag: options.onPlusTag,
      untagged: options.untagged as Record<string, (resp: ParsedResponse) => Promise<void> | void>,
    }

    this.responseRouter.registerHandler(tag, handler)

    const responsePromise = this.commandQueue.register<ParsedResponse>(tag, command)

    this._log.debug({
      cmd: command,
      comment: options.comment,
      msg: 'Sending command',
      src: 'c',
      tag,
    })

    this.write(Buffer.isBuffer(compiled) ? compiled : Buffer.concat(compiled as Buffer[]))
    this.write(CRLF)

    const response = await responsePromise

    return {
      next: () => undefined,
      response,
      tag,
    }
  }

  write = (data: string | Buffer): void => {
    if (!this.socketManager?.isConnected) {
      return
    }

    this.socketManager.write(data)
  }

  run = <T>(command: string, ...args: unknown[]): Promise<T> => {
    const cmdFn = getCommand(command)

    if (!cmdFn) {
      throw IMAPSDKError.internal(`Unknown command: ${command}`)
    }

    return cmdFn(this, ...args) as Promise<T>
  }

  getMailboxLock(path: MailboxPath): Promise<Lock> {
    return this.mailboxLock.acquire(path)
  }

  async logout(): Promise<void> {
    if (this.state === 'LOGOUT' || this.disposed) {
      return
    }

    this.stateMachine.send({ type: 'LOGOUT_INITIATED' })

    try {
      await this.run('LOGOUT')
    } catch {
      // Ignore logout errors
    }
  }

  async close(): Promise<void> {
    await this.logout()
    this.dispose()
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true

    this.timerManager.dispose()
    this.listenerTracker.dispose()
    this.commandQueue.dispose()
    this.responseRouter.dispose()
    this.mailboxLock.dispose()

    if (this.imapStream) {
      this.imapStream.destroy()
      this.imapStream = null
    }

    if (this.socketManager) {
      this.socketManager.dispose()
      this.socketManager = null
    }

    this.stateMachine.send({ type: 'CONNECTION_CLOSED' })
    this.stateMachine.stop()

    this.emit('close')
    this.removeAllListeners()
  }

  [Symbol.asyncDispose](): Promise<void> {
    return this.close()
  }

  private setupSocketListeners(): void {
    if (!this.socketManager) {
      return
    }

    this.listenerTracker.on(this.socketManager, 'error', (...args: unknown[]) => {
      const error = args[0] as Error
      this._log.error({ cid: this.id, error, info: 'Socket error' })
      this.stateMachine.send({ error, type: 'ERROR' })
      this.emit('error', error)
    })

    this.listenerTracker.once(this.socketManager, 'close', () => {
      this._log.info({ cid: this.id, info: 'Socket closed' })
      this.stateMachine.send({ type: 'CONNECTION_CLOSED' })
      this.dispose()
    })

    this.listenerTracker.once(this.socketManager, 'end', () => {
      this._log.debug({ cid: this.id, info: 'Socket ended' })
    })
  }

  private setupStreamListeners(): void {
    if (!this.imapStream) {
      return
    }

    this.listenerTracker.on(this.imapStream, 'data', async (...args: unknown[]) => {
      const output = args[0] as IMAPStreamOutput
      try {
        await this.handleStreamData(output)
      } catch (error) {
        this._log.error({ cid: this.id, error, info: 'Error handling stream data' })
      }
    })

    this.listenerTracker.on(this.imapStream, 'error', (...args: unknown[]) => {
      const error = args[0] as Error
      this._log.error({ cid: this.id, error, info: 'Stream error' })
    })
  }

  private async handleStreamData(output: IMAPStreamOutput): Promise<void> {
    const { payload, literals, next } = output

    const parseResult = parse(payload, { literals: literals as Buffer[] })

    if (!parseResult.ok) {
      this._log.warn({ cid: this.id, error: parseResult.error, info: 'Parse error' })
      next()
      return
    }

    const response: ParsedResponse = {
      attributes: parseResult.value.attributes as never,
      command: parseResult.value.command,
      humanReadable: parseResult.value.attributes?.find(x => x !== null && (x as { type: string }).type === 'TEXT')
        ?.value as string,
      tag: parseResult.value.tag as Tag,
    }

    this._log.trace({
      cmd: response.command,
      msg: 'Received response',
      src: 's',
      tag: response.tag,
    })

    await this.responseRouter.route(response)
    next()
  }

  private waitForGreeting(): Promise<void> {
    const timeout = this.options.greetingTimeout ?? DEFAULT_GREETING_TIMEOUT

    return new Promise<void>((resolve, reject) => {
      this.timerManager.set(
        'greeting',
        () => {
          reject(new Error(`Greeting timeout after ${timeout}ms`))
        },
        timeout,
      )

      const checkGreeting = (response: ParsedResponse): void => {
        const command = response.command.toUpperCase()

        if (command === 'OK' || command === 'PREAUTH') {
          this.timerManager.clear('greeting')
          this.greeting = response.humanReadable ?? ''

          this.parseGreetingCapabilities(response)

          if (command === 'PREAUTH') {
            this.stateMachine.send({ type: 'PREAUTH_RECEIVED', user: 'preauth' })
          } else {
            this.stateMachine.send({ greeting: this.greeting, type: 'GREETING_RECEIVED' })
          }

          this._log.info({ cid: this.id, greeting: this.greeting, info: 'Received greeting' })
          resolve()
        } else if (command === 'BYE') {
          this.timerManager.clear('greeting')
          reject(new Error(`Server sent BYE: ${response.humanReadable ?? 'Connection refused'}`))
        }
      }

      this.responseRouter = createResponseRouter({
        commandQueue: this.commandQueue,
        onUntagged: (cmd, resp) => {
          if (this.greeting === '' && (cmd === 'OK' || cmd === 'PREAUTH' || cmd === 'BYE')) {
            checkGreeting(resp)
          } else {
            this.handleGlobalUntagged(cmd, resp)
          }
        },
      })
    })
  }

  private parseGreetingCapabilities(response: ParsedResponse): void {
    if (!response.attributes?.length) {
      return
    }

    const attr = response.attributes[0] as { section?: readonly { value: string }[]; type: string }

    if (attr.type !== 'SECTION' || !attr.section?.length) {
      return
    }

    const section = attr.section
    const firstToken = section[0]

    if (firstToken?.value?.toUpperCase() === 'CAPABILITY') {
      const caps = new Set<string>()
      for (let i = 1; i < section.length; i++) {
        const cap = section[i]?.value
        if (cap) {
          caps.add(cap.toUpperCase())
        }
      }
      this.setCapabilities(caps)
    }
  }

  private handleGlobalUntagged(command: string, response: ParsedResponse): void {
    switch (command) {
      case 'CAPABILITY': {
        this.handleCapabilityResponse(response)

        break
      }
      case 'EXISTS': {
        this.handleExistsResponse(response)

        break
      }
      case 'EXPUNGE': {
        this.handleExpungeResponse(response)

        break
      }
      case 'FETCH': {
        this.handleFetchResponse(response)

        break
      }
      case 'BYE': {
        this._log.info({ cid: this.id, info: 'Server sent BYE', msg: response.humanReadable })
        this.stateMachine.send({ type: 'CONNECTION_CLOSED' })

        break
      }
      default: {
        break
      }
    }
  }

  private handleCapabilityResponse(response: ParsedResponse): void {
    if (!response.attributes?.length) {
      return
    }

    const caps = new Set<string>()

    for (const attr of response.attributes) {
      const value = (attr as { value: string }).value

      if (value && typeof value === 'string') {
        caps.add(value.toUpperCase())
      }
    }

    this.setCapabilities(caps)
  }

  private handleExistsResponse(response: ParsedResponse): void {
    if (!this._mailbox) {
      return
    }

    const count = Number(response.command)

    if (Number.isNaN(count)) {
      return
    }

    const prevCount = this._mailbox.exists
    this._mailbox = { ...this._mailbox, exists: count }

    if (count !== prevCount) {
      this.emitExists({ count, path: this._mailbox.path, prevCount })
    }
  }

  private handleExpungeResponse(response: ParsedResponse): void {
    if (!this._mailbox) {
      return
    }

    const seq = Number(response.command)

    if (Number.isNaN(seq)) {
      return
    }

    this.emitExpunge({ path: this._mailbox.path, seq, vanished: false })
  }

  private handleFetchResponse(response: ParsedResponse): void {
    if (!(this._mailbox && response.attributes?.length)) {
      return
    }

    const seq = Number(response.command)

    if (Number.isNaN(seq)) {
      return
    }

    const attrs = response.attributes as { type: string; value: string }[]

    let flags: Set<string> | undefined
    let uid: number | undefined
    let modseq: ModSeq | undefined

    for (let i = 0; i < attrs.length; i += 2) {
      const key = attrs[i]?.value?.toUpperCase()
      const value = attrs[i + 1]

      if (key === 'FLAGS' && Array.isArray(value)) {
        flags = new Set((value as { value: string }[]).map(x => x.value))
      } else if (key === 'UID' && value?.value) {
        uid = Number(value.value)
      } else if (key === 'MODSEQ' && Array.isArray(value) && value[0]?.value) {
        modseq = BigInt(value[0].value) as ModSeq
      }
    }

    if (flags) {
      this.emitFlags({ flags, modseq, path: this._mailbox.path, seq, uid })
    }
  }
}

export const createIMAPClient = (options: IMAPClientOptions): IMAPClient => new IMAPClient(options)
