import { Transform, type TransformCallback, type TransformOptions } from 'stream'

import type { Logger } from '@imap-sdk/types/common'

const STATE_LINE = 0x01
const STATE_LITERAL = 0x02

const LF = 0x0a
const CR = 0x0d
const NUM_0 = 0x30
const NUM_9 = 0x39
const CURLY_OPEN = 0x7b
const CURLY_CLOSE = 0x7d

const MAX_LITERAL_SIZE = 1024 * 1024 * 1024

export type IMAPStreamOutput = {
  readonly payload: Buffer
  readonly literals: readonly Buffer[]
  readonly next: () => void
}

export type IMAPStreamOptions = {
  readonly cid?: string
  readonly logger?: Logger
  readonly logRaw?: boolean
  readonly secureConnection?: boolean
}

export class LiteralTooLargeError extends Error {
  readonly name = 'LiteralTooLargeError' as const
  readonly code = 'LiteralTooLarge' as const
  readonly literalSize: number
  readonly maxSize: number

  constructor(literalSize: number, maxSize: number) {
    super(`Literal size ${literalSize} exceeds maximum allowed size of ${maxSize} bytes`)
    this.literalSize = literalSize
    this.maxSize = maxSize
  }
}

type QueuedChunk = {
  readonly chunk: Buffer
  readonly next: () => void
}

export class IMAPStream extends Transform {
  private readonly cid?: string
  private readonly log?: Logger
  private readonly logRaw: boolean
  private readonly secureConnection: boolean

  private readBytesCounter = 0
  private state = STATE_LINE
  private literalWaiting = 0
  private inputBuffer: Buffer[] = []
  private lineBuffer: Buffer[] = []
  private literalBuffer: Buffer[] = []
  private literals: Buffer[] = []
  private readonly inputQueue: QueuedChunk[] = []
  private processingInput = false

  compress = false

  constructor(options: IMAPStreamOptions = {}) {
    const transformOptions: TransformOptions = {
      readableObjectMode: true,
      writableObjectMode: false,
    }
    super(transformOptions)

    this.cid = options.cid
    this.log = options.logger
    this.logRaw = options.logRaw ?? false
    this.secureConnection = options.secureConnection ?? false
  }

  get bytesRead(): number {
    return this.readBytesCounter
  }

  private checkLiteralMarker(line: Buffer): boolean {
    if (!line?.length) {
      return false
    }

    let pos = line.length - 1

    if (line[pos] === LF) {
      pos -= 1
    } else {
      return false
    }

    if (pos >= 0 && line[pos] === CR) {
      pos -= 1
    }

    if (pos < 0) {
      return false
    }

    if (!pos || line[pos] !== CURLY_CLOSE) {
      return false
    }

    pos -= 1

    const numBytes: number[] = []

    for (; pos > 0; pos -= 1) {
      const c = line[pos]

      if (c >= NUM_0 && c <= NUM_9) {
        numBytes.unshift(c)
        continue
      }

      if (c === CURLY_OPEN && numBytes.length) {
        const literalSize = Number(Buffer.from(numBytes).toString())

        if (literalSize > MAX_LITERAL_SIZE) {
          const error = new LiteralTooLargeError(literalSize, MAX_LITERAL_SIZE)
          this.emit('error', error)
          return false
        }

        this.state = STATE_LITERAL
        this.literalWaiting = literalSize
        return true
      }

      return false
    }

    return false
  }

  private async processInputChunk(chunk: Buffer, startPos = 0): Promise<void> {
    if (startPos >= chunk.length) {
      return
    }

    switch (this.state) {
      case STATE_LINE: {
        let lineStart = startPos

        for (let i = startPos; i < chunk.length; i += 1) {
          if (chunk[i] === LF) {
            this.lineBuffer.push(chunk.subarray(lineStart, i + 1))
            lineStart = i + 1

            const line = Buffer.concat(this.lineBuffer)
            this.inputBuffer.push(line)
            this.lineBuffer = []

            if (this.checkLiteralMarker(line)) {
              await this.processInputChunk(chunk, lineStart)
              return
            }

            let payload = this.inputBuffer.length === 1 ? this.inputBuffer[0] : Buffer.concat(this.inputBuffer)
            const literals = this.literals
            this.inputBuffer = []
            this.literals = []

            if (payload.length) {
              let skipBytes = 0
              if (payload.length >= 1 && payload[payload.length - 1] === LF) {
                skipBytes += 1
                if (payload.length >= 2 && payload[payload.length - 2] === CR) {
                  skipBytes += 1
                }
              }

              if (skipBytes) {
                payload = payload.subarray(0, payload.length - skipBytes)
              }

              if (payload.length) {
                await new Promise<void>(resolve => {
                  this.push({ literals, next: resolve, payload } satisfies IMAPStreamOutput)
                })
              }
            }
          }
        }

        if (lineStart < chunk.length) {
          this.lineBuffer.push(chunk.subarray(lineStart))
        }

        break
      }

      case STATE_LITERAL: {
        const remaining = chunk.length - startPos

        if (remaining === this.literalWaiting) {
          if (startPos) {
            this.literalBuffer.push(chunk.subarray(startPos))
          } else {
            this.literalBuffer.push(chunk)
          }

          this.literalWaiting = 0
          this.literals.push(Buffer.concat(this.literalBuffer))
          this.literalBuffer = []
          this.state = STATE_LINE
        } else if (remaining > this.literalWaiting) {
          const partial = chunk.subarray(startPos, startPos + this.literalWaiting)
          this.literalBuffer.push(partial)
          const newStartPos = startPos + this.literalWaiting
          this.literalWaiting = 0
          this.literals.push(Buffer.concat(this.literalBuffer))
          this.literalBuffer = []
          this.state = STATE_LINE

          await this.processInputChunk(chunk, newStartPos)
        } else {
          const partial = chunk.subarray(startPos)
          this.literalBuffer.push(partial)
          this.literalWaiting -= partial.length
        }

        break
      }

      default: {
        break
      }
    }
  }

  private async processInput(): Promise<void> {
    let processedCount = 0

    while (this.inputQueue.length > 0) {
      const data = this.inputQueue.shift()

      if (!data) {
        break
      }

      await this.processInputChunk(data.chunk)
      data.next()

      processedCount += 1

      if (processedCount % 10 === 0) {
        await new Promise<void>(resolve => setImmediate(resolve))
      }
    }
  }

  override _transform(chunk: unknown, encoding: BufferEncoding, next: TransformCallback): void {
    let buffer: Buffer
    if (typeof chunk === 'string') {
      buffer = Buffer.from(chunk, encoding)
    } else if (Buffer.isBuffer(chunk)) {
      buffer = chunk
    } else {
      next()
      return
    }

    if (!buffer.length) {
      next()
      return
    }

    this.readBytesCounter += buffer.length

    if (this.logRaw && this.log) {
      this.log.trace({
        cid: this.cid,
        compress: this.compress,
        data: buffer.toString('base64'),
        msg: 'read from socket',
        secure: this.secureConnection,
        src: 's',
      })
    }

    this.inputQueue.push({ chunk: buffer, next })

    if (!this.processingInput) {
      this.processingInput = true
      this.processInput()
        .catch(error => this.emit('error', error))
        .finally(() => {
          this.processingInput = false
        })
    }
  }

  override _flush(next: TransformCallback): void {
    next()
  }
}

export const createIMAPStream = (options?: IMAPStreamOptions): IMAPStream => new IMAPStream(options)
