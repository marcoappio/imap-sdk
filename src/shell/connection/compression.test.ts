import { describe, expect, it, vi } from 'vitest'

import { CompressionHandler, createCompressionHandler } from './compression'

describe('CompressionHandler', () => {
  describe('createCompressionHandler', () => {
    it('should create a CompressionHandler instance', () => {
      const handler = createCompressionHandler()
      expect(handler).toBeInstanceOf(CompressionHandler)
    })

    it('should accept options', () => {
      const handler = createCompressionHandler({
        chunkSize: 32 * 1024,
        cid: 'test-connection',
        level: 6,
      })
      expect(handler).toBeInstanceOf(CompressionHandler)
    })
  })

  describe('initial state', () => {
    it('should not be active initially', () => {
      const handler = createCompressionHandler()
      expect(handler.isActive).toBe(false)
    })

    it('should not be disposed initially', () => {
      const handler = createCompressionHandler()
      expect(handler.isDisposed).toBe(false)
    })

    it('should return null for streams before activation', () => {
      const handler = createCompressionHandler()
      expect(handler.getDeflate()).toBeNull()
      expect(handler.getInflate()).toBeNull()
    })
  })

  describe('activate', () => {
    it('should activate compression and return streams', () => {
      const handler = createCompressionHandler()
      const streams = handler.activate()

      expect(streams.isActive).toBe(true)
      expect(streams.deflate).toBeDefined()
      expect(streams.inflate).toBeDefined()
      expect(typeof streams.dispose).toBe('function')

      handler.dispose()
    })

    it('should set isActive to true after activation', () => {
      const handler = createCompressionHandler()
      handler.activate()

      expect(handler.isActive).toBe(true)
      expect(handler.getDeflate()).not.toBeNull()
      expect(handler.getInflate()).not.toBeNull()

      handler.dispose()
    })

    it('should throw if already active', () => {
      const handler = createCompressionHandler()
      handler.activate()

      expect(() => handler.activate()).toThrow('Compression is already active')

      handler.dispose()
    })

    it('should throw if disposed', () => {
      const handler = createCompressionHandler()
      handler.dispose()

      expect(() => handler.activate()).toThrow('CompressionHandler has been disposed')
    })
  })

  describe('flush', () => {
    it('should resolve immediately if not active', async () => {
      const handler = createCompressionHandler()
      await expect(handler.flush()).resolves.toBeUndefined()
    })

    it('should flush the deflate stream', async () => {
      const handler = createCompressionHandler()
      handler.activate()

      await expect(handler.flush()).resolves.toBeUndefined()

      handler.dispose()
    })
  })

  describe('dispose', () => {
    it('should set isDisposed to true', () => {
      const handler = createCompressionHandler()
      handler.dispose()

      expect(handler.isDisposed).toBe(true)
    })

    it('should set isActive to false', () => {
      const handler = createCompressionHandler()
      handler.activate()
      handler.dispose()

      expect(handler.isActive).toBe(false)
    })

    it('should clear stream references', () => {
      const handler = createCompressionHandler()
      handler.activate()
      handler.dispose()

      expect(handler.getDeflate()).toBeNull()
      expect(handler.getInflate()).toBeNull()
    })

    it('should be idempotent', () => {
      const handler = createCompressionHandler()
      handler.activate()
      handler.dispose()
      handler.dispose()

      expect(handler.isDisposed).toBe(true)
    })

    it('should work via streams.dispose()', () => {
      const handler = createCompressionHandler()
      const streams = handler.activate()
      streams.dispose()

      expect(handler.isDisposed).toBe(true)
    })
  })

  describe('AsyncDisposable', () => {
    it('should implement Symbol.asyncDispose', async () => {
      const handler = createCompressionHandler()
      handler.activate()

      await handler[Symbol.asyncDispose]()

      expect(handler.isDisposed).toBe(true)
    })
  })

  describe('compression functionality', () => {
    it('should compress and decompress data correctly', async () => {
      const handler = createCompressionHandler()
      const { deflate, inflate } = handler.activate()

      const originalData = 'Hello, World! This is a test message for compression.'
      const chunks: Buffer[] = []

      inflate.on('data', chunk => {
        chunks.push(chunk)
      })

      const inflateEnd = new Promise<void>(resolve => {
        inflate.on('end', resolve)
      })

      deflate.write(originalData)
      deflate.pipe(inflate)
      deflate.end()

      await inflateEnd

      const result = Buffer.concat(chunks).toString()
      expect(result).toBe(originalData)

      handler.dispose()
    })
  })

  describe('error logging', () => {
    it('should log deflate errors', () => {
      const errorFn = vi.fn()
      const logger = {
        child: vi.fn(),
        debug: vi.fn(),
        error: errorFn,
        info: vi.fn(),
        trace: vi.fn(),
        warn: vi.fn(),
      }

      const handler = createCompressionHandler({
        cid: 'test-cid',
        logger,
      })

      const { deflate } = handler.activate()

      const testError = new Error('Test deflate error')
      deflate.emit('error', testError)

      expect(errorFn).toHaveBeenCalledWith(
        expect.objectContaining({
          cid: 'test-cid',
          err: testError,
          info: 'Deflate stream error',
        }),
      )

      handler.dispose()
    })

    it('should log inflate errors', () => {
      const errorFn = vi.fn()
      const logger = {
        child: vi.fn(),
        debug: vi.fn(),
        error: errorFn,
        info: vi.fn(),
        trace: vi.fn(),
        warn: vi.fn(),
      }

      const handler = createCompressionHandler({
        cid: 'test-cid',
        logger,
      })

      const { inflate } = handler.activate()

      const testError = new Error('Test inflate error')
      inflate.emit('error', testError)

      expect(errorFn).toHaveBeenCalledWith(
        expect.objectContaining({
          cid: 'test-cid',
          err: testError,
          info: 'Inflate stream error',
        }),
      )

      handler.dispose()
    })
  })
})
