import type { Tag } from '@imap-sdk/types/common'
import { IMAPSDKError } from '@imap-sdk/types/errors'

export type PendingCommand<T = unknown> = {
  readonly tag: Tag
  readonly command: string
  readonly resolve: (value: T) => void
  readonly reject: (error: Error) => void
  readonly createdAt: number
}

export type CommandQueueOptions = {
  readonly prefix?: string
  readonly maxConcurrent?: number
}

const DEFAULT_PREFIX = 'A'
const DEFAULT_MAX_CONCURRENT = 1

export class CommandQueue implements AsyncDisposable {
  private counter = 0
  private readonly prefix: string
  private readonly maxConcurrent: number
  private readonly pending = new Map<Tag, PendingCommand>()
  private readonly waitQueue: Array<() => void> = []
  private disposed = false

  constructor(options: CommandQueueOptions = {}) {
    this.prefix = options.prefix ?? DEFAULT_PREFIX
    this.maxConcurrent = options.maxConcurrent ?? DEFAULT_MAX_CONCURRENT
  }

  get isDisposed(): boolean {
    return this.disposed
  }

  get pendingCount(): number {
    return this.pending.size
  }

  get queueLength(): number {
    return this.waitQueue.length
  }

  nextTag(): Tag {
    this.counter += 1
    return `${this.prefix}${this.counter.toString().padStart(4, '0')}` as Tag
  }

  async acquire(): Promise<Tag> {
    if (this.disposed) {
      throw IMAPSDKError.disposed('CommandQueue')
    }

    if (this.pending.size >= this.maxConcurrent) {
      await new Promise<void>(resolve => {
        this.waitQueue.push(resolve)
      })
    }

    return this.nextTag()
  }

  register<T>(tag: Tag, command: string): Promise<T> {
    if (this.disposed) {
      return Promise.reject(IMAPSDKError.disposed('CommandQueue'))
    }

    return new Promise<T>((resolve, reject) => {
      const pending: PendingCommand<T> = {
        command,
        createdAt: Date.now(),
        reject,
        resolve,
        tag,
      }
      this.pending.set(tag, pending as PendingCommand)
    })
  }

  resolve(tag: Tag, value: unknown): boolean {
    const pending = this.pending.get(tag)

    if (!pending) {
      return false
    }

    this.pending.delete(tag)
    pending.resolve(value)
    this.releaseSlot()

    return true
  }

  reject(tag: Tag, error: Error): boolean {
    const pending = this.pending.get(tag)

    if (!pending) {
      return false
    }

    this.pending.delete(tag)
    pending.reject(error)
    this.releaseSlot()

    return true
  }

  rejectAll(error: Error): void {
    for (const pending of this.pending.values()) {
      pending.reject(error)
    }

    this.pending.clear()

    for (const resolve of this.waitQueue) {
      resolve()
    }

    this.waitQueue.length = 0
  }

  has(tag: Tag): boolean {
    return this.pending.has(tag)
  }

  get(tag: Tag): PendingCommand | undefined {
    return this.pending.get(tag)
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true

    this.rejectAll(IMAPSDKError.disposed('CommandQueue'))
  }

  [Symbol.asyncDispose](): Promise<void> {
    this.dispose()
    return Promise.resolve()
  }

  private releaseSlot(): void {
    if (this.waitQueue.length > 0) {
      const next = this.waitQueue.shift()
      next?.()
    }
  }
}

export const createCommandQueue = (options?: CommandQueueOptions): CommandQueue => new CommandQueue(options)
