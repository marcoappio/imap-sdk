import {
  AuthenticationError,
  ConnectionError,
  MissingExtensionError,
  ParserError,
  ProtocolError,
  ThrottleError,
} from './errors'

describe('ConnectionError', () => {
  it('should create error with code and message', () => {
    const error = new ConnectionError('NO_CONNECTION', 'Failed to connect')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ConnectionError)
    expect(error.name).toBe('ConnectionError')
    expect(error.code).toBe('NO_CONNECTION')
    expect(error.message).toBe('Failed to connect')
  })

  it('should work with all error codes', () => {
    const codes = [
      'NO_CONNECTION',
      'CONNECTION_CLOSED',
      'CONNECT_TIMEOUT',
      'GREETING_TIMEOUT',
      'SOCKET_TIMEOUT',
      'UPGRADE_TIMEOUT',
      'TLS_FAILED',
    ] as const

    for (const code of codes) {
      const error = new ConnectionError(code, `Error: ${code}`)
      expect(error.code).toBe(code)
    }
  })
})

describe('AuthenticationError', () => {
  it('should create error with message only', () => {
    const error = new AuthenticationError('Authentication failed')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AuthenticationError)
    expect(error.name).toBe('AuthenticationError')
    expect(error.code).toBe('AUTHENTICATION_FAILED')
    expect(error.message).toBe('Authentication failed')
    expect(error.serverResponseCode).toBeUndefined()
    expect(error.oauthError).toBeUndefined()
  })

  it('should create error with server response code', () => {
    const error = new AuthenticationError('Authentication failed', 'AUTHORIZATIONFAILED')

    expect(error.serverResponseCode).toBe('AUTHORIZATIONFAILED')
  })

  it('should create error with oauth error', () => {
    const oauthError = { code: 'invalid_grant', message: 'Token expired' }
    const error = new AuthenticationError('Authentication failed', 'AUTHORIZATIONFAILED', oauthError)

    expect(error.oauthError).toBe(oauthError)
  })
})

describe('ProtocolError', () => {
  it('should create error with message only', () => {
    const error = new ProtocolError('Protocol error')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ProtocolError)
    expect(error.name).toBe('ProtocolError')
    expect(error.code).toBe('PROTOCOL_ERROR')
    expect(error.message).toBe('Protocol error')
    expect(error.responseStatus).toBeUndefined()
    expect(error.responseText).toBeUndefined()
    expect(error.serverResponseCode).toBeUndefined()
  })

  it('should create error with NO response status', () => {
    const error = new ProtocolError('Command failed', 'NO', 'Mailbox does not exist', 'NONEXISTENT')

    expect(error.responseStatus).toBe('NO')
    expect(error.responseText).toBe('Mailbox does not exist')
    expect(error.serverResponseCode).toBe('NONEXISTENT')
  })

  it('should create error with BAD response status', () => {
    const error = new ProtocolError('Invalid command', 'BAD', 'Unknown command')

    expect(error.responseStatus).toBe('BAD')
    expect(error.responseText).toBe('Unknown command')
  })
})

describe('ParserError', () => {
  it('should create error with code and message', () => {
    const error = new ParserError('E1', 'Unexpected token')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ParserError)
    expect(error.name).toBe('ParserError')
    expect(error.code).toBe('PARSER_E1')
    expect(error.message).toBe('Unexpected token')
    expect(error.position).toBeUndefined()
    expect(error.input).toBeUndefined()
  })

  it('should create error with position', () => {
    const error = new ParserError('E2', 'Unexpected char at position 10', 10)

    expect(error.position).toBe(10)
  })

  it('should create error with input', () => {
    const error = new ParserError('E3', 'Parse error', 5, '* OK IMAP ready')

    expect(error.position).toBe(5)
    expect(error.input).toBe('* OK IMAP ready')
  })

  it('should prefix code with PARSER_', () => {
    const error = new ParserError('CUSTOM_CODE', 'Error message')

    expect(error.code).toBe('PARSER_CUSTOM_CODE')
  })
})

describe('ThrottleError', () => {
  it('should create error with message and throttle reset time', () => {
    const resetTime = Date.now() + 60_000
    const error = new ThrottleError('Rate limited', resetTime)

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ThrottleError)
    expect(error.name).toBe('ThrottleError')
    expect(error.code).toBe('THROTTLED')
    expect(error.message).toBe('Rate limited')
    expect(error.throttleReset).toBe(resetTime)
  })
})

describe('MissingExtensionError', () => {
  it('should create error with message and extension name', () => {
    const error = new MissingExtensionError('Extension QRESYNC is required', 'QRESYNC')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(MissingExtensionError)
    expect(error.name).toBe('MissingExtensionError')
    expect(error.code).toBe('MISSING_EXTENSION')
    expect(error.message).toBe('Extension QRESYNC is required')
    expect(error.extension).toBe('QRESYNC')
  })

  it('should work with different extension names', () => {
    const extensions = ['IDLE', 'MOVE', 'UIDPLUS', 'CONDSTORE', 'QRESYNC']

    for (const ext of extensions) {
      const error = new MissingExtensionError(`Missing ${ext}`, ext)
      expect(error.extension).toBe(ext)
    }
  })
})

describe('Error inheritance', () => {
  it('all errors should be catchable as Error', () => {
    const errors = [
      new ConnectionError('NO_CONNECTION', 'Connection error'),
      new AuthenticationError('Auth error'),
      new ProtocolError('Protocol error'),
      new ParserError('E1', 'Parser error'),
      new ThrottleError('Throttle error', Date.now()),
      new MissingExtensionError('Missing extension', 'IDLE'),
    ]

    for (const error of errors) {
      expect(error).toBeInstanceOf(Error)
      expect(typeof error.message).toBe('string')
      expect(typeof error.name).toBe('string')
    }
  })

  it('errors should have stack traces', () => {
    const error = new ConnectionError('NO_CONNECTION', 'Test error')

    expect(error.stack).toBeDefined()
    expect(error.stack).toContain('ConnectionError')
  })
})
