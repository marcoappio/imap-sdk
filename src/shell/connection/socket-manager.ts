import { EventEmitter } from 'events'
import net from 'net'
import type { CipherNameAndProtocol, SecureVersion, TLSSocket } from 'tls'
import tls from 'tls'
import zlib from 'zlib'

import { ListenerTracker } from '@imap-sdk/resources/listener-tracker'
import { TimerManager } from '@imap-sdk/resources/timer-manager'
import type { Logger } from '@imap-sdk/types/common'
import { IMAPSDKError } from '@imap-sdk/types/errors'

export type TlsConnectionOptions = {
  readonly rejectUnauthorized?: boolean
  readonly minVersion?: SecureVersion
  readonly maxVersion?: SecureVersion
  readonly minDHSize?: number
  readonly ca?: string | Buffer | (string | Buffer)[]
  readonly cert?: string | Buffer | (string | Buffer)[]
  readonly key?: string | Buffer | (string | Buffer)[]
  readonly passphrase?: string
  readonly ciphers?: string
  readonly ecdhCurve?: string
  readonly secureProtocol?: string
  readonly ALPNProtocols?: string[]
}

export type SocketManagerOptions = {
  readonly host: string
  readonly port: number
  readonly secure?: boolean
  readonly servername?: string
  readonly tls?: TlsConnectionOptions
  readonly connectionTimeout?: number
  readonly socketTimeout?: number
  readonly keepAliveInterval?: number
  readonly logger?: Logger
  readonly cid?: string
}

export type SocketInfo = {
  readonly remoteAddress?: string
  readonly remotePort?: number
  readonly localAddress?: string
  readonly localPort?: number
  readonly secure: boolean
  readonly tls?: CipherNameAndProtocol & { authorized?: boolean }
}

export type SocketManagerEvents = {
  connect: []
  data: [Buffer]
  error: [Error]
  close: []
  end: []
  timeout: []
}

const DEFAULT_CONNECTION_TIMEOUT = 90 * 1000
const DEFAULT_SOCKET_TIMEOUT = 5 * 60 * 1000
const DEFAULT_KEEPALIVE_INTERVAL = 5 * 1000
const TLS_UPGRADE_TIMEOUT = 10 * 1000

export class SocketManager extends EventEmitter implements AsyncDisposable {
  private socket: net.Socket | TLSSocket | null = null
  private writeSocket: net.Socket | TLSSocket | null = null
  private inflateStream: zlib.InflateRaw | null = null
  private deflateStream: zlib.DeflateRaw | null = null
  private readonly pipedDestinations: NodeJS.WritableStream[] = []
  private readonly listenerTracker = new ListenerTracker()
  private readonly timerManager = new TimerManager()
  private disposed = false
  private compressed = false

  private readonly host: string
  private readonly port: number
  private readonly secure: boolean
  private readonly servername?: string
  private readonly tlsOptions?: TlsConnectionOptions
  private readonly connectionTimeout: number
  private readonly socketTimeout: number
  private readonly keepAliveInterval: number
  private readonly logger?: Logger
  private readonly cid?: string

  constructor(options: SocketManagerOptions) {
    super()
    this.host = options.host
    this.port = options.port
    this.secure = options.secure ?? false
    this.servername = options.servername
    this.tlsOptions = options.tls
    this.connectionTimeout = options.connectionTimeout ?? DEFAULT_CONNECTION_TIMEOUT
    this.socketTimeout = options.socketTimeout ?? DEFAULT_SOCKET_TIMEOUT
    this.keepAliveInterval = options.keepAliveInterval ?? DEFAULT_KEEPALIVE_INTERVAL
    this.logger = options.logger
    this.cid = options.cid
  }

  get isConnected(): boolean {
    return this.socket !== null && !this.socket.destroyed
  }

  get isDisposed(): boolean {
    return this.disposed
  }

  get isCompressed(): boolean {
    return this.compressed
  }

  get socketInfo(): SocketInfo | null {
    if (!this.socket) {
      return null
    }

    const info: SocketInfo = {
      localAddress: this.socket.localAddress,
      localPort: this.socket.localPort,
      remoteAddress: this.socket.remoteAddress,
      remotePort: this.socket.remotePort,
      secure: this.isTlsSocket(this.socket),
    }

    if (this.isTlsSocket(this.socket)) {
      const cipher = this.socket.getCipher()
      if (cipher) {
        return {
          ...info,
          tls: {
            ...cipher,
            authorized: this.socket.authorized,
          },
        }
      }
    }

    return info
  }

