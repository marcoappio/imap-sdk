import { type Duplex, PassThrough, type Readable, type Writable } from 'stream'
import { constants, createDeflateRaw, createInflateRaw, type DeflateRaw, type InflateRaw } from 'zlib'

import type { Logger } from '@imap-sdk/types/common'
import { IMAPSDKError } from '@imap-sdk/types/errors'

export type CompressionOptions = {
  readonly chunkSize?: number
  readonly level?: number
  readonly logger?: Logger
  readonly cid?: string
}

export type CompressionStreams = {
  readonly deflate: DeflateRaw
  readonly inflate: InflateRaw
  readonly isActive: boolean
  dispose: () => void
}

const DEFAULT_CHUNK_SIZE = 16 * 1024

export class CompressionHandler implements AsyncDisposable {
  private deflate: DeflateRaw | null = null
  private inflate: InflateRaw | null = null
  private disposed = false
  private readonly logger?: Logger
  private readonly cid?: string
  private readonly chunkSize: number
  private readonly level: number

  constructor(options: CompressionOptions = {}) {
    this.logger = options.logger
    this.cid = options.cid
    this.chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE
    this.level = options.level ?? constants.Z_DEFAULT_COMPRESSION
  }

  get isActive(): boolean {
    return this.deflate !== null && this.inflate !== null && !this.disposed
  }

  get isDisposed(): boolean {
    return this.disposed
  }

  activate(): CompressionStreams {
    if (this.disposed) {
      throw IMAPSDKError.disposed('CompressionHandler')
    }

    if (this.deflate || this.inflate) {
      throw IMAPSDKError.invalidState('Compression is already active')
    }

    this.deflate = createDeflateRaw({
      chunkSize: this.chunkSize,
      level: this.level,
      strategy: constants.Z_DEFAULT_STRATEGY,
    })

    this.inflate = createInflateRaw({
      chunkSize: this.chunkSize,
    })

    this.deflate.on('error', err => {
      this.logger?.error({ cid: this.cid, err, info: 'Deflate stream error' })
    })

    this.inflate.on('error', err => {
      this.logger?.error({ cid: this.cid, err, info: 'Inflate stream error' })
    })

    return {
      deflate: this.deflate,
      dispose: () => this.dispose(),
      inflate: this.inflate,
      isActive: true,
    }
  }

  getDeflate(): DeflateRaw | null {
    return this.deflate
  }

  getInflate(): InflateRaw | null {
    return this.inflate
  }

  flush(): Promise<void> {
    return new Promise(resolve => {
      if (!this.deflate) {
        resolve()
        return
      }

      this.deflate.flush(() => {
        resolve()
      })
    })
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true

    if (this.deflate) {
      try {
        this.deflate.removeAllListeners()

        if (typeof (this.deflate as Duplex).unpipe === 'function') {
          ;(this.deflate as Duplex).unpipe()
        }

        this.deflate.destroy()
      } catch (error) {
        this.logger?.error({ cid: this.cid, error, info: 'Failed to destroy deflate stream' })
      }

      this.deflate = null
    }

    if (this.inflate) {
      try {
        this.inflate.removeAllListeners()

        if (typeof (this.inflate as Duplex).unpipe === 'function') {
          ;(this.inflate as Duplex).unpipe()
        }

        this.inflate.destroy()
      } catch (error) {
        this.logger?.error({ cid: this.cid, error, info: 'Failed to destroy inflate stream' })
      }

      this.inflate = null
    }
  }

  [Symbol.asyncDispose](): Promise<void> {
    this.dispose()
    return Promise.resolve()
  }
}

export const createCompressionHandler = (options?: CompressionOptions): CompressionHandler =>
  new CompressionHandler(options)

export const pipeWithCompression = (source: Readable, destination: Writable, deflate: DeflateRaw): void => {
  const writeSocket = new PassThrough()

  writeSocket.on('readable', () => {
    const readNext = (): void => {
      for (;;) {
        const chunk = writeSocket.read() as Buffer | null

        if (chunk === null) {
          break
        }

        if (deflate.write(chunk) === false) {
          deflate.once('drain', readNext)
          return
        }
      }

      deflate.flush()
    }

    readNext()
  })

  deflate.pipe(destination)
  source.pipe(writeSocket)
}
