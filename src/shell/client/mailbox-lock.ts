import type { MailboxPath } from '@imap-sdk/types/common'

export type Lock = {
  readonly lockId: string
  readonly path: MailboxPath
  readonly release: () => void
}

export type LockOptions = {
  readonly timeout?: number
}

type QueuedLockRequest = {
  readonly path: MailboxPath
  readonly resolve: (lock: Lock) => void
  readonly reject: (error: Error) => void
  readonly timeoutId?: ReturnType<typeof setTimeout>
}

const DEFAULT_LOCK_TIMEOUT = 30_000

export class MailboxLock implements AsyncDisposable {
  private lockCounter = 0
  private currentLock: Lock | null = null
  private readonly waitQueue: QueuedLockRequest[] = []
  private disposed = false

  get isDisposed(): boolean {
    return this.disposed
  }

  get isLocked(): boolean {
    return this.currentLock !== null
  }

  get currentPath(): MailboxPath | null {
    return this.currentLock?.path ?? null
  }

  get currentLockId(): string | null {
    return this.currentLock?.lockId ?? null
  }

  get queueLength(): number {
    return this.waitQueue.length
  }

  acquire(path: MailboxPath, options: LockOptions = {}): Promise<Lock> {
    if (this.disposed) {
      return Promise.reject(new Error('MailboxLock has been disposed'))
    }

    if (!this.currentLock) {
      return Promise.resolve(this.createLock(path))
    }

    const timeout = options.timeout ?? DEFAULT_LOCK_TIMEOUT

    return new Promise<Lock>((resolve, reject) => {
      const request: QueuedLockRequest = {
        path,
        reject,
        resolve,
        timeoutId:
          timeout > 0
            ? setTimeout(() => {
                const index = this.waitQueue.indexOf(request)
                if (index !== -1) {
                  this.waitQueue.splice(index, 1)
                  reject(new Error(`Lock acquisition timed out after ${timeout}ms for path: ${path}`))
                }
              }, timeout)
            : undefined,
      }

      this.waitQueue.push(request)
    })
  }

  tryAcquire(path: MailboxPath): Lock | null {
    if (this.disposed || this.currentLock) {
      return null
    }

    return this.createLock(path)
  }

  release(lockId: string): boolean {
    if (!this.currentLock || this.currentLock.lockId !== lockId) {
      return false
    }

    this.currentLock = null
    this.processQueue()

    return true
  }

  forceRelease(): boolean {
    if (!this.currentLock) {
      return false
    }

    this.currentLock = null
    this.processQueue()

    return true
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true

    this.currentLock = null

    const error = new Error('MailboxLock disposed')

    for (const request of this.waitQueue) {
      if (request.timeoutId) {
        clearTimeout(request.timeoutId)
      }

      request.reject(error)
    }

    this.waitQueue.length = 0
  }

  [Symbol.asyncDispose](): Promise<void> {
    this.dispose()
    return Promise.resolve()
  }

  private createLock(path: MailboxPath): Lock {
    this.lockCounter += 1
    const lockId = `lock-${this.lockCounter}`

    const lock: Lock = {
      lockId,
      path,
      release: () => this.release(lockId),
    }

    this.currentLock = lock

    return lock
  }

  private processQueue(): void {
    if (this.disposed || this.currentLock || this.waitQueue.length === 0) {
      return
    }

    const request = this.waitQueue.shift()

    if (!request) {
      return
    }

    if (request.timeoutId) {
      clearTimeout(request.timeoutId)
    }

    const lock = this.createLock(request.path)

    request.resolve(lock)
  }
}

export const createMailboxLock = (): MailboxLock => new MailboxLock()
