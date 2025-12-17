type TimerId = ReturnType<typeof setTimeout>

export class TimerManager implements AsyncDisposable {
  private readonly timers = new Map<string, TimerId>()
  private disposed = false

  set(name: string, callback: () => void, delay: number): void {
    if (this.disposed) {
      return
    }

    this.clear(name)

    const timerId = setTimeout(() => {
      this.timers.delete(name)

      if (!this.disposed) {
        callback()
      }
    }, delay)

    this.timers.set(name, timerId)
  }

  clear(name: string): void {
    const timerId = this.timers.get(name)

    if (timerId !== undefined) {
      clearTimeout(timerId)
      this.timers.delete(name)
    }
  }

  has(name: string): boolean {
    return this.timers.has(name)
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

    for (const timerId of this.timers.values()) {
      clearTimeout(timerId)
    }

    this.timers.clear()
  }

  get count(): number {
    return this.timers.size
  }

  get isDisposed(): boolean {
    return this.disposed
  }
}
