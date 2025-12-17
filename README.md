# imap-sdk

A TypeScript IMAP client with strict typing, automatic resource cleanup, and zero memory leaks.

## Why This Exists

The original [ImapFlow](https://github.com/postalsys/imapflow) library has persistent memory leak issues stemming from:

- Socket listeners that accumulate without cleanup
- Circular references in timeout handlers
- IDLE timer leaks when promises resolve
- Compression stream handlers not removed before `destroy()`
- Inconsistent `.once()` / `.on()` patterns

This rewrite eliminates these issues through a "functional core, imperative shell" architecture with explicit resource tracking.

## Features

- **Strict TypeScript** - Full type safety with branded types for UIDs, mailbox paths, etc.
- **Automatic Resource Cleanup** - Uses `AsyncDisposable` and `await using` for guaranteed cleanup
- **No Memory Leaks** - All listeners and timers tracked and disposed
- **Full IMAP Support** - 26 commands including IDLE, COMPRESS, and all Gmail extensions
- **Result Types** - Explicit error handling without exceptions in core logic

## Installation

```bash
npm install imap-sdk
# or
bun add imap-sdk
```

## Quick Start

```typescript
import { IMAPClient } from 'imap-sdk'

const client = new IMAPClient({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: 'user@gmail.com',
    accessToken: 'your-access-token',
  },
})

await client.connect()

const folders = await client.run('LIST', '', '*')
console.log('Folders:', folders.map(f => f.path))

const inbox = await client.run('SELECT', 'INBOX')
console.log('Messages:', inbox.exists)

await client.close()
```

## Automatic Cleanup with `await using`

The client implements `AsyncDisposable`, enabling automatic cleanup when the scope exits:

```typescript
import { IMAPClient } from 'imap-sdk'

async function checkMail() {
  await using client = new IMAPClient({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: 'user@gmail.com', pass: 'password' },
  })

  await client.connect()

  const status = await client.run('STATUS', 'INBOX', { messages: true })
  console.log('Unread:', status.messages)

  // client.close() called automatically when scope exits
  // All sockets, timers, and listeners cleaned up
}
```

This pattern guarantees cleanup even if an error is thrown:

```typescript
async function riskyOperation() {
  await using client = new IMAPClient(options)
  await client.connect()

  // Even if this throws, client is still cleaned up
  await client.run('SELECT', 'NonExistentFolder')
}
```

## Resource Management

### ListenerTracker

All event listeners are tracked and automatically removed on dispose:

```typescript
// Internal implementation - listeners never leak
this.listenerTracker.on(socket, 'data', handler)
this.listenerTracker.once(socket, 'error', errorHandler)

// On dispose, ALL tracked listeners are removed
this.listenerTracker.dispose()
```

### TimerManager

All timers are tracked and cleared on dispose:

```typescript
// Internal implementation - timers never leak
this.timerManager.set('greeting', callback, 30000)
this.timerManager.set('idle', idleCallback, 300000)

// On dispose, ALL tracked timers are cleared
this.timerManager.dispose()
```

## Commands

All IMAP commands are available via `client.run()`:

```typescript
// Mailbox operations
await client.run('LIST', '', '*')
await client.run('SELECT', 'INBOX')
await client.run('EXAMINE', 'INBOX')
await client.run('CREATE', 'NewFolder')
await client.run('DELETE', 'OldFolder')
await client.run('RENAME', 'Old', 'New')
await client.run('SUBSCRIBE', 'Folder')
await client.run('UNSUBSCRIBE', 'Folder')
await client.run('STATUS', 'INBOX', { messages: true, unseen: true })

// Message operations
await client.run('SEARCH', { unseen: true })
await client.run('FETCH', '1:10', { envelope: true, flags: true })
await client.run('STORE', '1:5', '+FLAGS', ['\\Seen'])
await client.run('COPY', '1:10', 'Archive')
await client.run('MOVE', '1:10', 'Trash')
await client.run('APPEND', 'INBOX', messageBuffer, { flags: ['\\Seen'] })
await client.run('EXPUNGE')

// Connection operations
await client.run('NOOP')
await client.run('IDLE')
await client.run('CAPABILITY')
await client.run('ENABLE', ['CONDSTORE'])
await client.run('COMPRESS')
await client.run('ID', { name: 'MyApp', version: '1.0' })
await client.run('NAMESPACE')
await client.run('QUOTA', '')
await client.run('LOGOUT')
```

## Branded Types

Type-safe identifiers prevent mixing up UIDs, sequence numbers, and paths:

```typescript
import { UID, MailboxPath, ModSeq } from 'imap-sdk'

const uid: UID = UID(12345)
const path: MailboxPath = MailboxPath('INBOX')
const modseq: ModSeq = ModSeq(BigInt(98765))

// Type error: can't pass UID where SequenceNumber expected
await client.run('FETCH', uid, { flags: true })  // Error!
```

## Error Handling

Errors are typed and include server response codes:

```typescript
import { IMAPSDKError, IMAPSDKErrorCode } from 'imap-sdk'

try {
  await client.run('SELECT', 'NonExistent')
} catch (error) {
  if (IMAPSDKError.isIMAPSDKError(error)) {
    console.log('Code:', error.code)
    console.log('Server code:', error.serverResponseCode)
    console.log('Message:', error.message)
  }
}
```

## Result Type (Optional)

For code that prefers explicit error handling:

```typescript
import { tryAsync, isOk, isErr } from 'imap-sdk'

const result = await tryAsync(() => client.run('SELECT', 'INBOX'))

if (isOk(result)) {
  console.log('Messages:', result.value.exists)
} else {
  console.log('Error:', result.error.message)
}
```

## Events

```typescript
client.on('exists', ({ path, count, prevCount }) => {
  console.log(`New messages in ${path}: ${count - prevCount}`)
})

client.on('expunge', ({ path, seq }) => {
  console.log(`Message ${seq} expunged from ${path}`)
})

client.on('flags', ({ path, seq, flags }) => {
  console.log(`Flags changed for ${seq} in ${path}:`, [...flags])
})

client.on('mailboxOpen', (mailbox) => {
  console.log('Opened:', mailbox.path)
})

client.on('mailboxClose', (mailbox) => {
  console.log('Closed:', mailbox.path)
})

client.on('close', () => {
  console.log('Connection closed')
})

client.on('error', (error) => {
  console.error('Error:', error)
})
```

## API Reference

See [API.md](./docs/API.md) for the full API reference.

## License

MIT
