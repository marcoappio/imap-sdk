import { IMAPClient } from './index'

type TestableClient = {
  _capabilities: Set<string>
  enableExtensions: () => Promise<void>
  run: IMAPClient['run']
}

const createTestClient = (): TestableClient =>
  new IMAPClient({
    host: 'imap.example.com',
    logger: false,
    port: 993,
    secure: true,
  }) as unknown as TestableClient

describe('IMAPClient', () => {
  describe('enableExtensions', () => {
    it('should enable CONDSTORE when capability is present', async () => {
      const client = createTestClient()
      const runCalls: { command: string; args: unknown[] }[] = []

      client._capabilities = new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE'])
      client.run = ((command: string, ...args: unknown[]) => {
        runCalls.push({ args, command })
        return Promise.resolve(new Set(['CONDSTORE']))
      }) as typeof client.run

      await client.enableExtensions()

      expect(runCalls.length).toBe(1)
      expect(runCalls[0].command).toBe('ENABLE')
      expect(runCalls[0].args).toEqual([['CONDSTORE']])
    })

    it('should enable QRESYNC when capability is present', async () => {
      const client = createTestClient()
      const runCalls: { command: string; args: unknown[] }[] = []

      client._capabilities = new Set(['IMAP4rev1', 'ENABLE', 'QRESYNC'])
      client.run = ((command: string, ...args: unknown[]) => {
        runCalls.push({ args, command })
        return Promise.resolve(new Set(['QRESYNC']))
      }) as typeof client.run

      await client.enableExtensions()

      expect(runCalls.length).toBe(1)
      expect(runCalls[0].args).toEqual([['QRESYNC']])
    })

    it('should enable UTF8=ACCEPT when capability is present', async () => {
      const client = createTestClient()
      const runCalls: { command: string; args: unknown[] }[] = []

      client._capabilities = new Set(['IMAP4rev1', 'ENABLE', 'UTF8=ACCEPT'])
      client.run = ((command: string, ...args: unknown[]) => {
        runCalls.push({ args, command })
        return Promise.resolve(new Set(['UTF8=ACCEPT']))
      }) as typeof client.run

      await client.enableExtensions()

      expect(runCalls.length).toBe(1)
      expect(runCalls[0].args).toEqual([['UTF8=ACCEPT']])
    })

    it('should enable all supported extensions when present', async () => {
      const client = createTestClient()
      const runCalls: { command: string; args: unknown[] }[] = []

      client._capabilities = new Set(['IMAP4rev1', 'ENABLE', 'CONDSTORE', 'QRESYNC', 'UTF8=ACCEPT'])
      client.run = ((command: string, ...args: unknown[]) => {
        runCalls.push({ args, command })
        return Promise.resolve(new Set(['CONDSTORE', 'QRESYNC', 'UTF8=ACCEPT']))
      }) as typeof client.run

      await client.enableExtensions()

      expect(runCalls.length).toBe(1)
      expect(runCalls[0].command).toBe('ENABLE')
      expect(runCalls[0].args).toEqual([['CONDSTORE', 'QRESYNC', 'UTF8=ACCEPT']])
    })

    it('should not call ENABLE when no supported extensions are present', async () => {
      const client = createTestClient()
      const runCalls: { command: string; args: unknown[] }[] = []

      client._capabilities = new Set(['IMAP4rev1', 'IDLE'])
      client.run = ((command: string, ...args: unknown[]) => {
        runCalls.push({ args, command })
        return Promise.resolve(new Set())
      }) as typeof client.run

      await client.enableExtensions()

      expect(runCalls.length).toBe(0)
    })
  })
})
