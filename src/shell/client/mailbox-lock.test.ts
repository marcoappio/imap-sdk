import type { MailboxPath } from '@imap-sdk/types/common'

import { createMailboxLock, MailboxLock } from './mailbox-lock'

describe('MailboxLock', () => {
  describe('constructor', () => {
    it('should create with no current lock', () => {
      const lock = new MailboxLock()
      expect(lock.isLocked).toBe(false)
      expect(lock.currentPath).toBeNull()
      expect(lock.currentLockId).toBeNull()
      expect(lock.queueLength).toBe(0)
    })

    it('should create via factory function', () => {
      const lock = createMailboxLock()
      expect(lock).toBeInstanceOf(MailboxLock)
      expect(lock.isDisposed).toBe(false)
    })
  })

  describe('acquire', () => {
    it('should acquire lock immediately when not locked', async () => {
      const lock = new MailboxLock()
      const acquired = await lock.acquire('INBOX' as MailboxPath)

      expect(acquired.lockId).toBe('lock-1')
      expect(acquired.path).toBe('INBOX')
      expect(lock.isLocked).toBe(true)
      expect(lock.currentPath).toBe('INBOX')
    })

    it('should wait when already locked', async () => {
      const lock = new MailboxLock()
      const first = await lock.acquire('INBOX' as MailboxPath)

      let secondAcquired = false
      const secondPromise = lock.acquire('Archive' as MailboxPath).then(l => {
        secondAcquired = true
        return l
      })

      await new Promise(resolve => setTimeout(resolve, 10))
      expect(secondAcquired).toBe(false)
      expect(lock.queueLength).toBe(1)

      first.release()

      const second = await secondPromise
      expect(secondAcquired).toBe(true)
      expect(second.path).toBe('Archive')
    })

    it('should timeout waiting for lock', async () => {
      const lock = new MailboxLock()
      await lock.acquire('INBOX' as MailboxPath)

      await expect(lock.acquire('Archive' as MailboxPath, { timeout: 50 })).rejects.toThrow('timed out')
    })

    it('should reject when disposed', async () => {
      const lock = new MailboxLock()
      lock.dispose()

      await expect(lock.acquire('INBOX' as MailboxPath)).rejects.toThrow('disposed')
    })

    it('should generate unique lock IDs', async () => {
      const lock = new MailboxLock()

      const first = await lock.acquire('INBOX' as MailboxPath)
      first.release()

      const second = await lock.acquire('INBOX' as MailboxPath)
      second.release()

      const third = await lock.acquire('INBOX' as MailboxPath)

      expect(first.lockId).toBe('lock-1')
      expect(second.lockId).toBe('lock-2')
      expect(third.lockId).toBe('lock-3')
    })
  })

  describe('tryAcquire', () => {
    it('should return lock when not locked', () => {
      const lock = new MailboxLock()
      const acquired = lock.tryAcquire('INBOX' as MailboxPath)

      expect(acquired).not.toBeNull()
      expect(acquired?.lockId).toBe('lock-1')
      expect(acquired?.path).toBe('INBOX')
    })

    it('should return null when already locked', async () => {
      const lock = new MailboxLock()
      await lock.acquire('INBOX' as MailboxPath)

      const second = lock.tryAcquire('Archive' as MailboxPath)
      expect(second).toBeNull()
    })

    it('should return null when disposed', () => {
      const lock = new MailboxLock()
      lock.dispose()

      const acquired = lock.tryAcquire('INBOX' as MailboxPath)
      expect(acquired).toBeNull()
    })
  })

  describe('release', () => {
    it('should release current lock', async () => {
      const lock = new MailboxLock()
      const acquired = await lock.acquire('INBOX' as MailboxPath)

      const released = lock.release(acquired.lockId)

      expect(released).toBe(true)
      expect(lock.isLocked).toBe(false)
      expect(lock.currentPath).toBeNull()
    })

    it('should return false for wrong lock ID', async () => {
      const lock = new MailboxLock()
      await lock.acquire('INBOX' as MailboxPath)

      const released = lock.release('wrong-id')
      expect(released).toBe(false)
      expect(lock.isLocked).toBe(true)
    })

    it('should return false when not locked', () => {
      const lock = new MailboxLock()
      const released = lock.release('any-id')
      expect(released).toBe(false)
    })

    it('should process waiting queue after release', async () => {
      const lock = new MailboxLock()
      const first = await lock.acquire('INBOX' as MailboxPath)

      const secondPromise = lock.acquire('Archive' as MailboxPath)
      expect(lock.queueLength).toBe(1)

      first.release()

      const second = await secondPromise
      expect(second.path).toBe('Archive')
      expect(lock.queueLength).toBe(0)
    })
  })

  describe('forceRelease', () => {
    it('should release current lock regardless of ID', async () => {
      const lock = new MailboxLock()
      await lock.acquire('INBOX' as MailboxPath)

      const released = lock.forceRelease()

      expect(released).toBe(true)
      expect(lock.isLocked).toBe(false)
    })

    it('should return false when not locked', () => {
      const lock = new MailboxLock()
      const released = lock.forceRelease()
      expect(released).toBe(false)
    })
  })

  describe('Lock.release', () => {
    it('should release via lock object method', async () => {
      const lock = new MailboxLock()
      const acquired = await lock.acquire('INBOX' as MailboxPath)

      acquired.release()

      expect(lock.isLocked).toBe(false)
    })
  })

  describe('dispose', () => {
    it('should clear current lock', async () => {
      const lock = new MailboxLock()
      await lock.acquire('INBOX' as MailboxPath)

      lock.dispose()

      expect(lock.isDisposed).toBe(true)
      expect(lock.isLocked).toBe(false)
    })

    it('should reject all waiting requests', async () => {
      const lock = new MailboxLock()
      await lock.acquire('INBOX' as MailboxPath)

      const waitingPromise = lock.acquire('Archive' as MailboxPath)
      lock.dispose()

      await expect(waitingPromise).rejects.toThrow('disposed')
    })

    it('should clear timeouts for waiting requests', async () => {
      const lock = new MailboxLock()
      await lock.acquire('INBOX' as MailboxPath)

      const waitingPromise = lock.acquire('Archive' as MailboxPath, { timeout: 10_000 })
      lock.dispose()

      await expect(waitingPromise).rejects.toThrow('disposed')
    })

    it('should be idempotent', () => {
      const lock = new MailboxLock()
      lock.dispose()
      lock.dispose()
      expect(lock.isDisposed).toBe(true)
    })
  })

  describe('Symbol.asyncDispose', () => {
    it('should dispose the lock', async () => {
      const lock = new MailboxLock()
      await lock[Symbol.asyncDispose]()
      expect(lock.isDisposed).toBe(true)
    })
  })
})
