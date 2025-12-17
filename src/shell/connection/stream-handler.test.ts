import { describe, expect, it, vi } from 'vitest'

import { createIMAPStream, IMAPStream, LiteralTooLargeError } from './stream-handler'

describe('IMAPStream', () => {
  describe('createIMAPStream', () => {
    it('should create an IMAPStream instance', () => {
      const stream = createIMAPStream()
      expect(stream).toBeInstanceOf(IMAPStream)
    })

    it('should accept options', () => {
      const stream = createIMAPStream({
        cid: 'test-connection',
        logRaw: true,
        secureConnection: true,
      })
      expect(stream).toBeInstanceOf(IMAPStream)
    })
  })

  describe('simple line parsing', () => {
    it('should parse a simple response line', async () => {
      const stream = createIMAPStream()
      const outputs: { payload: Buffer; literals: readonly Buffer[] }[] = []

      stream.on('data', data => {
        outputs.push({ literals: data.literals, payload: data.payload })
        data.next()
      })

      stream.write('* OK IMAP4rev1 Server Ready\r\n')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(outputs).toHaveLength(1)
      expect(outputs[0].payload.toString()).toBe('* OK IMAP4rev1 Server Ready')
      expect(outputs[0].literals).toHaveLength(0)
    })

    it('should parse multiple response lines', async () => {
      const stream = createIMAPStream()
      const outputs: { payload: Buffer; literals: readonly Buffer[] }[] = []

      stream.on('data', data => {
        outputs.push({ literals: data.literals, payload: data.payload })
        data.next()
      })

      stream.write('* OK Ready\r\n')
      stream.write('A001 OK Login successful\r\n')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(outputs).toHaveLength(2)
      expect(outputs[0].payload.toString()).toBe('* OK Ready')
      expect(outputs[1].payload.toString()).toBe('A001 OK Login successful')
    })

    it('should handle lines ending with LF only', async () => {
      const stream = createIMAPStream()
      const outputs: { payload: Buffer }[] = []

      stream.on('data', data => {
        outputs.push({ payload: data.payload })
        data.next()
      })

      stream.write('* OK Ready\n')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(outputs).toHaveLength(1)
      expect(outputs[0].payload.toString()).toBe('* OK Ready')
    })
  })

  describe('literal parsing', () => {
    it('should parse a response with a literal', async () => {
      const stream = createIMAPStream()
      const outputs: { payload: Buffer; literals: readonly Buffer[] }[] = []

      stream.on('data', data => {
        outputs.push({ literals: data.literals, payload: data.payload })
        data.next()
      })

      stream.write('* 1 FETCH (BODY[] {11}\r\n')
      stream.write('Hello World)\r\n')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(outputs).toHaveLength(1)
      expect(outputs[0].payload.toString()).toBe('* 1 FETCH (BODY[] {11}\r\n)')
      expect(outputs[0].literals).toHaveLength(1)
      expect(outputs[0].literals[0].toString()).toBe('Hello World')
    })

    it('should handle literal split across chunks', async () => {
      const stream = createIMAPStream()
      const outputs: { payload: Buffer; literals: readonly Buffer[] }[] = []

      stream.on('data', data => {
        outputs.push({ literals: data.literals, payload: data.payload })
        data.next()
      })

      stream.write('* 1 FETCH (BODY[] {10}\r\n')
      stream.write('Hello')
      stream.write(' ')
      stream.write('Test)\r\n')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(outputs).toHaveLength(1)
      expect(outputs[0].literals).toHaveLength(1)
      expect(outputs[0].literals[0].toString()).toBe('Hello Test')
    })

    it('should parse multiple literals in one response', async () => {
      const stream = createIMAPStream()
      const outputs: { payload: Buffer; literals: readonly Buffer[] }[] = []

      stream.on('data', data => {
        outputs.push({ literals: data.literals, payload: data.payload })
        data.next()
      })

      stream.write('* 1 FETCH (RFC822.HEADER {5}\r\n')
      stream.write('From:')
      stream.write(' RFC822.TEXT {4}\r\n')
      stream.write('Body)\r\n')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(outputs).toHaveLength(1)
      expect(outputs[0].literals).toHaveLength(2)
      expect(outputs[0].literals[0].toString()).toBe('From:')
      expect(outputs[0].literals[1].toString()).toBe('Body')
    })
  })

  describe('bytesRead counter', () => {
    it('should track bytes read', async () => {
      const stream = createIMAPStream()

      stream.on('data', data => {
        data.next()
      })

      expect(stream.bytesRead).toBe(0)

      stream.write('* OK Ready\r\n')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(stream.bytesRead).toBe(12)
    })
  })

  describe('error handling', () => {
    it('should emit error for oversized literals', async () => {
      const stream = createIMAPStream()
      const errors: Error[] = []

      stream.on('error', error => {
        errors.push(error)
      })

      stream.on('data', data => {
        data.next()
      })

      stream.write(`* 1 FETCH (BODY[] {${1024 * 1024 * 1024 + 1}}\r\n`)
      stream.end()

      await new Promise(resolve => setTimeout(resolve, 10))

      expect(errors).toHaveLength(1)
      expect(errors[0]).toBeInstanceOf(LiteralTooLargeError)
      expect((errors[0] as LiteralTooLargeError).code).toBe('LiteralTooLarge')
    })
  })

  describe('LiteralTooLargeError', () => {
    it('should have correct properties', () => {
      const error = new LiteralTooLargeError(2_000_000_000, 1_073_741_824)

      expect(error.name).toBe('LiteralTooLargeError')
      expect(error.code).toBe('LiteralTooLarge')
      expect(error.literalSize).toBe(2_000_000_000)
      expect(error.maxSize).toBe(1_073_741_824)
      expect(error.message).toContain('2000000000')
      expect(error.message).toContain('1073741824')
    })
  })

  describe('compress flag', () => {
    it('should have compress property', () => {
      const stream = createIMAPStream()

      expect(stream.compress).toBe(false)
      stream.compress = true
      expect(stream.compress).toBe(true)
    })
  })

  describe('chunked input', () => {
    it('should handle response split across many chunks', async () => {
      const stream = createIMAPStream()
      const outputs: { payload: Buffer }[] = []

      stream.on('data', data => {
        outputs.push({ payload: data.payload })
        data.next()
      })

      stream.write('* ')
      stream.write('OK ')
      stream.write('Ready')
      stream.write('\r')
      stream.write('\n')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(outputs).toHaveLength(1)
      expect(outputs[0].payload.toString()).toBe('* OK Ready')
    })

    it('should handle empty chunks', async () => {
      const stream = createIMAPStream()
      const outputs: { payload: Buffer }[] = []

      stream.on('data', data => {
        outputs.push({ payload: data.payload })
        data.next()
      })

      stream.write('')
      stream.write('* OK Ready\r\n')
      stream.write('')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(outputs).toHaveLength(1)
    })
  })

  describe('logging', () => {
    it('should log raw data when logRaw is enabled', async () => {
      const traceFn = vi.fn()
      const logger = {
        child: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        trace: traceFn,
        warn: vi.fn(),
      }

      const stream = createIMAPStream({
        cid: 'test-cid',
        logger,
        logRaw: true,
        secureConnection: true,
      })

      stream.on('data', data => {
        data.next()
      })

      stream.write('* OK Ready\r\n')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(traceFn).toHaveBeenCalledWith(
        expect.objectContaining({
          cid: 'test-cid',
          compress: false,
          secure: true,
          src: 's',
        }),
      )
    })

    it('should not log when logRaw is disabled', async () => {
      const traceFn = vi.fn()
      const logger = {
        child: vi.fn(),
        debug: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        trace: traceFn,
        warn: vi.fn(),
      }

      const stream = createIMAPStream({
        logger,
        logRaw: false,
      })

      stream.on('data', data => {
        data.next()
      })

      stream.write('* OK Ready\r\n')
      stream.end()

      await new Promise(resolve => stream.on('finish', resolve))

      expect(traceFn).not.toHaveBeenCalled()
    })
  })
})