  connect(): Promise<void> {
    if (this.disposed) {
      return Promise.reject(new Error('SocketManager has been disposed'))
    }

    if (this.socket) {
      return Promise.reject(new Error('Socket already connected'))
    }

    return new Promise((resolve, reject) => {
      this.timerManager.set(
        'connect',
        () => {
          const error = new Error(`Connection timeout after ${this.connectionTimeout}ms`)
          ;(error as Error & { code: string }).code = 'CONNECT_TIMEOUT'
          this.logger?.error({ cid: this.cid, error, info: 'Connection timeout' })
          this.destroy()
          reject(error)
        },
        this.connectionTimeout,
      )

      const onConnect = (): void => {
        this.timerManager.clear('connect')

        if (!this.socket) {
          reject(new Error('Socket was destroyed during connection'))
          return
        }

        this.socket.setKeepAlive(true, this.keepAliveInterval)
        this.socket.setTimeout(this.socketTimeout)

        this.setupSocketListeners()

        this.logger?.info({
          cid: this.cid,
          host: this.host,
          info: `Established ${this.secure ? 'secure ' : ''}TCP connection`,
          port: this.port,
          secure: this.secure,
          ...this.socketInfo,
        })

        resolve()
      }

      const onError = (...args: unknown[]): void => {
        const error = args[0] as Error
        this.timerManager.clear('connect')
        this.logger?.error({ cid: this.cid, error, info: 'Connection error' })
        this.destroy()
        reject(error)
      }

      if (this.secure) {
        const tlsOpts: tls.ConnectionOptions = {
          host: this.host,
          port: this.port,
          servername: this.servername ?? this.host,
          ...this.tlsOptions,
        }

        this.socket = tls.connect(tlsOpts, onConnect)
      } else {
        const netOpts: net.NetConnectOpts = {
          host: this.host,
          port: this.port,
        }

        this.socket = net.connect(netOpts, onConnect)
      }

      this.writeSocket = this.socket
      this.listenerTracker.once(this.socket, 'error', onError)
    })
  }

  upgradeToTls(): Promise<void> {
    if (this.disposed) {
      return Promise.reject(new Error('SocketManager has been disposed'))
    }

    if (!this.socket || this.socket.destroyed) {
      return Promise.reject(new Error('No active socket to upgrade'))
    }

    if (this.isTlsSocket(this.socket)) {
      return Promise.reject(new Error('Socket is already TLS'))
    }

    return new Promise((resolve, reject) => {
      const plainSocket = this.socket as net.Socket

      this.listenerTracker.removeAllFor(plainSocket)

      const opts: tls.ConnectionOptions = {
        servername: this.servername ?? this.host,
        socket: plainSocket,
        ...this.tlsOptions,
      }

      this.timerManager.set(
        'upgrade',
        () => {
          const error = new Error('TLS upgrade timeout')
          ;(error as Error & { code: string }).code = 'UPGRADE_TIMEOUT'
          reject(error)
        },
        TLS_UPGRADE_TIMEOUT,
      )

      const tlsSocket = tls.connect(opts, () => {
        this.timerManager.clear('upgrade')
        this.socket = tlsSocket
        this.writeSocket = tlsSocket

        this.setupSocketListeners()

        this.logger?.info({
          cid: this.cid,
          info: 'TLS upgrade successful',
          ...this.socketInfo,
        })

        resolve()
      })

      this.listenerTracker.once(tlsSocket, 'error', (...args: unknown[]) => {
        const error = args[0] as Error
        this.timerManager.clear('upgrade')
        this.logger?.error({ cid: this.cid, error, info: 'TLS upgrade failed' })
        reject(error)
      })
    })
  }

  enableCompression(): void {
    if (this.disposed || this.compressed || !this.socket) {
      return
    }

    this.logger?.info({ cid: this.cid, info: 'Enabling DEFLATE compression' })

    this.inflateStream = zlib.createInflateRaw()
    this.deflateStream = zlib.createDeflateRaw()

    this.listenerTracker.on(this.inflateStream, 'error', (...args: unknown[]) => {
      const error = args[0] as Error
      this.logger?.error({ cid: this.cid, error, info: 'Inflate stream error' })
      this.emit('error', error)
    })

    this.listenerTracker.on(this.deflateStream, 'error', (...args: unknown[]) => {
      const error = args[0] as Error
      this.logger?.error({ cid: this.cid, error, info: 'Deflate stream error' })
      this.emit('error', error)
    })

    this.socket.removeAllListeners('data')

    this.deflateStream.pipe(this.socket)

    this.socket.pipe(this.inflateStream)

    for (const dest of this.pipedDestinations) {
      this.socket.unpipe(dest)
      this.inflateStream.pipe(dest)
    }

    this.listenerTracker.on(this.inflateStream, 'data', (...args: unknown[]) => {
      const data = args[0] as Buffer
      this.emit('data', data)
    })

    this.compressed = true
    this.logger?.info({ cid: this.cid, info: 'DEFLATE compression enabled' })
  }

