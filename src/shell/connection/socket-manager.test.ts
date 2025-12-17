import { describe, expect, it, vi } from 'vitest'

import { createSocketManager, SocketManager } from './socket-manager'

describe('SocketManager', () => {
  describe('createSocketManager', () => {
    it('should create a SocketManager instance', () => {
      const manager = createSocketManager({
        host: 'localhost',
        port: 993,
      })
      expect(manager).toBeInstanceOf(SocketManager)
      manager.dispose()
    })

    it('should accept all options', () => {
      const manager = createSocketManager({
        cid: 'test-connection',
        connectionTimeout: 30_000,
        host: 'imap.example.com',
        keepAliveInterval: 10_000,
        port: 993,
        secure: true,
        servername: 'imap.example.com',
        socketTimeout: 60_000,
        tls: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
        },
      })
      expect(manager).toBeInstanceOf(SocketManager)
      manager.dispose()
    })
  })

  describe('initial state', () => {
    it('should not be connected initially', () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })

      expect(manager.isConnected).toBe(false)
      expect(manager.isDisposed).toBe(false)
      expect(manager.socketInfo).toBeNull()
      expect(manager.getSocket()).toBeNull()
      expect(manager.getWriteSocket()).toBeNull()

      manager.dispose()
    })
  })

  describe('connect', () => {
    it('should reject if disposed', async () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })
      manager.dispose()

      await expect(manager.connect()).rejects.toThrow('SocketManager has been disposed')
    })

    it('should reject connection to invalid host with timeout', async () => {
      const manager = createSocketManager({
        connectionTimeout: 100,
        host: '192.0.2.1',
        port: 993,
      })

      await expect(manager.connect()).rejects.toThrow()

      manager.dispose()
    }, 5000)
  })

  describe('upgradeToTls', () => {
    it('should reject if disposed', async () => {
      const manager = createSocketManager({ host: 'localhost', port: 143 })
      manager.dispose()

      await expect(manager.upgradeToTls()).rejects.toThrow('SocketManager has been disposed')
    })

    it('should reject if no active socket', async () => {
      const manager = createSocketManager({ host: 'localhost', port: 143 })

      await expect(manager.upgradeToTls()).rejects.toThrow('No active socket to upgrade')

      manager.dispose()
    })
  })

  describe('write', () => {
    it('should return false if no write socket', () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })

      expect(manager.write('test')).toBe(false)
      expect(manager.write(Buffer.from('test'))).toBe(false)

      manager.dispose()
    })
  })

  describe('pipe', () => {
    it('should throw if no socket', () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })
      const { PassThrough } = require('stream')

      expect(() => manager.pipe(new PassThrough())).toThrow('No socket to pipe from')

      manager.dispose()
    })
  })

  describe('unpipe', () => {
    it('should not throw if no socket', () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })

      expect(() => manager.unpipe()).not.toThrow()

      manager.dispose()
    })
  })

  describe('destroy', () => {
    it('should be safe to call multiple times', () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })

      expect(() => {
        manager.destroy()
        manager.destroy()
        manager.destroy()
      }).not.toThrow()

      manager.dispose()
    })
  })

  describe('dispose', () => {
    it('should set isDisposed to true', () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })

      manager.dispose()

      expect(manager.isDisposed).toBe(true)
    })

    it('should be idempotent', () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })

      manager.dispose()
      manager.dispose()
      manager.dispose()

      expect(manager.isDisposed).toBe(true)
    })

    it('should clear socket references', () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })

      manager.dispose()

      expect(manager.getSocket()).toBeNull()
      expect(manager.getWriteSocket()).toBeNull()
    })
  })

  describe('AsyncDisposable', () => {
    it('should implement Symbol.asyncDispose', async () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })

      await manager[Symbol.asyncDispose]()

      expect(manager.isDisposed).toBe(true)
    })
  })

  describe('event emitter', () => {
    it('should emit events', () => {
      const manager = createSocketManager({ host: 'localhost', port: 993 })
      const dataHandler = vi.fn()
      const errorHandler = vi.fn()
      const closeHandler = vi.fn()

      manager.on('data', dataHandler)
      manager.on('error', errorHandler)
      manager.on('close', closeHandler)

      expect(manager.listenerCount('data')).toBe(1)
      expect(manager.listenerCount('error')).toBe(1)
      expect(manager.listenerCount('close')).toBe(1)

      manager.dispose()

      expect(manager.listenerCount('data')).toBe(0)
      expect(manager.listenerCount('error')).toBe(0)
      expect(manager.listenerCount('close')).toBe(0)
    })
  })

  describe('TlsConnectionOptions', () => {
    it('should accept valid TLS options', () => {
      const manager = createSocketManager({
        host: 'localhost',
        port: 993,
        secure: true,
        tls: {
          ALPNProtocols: ['imap'],
          ca: 'custom-ca',
          cert: 'custom-cert',
          ciphers: 'HIGH',
          ecdhCurve: 'auto',
          key: 'custom-key',
          maxVersion: 'TLSv1.3',
          minDHSize: 2048,
          minVersion: 'TLSv1.2',
          passphrase: 'secret',
          rejectUnauthorized: false,
        },
      })

      expect(manager).toBeInstanceOf(SocketManager)
      manager.dispose()
    })
  })
})
