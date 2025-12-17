import { fetch } from './fetch'
import {
  createMockContext,
  createMockLoggerWithWarn,
  createMockResponse,
  createThrowingExec,
  createToken,
} from './test-utils'

describe('fetch command', () => {
  describe('preconditions', () => {
    it('should return undefined if state is NOT_AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'NOT_AUTHENTICATED' })
      const result = await fetch(ctx, '1:*', { uid: true })
      expect(result).toBeUndefined()
    })

    it('should return undefined if state is AUTHENTICATED', async () => {
      const ctx = createMockContext({ state: 'AUTHENTICATED' })
      const result = await fetch(ctx, '1:*', { uid: true })
      expect(result).toBeUndefined()
    })

    it('should return undefined if state is LOGOUT', async () => {
      const ctx = createMockContext({ state: 'LOGOUT' })
      const result = await fetch(ctx, '1:*', { uid: true })
      expect(result).toBeUndefined()
    })

    it('should return undefined if range is empty', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      const result = await fetch(ctx, '', { uid: true })
      expect(result).toBeUndefined()
    })

    it('should work in SELECTED state', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      const result = await fetch(ctx, '1:*', { uid: true })
      expect(result).toBeDefined()
    })
  })

  describe('command structure', () => {
    it('should send FETCH command with range', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:10', { uid: true })

      expect(ctx.mockExecCalls).toHaveLength(1)
      expect(ctx.mockExecCalls[0].command).toBe('FETCH')
      expect(ctx.mockExecCalls[0].attributes[0]).toMatchObject({
        type: 'SEQUENCE',
        value: '1:10',
      })
    })

    it('should send UID FETCH when uid option is true', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:10', { uid: true }, { uid: true })

      expect(ctx.mockExecCalls[0].command).toBe('UID FETCH')
    })

    it('should send regular FETCH when uid option is false', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:10', { uid: true }, { uid: false })

      expect(ctx.mockExecCalls[0].command).toBe('FETCH')
    })
  })

  describe('query attributes', () => {
    it('should include UID in query', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { uid: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const hasUid = JSON.stringify(queryAttrs).includes('UID')
      expect(hasUid).toBe(true)
    })

    it('should include FLAGS in query when requested', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { flags: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const hasFlags = JSON.stringify(queryAttrs).includes('FLAGS')
      expect(hasFlags).toBe(true)
    })

    it('should include BODYSTRUCTURE in query when requested', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { bodyStructure: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('BODYSTRUCTURE')
      expect(has).toBe(true)
    })

    it('should include ENVELOPE in query when requested', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { envelope: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('ENVELOPE')
      expect(has).toBe(true)
    })

    it('should include INTERNALDATE in query when requested', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { internalDate: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('INTERNALDATE')
      expect(has).toBe(true)
    })

    it('should include RFC822.SIZE in query when size is requested', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { size: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('RFC822.SIZE')
      expect(has).toBe(true)
    })

    it('should include EMAILID when OBJECTID capability is present', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'OBJECTID']),
        state: 'SELECTED',
      })
      await fetch(ctx, '1:*', { uid: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('EMAILID')
      expect(has).toBe(true)
    })

    it('should include X-GM-MSGID when X-GM-EXT-1 capability is present', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'X-GM-EXT-1']),
        state: 'SELECTED',
      })
      await fetch(ctx, '1:*', { uid: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('X-GM-MSGID')
      expect(has).toBe(true)
    })

    it('should include THREADID when threadId is requested and OBJECTID is present', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'OBJECTID']),
        state: 'SELECTED',
      })
      await fetch(ctx, '1:*', { threadId: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('THREADID')
      expect(has).toBe(true)
    })

    it('should include X-GM-LABELS when labels is requested and X-GM-EXT-1 is present', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'X-GM-EXT-1']),
        state: 'SELECTED',
      })
      await fetch(ctx, '1:*', { labels: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('X-GM-LABELS')
      expect(has).toBe(true)
    })

    it('should include MODSEQ when modseq is requested and CONDSTORE is enabled', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'CONDSTORE']),
        enabled: new Set(['CONDSTORE']),
        state: 'SELECTED',
      })
      await fetch(ctx, '1:*', { modseq: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('MODSEQ')
      expect(has).toBe(true)
    })

    it('should include BODY.PEEK for source request', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { source: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('BODY.PEEK')
      expect(has).toBe(true)
    })

    it('should include partial range for source request', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { source: { maxLength: 1024, start: 0 } })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const str = JSON.stringify(queryAttrs)
      expect(str).toContain('BODY.PEEK')
      expect(str).toContain('partial')
    })

    it('should use BINARY.PEEK when binary option is true and BINARY capability exists', async () => {
      const ctx = createMockContext({
        capabilities: new Set(['IMAP4rev1', 'BINARY']),
        state: 'SELECTED',
      })
      await fetch(ctx, '1:*', { source: true }, { binary: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const has = JSON.stringify(queryAttrs).includes('BINARY.PEEK')
      expect(has).toBe(true)
    })

    it('should include HEADER.FIELDS for specific headers request', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { headers: ['From', 'Subject', 'Date'] })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const str = JSON.stringify(queryAttrs)
      expect(str).toContain('HEADER.FIELDS')
      expect(str).toContain('From')
      expect(str).toContain('Subject')
      expect(str).toContain('Date')
    })

    it('should include HEADER for all headers request', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { headers: true })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const str = JSON.stringify(queryAttrs)
      expect(str).toContain('HEADER')
    })

    it('should include body parts when requested', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      await fetch(ctx, '1:*', { bodyParts: ['1', '2', '1.2'] })

      const queryAttrs = ctx.mockExecCalls[0].attributes[1]
      const str = JSON.stringify(queryAttrs)
      expect(str).toContain('"1"')
      expect(str).toContain('"2"')
      expect(str).toContain('"1.2"')
    })
  })

  describe('CHANGEDSINCE modifier', () => {
    it('should include CHANGEDSINCE when provided', async () => {
      const ctx = createMockContext({
        enabled: new Set(['CONDSTORE']),
        state: 'SELECTED',
      })
      await fetch(ctx, '1:*', { uid: true }, { changedSince: 12345n })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('CHANGEDSINCE')
      expect(str).toContain('12345')
    })

    it('should include VANISHED when uid option and QRESYNC enabled', async () => {
      const ctx = createMockContext({
        enabled: new Set(['CONDSTORE', 'QRESYNC']),
        state: 'SELECTED',
      })
      await fetch(ctx, '1:*', { uid: true }, { changedSince: 12345n, uid: true })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).toContain('VANISHED')
    })

    it('should not include CHANGEDSINCE when CONDSTORE not enabled', async () => {
      const ctx = createMockContext({
        enabled: new Set(),
        state: 'SELECTED',
      })
      await fetch(ctx, '1:*', { uid: true }, { changedSince: 12345n })

      const attrs = ctx.mockExecCalls[0].attributes
      const str = JSON.stringify(attrs)
      expect(str).not.toContain('CHANGEDSINCE')
    })
  })

  describe('response parsing', () => {
    it('should parse UID from response', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      const execPromise = fetch(ctx, '1:*', { uid: true })

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [createToken('UID'), createToken('12345')],
          command: '1',
        }),
      )

      const result = await execPromise

      expect(result?.list).toHaveLength(1)
      expect(result?.list[0].uid).toBe(12_345)
    })

    it('should parse FLAGS from response', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      const execPromise = fetch(ctx, '1:*', { flags: true })

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [
            createToken('FLAGS'),
            [createToken('\\Seen'), createToken('\\Answered')],
            createToken('UID'),
            createToken('1'),
          ] as never,
          command: '1',
        }),
      )

      const result = await execPromise

      expect(result?.list[0].flags).toBeDefined()
      expect(result?.list[0].flags?.has('\\Seen')).toBe(true)
      expect(result?.list[0].flags?.has('\\Answered')).toBe(true)
    })

    it('should parse MODSEQ from response', async () => {
      const ctx = createMockContext({
        enabled: new Set(['CONDSTORE']),
        state: 'SELECTED',
      })

      const execPromise = fetch(ctx, '1:*', { modseq: true })

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [createToken('MODSEQ'), [createToken('98765')], createToken('UID'), createToken('1')] as never,
          command: '1',
        }),
      )

      const result = await execPromise

      expect(result?.list[0].modseq).toBe(98765n)
    })

    it('should parse RFC822.SIZE from response', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      const execPromise = fetch(ctx, '1:*', { size: true })

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [createToken('RFC822.SIZE'), createToken('4096'), createToken('UID'), createToken('1')],
          command: '1',
        }),
      )

      const result = await execPromise

      expect(result?.list[0].size).toBe(4096)
    })

    it('should parse INTERNALDATE from response', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      const execPromise = fetch(ctx, '1:*', { internalDate: true })

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [
            createToken('INTERNALDATE'),
            createToken('15-Jun-2024 10:30:00 +0000'),
            createToken('UID'),
            createToken('1'),
          ],
          command: '1',
        }),
      )

      const result = await execPromise

      expect(result?.list[0].internalDate).toBeInstanceOf(Date)
    })

    it('should parse sequence number from command', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      const execPromise = fetch(ctx, '1:*', { uid: true })

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [createToken('UID'), createToken('100')],
          command: '42',
        }),
      )

      const result = await execPromise

      expect(result?.list[0].seq).toBe(42)
    })

    it('should track message count', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      const execPromise = fetch(ctx, '1:*', { uid: true })

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [createToken('UID'), createToken('1')],
          command: '1',
        }),
      )

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [createToken('UID'), createToken('2')],
          command: '2',
        }),
      )

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [createToken('UID'), createToken('3')],
          command: '3',
        }),
      )

      const result = await execPromise

      expect(result?.count).toBe(3)
      expect(result?.list).toHaveLength(3)
    })
  })

  describe('streaming callback', () => {
    it('should call onUntaggedFetch callback for each message', async () => {
      const messages: unknown[] = []
      const ctx = createMockContext({ state: 'SELECTED' })

      const execPromise = fetch(
        ctx,
        '1:*',
        { uid: true },
        {
          onUntaggedFetch: (msg, done) => {
            messages.push(msg)
            done()
          },
        },
      )

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [createToken('UID'), createToken('1')],
          command: '1',
        }),
      )

      await ctx.triggerUntagged(
        'FETCH',
        createMockResponse({
          attributes: [createToken('UID'), createToken('2')],
          command: '2',
        }),
      )

      const result = await execPromise

      expect(messages).toHaveLength(2)
      expect(result?.list).toHaveLength(0)
      expect(result?.count).toBe(2)
    })

    it('should handle callback errors', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })

      let triggerError: Error | null = null

      const fetchPromise = fetch(
        ctx,
        '1:*',
        { uid: true },
        {
          onUntaggedFetch: (_msg, done) => {
            done(new Error('Callback error'))
          },
        },
      )

      try {
        await ctx.triggerUntagged(
          'FETCH',
          createMockResponse({
            attributes: [createToken('UID'), createToken('1')],
            command: '1',
          }),
        )
      } catch (err) {
        triggerError = err as Error
      }

      if (triggerError) {
        expect(triggerError.message).toBe('Callback error')
      } else {
        await expect(fetchPromise).rejects.toThrow('Callback error')
      }
    })
  })

  describe('error handling', () => {
    it('should throw on error', async () => {
      const ctx = createMockContext({ state: 'SELECTED' })
      ctx.exec = createThrowingExec('Server error')

      await expect(fetch(ctx, '1:*', { uid: true })).rejects.toThrow('Server error')
    })

    it('should log warning on error', async () => {
      const warnCalls: unknown[] = []
      const ctx = createMockContext({
        log: createMockLoggerWithWarn(warnCalls),
        state: 'SELECTED',
      })
      ctx.exec = createThrowingExec('Server error')

      try {
        await fetch(ctx, '1:*', { uid: true })
      } catch {
        /* expected */
      }
      expect(warnCalls.length).toBeGreaterThan(0)
    })
  })
})
