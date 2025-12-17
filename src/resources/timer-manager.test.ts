import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TimerManager } from './timer-manager'

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

describe('TimerManager', () => {
  let manager: TimerManager

  beforeEach(() => {
    manager = new TimerManager()
  })

  afterEach(() => {
    manager.dispose()
  })

  describe('set', () => {
    it('should set a timer that executes after delay', async () => {
      const callback = vi.fn()

      manager.set('test', callback, 20)
      expect(callback).not.toHaveBeenCalled()

      await delay(30)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should track the timer', () => {
      manager.set('test', vi.fn(), 1000)

      expect(manager.has('test')).toBe(true)
      expect(manager.count).toBe(1)
    })

    it('should remove timer from tracking after it fires', async () => {
      manager.set('test', vi.fn(), 20)
      expect(manager.has('test')).toBe(true)

      await delay(30)
      expect(manager.has('test')).toBe(false)
      expect(manager.count).toBe(0)
    })

    it('should replace existing timer with same name', async () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      manager.set('test', callback1, 20)
      manager.set('test', callback2, 20)

      await delay(30)
      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple timers with different names', async () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()
      const callback3 = vi.fn()

      manager.set('timer1', callback1, 10)
      manager.set('timer2', callback2, 30)
      manager.set('timer3', callback3, 50)

      expect(manager.count).toBe(3)

      await delay(20)
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).not.toHaveBeenCalled()
      expect(callback3).not.toHaveBeenCalled()
      expect(manager.count).toBe(2)

      await delay(20)
      expect(callback2).toHaveBeenCalledTimes(1)
      expect(callback3).not.toHaveBeenCalled()
      expect(manager.count).toBe(1)

      await delay(20)
      expect(callback3).toHaveBeenCalledTimes(1)
      expect(manager.count).toBe(0)
    })

    it('should not set timer when disposed', async () => {
      manager.dispose()
      const callback = vi.fn()

      manager.set('test', callback, 20)

      expect(manager.has('test')).toBe(false)
      await delay(30)
      expect(callback).not.toHaveBeenCalled()
    })

    it('should not execute callback if disposed before timer fires', async () => {
      const callback = vi.fn()

      manager.set('test', callback, 50)
      manager.dispose()

      await delay(60)
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('clear', () => {
    it('should clear a specific timer', async () => {
      const callback = vi.fn()

      manager.set('test', callback, 20)
      manager.clear('test')

      expect(manager.has('test')).toBe(false)
      await delay(30)
      expect(callback).not.toHaveBeenCalled()
    })

    it('should not affect other timers', async () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      manager.set('timer1', callback1, 20)
      manager.set('timer2', callback2, 20)

      manager.clear('timer1')

      expect(manager.has('timer1')).toBe(false)
      expect(manager.has('timer2')).toBe(true)

      await delay(30)
      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('should handle clearing non-existent timer', () => {
      expect(() => {
        manager.clear('non-existent')
      }).not.toThrow()
    })
  })

  describe('has', () => {
    it('should return true for existing timer', () => {
      manager.set('test', vi.fn(), 1000)
      expect(manager.has('test')).toBe(true)
    })

    it('should return false for non-existent timer', () => {
      expect(manager.has('test')).toBe(false)
    })

    it('should return false after timer fires', async () => {
      manager.set('test', vi.fn(), 20)
      await delay(30)
      expect(manager.has('test')).toBe(false)
    })

    it('should return false after timer is cleared', () => {
      manager.set('test', vi.fn(), 1000)
      manager.clear('test')
      expect(manager.has('test')).toBe(false)
    })
  })

  describe('dispose', () => {
    it('should clear all timers', async () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      manager.set('timer1', callback1, 20)
      manager.set('timer2', callback2, 20)

      manager.dispose()

      expect(manager.count).toBe(0)
      await delay(30)
      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).not.toHaveBeenCalled()
    })

    it('should set isDisposed to true', () => {
      expect(manager.isDisposed).toBe(false)
      manager.dispose()
      expect(manager.isDisposed).toBe(true)
    })

    it('should be idempotent', () => {
      manager.set('test', vi.fn(), 1000)

      manager.dispose()
      manager.dispose()
      manager.dispose()

      expect(manager.isDisposed).toBe(true)
      expect(manager.count).toBe(0)
    })
  })

  describe('AsyncDisposable', () => {
    it('should implement Symbol.asyncDispose', async () => {
      const callback = vi.fn()
      manager.set('test', callback, 20)

      await manager[Symbol.asyncDispose]()

      expect(manager.isDisposed).toBe(true)
      await delay(30)
      expect(callback).not.toHaveBeenCalled()
    })

    it('should work with await using', async () => {
      const callback = vi.fn()

      await (async () => {
        await using localManager = new TimerManager()
        await Promise.resolve()
        localManager.set('test', callback, 50)
        expect(localManager.has('test')).toBe(true)
      })()

      await delay(60)
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('count', () => {
    it('should return 0 initially', () => {
      expect(manager.count).toBe(0)
    })

    it('should return the number of active timers', () => {
      manager.set('timer1', vi.fn(), 1000)
      expect(manager.count).toBe(1)

      manager.set('timer2', vi.fn(), 1000)
      expect(manager.count).toBe(2)

      manager.set('timer3', vi.fn(), 1000)
      expect(manager.count).toBe(3)
    })

    it('should decrease when timers fire', async () => {
      manager.set('timer1', vi.fn(), 10)
      manager.set('timer2', vi.fn(), 30)
      expect(manager.count).toBe(2)

      await delay(20)
      expect(manager.count).toBe(1)

      await delay(20)
      expect(manager.count).toBe(0)
    })
  })

  describe('isDisposed', () => {
    it('should return false initially', () => {
      expect(manager.isDisposed).toBe(false)
    })

    it('should return true after dispose', () => {
      manager.dispose()
      expect(manager.isDisposed).toBe(true)
    })
  })
})
