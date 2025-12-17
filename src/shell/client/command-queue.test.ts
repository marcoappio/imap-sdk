import type { Tag } from '@imap-sdk/types/common'

import { CommandQueue, createCommandQueue } from './command-queue'

describe('CommandQueue', () => {
  describe('constructor', () => {
    it('should create with default options', () => {
      const queue = new CommandQueue()
      expect(queue.isDisposed).toBe(false)
      expect(queue.pendingCount).toBe(0)
      expect(queue.queueLength).toBe(0)
    })

    it('should create with custom prefix', () => {
      const queue = new CommandQueue({ prefix: 'B' })
      const tag = queue.nextTag()
      expect(tag).toBe('B0001')
    })

    it('should create via factory function', () => {
      const queue = createCommandQueue({ prefix: 'C' })
      expect(queue).toBeInstanceOf(CommandQueue)
      expect(queue.nextTag()).toBe('C0001')
    })
  })

  describe('nextTag', () => {
    it('should generate sequential tags', () => {
      const queue = new CommandQueue()
      expect(queue.nextTag()).toBe('A0001')
      expect(queue.nextTag()).toBe('A0002')
      expect(queue.nextTag()).toBe('A0003')
    })

    it('should pad tag numbers to 4 digits', () => {
      const queue = new CommandQueue()
      for (let i = 0; i < 999; i++) {
        queue.nextTag()
      }
      expect(queue.nextTag()).toBe('A1000')
    })
  })

  describe('acquire', () => {
    it('should return a tag immediately when no commands pending', async () => {
      const queue = new CommandQueue()
      const tag = await queue.acquire()
      expect(tag).toBe('A0001')
    })

    it('should wait when max concurrent reached', async () => {
      const queue = new CommandQueue({ maxConcurrent: 1 })

      const tag1 = await queue.acquire()
      queue.register(tag1, 'TEST')

      let secondResolved = false
      const secondPromise = queue.acquire().then(tag => {
        secondResolved = true
        return tag
      })

      await new Promise(resolve => setTimeout(resolve, 10))
      expect(secondResolved).toBe(false)

      queue.resolve(tag1, 'result')

      const tag2 = await secondPromise
      expect(secondResolved).toBe(true)
      expect(tag2).toBe('A0002')
    })

    it('should reject when disposed', async () => {
      const queue = new CommandQueue()
      queue.dispose()
      await expect(queue.acquire()).rejects.toThrow('disposed')
    })
  })

  describe('register', () => {
    it('should return a promise for the command result', async () => {
      const queue = new CommandQueue()
      const tag = await queue.acquire()
      const promise = queue.register(tag, 'TEST')

      expect(queue.pendingCount).toBe(1)
      expect(queue.has(tag)).toBe(true)

      queue.resolve(tag, 'result')
      await expect(promise).resolves.toBe('result')
    })

    it('should reject when disposed', async () => {
      const queue = new CommandQueue()
      queue.dispose()
      await expect(queue.register('A0001' as Tag, 'TEST')).rejects.toThrow('disposed')
    })
  })

  describe('resolve', () => {
    it('should resolve pending command', async () => {
      const queue = new CommandQueue()
      const tag = await queue.acquire()
      const promise = queue.register(tag, 'TEST')

      const resolved = queue.resolve(tag, 'success')

      expect(resolved).toBe(true)
      expect(queue.pendingCount).toBe(0)
      await expect(promise).resolves.toBe('success')
    })

    it('should return false for unknown tag', () => {
      const queue = new CommandQueue()
      const resolved = queue.resolve('UNKNOWN' as Tag, 'value')
      expect(resolved).toBe(false)
    })

    it('should release slot for waiting commands', async () => {
      const queue = new CommandQueue({ maxConcurrent: 1 })

      const tag1 = await queue.acquire()
      queue.register(tag1, 'TEST1')

      const acquirePromise = queue.acquire()
      queue.resolve(tag1, 'done')

      const tag2 = await acquirePromise
      expect(tag2).toBeDefined()
    })
  })

  describe('reject', () => {
    it('should reject pending command', async () => {
      const queue = new CommandQueue()
      const tag = await queue.acquire()
      const promise = queue.register(tag, 'TEST')

      const rejected = queue.reject(tag, new Error('Test error'))

      expect(rejected).toBe(true)
      expect(queue.pendingCount).toBe(0)
      await expect(promise).rejects.toThrow('Test error')
    })

    it('should return false for unknown tag', () => {
      const queue = new CommandQueue()
      const rejected = queue.reject('UNKNOWN' as Tag, new Error('error'))
      expect(rejected).toBe(false)
    })
  })

  describe('rejectAll', () => {
    it('should reject all pending commands', async () => {
      const queue = new CommandQueue({ maxConcurrent: 10 })

      const promises: Promise<unknown>[] = []
      for (let i = 0; i < 5; i++) {
        const tag = await queue.acquire()
        promises.push(queue.register(tag, `TEST${i}`))
      }

      queue.rejectAll(new Error('Connection closed'))

      for (const promise of promises) {
        await expect(promise).rejects.toThrow('Connection closed')
      }

      expect(queue.pendingCount).toBe(0)
    })

    it('should unblock waiting acquires', async () => {
      const queue = new CommandQueue({ maxConcurrent: 1 })

      const tag1 = await queue.acquire()
      const registerPromise = queue.register(tag1, 'TEST').catch(() => {})

      let acquireResolved = false
      const acquirePromise = queue.acquire().then(tag => {
        acquireResolved = true
        return tag
      })

      queue.rejectAll(new Error('Closed'))

      await registerPromise

      const tag2 = await acquirePromise
      expect(acquireResolved).toBe(true)
      expect(tag2).toBe('A0002')
    })
  })

  describe('has', () => {
    it('should return true for pending tags', async () => {
      const queue = new CommandQueue()
      const tag = await queue.acquire()
      queue.register(tag, 'TEST')

      expect(queue.has(tag)).toBe(true)
    })

    it('should return false for unknown tags', () => {
      const queue = new CommandQueue()
      expect(queue.has('UNKNOWN' as Tag)).toBe(false)
    })

    it('should return false after resolve', async () => {
      const queue = new CommandQueue()
      const tag = await queue.acquire()
      queue.register(tag, 'TEST')
      queue.resolve(tag, 'done')

      expect(queue.has(tag)).toBe(false)
    })
  })

  describe('get', () => {
    it('should return pending command info', async () => {
      const queue = new CommandQueue()
      const tag = await queue.acquire()
      queue.register(tag, 'SELECT')

      const pending = queue.get(tag)

      expect(pending).toBeDefined()
      expect(pending?.tag).toBe(tag)
      expect(pending?.command).toBe('SELECT')
      expect(pending?.createdAt).toBeLessThanOrEqual(Date.now())
    })

    it('should return undefined for unknown tags', () => {
      const queue = new CommandQueue()
      expect(queue.get('UNKNOWN' as Tag)).toBeUndefined()
    })
  })

  describe('dispose', () => {
    it('should reject all pending commands', async () => {
      const queue = new CommandQueue()
      const tag = await queue.acquire()
      const promise = queue.register(tag, 'TEST')

      queue.dispose()

      await expect(promise).rejects.toThrow('disposed')
      expect(queue.isDisposed).toBe(true)
    })

    it('should be idempotent', () => {
      const queue = new CommandQueue()
      queue.dispose()
      queue.dispose()
      expect(queue.isDisposed).toBe(true)
    })
  })

  describe('Symbol.asyncDispose', () => {
    it('should dispose the queue', async () => {
      const queue = new CommandQueue()
      await queue[Symbol.asyncDispose]()
      expect(queue.isDisposed).toBe(true)
    })
  })
})