  write(data: Buffer | string): boolean {
    if (this.compressed && this.deflateStream) {
      this.deflateStream.write(data)
      this.deflateStream.flush(zlib.constants.Z_SYNC_FLUSH)
      return true
    }

    if (!this.writeSocket || this.writeSocket.destroyed) {
      return false
    }

    return this.writeSocket.write(data)
  }

  pipe<T extends NodeJS.WritableStream>(destination: T): T {
    if (!this.socket) {
      throw IMAPSDKError.invalidState('No socket to pipe from')
    }

    this.pipedDestinations.push(destination)

    if (this.compressed && this.inflateStream) {
      return this.inflateStream.pipe(destination)
    }

    return this.socket.pipe(destination)
  }

  unpipe(destination?: NodeJS.WritableStream): this {
    if (this.socket) {
      this.socket.unpipe(destination)
    }

    return this
  }

  setWriteSocket(socket: net.Socket | TLSSocket): void {
    this.writeSocket = socket
  }

  getSocket(): net.Socket | TLSSocket | null {
    return this.socket
  }

  getWriteSocket(): net.Socket | TLSSocket | null {
    return this.writeSocket
  }

  destroy(): void {
    if (this.inflateStream) {
      try {
        this.inflateStream.destroy()
      } catch (error) {
        this.logger?.error({ cid: this.cid, error, info: 'Error destroying inflate stream' })
      }

      this.inflateStream = null
    }

    if (this.deflateStream) {
      try {
        this.deflateStream.destroy()
      } catch (error) {
        this.logger?.error({ cid: this.cid, error, info: 'Error destroying deflate stream' })
      }

      this.deflateStream = null
    }

    if (this.socket && !this.socket.destroyed) {
      try {
        this.socket.destroy()
      } catch (error) {
        this.logger?.error({ cid: this.cid, error, info: 'Error destroying socket' })
      }
    }

    if (this.writeSocket && this.writeSocket !== this.socket && !this.writeSocket.destroyed) {
      try {
        this.writeSocket.destroy()
      } catch (error) {
        this.logger?.error({ cid: this.cid, error, info: 'Error destroying write socket' })
      }
    }

    this.socket = null
    this.writeSocket = null
    this.compressed = false
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true

    this.timerManager.dispose()
    this.listenerTracker.dispose()
    this.destroy()
    this.removeAllListeners()
  }

  [Symbol.asyncDispose](): Promise<void> {
    this.dispose()
    return Promise.resolve()
  }

  private setupSocketListeners(): void {
    if (!this.socket) {
      return
    }

    this.listenerTracker.on(this.socket, 'data', (...args: unknown[]) => {
      const data = args[0] as Buffer
      this.emit('data', data)
    })

    this.listenerTracker.once(this.socket, 'error', (...args: unknown[]) => {
      const error = args[0] as Error
      this.logger?.error({ cid: this.cid, error, info: 'Socket error' })
      this.emit('error', error)
    })

    this.listenerTracker.once(this.socket, 'close', () => {
      this.emit('close')
    })

    this.listenerTracker.once(this.socket, 'end', () => {
      this.emit('end')
    })

    this.listenerTracker.on(this.socket, 'timeout', () => {
      this.emit('timeout')
    })

    if (this.isTlsSocket(this.socket)) {
      this.listenerTracker.on(this.socket, 'tlsClientError', (...args: unknown[]) => {
        const error = args[0] as Error
        this.logger?.error({ cid: this.cid, error, info: 'TLS client error' })
        this.emit('error', error)
      })
    }
  }

  private isTlsSocket(socket: net.Socket | TLSSocket): socket is TLSSocket {
    return 'encrypted' in socket && socket.encrypted === true
  }
}

export const createSocketManager = (options: SocketManagerOptions): SocketManager => new SocketManager(options)
