import { EventEmitter } from 'events'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ListenerTracker } from './listener-tracker'

describe('ListenerTracker', () => {
  let tracker: ListenerTracker
  let emitter: EventEmitter

  beforeEach(() => {
    tracker = new ListenerTracker()
    emitter = new EventEmitter()
  })

  afterEach(() => {
    tracker.dispose()
  })

  describe('on', () => {
    it('should add a listener and track it', () => {
      const handler = vi.fn()

      tracker.on(emitter, 'test', handler)
      emitter.emit('test', 'arg1', 'arg2')

      expect(handler).toHaveBeenCalledWith('arg1', 'arg2')
      expect(tracker.count).toBe(1)
    })

    it('should return a cleanup function', () => {
      const handler = vi.fn()

      const cleanup = tracker.on(emitter, 'test', handler)
      expect(tracker.count).toBe(1)

      cleanup()
      expect(tracker.count).toBe(0)

      emitter.emit('test')
      expect(handler).not.toHaveBeenCalled()
    })

    it('should track multiple listeners', () => {
      tracker.on(emitter, 'event1', vi.fn())
      tracker.on(emitter, 'event2', vi.fn())
      tracker.on(emitter, 'event3', vi.fn())

      expect(tracker.count).toBe(3)
    })

    it('should throw when disposed', () => {
      tracker.dispose()

      expect(() => {
        tracker.on(emitter, 'test', vi.fn())
      }).toThrow('ListenerTracker has been disposed')
    })
  })

  describe('once', () => {
    it('should add a one-time listener', () => {
      const handler = vi.fn()

      tracker.once(emitter, 'test', handler)
      expect(tracker.count).toBe(1)

      emitter.emit('test', 'value')
      expect(handler).toHaveBeenCalledWith('value')
      expect(handler).toHaveBeenCalledTimes(1)

      expect(tracker.count).toBe(0)
    })

    it('should auto-remove after first call', () => {
      const handler = vi.fn()

      tracker.once(emitter, 'test', handler)
      emitter.emit('test')
      emitter.emit('test')

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should return a cleanup function that works before emit', () => {
      const handler = vi.fn()

      const cleanup = tracker.once(emitter, 'test', handler)
      cleanup()

      emitter.emit('test')
      expect(handler).not.toHaveBeenCalled()
    })

    it('should throw when disposed', () => {
      tracker.dispose()

      expect(() => {
        tracker.once(emitter, 'test', vi.fn())
      }).toThrow('ListenerTracker has been disposed')
    })
  })

  describe('remove', () => {
    it('should remove a specific listener', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      tracker.on(emitter, 'test', handler1)
      tracker.on(emitter, 'test', handler2)
      expect(tracker.count).toBe(2)

      tracker.remove(emitter, 'test', handler1)
      expect(tracker.count).toBe(1)

      emitter.emit('test')
      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
    })

    it('should handle removing non-existent listener', () => {
      const handler = vi.fn()

      tracker.remove(emitter, 'test', handler)

      expect(tracker.count).toBe(0)
    })
  })

  describe('removeAllFor', () => {
    it('should remove all listeners for a specific emitter', () => {
      const emitter2 = new EventEmitter()

      tracker.on(emitter, 'event1', vi.fn())
      tracker.on(emitter, 'event2', vi.fn())
      tracker.on(emitter2, 'event1', vi.fn())

      expect(tracker.count).toBe(3)

      tracker.removeAllFor(emitter)
      expect(tracker.count).toBe(1)
    })

    it('should not affect other emitters', () => {
      const emitter2 = new EventEmitter()
      const handler2 = vi.fn()

      tracker.on(emitter, 'test', vi.fn())
      tracker.on(emitter2, 'test', handler2)

      tracker.removeAllFor(emitter)

      emitter2.emit('test')
      expect(handler2).toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should remove all tracked listeners', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      tracker.on(emitter, 'event1', handler1)
      tracker.on(emitter, 'event2', handler2)

      tracker.dispose()

      expect(tracker.count).toBe(0)
      expect(tracker.isDisposed).toBe(true)

      emitter.emit('event1')
      emitter.emit('event2')

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).not.toHaveBeenCalled()
    })

    it('should be idempotent', () => {
      tracker.on(emitter, 'test', vi.fn())

      tracker.dispose()
      tracker.dispose()
      tracker.dispose()

      expect(tracker.isDisposed).toBe(true)
      expect(tracker.count).toBe(0)
    })
  })

  describe('AsyncDisposable', () => {
    it('should implement Symbol.asyncDispose', async () => {
      const handler = vi.fn()
      tracker.on(emitter, 'test', handler)

      await tracker[Symbol.asyncDispose]()

      expect(tracker.isDisposed).toBe(true)
      emitter.emit('test')
      expect(handler).not.toHaveBeenCalled()
    })

    it('should work with await using', async () => {
      const localEmitter = new EventEmitter()
      const handler = vi.fn()

      await (async () => {
        await using localTracker = new ListenerTracker()
        await Promise.resolve()
        localTracker.on(localEmitter, 'test', handler)
        localEmitter.emit('test')
        expect(handler).toHaveBeenCalledTimes(1)
      })()

      localEmitter.emit('test')
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('count', () => {
    it('should return the number of tracked listeners', () => {
      expect(tracker.count).toBe(0)

      tracker.on(emitter, 'test1', vi.fn())
      expect(tracker.count).toBe(1)

      tracker.on(emitter, 'test2', vi.fn())
      expect(tracker.count).toBe(2)
    })
  })

  describe('isDisposed', () => {
    it('should return false initially', () => {
      expect(tracker.isDisposed).toBe(false)
    })

    it('should return true after dispose', () => {
      tracker.dispose()
      expect(tracker.isDisposed).toBe(true)
    })
  })
})
