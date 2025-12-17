import type { EventEmitter } from 'events'

import { IMAPSDKError } from '@imap-sdk/types/errors'

type ListenerEntry = {
  readonly target: EventEmitter
  readonly event: string
  readonly listener: (...args: unknown[]) => void
  readonly once: boolean
}

export class ListenerTracker implements AsyncDisposable {
  private readonly listeners: ListenerEntry[] = []
  private disposed = false

  on<T extends EventEmitter>(target: T, event: string, listener: (...args: unknown[]) => void): () => void {
    if (this.disposed) {
      throw IMAPSDKError.disposed('ListenerTracker')
    }

    target.on(event, listener)
    this.listeners.push({ event, listener, once: false, target })

    return () => this.remove(target, event, listener)
  }

  once<T extends EventEmitter>(target: T, event: string, listener: (...args: unknown[]) => void): () => void {
    if (this.disposed) {
      throw IMAPSDKError.disposed('ListenerTracker')
    }

    const wrappedListener = (...args: unknown[]) => {
      const idx = this.listeners.findIndex(e => e.target === target && e.listener === wrappedListener)
      if (idx >= 0) {
        this.listeners.splice(idx, 1)
      }
      return listener(...args)
    }

    target.once(event, wrappedListener)
    this.listeners.push({ event, listener: wrappedListener, once: true, target })

    return () => this.remove(target, event, wrappedListener)
  }

  remove<T extends EventEmitter>(target: T, event: string, listener: (...args: unknown[]) => void): void {
    const idx = this.listeners.findIndex(e => e.target === target && e.event === event && e.listener === listener)

    if (idx >= 0) {
      const entry = this.listeners[idx]
      entry.target.removeListener(entry.event, entry.listener)
      this.listeners.splice(idx, 1)
    }
  }

  removeAllFor(target: EventEmitter): void {
    for (let i = this.listeners.length - 1; i >= 0; i--) {
      if (this.listeners[i].target === target) {
        const entry = this.listeners[i]
        entry.target.removeListener(entry.event, entry.listener)
        this.listeners.splice(i, 1)
      }
    }
  }

  [Symbol.asyncDispose](): Promise<void> {
    this.dispose()
    return Promise.resolve()
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true

    for (const entry of this.listeners) {
      entry.target.removeListener(entry.event, entry.listener)
    }

    this.listeners.length = 0
  }

  get count(): number {
    return this.listeners.length
  }

  get isDisposed(): boolean {
    return this.disposed
  }
}
