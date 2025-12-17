# imap-sdk

## Classes

### AuthenticationError

Defined in: [src/types/errors.ts:172](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L172)

#### Extends

- [`IMAPSDKError`](#imapsdkerror)

#### Constructors

##### Constructor

```ts
new AuthenticationError(
   message: string, 
   serverResponseCode?: string, 
   oauthError?: unknown): AuthenticationError;
```

Defined in: [src/types/errors.ts:175](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L175)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `oauthError?` | `unknown` |

###### Returns

[`AuthenticationError`](#authenticationerror)

###### Overrides

[`IMAPSDKError`](#imapsdkerror).[`constructor`](#constructor-3)

#### Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cause"></a> `cause?` | `public` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`cause`](#cause-2) | node\_modules/typescript/lib/lib.es2022.error.d.ts:26 |
| <a id="code"></a> `code` | `readonly` | \| `"AUTHENTICATION_FAILED"` \| `"COMMAND_FAILED"` \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"DISPOSED"` \| `"GREETING_TIMEOUT"` \| `"INTERNAL"` \| `"INVALID_STATE"` \| `"MISSING_EXTENSION"` \| `"NO_CONNECTION"` \| `"PROTOCOL_ERROR"` \| `"SOCKET_TIMEOUT"` \| `"THROTTLED"` \| `"TLS_FAILED"` \| `"UNKNOWN"` \| `"UPGRADE_TIMEOUT"` \| `` `PARSER_${string}` `` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`code`](#code-2) | [src/types/errors.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L37) |
| <a id="extension"></a> `extension?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`extension`](#extension-2) | [src/types/errors.ts:43](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L43) |
| <a id="message"></a> `message` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`message`](#message-2) | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| <a id="name"></a> `name` | `readonly` | `"AuthenticationError"` | `'AuthenticationError'` | - | [`IMAPSDKError`](#imapsdkerror).[`name`](#name-2) | - | [src/types/errors.ts:173](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L173) |
| <a id="oautherror"></a> `oauthError?` | `readonly` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`oauthError`](#oautherror-2) | [src/types/errors.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L39) |
| <a id="parserinput"></a> `parserInput?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserInput`](#parserinput-2) | [src/types/errors.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L45) |
| <a id="parserposition"></a> `parserPosition?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserPosition`](#parserposition-2) | [src/types/errors.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L44) |
| <a id="responsestatus"></a> `responseStatus?` | `readonly` | `"NO"` \| `"BAD"` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseStatus`](#responsestatus-2) | [src/types/errors.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L40) |
| <a id="responsetext"></a> `responseText?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseText`](#responsetext-2) | [src/types/errors.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L41) |
| <a id="serverresponsecode"></a> `serverResponseCode?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`serverResponseCode`](#serverresponsecode-2) | [src/types/errors.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L38) |
| <a id="stack"></a> `stack?` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`stack`](#stack-2) | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| <a id="throttlereset"></a> `throttleReset?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`throttleReset`](#throttlereset-2) | [src/types/errors.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L42) |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | `undefined` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | - | [`IMAPSDKError`](#imapsdkerror).[`stackTraceLimit`](#stacktracelimit-2) | node\_modules/@types/node/globals.d.ts:68 |

#### Methods

##### authentication()

```ts
static authentication(
   message: string, 
   serverResponseCode?: string, 
   oauthError?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:74](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L74)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `oauthError?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`authentication`](#authentication-4)

##### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`captureStackTrace`](#capturestacktrace-4)

##### commandFailed()

```ts
static commandFailed(
   message: string, 
   serverResponseCode?: string, 
   responseText?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:94](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L94)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `responseText?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`commandFailed`](#commandfailed-4)

##### connection()

```ts
static connection(code: 
  | "CONNECT_TIMEOUT"
  | "CONNECTION_CLOSED"
  | "GREETING_TIMEOUT"
  | "NO_CONNECTION"
  | "SOCKET_TIMEOUT"
  | "TLS_FAILED"
  | "UPGRADE_TIMEOUT", message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:60](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L60)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"GREETING_TIMEOUT"` \| `"NO_CONNECTION"` \| `"SOCKET_TIMEOUT"` \| `"TLS_FAILED"` \| `"UPGRADE_TIMEOUT"` |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`connection`](#connection-4)

##### disposed()

```ts
static disposed(resource: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:120](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L120)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `resource` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`disposed`](#disposed-4)

##### internal()

```ts
static internal(message: string, cause?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:124](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `cause?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`internal`](#internal-4)

##### invalidState()

```ts
static invalidState(message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:116](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`invalidState`](#invalidstate-4)

##### isError()

```ts
static isError(error: unknown): error is Error;
```

Defined in: node\_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is Error`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isError`](#iserror-4)

##### isIMAPSDKError()

```ts
static isIMAPSDKError(error: unknown): error is IMAPSDKError;
```

Defined in: [src/types/errors.ts:128](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L128)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is IMAPSDKError`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isIMAPSDKError`](#isimapsdkerror-4)

##### missingExtension()

```ts
static missingExtension(message: string, extension: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:112](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `extension` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`missingExtension`](#missingextension-4)

##### parser()

```ts
static parser(
   message: string, 
   position?: number, 
   input?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:101](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L101)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `position?` | `number` |
| `input?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`parser`](#parser-4)

##### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`prepareStackTrace`](#preparestacktrace-4)

##### protocol()

```ts
static protocol(
   message: string, 
   responseStatus?: "NO" | "BAD", 
   responseText?: string, 
   serverResponseCode?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:81](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `responseStatus?` | `"NO"` \| `"BAD"` |
| `responseText?` | `string` |
| `serverResponseCode?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`protocol`](#protocol-4)

##### throttled()

```ts
static throttled(message: string, throttleReset: number): IMAPSDKError;
```

Defined in: [src/types/errors.ts:108](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L108)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `throttleReset` | `number` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`throttled`](#throttled-4)

***

### ConnectionError

Defined in: [src/types/errors.ts:163](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L163)

#### Extends

- [`IMAPSDKError`](#imapsdkerror)

#### Constructors

##### Constructor

```ts
new ConnectionError(code: ConnectionErrorCode, message: string): ConnectionError;
```

Defined in: [src/types/errors.ts:167](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L167)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`ConnectionErrorCode`](#connectionerrorcode-1) |
| `message` | `string` |

###### Returns

[`ConnectionError`](#connectionerror)

###### Overrides

[`IMAPSDKError`](#imapsdkerror).[`constructor`](#constructor-3)

#### Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cause-1"></a> `cause?` | `public` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`cause`](#cause-2) | node\_modules/typescript/lib/lib.es2022.error.d.ts:26 |
| <a id="code-1"></a> `code` | `readonly` | \| `"AUTHENTICATION_FAILED"` \| `"COMMAND_FAILED"` \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"DISPOSED"` \| `"GREETING_TIMEOUT"` \| `"INTERNAL"` \| `"INVALID_STATE"` \| `"MISSING_EXTENSION"` \| `"NO_CONNECTION"` \| `"PROTOCOL_ERROR"` \| `"SOCKET_TIMEOUT"` \| `"THROTTLED"` \| `"TLS_FAILED"` \| `"UNKNOWN"` \| `"UPGRADE_TIMEOUT"` \| `` `PARSER_${string}` `` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`code`](#code-2) | [src/types/errors.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L37) |
| <a id="extension-1"></a> `extension?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`extension`](#extension-2) | [src/types/errors.ts:43](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L43) |
| <a id="message-1"></a> `message` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`message`](#message-2) | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| <a id="name-1"></a> `name` | `readonly` | `"ConnectionError"` | `'ConnectionError'` | - | [`IMAPSDKError`](#imapsdkerror).[`name`](#name-2) | - | [src/types/errors.ts:164](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L164) |
| <a id="oautherror-1"></a> `oauthError?` | `readonly` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`oauthError`](#oautherror-2) | [src/types/errors.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L39) |
| <a id="parserinput-1"></a> `parserInput?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserInput`](#parserinput-2) | [src/types/errors.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L45) |
| <a id="parserposition-1"></a> `parserPosition?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserPosition`](#parserposition-2) | [src/types/errors.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L44) |
| <a id="responsestatus-1"></a> `responseStatus?` | `readonly` | `"NO"` \| `"BAD"` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseStatus`](#responsestatus-2) | [src/types/errors.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L40) |
| <a id="responsetext-1"></a> `responseText?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseText`](#responsetext-2) | [src/types/errors.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L41) |
| <a id="serverresponsecode-1"></a> `serverResponseCode?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`serverResponseCode`](#serverresponsecode-2) | [src/types/errors.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L38) |
| <a id="stack-1"></a> `stack?` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`stack`](#stack-2) | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| <a id="throttlereset-1"></a> `throttleReset?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`throttleReset`](#throttlereset-2) | [src/types/errors.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L42) |
| <a id="stacktracelimit-1"></a> `stackTraceLimit` | `static` | `number` | `undefined` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | - | [`IMAPSDKError`](#imapsdkerror).[`stackTraceLimit`](#stacktracelimit-2) | node\_modules/@types/node/globals.d.ts:68 |

#### Methods

##### authentication()

```ts
static authentication(
   message: string, 
   serverResponseCode?: string, 
   oauthError?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:74](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L74)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `oauthError?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`authentication`](#authentication-4)

##### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`captureStackTrace`](#capturestacktrace-4)

##### commandFailed()

```ts
static commandFailed(
   message: string, 
   serverResponseCode?: string, 
   responseText?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:94](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L94)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `responseText?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`commandFailed`](#commandfailed-4)

##### connection()

```ts
static connection(code: 
  | "CONNECT_TIMEOUT"
  | "CONNECTION_CLOSED"
  | "GREETING_TIMEOUT"
  | "NO_CONNECTION"
  | "SOCKET_TIMEOUT"
  | "TLS_FAILED"
  | "UPGRADE_TIMEOUT", message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:60](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L60)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"GREETING_TIMEOUT"` \| `"NO_CONNECTION"` \| `"SOCKET_TIMEOUT"` \| `"TLS_FAILED"` \| `"UPGRADE_TIMEOUT"` |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`connection`](#connection-4)

##### disposed()

```ts
static disposed(resource: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:120](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L120)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `resource` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`disposed`](#disposed-4)

##### internal()

```ts
static internal(message: string, cause?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:124](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `cause?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`internal`](#internal-4)

##### invalidState()

```ts
static invalidState(message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:116](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`invalidState`](#invalidstate-4)

##### isError()

```ts
static isError(error: unknown): error is Error;
```

Defined in: node\_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is Error`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isError`](#iserror-4)

##### isIMAPSDKError()

```ts
static isIMAPSDKError(error: unknown): error is IMAPSDKError;
```

Defined in: [src/types/errors.ts:128](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L128)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is IMAPSDKError`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isIMAPSDKError`](#isimapsdkerror-4)

##### missingExtension()

```ts
static missingExtension(message: string, extension: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:112](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `extension` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`missingExtension`](#missingextension-4)

##### parser()

```ts
static parser(
   message: string, 
   position?: number, 
   input?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:101](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L101)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `position?` | `number` |
| `input?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`parser`](#parser-4)

##### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`prepareStackTrace`](#preparestacktrace-4)

##### protocol()

```ts
static protocol(
   message: string, 
   responseStatus?: "NO" | "BAD", 
   responseText?: string, 
   serverResponseCode?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:81](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `responseStatus?` | `"NO"` \| `"BAD"` |
| `responseText?` | `string` |
| `serverResponseCode?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`protocol`](#protocol-4)

##### throttled()

```ts
static throttled(message: string, throttleReset: number): IMAPSDKError;
```

Defined in: [src/types/errors.ts:108](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L108)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `throttleReset` | `number` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`throttled`](#throttled-4)

***

### IMAPClient

Defined in: [src/shell/client/index.ts:58](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L58)

#### Extends

- `EventEmitter`

#### Implements

- [`CommandContext`](#commandcontext)
- `AsyncDisposable`

#### Constructors

##### Constructor

```ts
new IMAPClient(options: IMAPClientOptions): IMAPClient;
```

Defined in: [src/shell/client/index.ts:82](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L82)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`IMAPClientOptions`](#imapclientoptions) |

###### Returns

[`IMAPClient`](#imapclient)

###### Overrides

```ts
EventEmitter.constructor
```

#### Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `readonly` | [`ConnectionId`](#connectionid) | - | - | [src/shell/client/index.ts:59](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L59) |
| <a id="capturerejections"></a> `captureRejections` | `static` | `boolean` | Value: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Change the default `captureRejections` option on all new `EventEmitter` objects. **Since** v13.4.0, v12.16.0 | `EventEmitter.captureRejections` | node\_modules/@types/node/events.d.ts:425 |
| <a id="capturerejectionsymbol"></a> `captureRejectionSymbol` | `readonly` | *typeof* [`captureRejectionSymbol`](#capturerejectionsymbol) | Value: `Symbol.for('nodejs.rejection')` See how to write a custom `rejection handler`. **Since** v13.4.0, v12.16.0 | `EventEmitter.captureRejectionSymbol` | node\_modules/@types/node/events.d.ts:418 |
| <a id="defaultmaxlisteners"></a> `defaultMaxListeners` | `static` | `number` | By default, a maximum of `10` listeners can be registered for any single event. This limit can be changed for individual `EventEmitter` instances using the `emitter.setMaxListeners(n)` method. To change the default for _all_`EventEmitter` instances, the `events.defaultMaxListeners` property can be used. If this value is not a positive number, a `RangeError` is thrown. Take caution when setting the `events.defaultMaxListeners` because the change affects _all_ `EventEmitter` instances, including those created before the change is made. However, calling `emitter.setMaxListeners(n)` still has precedence over `events.defaultMaxListeners`. This is not a hard limit. The `EventEmitter` instance will allow more listeners to be added but will output a trace warning to stderr indicating that a "possible EventEmitter memory leak" has been detected. For any single `EventEmitter`, the `emitter.getMaxListeners()` and `emitter.setMaxListeners()` methods can be used to temporarily avoid this warning: `import { EventEmitter } from 'node:events'; const emitter = new EventEmitter(); emitter.setMaxListeners(emitter.getMaxListeners() + 1); emitter.once('event', () => { // do stuff emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0)); });` The `--trace-warnings` command-line flag can be used to display the stack trace for such warnings. The emitted warning can be inspected with `process.on('warning')` and will have the additional `emitter`, `type`, and `count` properties, referring to the event emitter instance, the event's name and the number of attached listeners, respectively. Its `name` property is set to `'MaxListenersExceededWarning'`. **Since** v0.11.2 | `EventEmitter.defaultMaxListeners` | node\_modules/@types/node/events.d.ts:464 |
| <a id="errormonitor"></a> `errorMonitor` | `readonly` | *typeof* [`errorMonitor`](#errormonitor) | This symbol shall be used to install a listener for only monitoring `'error'` events. Listeners installed using this symbol are called before the regular `'error'` listeners are called. Installing a listener using this symbol does not change the behavior once an `'error'` event is emitted. Therefore, the process will still crash if no regular `'error'` listener is installed. **Since** v13.6.0, v12.17.0 | `EventEmitter.errorMonitor` | node\_modules/@types/node/events.d.ts:411 |

#### Accessors

##### authCapabilities

###### Get Signature

```ts
get authCapabilities(): ReadonlyMap<string, boolean>;
```

Defined in: [src/shell/client/index.ts:112](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L112)

###### Returns

`ReadonlyMap`\<`string`, `boolean`\>

###### Implementation of

```ts
CommandContext.authCapabilities
```

##### capabilities

###### Get Signature

```ts
get capabilities(): ReadonlySet<string>;
```

Defined in: [src/shell/client/index.ts:104](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L104)

###### Returns

`ReadonlySet`\<`string`\>

###### Implementation of

```ts
CommandContext.capabilities
```

##### enabled

###### Get Signature

```ts
get enabled(): ReadonlySet<string>;
```

Defined in: [src/shell/client/index.ts:108](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L108)

###### Returns

`ReadonlySet`\<`string`\>

###### Implementation of

```ts
CommandContext.enabled
```

##### expectCapabilityUpdate

###### Get Signature

```ts
get expectCapabilityUpdate(): boolean;
```

Defined in: [src/shell/client/index.ts:149](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L149)

###### Returns

`boolean`

###### Implementation of

```ts
CommandContext.expectCapabilityUpdate
```

##### folders

###### Get Signature

```ts
get folders(): ReadonlyMap<MailboxPath, MailboxListEntry>;
```

Defined in: [src/shell/client/index.ts:145](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L145)

###### Returns

`ReadonlyMap`\<[`MailboxPath`](#mailboxpath), [`MailboxListEntry`](#mailboxlistentry)\>

###### Implementation of

```ts
CommandContext.folders
```

##### isCompressed

###### Get Signature

```ts
get isCompressed(): boolean;
```

Defined in: [src/shell/client/index.ts:157](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L157)

###### Returns

`boolean`

##### isDisposed

###### Get Signature

```ts
get isDisposed(): boolean;
```

Defined in: [src/shell/client/index.ts:153](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L153)

###### Returns

`boolean`

##### log

###### Get Signature

```ts
get log(): Logger;
```

Defined in: [src/shell/client/index.ts:100](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L100)

###### Returns

[`Logger`](#logger-1)

###### Implementation of

```ts
CommandContext.log
```

##### mailbox

###### Get Signature

```ts
get mailbox(): MailboxInfo | null;
```

Defined in: [src/shell/client/index.ts:141](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L141)

###### Returns

[`MailboxInfo`](#mailboxinfo) \| `null`

###### Implementation of

```ts
CommandContext.mailbox
```

##### servername

###### Get Signature

```ts
get servername(): string;
```

Defined in: [src/shell/client/index.ts:116](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L116)

###### Returns

`string`

###### Implementation of

```ts
CommandContext.servername
```

##### state

###### Get Signature

```ts
get state(): CommandContextState;
```

Defined in: [src/shell/client/index.ts:120](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L120)

###### Returns

[`CommandContextState`](#commandcontextstate-1)

###### Implementation of

```ts
CommandContext.state
```

#### Methods

##### \[asyncDispose\]()

```ts
asyncDispose: Promise<void>;
```

Defined in: [src/shell/client/index.ts:407](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L407)

###### Returns

`Promise`\<`void`\>

###### Implementation of

```ts
AsyncDisposable.[asyncDispose]
```

##### \[captureRejectionSymbol\]()?

```ts
optional [captureRejectionSymbol]<K>(
   error: Error, 
   event: string | symbol, ...
   args: AnyRest): void;
```

Defined in: node\_modules/@types/node/events.d.ts:103

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `Error` |
| `event` | `string` \| `symbol` |
| ...`args` | `AnyRest` |

###### Returns

`void`

###### Inherited from

```ts
EventEmitter.[captureRejectionSymbol]
```

##### addEnabled()

```ts
addEnabled(extension: string): void;
```

Defined in: [src/shell/client/index.ts:170](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L170)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `extension` | `string` |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.addEnabled
```

##### addListener()

```ts
addListener<K>(eventName: string | symbol, listener: (...args: any[]) => void): this;
```

Defined in: node\_modules/@types/node/events.d.ts:642

Alias for `emitter.on(eventName, listener)`.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

###### Returns

`this`

###### Since

v0.1.26

###### Inherited from

```ts
EventEmitter.addListener
```

##### authenticate()

```ts
authenticate(auth: AuthOptions): Promise<string>;
```

Defined in: [src/shell/client/index.ts:276](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L276)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `auth` | [`AuthOptions`](#authoptions) |

###### Returns

`Promise`\<`string`\>

##### close()

```ts
close(): Promise<void>;
```

Defined in: [src/shell/client/index.ts:372](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L372)

###### Returns

`Promise`\<`void`\>

##### connect()

```ts
connect(): Promise<void>;
```

Defined in: [src/shell/client/index.ts:216](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L216)

###### Returns

`Promise`\<`void`\>

##### dispose()

```ts
dispose(): void;
```

Defined in: [src/shell/client/index.ts:377](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L377)

###### Returns

`void`

##### emit()

```ts
emit<K>(eventName: string | symbol, ...args: AnyRest): boolean;
```

Defined in: node\_modules/@types/node/events.d.ts:904

Synchronously calls each of the listeners registered for the event named `eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |
| ...`args` | `AnyRest` |

###### Returns

`boolean`

###### Since

v0.1.26

###### Inherited from

```ts
EventEmitter.emit
```

##### emitExists()

```ts
emitExists(info: {
  count: number;
  path: MailboxPath;
  prevCount: number;
}): void;
```

Defined in: [src/shell/client/index.ts:204](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L204)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `info` | \{ `count`: `number`; `path`: [`MailboxPath`](#mailboxpath); `prevCount`: `number`; \} |
| `info.count` | `number` |
| `info.path` | [`MailboxPath`](#mailboxpath) |
| `info.prevCount` | `number` |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.emitExists
```

##### emitExpunge()

```ts
emitExpunge(info: {
  path: MailboxPath;
  seq: number;
  vanished: boolean;
}): void;
```

Defined in: [src/shell/client/index.ts:208](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L208)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `info` | \{ `path`: [`MailboxPath`](#mailboxpath); `seq`: `number`; `vanished`: `boolean`; \} |
| `info.path` | [`MailboxPath`](#mailboxpath) |
| `info.seq` | `number` |
| `info.vanished` | `boolean` |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.emitExpunge
```

##### emitFlags()

```ts
emitFlags(info: {
  flags: Set<string>;
  modseq?: ModSeq;
  path: MailboxPath;
  seq: number;
  uid?: number;
}): void;
```

Defined in: [src/shell/client/index.ts:212](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L212)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `info` | \{ `flags`: `Set`\<`string`\>; `modseq?`: [`ModSeq`](#modseq-2); `path`: [`MailboxPath`](#mailboxpath); `seq`: `number`; `uid?`: `number`; \} |
| `info.flags` | `Set`\<`string`\> |
| `info.modseq?` | [`ModSeq`](#modseq-2) |
| `info.path` | [`MailboxPath`](#mailboxpath) |
| `info.seq` | `number` |
| `info.uid?` | `number` |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.emitFlags
```

##### emitMailboxClose()

```ts
emitMailboxClose(mailbox: MailboxInfo): void;
```

Defined in: [src/shell/client/index.ts:200](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L200)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `mailbox` | [`MailboxInfo`](#mailboxinfo) |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.emitMailboxClose
```

##### emitMailboxOpen()

```ts
emitMailboxOpen(mailbox: MailboxInfo): void;
```

Defined in: [src/shell/client/index.ts:196](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L196)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `mailbox` | [`MailboxInfo`](#mailboxinfo) |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.emitMailboxOpen
```

##### enableCompression()

```ts
enableCompression(): void;
```

Defined in: [src/shell/client/index.ts:161](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L161)

###### Returns

`void`

##### eventNames()

```ts
eventNames(): (string | symbol)[];
```

Defined in: node\_modules/@types/node/events.d.ts:967

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

###### Returns

(`string` \| `symbol`)[]

###### Since

v6.0.0

###### Inherited from

```ts
EventEmitter.eventNames
```

##### exec()

```ts
exec(
   command: string, 
   attributes: readonly CommandAttribute[], 
options: ExecOptions): Promise<ExecResponse>;
```

Defined in: [src/shell/client/index.ts:291](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L291)

###### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `command` | `string` | `undefined` |
| `attributes` | readonly [`CommandAttribute`](#commandattribute)[] | `[]` |
| `options` | [`ExecOptions`](#execoptions) | `{}` |

###### Returns

`Promise`\<[`ExecResponse`](#execresponse)\>

###### Implementation of

```ts
CommandContext.exec
```

##### getMailboxLock()

```ts
getMailboxLock(path: MailboxPath): Promise<Lock>;
```

Defined in: [src/shell/client/index.ts:354](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L354)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `path` | [`MailboxPath`](#mailboxpath) |

###### Returns

`Promise`\<[`Lock`](#lock)\>

##### getMaxListeners()

```ts
getMaxListeners(): number;
```

Defined in: node\_modules/@types/node/events.d.ts:819

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [EventEmitter.defaultMaxListeners](#defaultmaxlisteners).

###### Returns

`number`

###### Since

v1.0.0

###### Inherited from

```ts
EventEmitter.getMaxListeners
```

##### listenerCount()

```ts
listenerCount<K>(eventName: string | symbol, listener?: Function): number;
```

Defined in: node\_modules/@types/node/events.d.ts:913

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |
| `listener?` | `Function` | The event handler function |

###### Returns

`number`

###### Since

v3.2.0

###### Inherited from

```ts
EventEmitter.listenerCount
```

##### listeners()

```ts
listeners<K>(eventName: string | symbol): Function[];
```

Defined in: node\_modules/@types/node/events.d.ts:832

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |

###### Returns

`Function`[]

###### Since

v0.1.26

###### Inherited from

```ts
EventEmitter.listeners
```

##### logout()

```ts
logout(): Promise<void>;
```

Defined in: [src/shell/client/index.ts:358](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L358)

###### Returns

`Promise`\<`void`\>

##### off()

```ts
off<K>(eventName: string | symbol, listener: (...args: any[]) => void): this;
```

Defined in: node\_modules/@types/node/events.d.ts:792

Alias for `emitter.removeListener()`.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

###### Returns

`this`

###### Since

v10.0.0

###### Inherited from

```ts
EventEmitter.off
```

##### on()

```ts
on<K>(eventName: string | symbol, listener: (...args: any[]) => void): this;
```

Defined in: node\_modules/@types/node/events.d.ts:674

Adds the `listener` function to the end of the listeners array for the event
named `eventName`. No checks are made to see if the `listener` has already
been added. Multiple calls passing the same combination of `eventName` and
`listener` will result in the `listener` being added, and called, multiple times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The `emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

###### Returns

`this`

###### Since

v0.1.101

###### Inherited from

```ts
EventEmitter.on
```

##### once()

```ts
once<K>(eventName: string | symbol, listener: (...args: any[]) => void): this;
```

Defined in: node\_modules/@types/node/events.d.ts:704

Adds a **one-time** `listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The `emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

###### Returns

`this`

###### Since

v0.3.0

###### Inherited from

```ts
EventEmitter.once
```

##### prependListener()

```ts
prependListener<K>(eventName: string | symbol, listener: (...args: any[]) => void): this;
```

Defined in: node\_modules/@types/node/events.d.ts:931

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`
and `listener` will result in the `listener` being added, and called, multiple times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

###### Returns

`this`

###### Since

v6.0.0

###### Inherited from

```ts
EventEmitter.prependListener
```

##### prependOnceListener()

```ts
prependOnceListener<K>(eventName: string | symbol, listener: (...args: any[]) => void): this;
```

Defined in: node\_modules/@types/node/events.d.ts:947

Adds a **one-time**`listener` function for the event named `eventName` to the _beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

###### Returns

`this`

###### Since

v6.0.0

###### Inherited from

```ts
EventEmitter.prependOnceListener
```

##### rawListeners()

```ts
rawListeners<K>(eventName: string | symbol): Function[];
```

Defined in: node\_modules/@types/node/events.d.ts:863

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |

###### Returns

`Function`[]

###### Since

v9.4.0

###### Inherited from

```ts
EventEmitter.rawListeners
```

##### removeAllListeners()

```ts
removeAllListeners(eventName?: string | symbol): this;
```

Defined in: node\_modules/@types/node/events.d.ts:803

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName?` | `string` \| `symbol` |

###### Returns

`this`

###### Since

v0.1.26

###### Inherited from

```ts
EventEmitter.removeAllListeners
```

##### removeListener()

```ts
removeListener<K>(eventName: string | symbol, listener: (...args: any[]) => void): this;
```

Defined in: node\_modules/@types/node/events.d.ts:787

Removes the specified `listener` from the listener array for the event named `eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any `removeListener()` or `removeAllListeners()` calls _after_ emitting and _before_ the last listener finishes execution
will not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')` listener is removed:

```js
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

###### Type Parameters

| Type Parameter |
| ------ |
| `K` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

###### Returns

`this`

###### Since

v0.1.26

###### Inherited from

```ts
EventEmitter.removeListener
```

##### run()

```ts
run<T>(command: string, ...args: unknown[]): Promise<T>;
```

Defined in: [src/shell/client/index.ts:344](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L344)

###### Type Parameters

| Type Parameter |
| ------ |
| `T` |

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `command` | `string` |
| ...`args` | `unknown`[] |

###### Returns

`Promise`\<`T`\>

###### Implementation of

```ts
CommandContext.run
```

##### setAuthCapability()

```ts
setAuthCapability(method: string, success: boolean): void;
```

Defined in: [src/shell/client/index.ts:174](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L174)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `method` | `string` |
| `success` | `boolean` |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.setAuthCapability
```

##### setCapabilities()

```ts
setCapabilities(capabilities: Set<string>): void;
```

Defined in: [src/shell/client/index.ts:165](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L165)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `capabilities` | `Set`\<`string`\> |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.setCapabilities
```

##### setExpectCapabilityUpdate()

```ts
setExpectCapabilityUpdate(expect: boolean): void;
```

Defined in: [src/shell/client/index.ts:178](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L178)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `expect` | `boolean` |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.setExpectCapabilityUpdate
```

##### setFolder()

```ts
setFolder(path: MailboxPath, folder: MailboxListEntry): void;
```

Defined in: [src/shell/client/index.ts:192](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L192)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `path` | [`MailboxPath`](#mailboxpath) |
| `folder` | [`MailboxListEntry`](#mailboxlistentry) |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.setFolder
```

##### setMailbox()

```ts
setMailbox(mailbox: MailboxInfo | null): void;
```

Defined in: [src/shell/client/index.ts:182](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L182)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `mailbox` | [`MailboxInfo`](#mailboxinfo) \| `null` |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.setMailbox
```

##### setMaxListeners()

```ts
setMaxListeners(n: number): this;
```

Defined in: node\_modules/@types/node/events.d.ts:813

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to `Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `number` |

###### Returns

`this`

###### Since

v0.3.5

###### Inherited from

```ts
EventEmitter.setMaxListeners
```

##### write()

```ts
write(data: string | Buffer<ArrayBufferLike>): void;
```

Defined in: [src/shell/client/index.ts:336](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L336)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `string` \| `Buffer`\<`ArrayBufferLike`\> |

###### Returns

`void`

###### Implementation of

```ts
CommandContext.write
```

##### addAbortListener()

```ts
static addAbortListener(signal: AbortSignal, resource: (event: Event) => void): Disposable;
```

Defined in: node\_modules/@types/node/events.d.ts:403

Listens once to the `abort` event on the provided `signal`.

Listening to the `abort` event on abort signals is unsafe and may
lead to resource leaks since another third party with the signal can
call `e.stopImmediatePropagation()`. Unfortunately Node.js cannot change
this since it would violate the web standard. Additionally, the original
API makes it easy to forget to remove listeners.

This API allows safely using `AbortSignal`s in Node.js APIs by solving these
two issues by listening to the event such that `stopImmediatePropagation` does
not prevent the listener from running.

Returns a disposable so that it may be unsubscribed from more easily.

```js
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `signal` | `AbortSignal` |
| `resource` | (`event`: `Event`) => `void` |

###### Returns

`Disposable`

Disposable that removes the `abort` listener.

###### Since

v20.5.0

###### Inherited from

```ts
EventEmitter.addAbortListener
```

##### getEventListeners()

```ts
static getEventListeners(emitter: EventEmitter<DefaultEventMap> | EventTarget, name: string | symbol): Function[];
```

Defined in: node\_modules/@types/node/events.d.ts:325

Returns a copy of the array of listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listeners` on
the emitter.

For `EventTarget`s this is the only way to get the event listeners for the
event target. This is useful for debugging and diagnostic purposes.

```js
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventEmitter`\<`DefaultEventMap`\> \| `EventTarget` |
| `name` | `string` \| `symbol` |

###### Returns

`Function`[]

###### Since

v15.2.0, v14.17.0

###### Inherited from

```ts
EventEmitter.getEventListeners
```

##### getMaxListeners()

```ts
static getMaxListeners(emitter: EventEmitter<DefaultEventMap> | EventTarget): number;
```

Defined in: node\_modules/@types/node/events.d.ts:354

Returns the currently set max amount of listeners.

For `EventEmitter`s this behaves exactly the same as calling `.getMaxListeners` on
the emitter.

For `EventTarget`s this is the only way to get the max event listeners for the
event target. If the number of event handlers on a single EventTarget exceeds
the max set, the EventTarget will print a warning.

```js
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventEmitter`\<`DefaultEventMap`\> \| `EventTarget` |

###### Returns

`number`

###### Since

v19.9.0

###### Inherited from

```ts
EventEmitter.getMaxListeners
```

##### ~~listenerCount()~~

```ts
static listenerCount(emitter: EventEmitter, eventName: string | symbol): number;
```

Defined in: node\_modules/@types/node/events.d.ts:297

A class method that returns the number of listeners for the given `eventName` registered on the given `emitter`.

```js
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `emitter` | `EventEmitter` | The emitter to query |
| `eventName` | `string` \| `symbol` | The event name |

###### Returns

`number`

###### Since

v0.9.12

###### Deprecated

Since v3.2.0 - Use `listenerCount` instead.

###### Inherited from

```ts
EventEmitter.listenerCount
```

##### on()

###### Call Signature

```ts
static on(
   emitter: EventEmitter, 
   eventName: string | symbol, 
options?: StaticEventEmitterIteratorOptions): AsyncIterator<any[]>;
```

Defined in: node\_modules/@types/node/events.d.ts:270

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // The execution of this inner block is synchronous and it
  // processes one event at a time (even with await). Do not use
  // if concurrent execution is required.
  console.log(event); // prints ['bar'] [42]
}
// Unreachable here
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An `AbortSignal` can be used to cancel waiting on events:

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

Use the `close` option to specify an array of event names that will end the iteration:

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
  ee.emit('close');
});

for await (const event of on(ee, 'foo', { close: ['close'] })) {
  console.log(event); // prints ['bar'] [42]
}
// the loop will exit after 'close' is emitted
console.log('done'); // prints 'done'
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventEmitter` |
| `eventName` | `string` \| `symbol` |
| `options?` | `StaticEventEmitterIteratorOptions` |

###### Returns

`AsyncIterator`\<`any`[]\>

An `AsyncIterator` that iterates `eventName` events emitted by the `emitter`

###### Since

v13.6.0, v12.16.0

###### Inherited from

```ts
EventEmitter.on
```

###### Call Signature

```ts
static on(
   emitter: EventTarget, 
   eventName: string, 
options?: StaticEventEmitterIteratorOptions): AsyncIterator<any[]>;
```

Defined in: node\_modules/@types/node/events.d.ts:275

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // The execution of this inner block is synchronous and it
  // processes one event at a time (even with await). Do not use
  // if concurrent execution is required.
  console.log(event); // prints ['bar'] [42]
}
// Unreachable here
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An `AbortSignal` can be used to cancel waiting on events:

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

Use the `close` option to specify an array of event names that will end the iteration:

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
  ee.emit('close');
});

for await (const event of on(ee, 'foo', { close: ['close'] })) {
  console.log(event); // prints ['bar'] [42]
}
// the loop will exit after 'close' is emitted
console.log('done'); // prints 'done'
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventTarget` |
| `eventName` | `string` |
| `options?` | `StaticEventEmitterIteratorOptions` |

###### Returns

`AsyncIterator`\<`any`[]\>

An `AsyncIterator` that iterates `eventName` events emitted by the `emitter`

###### Since

v13.6.0, v12.16.0

###### Inherited from

```ts
EventEmitter.on
```

##### once()

###### Call Signature

```ts
static once(
   emitter: EventEmitter, 
   eventName: string | symbol, 
options?: StaticEventEmitterOptions): Promise<any[]>;
```

Defined in: node\_modules/@types/node/events.d.ts:184

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special`'error'` event
semantics and does not listen to the `'error'` event.

```js
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

The special handling of the `'error'` event is only used when `events.once()` is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

An `AbortSignal` can be used to cancel waiting for the event:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Abort waiting for the event
ee.emit('foo'); // Prints: Waiting for the event was canceled!
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventEmitter` |
| `eventName` | `string` \| `symbol` |
| `options?` | `StaticEventEmitterOptions` |

###### Returns

`Promise`\<`any`[]\>

###### Since

v11.13.0, v10.16.0

###### Inherited from

```ts
EventEmitter.once
```

###### Call Signature

```ts
static once(
   emitter: EventTarget, 
   eventName: string, 
options?: StaticEventEmitterOptions): Promise<any[]>;
```

Defined in: node\_modules/@types/node/events.d.ts:189

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special`'error'` event
semantics and does not listen to the `'error'` event.

```js
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

The special handling of the `'error'` event is only used when `events.once()` is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

An `AbortSignal` can be used to cancel waiting for the event:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Abort waiting for the event
ee.emit('foo'); // Prints: Waiting for the event was canceled!
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventTarget` |
| `eventName` | `string` |
| `options?` | `StaticEventEmitterOptions` |

###### Returns

`Promise`\<`any`[]\>

###### Since

v11.13.0, v10.16.0

###### Inherited from

```ts
EventEmitter.once
```

##### setMaxListeners()

```ts
static setMaxListeners(n?: number, ...eventTargets?: (EventEmitter<DefaultEventMap> | EventTarget)[]): void;
```

Defined in: node\_modules/@types/node/events.d.ts:369

```js
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n?` | `number` | A non-negative number. The maximum number of listeners per `EventTarget` event. |
| ...`eventTargets?` | (`EventEmitter`\<`DefaultEventMap`\> \| `EventTarget`)[] | Zero or more {EventTarget} or {EventEmitter} instances. If none are specified, `n` is set as the default max for all newly created {EventTarget} and {EventEmitter} objects. |

###### Returns

`void`

###### Since

v15.4.0

###### Inherited from

```ts
EventEmitter.setMaxListeners
```

***

### IMAPSDKError

Defined in: [src/types/errors.ts:35](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L35)

#### Extends

- `Error`

#### Extended by

- [`AuthenticationError`](#authenticationerror)
- [`ConnectionError`](#connectionerror)
- [`MissingExtensionError`](#missingextensionerror)
- [`ParserError`](#parsererror)
- [`ProtocolError`](#protocolerror)
- [`ThrottleError`](#throttleerror)

#### Constructors

##### Constructor

```ts
new IMAPSDKError(
   code: IMAPSDKErrorCode, 
   message: string, 
   options: IMAPSDKErrorOptions): IMAPSDKError;
```

Defined in: [src/types/errors.ts:47](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L47)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | [`IMAPSDKErrorCode`](#imapsdkerrorcode-1) |
| `message` | `string` |
| `options` | [`IMAPSDKErrorOptions`](#imapsdkerroroptions) |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cause-2"></a> `cause?` | `public` | `unknown` | `undefined` | - | - | `Error.cause` | node\_modules/typescript/lib/lib.es2022.error.d.ts:26 |
| <a id="code-2"></a> `code` | `readonly` | \| `"AUTHENTICATION_FAILED"` \| `"COMMAND_FAILED"` \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"DISPOSED"` \| `"GREETING_TIMEOUT"` \| `"INTERNAL"` \| `"INVALID_STATE"` \| `"MISSING_EXTENSION"` \| `"NO_CONNECTION"` \| `"PROTOCOL_ERROR"` \| `"SOCKET_TIMEOUT"` \| `"THROTTLED"` \| `"TLS_FAILED"` \| `"UNKNOWN"` \| `"UPGRADE_TIMEOUT"` \| `` `PARSER_${string}` `` | `undefined` | - | - | - | [src/types/errors.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L37) |
| <a id="extension-2"></a> `extension?` | `readonly` | `string` | `undefined` | - | - | - | [src/types/errors.ts:43](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L43) |
| <a id="message-2"></a> `message` | `public` | `string` | `undefined` | - | - | `Error.message` | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| <a id="name-2"></a> `name` | `readonly` | `string` | `'IMAPSDKError'` | - | `Error.name` | - | [src/types/errors.ts:36](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L36) |
| <a id="oautherror-2"></a> `oauthError?` | `readonly` | `unknown` | `undefined` | - | - | - | [src/types/errors.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L39) |
| <a id="parserinput-2"></a> `parserInput?` | `readonly` | `string` | `undefined` | - | - | - | [src/types/errors.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L45) |
| <a id="parserposition-2"></a> `parserPosition?` | `readonly` | `number` | `undefined` | - | - | - | [src/types/errors.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L44) |
| <a id="responsestatus-2"></a> `responseStatus?` | `readonly` | `"NO"` \| `"BAD"` | `undefined` | - | - | - | [src/types/errors.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L40) |
| <a id="responsetext-2"></a> `responseText?` | `readonly` | `string` | `undefined` | - | - | - | [src/types/errors.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L41) |
| <a id="serverresponsecode-2"></a> `serverResponseCode?` | `readonly` | `string` | `undefined` | - | - | - | [src/types/errors.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L38) |
| <a id="stack-2"></a> `stack?` | `public` | `string` | `undefined` | - | - | `Error.stack` | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| <a id="throttlereset-2"></a> `throttleReset?` | `readonly` | `number` | `undefined` | - | - | - | [src/types/errors.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L42) |
| <a id="stacktracelimit-2"></a> `stackTraceLimit` | `static` | `number` | `undefined` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | - | `Error.stackTraceLimit` | node\_modules/@types/node/globals.d.ts:68 |

#### Methods

##### authentication()

```ts
static authentication(
   message: string, 
   serverResponseCode?: string, 
   oauthError?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:74](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L74)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `oauthError?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

##### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

```ts
Error.captureStackTrace
```

##### commandFailed()

```ts
static commandFailed(
   message: string, 
   serverResponseCode?: string, 
   responseText?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:94](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L94)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `responseText?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

##### connection()

```ts
static connection(code: 
  | "CONNECT_TIMEOUT"
  | "CONNECTION_CLOSED"
  | "GREETING_TIMEOUT"
  | "NO_CONNECTION"
  | "SOCKET_TIMEOUT"
  | "TLS_FAILED"
  | "UPGRADE_TIMEOUT", message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:60](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L60)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"GREETING_TIMEOUT"` \| `"NO_CONNECTION"` \| `"SOCKET_TIMEOUT"` \| `"TLS_FAILED"` \| `"UPGRADE_TIMEOUT"` |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

##### disposed()

```ts
static disposed(resource: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:120](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L120)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `resource` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

##### internal()

```ts
static internal(message: string, cause?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:124](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `cause?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

##### invalidState()

```ts
static invalidState(message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:116](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

##### isError()

```ts
static isError(error: unknown): error is Error;
```

Defined in: node\_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is Error`

###### Inherited from

```ts
Error.isError
```

##### isIMAPSDKError()

```ts
static isIMAPSDKError(error: unknown): error is IMAPSDKError;
```

Defined in: [src/types/errors.ts:128](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L128)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is IMAPSDKError`

##### missingExtension()

```ts
static missingExtension(message: string, extension: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:112](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `extension` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

##### parser()

```ts
static parser(
   message: string, 
   position?: number, 
   input?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:101](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L101)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `position?` | `number` |
| `input?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

##### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

```ts
Error.prepareStackTrace
```

##### protocol()

```ts
static protocol(
   message: string, 
   responseStatus?: "NO" | "BAD", 
   responseText?: string, 
   serverResponseCode?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:81](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `responseStatus?` | `"NO"` \| `"BAD"` |
| `responseText?` | `string` |
| `serverResponseCode?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

##### throttled()

```ts
static throttled(message: string, throttleReset: number): IMAPSDKError;
```

Defined in: [src/types/errors.ts:108](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L108)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `throttleReset` | `number` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

***

### MissingExtensionError

Defined in: [src/types/errors.ts:214](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L214)

#### Extends

- [`IMAPSDKError`](#imapsdkerror)

#### Constructors

##### Constructor

```ts
new MissingExtensionError(message: string, extension: string): MissingExtensionError;
```

Defined in: [src/types/errors.ts:217](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L217)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `extension` | `string` |

###### Returns

[`MissingExtensionError`](#missingextensionerror)

###### Overrides

[`IMAPSDKError`](#imapsdkerror).[`constructor`](#constructor-3)

#### Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cause-3"></a> `cause?` | `public` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`cause`](#cause-2) | node\_modules/typescript/lib/lib.es2022.error.d.ts:26 |
| <a id="code-3"></a> `code` | `readonly` | \| `"AUTHENTICATION_FAILED"` \| `"COMMAND_FAILED"` \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"DISPOSED"` \| `"GREETING_TIMEOUT"` \| `"INTERNAL"` \| `"INVALID_STATE"` \| `"MISSING_EXTENSION"` \| `"NO_CONNECTION"` \| `"PROTOCOL_ERROR"` \| `"SOCKET_TIMEOUT"` \| `"THROTTLED"` \| `"TLS_FAILED"` \| `"UNKNOWN"` \| `"UPGRADE_TIMEOUT"` \| `` `PARSER_${string}` `` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`code`](#code-2) | [src/types/errors.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L37) |
| <a id="extension-3"></a> `extension?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`extension`](#extension-2) | [src/types/errors.ts:43](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L43) |
| <a id="message-3"></a> `message` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`message`](#message-2) | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| <a id="name-3"></a> `name` | `readonly` | `"MissingExtensionError"` | `'MissingExtensionError'` | - | [`IMAPSDKError`](#imapsdkerror).[`name`](#name-2) | - | [src/types/errors.ts:215](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L215) |
| <a id="oautherror-3"></a> `oauthError?` | `readonly` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`oauthError`](#oautherror-2) | [src/types/errors.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L39) |
| <a id="parserinput-3"></a> `parserInput?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserInput`](#parserinput-2) | [src/types/errors.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L45) |
| <a id="parserposition-3"></a> `parserPosition?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserPosition`](#parserposition-2) | [src/types/errors.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L44) |
| <a id="responsestatus-3"></a> `responseStatus?` | `readonly` | `"NO"` \| `"BAD"` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseStatus`](#responsestatus-2) | [src/types/errors.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L40) |
| <a id="responsetext-3"></a> `responseText?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseText`](#responsetext-2) | [src/types/errors.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L41) |
| <a id="serverresponsecode-3"></a> `serverResponseCode?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`serverResponseCode`](#serverresponsecode-2) | [src/types/errors.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L38) |
| <a id="stack-3"></a> `stack?` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`stack`](#stack-2) | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| <a id="throttlereset-3"></a> `throttleReset?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`throttleReset`](#throttlereset-2) | [src/types/errors.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L42) |
| <a id="stacktracelimit-3"></a> `stackTraceLimit` | `static` | `number` | `undefined` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | - | [`IMAPSDKError`](#imapsdkerror).[`stackTraceLimit`](#stacktracelimit-2) | node\_modules/@types/node/globals.d.ts:68 |

#### Methods

##### authentication()

```ts
static authentication(
   message: string, 
   serverResponseCode?: string, 
   oauthError?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:74](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L74)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `oauthError?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`authentication`](#authentication-4)

##### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`captureStackTrace`](#capturestacktrace-4)

##### commandFailed()

```ts
static commandFailed(
   message: string, 
   serverResponseCode?: string, 
   responseText?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:94](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L94)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `responseText?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`commandFailed`](#commandfailed-4)

##### connection()

```ts
static connection(code: 
  | "CONNECT_TIMEOUT"
  | "CONNECTION_CLOSED"
  | "GREETING_TIMEOUT"
  | "NO_CONNECTION"
  | "SOCKET_TIMEOUT"
  | "TLS_FAILED"
  | "UPGRADE_TIMEOUT", message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:60](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L60)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"GREETING_TIMEOUT"` \| `"NO_CONNECTION"` \| `"SOCKET_TIMEOUT"` \| `"TLS_FAILED"` \| `"UPGRADE_TIMEOUT"` |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`connection`](#connection-4)

##### disposed()

```ts
static disposed(resource: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:120](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L120)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `resource` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`disposed`](#disposed-4)

##### internal()

```ts
static internal(message: string, cause?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:124](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `cause?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`internal`](#internal-4)

##### invalidState()

```ts
static invalidState(message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:116](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`invalidState`](#invalidstate-4)

##### isError()

```ts
static isError(error: unknown): error is Error;
```

Defined in: node\_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is Error`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isError`](#iserror-4)

##### isIMAPSDKError()

```ts
static isIMAPSDKError(error: unknown): error is IMAPSDKError;
```

Defined in: [src/types/errors.ts:128](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L128)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is IMAPSDKError`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isIMAPSDKError`](#isimapsdkerror-4)

##### missingExtension()

```ts
static missingExtension(message: string, extension: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:112](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `extension` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`missingExtension`](#missingextension-4)

##### parser()

```ts
static parser(
   message: string, 
   position?: number, 
   input?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:101](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L101)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `position?` | `number` |
| `input?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`parser`](#parser-4)

##### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`prepareStackTrace`](#preparestacktrace-4)

##### protocol()

```ts
static protocol(
   message: string, 
   responseStatus?: "NO" | "BAD", 
   responseText?: string, 
   serverResponseCode?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:81](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `responseStatus?` | `"NO"` \| `"BAD"` |
| `responseText?` | `string` |
| `serverResponseCode?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`protocol`](#protocol-4)

##### throttled()

```ts
static throttled(message: string, throttleReset: number): IMAPSDKError;
```

Defined in: [src/types/errors.ts:108](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L108)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `throttleReset` | `number` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`throttled`](#throttled-4)

***

### ParserError

Defined in: [src/types/errors.ts:188](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L188)

#### Extends

- [`IMAPSDKError`](#imapsdkerror)

#### Constructors

##### Constructor

```ts
new ParserError(
   code: string, 
   message: string, 
   position?: number, 
   input?: string): ParserError;
```

Defined in: [src/types/errors.ts:192](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L192)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | `string` |
| `message` | `string` |
| `position?` | `number` |
| `input?` | `string` |

###### Returns

[`ParserError`](#parsererror)

###### Overrides

[`IMAPSDKError`](#imapsdkerror).[`constructor`](#constructor-3)

#### Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cause-4"></a> `cause?` | `public` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`cause`](#cause-2) | node\_modules/typescript/lib/lib.es2022.error.d.ts:26 |
| <a id="code-4"></a> `code` | `readonly` | `` `PARSER_${string}` `` | `undefined` | - | [`IMAPSDKError`](#imapsdkerror).[`code`](#code-2) | - | [src/types/errors.ts:190](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L190) |
| <a id="extension-4"></a> `extension?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`extension`](#extension-2) | [src/types/errors.ts:43](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L43) |
| <a id="message-4"></a> `message` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`message`](#message-2) | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| <a id="name-4"></a> `name` | `readonly` | `"ParserError"` | `'ParserError'` | - | [`IMAPSDKError`](#imapsdkerror).[`name`](#name-2) | - | [src/types/errors.ts:189](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L189) |
| <a id="oautherror-4"></a> `oauthError?` | `readonly` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`oauthError`](#oautherror-2) | [src/types/errors.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L39) |
| <a id="parserinput-4"></a> `parserInput?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserInput`](#parserinput-2) | [src/types/errors.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L45) |
| <a id="parserposition-4"></a> `parserPosition?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserPosition`](#parserposition-2) | [src/types/errors.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L44) |
| <a id="responsestatus-4"></a> `responseStatus?` | `readonly` | `"NO"` \| `"BAD"` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseStatus`](#responsestatus-2) | [src/types/errors.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L40) |
| <a id="responsetext-4"></a> `responseText?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseText`](#responsetext-2) | [src/types/errors.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L41) |
| <a id="serverresponsecode-4"></a> `serverResponseCode?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`serverResponseCode`](#serverresponsecode-2) | [src/types/errors.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L38) |
| <a id="stack-4"></a> `stack?` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`stack`](#stack-2) | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| <a id="throttlereset-4"></a> `throttleReset?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`throttleReset`](#throttlereset-2) | [src/types/errors.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L42) |
| <a id="stacktracelimit-4"></a> `stackTraceLimit` | `static` | `number` | `undefined` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | - | [`IMAPSDKError`](#imapsdkerror).[`stackTraceLimit`](#stacktracelimit-2) | node\_modules/@types/node/globals.d.ts:68 |

#### Accessors

##### input

###### Get Signature

```ts
get input(): string | undefined;
```

Defined in: [src/types/errors.ts:201](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L201)

###### Returns

`string` \| `undefined`

##### position

###### Get Signature

```ts
get position(): number | undefined;
```

Defined in: [src/types/errors.ts:197](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L197)

###### Returns

`number` \| `undefined`

#### Methods

##### authentication()

```ts
static authentication(
   message: string, 
   serverResponseCode?: string, 
   oauthError?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:74](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L74)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `oauthError?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`authentication`](#authentication-4)

##### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`captureStackTrace`](#capturestacktrace-4)

##### commandFailed()

```ts
static commandFailed(
   message: string, 
   serverResponseCode?: string, 
   responseText?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:94](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L94)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `responseText?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`commandFailed`](#commandfailed-4)

##### connection()

```ts
static connection(code: 
  | "CONNECT_TIMEOUT"
  | "CONNECTION_CLOSED"
  | "GREETING_TIMEOUT"
  | "NO_CONNECTION"
  | "SOCKET_TIMEOUT"
  | "TLS_FAILED"
  | "UPGRADE_TIMEOUT", message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:60](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L60)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"GREETING_TIMEOUT"` \| `"NO_CONNECTION"` \| `"SOCKET_TIMEOUT"` \| `"TLS_FAILED"` \| `"UPGRADE_TIMEOUT"` |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`connection`](#connection-4)

##### disposed()

```ts
static disposed(resource: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:120](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L120)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `resource` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`disposed`](#disposed-4)

##### internal()

```ts
static internal(message: string, cause?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:124](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `cause?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`internal`](#internal-4)

##### invalidState()

```ts
static invalidState(message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:116](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`invalidState`](#invalidstate-4)

##### isError()

```ts
static isError(error: unknown): error is Error;
```

Defined in: node\_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is Error`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isError`](#iserror-4)

##### isIMAPSDKError()

```ts
static isIMAPSDKError(error: unknown): error is IMAPSDKError;
```

Defined in: [src/types/errors.ts:128](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L128)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is IMAPSDKError`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isIMAPSDKError`](#isimapsdkerror-4)

##### missingExtension()

```ts
static missingExtension(message: string, extension: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:112](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `extension` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`missingExtension`](#missingextension-4)

##### parser()

```ts
static parser(
   message: string, 
   position?: number, 
   input?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:101](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L101)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `position?` | `number` |
| `input?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`parser`](#parser-4)

##### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`prepareStackTrace`](#preparestacktrace-4)

##### protocol()

```ts
static protocol(
   message: string, 
   responseStatus?: "NO" | "BAD", 
   responseText?: string, 
   serverResponseCode?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:81](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `responseStatus?` | `"NO"` \| `"BAD"` |
| `responseText?` | `string` |
| `serverResponseCode?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`protocol`](#protocol-4)

##### throttled()

```ts
static throttled(message: string, throttleReset: number): IMAPSDKError;
```

Defined in: [src/types/errors.ts:108](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L108)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `throttleReset` | `number` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`throttled`](#throttled-4)

***

### ProtocolError

Defined in: [src/types/errors.ts:180](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L180)

#### Extends

- [`IMAPSDKError`](#imapsdkerror)

#### Constructors

##### Constructor

```ts
new ProtocolError(
   message: string, 
   responseStatus?: "NO" | "BAD", 
   responseText?: string, 
   serverResponseCode?: string): ProtocolError;
```

Defined in: [src/types/errors.ts:183](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L183)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `responseStatus?` | `"NO"` \| `"BAD"` |
| `responseText?` | `string` |
| `serverResponseCode?` | `string` |

###### Returns

[`ProtocolError`](#protocolerror)

###### Overrides

[`IMAPSDKError`](#imapsdkerror).[`constructor`](#constructor-3)

#### Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cause-5"></a> `cause?` | `public` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`cause`](#cause-2) | node\_modules/typescript/lib/lib.es2022.error.d.ts:26 |
| <a id="code-5"></a> `code` | `readonly` | \| `"AUTHENTICATION_FAILED"` \| `"COMMAND_FAILED"` \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"DISPOSED"` \| `"GREETING_TIMEOUT"` \| `"INTERNAL"` \| `"INVALID_STATE"` \| `"MISSING_EXTENSION"` \| `"NO_CONNECTION"` \| `"PROTOCOL_ERROR"` \| `"SOCKET_TIMEOUT"` \| `"THROTTLED"` \| `"TLS_FAILED"` \| `"UNKNOWN"` \| `"UPGRADE_TIMEOUT"` \| `` `PARSER_${string}` `` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`code`](#code-2) | [src/types/errors.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L37) |
| <a id="extension-5"></a> `extension?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`extension`](#extension-2) | [src/types/errors.ts:43](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L43) |
| <a id="message-5"></a> `message` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`message`](#message-2) | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| <a id="name-5"></a> `name` | `readonly` | `"ProtocolError"` | `'ProtocolError'` | - | [`IMAPSDKError`](#imapsdkerror).[`name`](#name-2) | - | [src/types/errors.ts:181](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L181) |
| <a id="oautherror-5"></a> `oauthError?` | `readonly` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`oauthError`](#oautherror-2) | [src/types/errors.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L39) |
| <a id="parserinput-5"></a> `parserInput?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserInput`](#parserinput-2) | [src/types/errors.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L45) |
| <a id="parserposition-5"></a> `parserPosition?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserPosition`](#parserposition-2) | [src/types/errors.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L44) |
| <a id="responsestatus-5"></a> `responseStatus?` | `readonly` | `"NO"` \| `"BAD"` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseStatus`](#responsestatus-2) | [src/types/errors.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L40) |
| <a id="responsetext-5"></a> `responseText?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseText`](#responsetext-2) | [src/types/errors.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L41) |
| <a id="serverresponsecode-5"></a> `serverResponseCode?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`serverResponseCode`](#serverresponsecode-2) | [src/types/errors.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L38) |
| <a id="stack-5"></a> `stack?` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`stack`](#stack-2) | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| <a id="throttlereset-5"></a> `throttleReset?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`throttleReset`](#throttlereset-2) | [src/types/errors.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L42) |
| <a id="stacktracelimit-5"></a> `stackTraceLimit` | `static` | `number` | `undefined` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | - | [`IMAPSDKError`](#imapsdkerror).[`stackTraceLimit`](#stacktracelimit-2) | node\_modules/@types/node/globals.d.ts:68 |

#### Methods

##### authentication()

```ts
static authentication(
   message: string, 
   serverResponseCode?: string, 
   oauthError?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:74](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L74)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `oauthError?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`authentication`](#authentication-4)

##### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`captureStackTrace`](#capturestacktrace-4)

##### commandFailed()

```ts
static commandFailed(
   message: string, 
   serverResponseCode?: string, 
   responseText?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:94](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L94)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `responseText?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`commandFailed`](#commandfailed-4)

##### connection()

```ts
static connection(code: 
  | "CONNECT_TIMEOUT"
  | "CONNECTION_CLOSED"
  | "GREETING_TIMEOUT"
  | "NO_CONNECTION"
  | "SOCKET_TIMEOUT"
  | "TLS_FAILED"
  | "UPGRADE_TIMEOUT", message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:60](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L60)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"GREETING_TIMEOUT"` \| `"NO_CONNECTION"` \| `"SOCKET_TIMEOUT"` \| `"TLS_FAILED"` \| `"UPGRADE_TIMEOUT"` |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`connection`](#connection-4)

##### disposed()

```ts
static disposed(resource: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:120](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L120)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `resource` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`disposed`](#disposed-4)

##### internal()

```ts
static internal(message: string, cause?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:124](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `cause?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`internal`](#internal-4)

##### invalidState()

```ts
static invalidState(message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:116](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`invalidState`](#invalidstate-4)

##### isError()

```ts
static isError(error: unknown): error is Error;
```

Defined in: node\_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is Error`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isError`](#iserror-4)

##### isIMAPSDKError()

```ts
static isIMAPSDKError(error: unknown): error is IMAPSDKError;
```

Defined in: [src/types/errors.ts:128](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L128)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is IMAPSDKError`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isIMAPSDKError`](#isimapsdkerror-4)

##### missingExtension()

```ts
static missingExtension(message: string, extension: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:112](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `extension` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`missingExtension`](#missingextension-4)

##### parser()

```ts
static parser(
   message: string, 
   position?: number, 
   input?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:101](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L101)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `position?` | `number` |
| `input?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`parser`](#parser-4)

##### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`prepareStackTrace`](#preparestacktrace-4)

##### protocol()

```ts
static protocol(
   message: string, 
   responseStatus?: "NO" | "BAD", 
   responseText?: string, 
   serverResponseCode?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:81](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `responseStatus?` | `"NO"` \| `"BAD"` |
| `responseText?` | `string` |
| `serverResponseCode?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`protocol`](#protocol-4)

##### throttled()

```ts
static throttled(message: string, throttleReset: number): IMAPSDKError;
```

Defined in: [src/types/errors.ts:108](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L108)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `throttleReset` | `number` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`throttled`](#throttled-4)

***

### ThrottleError

Defined in: [src/types/errors.ts:206](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L206)

#### Extends

- [`IMAPSDKError`](#imapsdkerror)

#### Constructors

##### Constructor

```ts
new ThrottleError(message: string, throttleReset: number): ThrottleError;
```

Defined in: [src/types/errors.ts:209](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L209)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `throttleReset` | `number` |

###### Returns

[`ThrottleError`](#throttleerror)

###### Overrides

[`IMAPSDKError`](#imapsdkerror).[`constructor`](#constructor-3)

#### Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cause-6"></a> `cause?` | `public` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`cause`](#cause-2) | node\_modules/typescript/lib/lib.es2022.error.d.ts:26 |
| <a id="code-6"></a> `code` | `readonly` | \| `"AUTHENTICATION_FAILED"` \| `"COMMAND_FAILED"` \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"DISPOSED"` \| `"GREETING_TIMEOUT"` \| `"INTERNAL"` \| `"INVALID_STATE"` \| `"MISSING_EXTENSION"` \| `"NO_CONNECTION"` \| `"PROTOCOL_ERROR"` \| `"SOCKET_TIMEOUT"` \| `"THROTTLED"` \| `"TLS_FAILED"` \| `"UNKNOWN"` \| `"UPGRADE_TIMEOUT"` \| `` `PARSER_${string}` `` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`code`](#code-2) | [src/types/errors.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L37) |
| <a id="extension-6"></a> `extension?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`extension`](#extension-2) | [src/types/errors.ts:43](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L43) |
| <a id="message-6"></a> `message` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`message`](#message-2) | node\_modules/typescript/lib/lib.es5.d.ts:1077 |
| <a id="name-6"></a> `name` | `readonly` | `"ThrottleError"` | `'ThrottleError'` | - | [`IMAPSDKError`](#imapsdkerror).[`name`](#name-2) | - | [src/types/errors.ts:207](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L207) |
| <a id="oautherror-6"></a> `oauthError?` | `readonly` | `unknown` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`oauthError`](#oautherror-2) | [src/types/errors.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L39) |
| <a id="parserinput-6"></a> `parserInput?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserInput`](#parserinput-2) | [src/types/errors.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L45) |
| <a id="parserposition-6"></a> `parserPosition?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`parserPosition`](#parserposition-2) | [src/types/errors.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L44) |
| <a id="responsestatus-6"></a> `responseStatus?` | `readonly` | `"NO"` \| `"BAD"` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseStatus`](#responsestatus-2) | [src/types/errors.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L40) |
| <a id="responsetext-6"></a> `responseText?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`responseText`](#responsetext-2) | [src/types/errors.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L41) |
| <a id="serverresponsecode-6"></a> `serverResponseCode?` | `readonly` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`serverResponseCode`](#serverresponsecode-2) | [src/types/errors.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L38) |
| <a id="stack-6"></a> `stack?` | `public` | `string` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`stack`](#stack-2) | node\_modules/typescript/lib/lib.es5.d.ts:1078 |
| <a id="throttlereset-6"></a> `throttleReset?` | `readonly` | `number` | `undefined` | - | - | [`IMAPSDKError`](#imapsdkerror).[`throttleReset`](#throttlereset-2) | [src/types/errors.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L42) |
| <a id="stacktracelimit-6"></a> `stackTraceLimit` | `static` | `number` | `undefined` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | - | [`IMAPSDKError`](#imapsdkerror).[`stackTraceLimit`](#stacktracelimit-2) | node\_modules/@types/node/globals.d.ts:68 |

#### Methods

##### authentication()

```ts
static authentication(
   message: string, 
   serverResponseCode?: string, 
   oauthError?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:74](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L74)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `oauthError?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`authentication`](#authentication-4)

##### captureStackTrace()

```ts
static captureStackTrace(targetObject: object, constructorOpt?: Function): void;
```

Defined in: node\_modules/@types/node/globals.d.ts:52

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

###### Returns

`void`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`captureStackTrace`](#capturestacktrace-4)

##### commandFailed()

```ts
static commandFailed(
   message: string, 
   serverResponseCode?: string, 
   responseText?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:94](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L94)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `serverResponseCode?` | `string` |
| `responseText?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`commandFailed`](#commandfailed-4)

##### connection()

```ts
static connection(code: 
  | "CONNECT_TIMEOUT"
  | "CONNECTION_CLOSED"
  | "GREETING_TIMEOUT"
  | "NO_CONNECTION"
  | "SOCKET_TIMEOUT"
  | "TLS_FAILED"
  | "UPGRADE_TIMEOUT", message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:60](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L60)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `code` | \| `"CONNECT_TIMEOUT"` \| `"CONNECTION_CLOSED"` \| `"GREETING_TIMEOUT"` \| `"NO_CONNECTION"` \| `"SOCKET_TIMEOUT"` \| `"TLS_FAILED"` \| `"UPGRADE_TIMEOUT"` |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`connection`](#connection-4)

##### disposed()

```ts
static disposed(resource: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:120](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L120)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `resource` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`disposed`](#disposed-4)

##### internal()

```ts
static internal(message: string, cause?: unknown): IMAPSDKError;
```

Defined in: [src/types/errors.ts:124](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L124)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `cause?` | `unknown` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`internal`](#internal-4)

##### invalidState()

```ts
static invalidState(message: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:116](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L116)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`invalidState`](#invalidstate-4)

##### isError()

```ts
static isError(error: unknown): error is Error;
```

Defined in: node\_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is Error`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isError`](#iserror-4)

##### isIMAPSDKError()

```ts
static isIMAPSDKError(error: unknown): error is IMAPSDKError;
```

Defined in: [src/types/errors.ts:128](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L128)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

###### Returns

`error is IMAPSDKError`

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`isIMAPSDKError`](#isimapsdkerror-4)

##### missingExtension()

```ts
static missingExtension(message: string, extension: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:112](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L112)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `extension` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`missingExtension`](#missingextension-4)

##### parser()

```ts
static parser(
   message: string, 
   position?: number, 
   input?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:101](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L101)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `position?` | `number` |
| `input?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`parser`](#parser-4)

##### prepareStackTrace()

```ts
static prepareStackTrace(err: Error, stackTraces: CallSite[]): any;
```

Defined in: node\_modules/@types/node/globals.d.ts:56

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`prepareStackTrace`](#preparestacktrace-4)

##### protocol()

```ts
static protocol(
   message: string, 
   responseStatus?: "NO" | "BAD", 
   responseText?: string, 
   serverResponseCode?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:81](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L81)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `responseStatus?` | `"NO"` \| `"BAD"` |
| `responseText?` | `string` |
| `serverResponseCode?` | `string` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`protocol`](#protocol-4)

##### throttled()

```ts
static throttled(message: string, throttleReset: number): IMAPSDKError;
```

Defined in: [src/types/errors.ts:108](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L108)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `throttleReset` | `number` |

###### Returns

[`IMAPSDKError`](#imapsdkerror)

###### Inherited from

[`IMAPSDKError`](#imapsdkerror).[`throttled`](#throttled-4)

## Type Aliases

### Address

```ts
type Address = {
  address?: string;
  name?: string;
};
```

Defined in: [src/types/message.ts:3](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L3)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="address-1"></a> `address?` | `readonly` | `string` | [src/types/message.ts:5](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L5) |
| <a id="name-7"></a> `name?` | `readonly` | `string` | [src/types/message.ts:4](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L4) |

***

### AppendOptions

```ts
type AppendOptions = {
  date?: Date;
  flags?: readonly string[];
};
```

Defined in: [src/types/message.ts:74](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L74)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="date"></a> `date?` | `readonly` | `Date` | [src/types/message.ts:76](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L76) |
| <a id="flags"></a> `flags?` | `readonly` | readonly `string`[] | [src/types/message.ts:75](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L75) |

***

### AuthOptions

```ts
type AuthOptions = {
  accessToken?: string;
  authzid?: string;
  loginMethod?: string;
  pass?: string;
  user: string;
};
```

Defined in: [src/types/connection.ts:36](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L36)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="accesstoken"></a> `accessToken?` | `readonly` | `string` | [src/types/connection.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L39) |
| <a id="authzid"></a> `authzid?` | `readonly` | `string` | [src/types/connection.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L41) |
| <a id="loginmethod"></a> `loginMethod?` | `readonly` | `string` | [src/types/connection.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L40) |
| <a id="pass"></a> `pass?` | `readonly` | `string` | [src/types/connection.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L38) |
| <a id="user"></a> `user` | `readonly` | `string` | [src/types/connection.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L37) |

***

### Brand

```ts
type Brand<T, B> = T & {
  [___brand]: B;
};
```

Defined in: [src/types/brand.ts:3](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/brand.ts#L3)

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `[___brand]` | `B` | [src/types/brand.ts:3](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/brand.ts#L3) |

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `B` *extends* `string` |

***

### CommandAttribute

```ts
type CommandAttribute = 
  | {
  sensitive?: boolean;
  type: "ATOM";
  value: string;
}
  | {
  type: "STRING";
  value: string;
}
  | {
  isLiteral8?: boolean;
  type: "LITERAL";
  value: Buffer;
}
  | {
  type: "SEQUENCE";
  value: string;
}
  | {
  type: "NUMBER";
  value: number;
}
  | {
  section?: readonly CommandAttribute[];
  type: "SECTION";
  value: string;
}
  | {
  type: "TEXT";
  value: string;
}
  | readonly CommandAttribute[];
```

Defined in: [src/types/protocol.ts:22](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L22)

***

### CommandContext

```ts
type CommandContext = {
  addEnabled: (extension: string) => void;
  authCapabilities: ReadonlyMap<string, boolean>;
  capabilities: ReadonlySet<string>;
  emitExists: (info: {
     count: number;
     path: MailboxPath;
     prevCount: number;
  }) => void;
  emitExpunge: (info: {
     path: MailboxPath;
     seq: number;
     vanished: boolean;
  }) => void;
  emitFlags: (info: {
     flags: Set<string>;
     modseq?: ModSeq;
     path: MailboxPath;
     seq: number;
     uid?: number;
  }) => void;
  emitMailboxClose: (mailbox: MailboxInfo) => void;
  emitMailboxOpen: (mailbox: MailboxInfo) => void;
  enabled: ReadonlySet<string>;
  exec: (command: string, attributes?: readonly CommandAttribute[], options?: ExecOptions) => Promise<ExecResponse>;
  expectCapabilityUpdate: boolean;
  folders: ReadonlyMap<MailboxPath, MailboxListEntry>;
  id: string;
  log: Logger;
  mailbox: MailboxInfo | null;
  run: <T>(command: string, ...args: unknown[]) => Promise<T>;
  servername: string;
  setAuthCapability: (method: string, success: boolean) => void;
  setCapabilities: (capabilities: Set<string>) => void;
  setExpectCapabilityUpdate: (expect: boolean) => void;
  setFolder: (path: MailboxPath, folder: MailboxListEntry) => void;
  setMailbox: (mailbox: MailboxInfo | null) => void;
  state: CommandContextState;
  write: (data: string | Buffer) => void;
};
```

Defined in: [src/shell/commands/types.ts:26](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L26)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="addenabled-2"></a> `addEnabled` | `public` | (`extension`: `string`) => `void` | [src/shell/commands/types.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L41) |
| <a id="authcapabilities-1"></a> `authCapabilities` | `readonly` | `ReadonlyMap`\<`string`, `boolean`\> | [src/shell/commands/types.ts:32](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L32) |
| <a id="capabilities-1"></a> `capabilities` | `readonly` | `ReadonlySet`\<`string`\> | [src/shell/commands/types.ts:30](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L30) |
| <a id="emitexists-2"></a> `emitExists` | `public` | (`info`: \{ `count`: `number`; `path`: [`MailboxPath`](#mailboxpath); `prevCount`: `number`; \}) => `void` | [src/shell/commands/types.ts:56](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L56) |
| <a id="emitexpunge-2"></a> `emitExpunge` | `public` | (`info`: \{ `path`: [`MailboxPath`](#mailboxpath); `seq`: `number`; `vanished`: `boolean`; \}) => `void` | [src/shell/commands/types.ts:57](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L57) |
| <a id="emitflags-2"></a> `emitFlags` | `public` | (`info`: \{ `flags`: `Set`\<`string`\>; `modseq?`: [`ModSeq`](#modseq-2); `path`: [`MailboxPath`](#mailboxpath); `seq`: `number`; `uid?`: `number`; \}) => `void` | [src/shell/commands/types.ts:58](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L58) |
| <a id="emitmailboxclose-2"></a> `emitMailboxClose` | `public` | (`mailbox`: [`MailboxInfo`](#mailboxinfo)) => `void` | [src/shell/commands/types.ts:55](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L55) |
| <a id="emitmailboxopen-2"></a> `emitMailboxOpen` | `public` | (`mailbox`: [`MailboxInfo`](#mailboxinfo)) => `void` | [src/shell/commands/types.ts:54](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L54) |
| <a id="enabled-1"></a> `enabled` | `readonly` | `ReadonlySet`\<`string`\> | [src/shell/commands/types.ts:31](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L31) |
| <a id="exec-2"></a> `exec` | `public` | (`command`: `string`, `attributes?`: readonly [`CommandAttribute`](#commandattribute)[], `options?`: [`ExecOptions`](#execoptions)) => `Promise`\<[`ExecResponse`](#execresponse)\> | [src/shell/commands/types.ts:47](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L47) |
| <a id="expectcapabilityupdate-1"></a> `expectCapabilityUpdate` | `readonly` | `boolean` | [src/shell/commands/types.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L45) |
| <a id="folders-1"></a> `folders` | `readonly` | `ReadonlyMap`\<[`MailboxPath`](#mailboxpath), [`MailboxListEntry`](#mailboxlistentry)\> | [src/shell/commands/types.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L38) |
| <a id="id-1"></a> `id` | `readonly` | `string` | [src/shell/commands/types.ts:27](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L27) |
| <a id="log-1"></a> `log` | `readonly` | [`Logger`](#logger-1) | [src/shell/commands/types.ts:28](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L28) |
| <a id="mailbox-1"></a> `mailbox` | `readonly` | [`MailboxInfo`](#mailboxinfo) \| `null` | [src/shell/commands/types.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L37) |
| <a id="run-2"></a> `run` | `public` | \<`T`\>(`command`: `string`, ...`args`: `unknown`[]) => `Promise`\<`T`\> | [src/shell/commands/types.ts:49](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L49) |
| <a id="servername-1"></a> `servername` | `readonly` | `string` | [src/shell/commands/types.ts:33](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L33) |
| <a id="setauthcapability-2"></a> `setAuthCapability` | `public` | (`method`: `string`, `success`: `boolean`) => `void` | [src/shell/commands/types.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L42) |
| <a id="setcapabilities-2"></a> `setCapabilities` | `public` | (`capabilities`: `Set`\<`string`\>) => `void` | [src/shell/commands/types.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L40) |
| <a id="setexpectcapabilityupdate-2"></a> `setExpectCapabilityUpdate` | `public` | (`expect`: `boolean`) => `void` | [src/shell/commands/types.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L44) |
| <a id="setfolder-2"></a> `setFolder` | `public` | (`path`: [`MailboxPath`](#mailboxpath), `folder`: [`MailboxListEntry`](#mailboxlistentry)) => `void` | [src/shell/commands/types.ts:52](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L52) |
| <a id="setmailbox-2"></a> `setMailbox` | `public` | (`mailbox`: [`MailboxInfo`](#mailboxinfo) \| `null`) => `void` | [src/shell/commands/types.ts:51](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L51) |
| <a id="state-1"></a> `state` | `readonly` | [`CommandContextState`](#commandcontextstate-1) | [src/shell/commands/types.ts:35](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L35) |
| <a id="write-2"></a> `write` | `public` | (`data`: `string` \| `Buffer`) => `void` | [src/shell/commands/types.ts:48](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L48) |

***

### CommandContextState

```ts
type CommandContextState = "NOT_AUTHENTICATED" | "AUTHENTICATED" | "SELECTED" | "LOGOUT";
```

Defined in: [src/shell/commands/types.ts:61](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L61)

***

### ConnectionErrorCode

```ts
type ConnectionErrorCode = 
  | typeof NO_CONNECTION
  | typeof CONNECTION_CLOSED
  | typeof CONNECT_TIMEOUT
  | typeof GREETING_TIMEOUT
  | typeof SOCKET_TIMEOUT
  | typeof UPGRADE_TIMEOUT
  | typeof TLS_FAILED;
```

Defined in: [src/types/errors.ts:154](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L154)

***

### ConnectionEvent

```ts
type ConnectionEvent = 
  | {
  type: "CONNECT_START";
}
  | {
  greeting: string;
  type: "GREETING_RECEIVED";
}
  | {
  type: "PREAUTH_RECEIVED";
}
  | {
  type: "AUTHENTICATED";
  user: string;
}
  | {
  mailbox: MailboxInfo;
  type: "MAILBOX_SELECTED";
}
  | {
  type: "MAILBOX_CLOSED";
}
  | {
  type: "LOGOUT_INITIATED";
}
  | {
  type: "CONNECTION_CLOSED";
}
  | {
  error: Error;
  type: "ERROR";
};
```

Defined in: [src/types/connection.ts:25](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L25)

***

### ConnectionEventType

```ts
type ConnectionEventType = 
  | "CONNECT_START"
  | "GREETING_RECEIVED"
  | "PREAUTH_RECEIVED"
  | "AUTHENTICATED"
  | "MAILBOX_SELECTED"
  | "MAILBOX_CLOSED"
  | "LOGOUT_INITIATED"
  | "CONNECTION_CLOSED"
  | "ERROR";
```

Defined in: [src/types/connection.ts:14](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L14)

***

### ConnectionId

```ts
type ConnectionId = Brand<string, "ConnectionId">;
```

Defined in: [src/types/common.ts:10](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L10)

***

### ConnectionInfo

```ts
type ConnectionInfo = {
  capabilities: ReadonlySet<string>;
  enabled: ReadonlySet<string>;
  greeting?: string;
  host: string;
  id: ConnectionId;
  port: number;
  secure: boolean;
  serverInfo?: IdInfo;
};
```

Defined in: [src/types/connection.ts:80](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L80)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="capabilities-2"></a> `capabilities` | `readonly` | `ReadonlySet`\<`string`\> | [src/types/connection.ts:87](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L87) |
| <a id="enabled-2"></a> `enabled` | `readonly` | `ReadonlySet`\<`string`\> | [src/types/connection.ts:88](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L88) |
| <a id="greeting"></a> `greeting?` | `readonly` | `string` | [src/types/connection.ts:85](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L85) |
| <a id="host"></a> `host` | `readonly` | `string` | [src/types/connection.ts:82](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L82) |
| <a id="id-2"></a> `id` | `readonly` | [`ConnectionId`](#connectionid) | [src/types/connection.ts:81](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L81) |
| <a id="port"></a> `port` | `readonly` | `number` | [src/types/connection.ts:83](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L83) |
| <a id="secure"></a> `secure` | `readonly` | `boolean` | [src/types/connection.ts:84](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L84) |
| <a id="serverinfo"></a> `serverInfo?` | `readonly` | [`IdInfo`](#idinfo) | [src/types/connection.ts:86](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L86) |

***

### ConnectionOptions

```ts
type ConnectionOptions = {
  auth?: AuthOptions;
  clientInfo?: IdInfo;
  connectionTimeout?: number;
  disableAutoEnable?: boolean;
  disableAutoIdle?: boolean;
  disableBinary?: boolean;
  disableCompression?: boolean;
  doSTARTTLS?: boolean;
  emitLogs?: boolean;
  greetingTimeout?: number;
  host: string;
  logger?: Logger | false;
  logRaw?: boolean;
  maxIdleTime?: number;
  missingIdleCommand?: "NOOP" | "SELECT" | "STATUS";
  port: number;
  proxy?: string;
  qresync?: boolean;
  secure?: boolean;
  servername?: string;
  socketTimeout?: number;
  tls?: TlsOptions;
  verifyOnly?: boolean;
};
```

Defined in: [src/types/connection.ts:54](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L54)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="auth"></a> `auth?` | `readonly` | [`AuthOptions`](#authoptions) | [src/types/connection.ts:60](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L60) |
| <a id="clientinfo"></a> `clientInfo?` | `readonly` | [`IdInfo`](#idinfo) | [src/types/connection.ts:74](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L74) |
| <a id="connectiontimeout"></a> `connectionTimeout?` | `readonly` | `number` | [src/types/connection.ts:70](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L70) |
| <a id="disableautoenable"></a> `disableAutoEnable?` | `readonly` | `boolean` | [src/types/connection.ts:66](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L66) |
| <a id="disableautoidle"></a> `disableAutoIdle?` | `readonly` | `boolean` | [src/types/connection.ts:64](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L64) |
| <a id="disablebinary"></a> `disableBinary?` | `readonly` | `boolean` | [src/types/connection.ts:65](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L65) |
| <a id="disablecompression"></a> `disableCompression?` | `readonly` | `boolean` | [src/types/connection.ts:63](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L63) |
| <a id="dostarttls"></a> `doSTARTTLS?` | `readonly` | `boolean` | [src/types/connection.ts:58](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L58) |
| <a id="emitlogs"></a> `emitLogs?` | `readonly` | `boolean` | [src/types/connection.ts:77](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L77) |
| <a id="greetingtimeout"></a> `greetingTimeout?` | `readonly` | `number` | [src/types/connection.ts:71](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L71) |
| <a id="host-1"></a> `host` | `readonly` | `string` | [src/types/connection.ts:55](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L55) |
| <a id="logger"></a> `logger?` | `readonly` | [`Logger`](#logger-1) \| `false` | [src/types/connection.ts:75](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L75) |
| <a id="lograw"></a> `logRaw?` | `readonly` | `boolean` | [src/types/connection.ts:76](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L76) |
| <a id="maxidletime"></a> `maxIdleTime?` | `readonly` | `number` | [src/types/connection.ts:68](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L68) |
| <a id="missingidlecommand"></a> `missingIdleCommand?` | `readonly` | `"NOOP"` \| `"SELECT"` \| `"STATUS"` | [src/types/connection.ts:69](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L69) |
| <a id="port-1"></a> `port` | `readonly` | `number` | [src/types/connection.ts:56](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L56) |
| <a id="proxy"></a> `proxy?` | `readonly` | `string` | [src/types/connection.ts:62](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L62) |
| <a id="qresync"></a> `qresync?` | `readonly` | `boolean` | [src/types/connection.ts:67](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L67) |
| <a id="secure-1"></a> `secure?` | `readonly` | `boolean` | [src/types/connection.ts:57](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L57) |
| <a id="servername-2"></a> `servername?` | `readonly` | `string` | [src/types/connection.ts:59](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L59) |
| <a id="sockettimeout"></a> `socketTimeout?` | `readonly` | `number` | [src/types/connection.ts:72](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L72) |
| <a id="tls"></a> `tls?` | `readonly` | `TlsOptions` | [src/types/connection.ts:61](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L61) |
| <a id="verifyonly"></a> `verifyOnly?` | `readonly` | `boolean` | [src/types/connection.ts:73](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L73) |

***

### ConnectionState

```ts
type ConnectionState = 
  | {
  state: "DISCONNECTED";
}
  | {
  startedAt: number;
  state: "CONNECTING";
}
  | {
  greeting: string;
  state: "NOT_AUTHENTICATED";
}
  | {
  state: "AUTHENTICATED";
  user: string | true;
}
  | {
  mailbox: MailboxInfo;
  state: "SELECTED";
  user: string | true;
}
  | {
  state: "LOGOUT";
};
```

Defined in: [src/types/connection.ts:6](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L6)

***

### CopyOptions

```ts
type CopyOptions = {
  uid?: boolean;
};
```

Defined in: [src/shell/commands/types.ts:143](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L143)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="uid"></a> `uid?` | `readonly` | `boolean` | [src/shell/commands/types.ts:144](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L144) |

***

### CopyResponse

```ts
type CopyResponse = {
  path: string;
  uidMap: ReadonlyMap<number, number>;
  uidValidity: bigint;
};
```

Defined in: [src/types/message.ts:79](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L79)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="path"></a> `path` | `readonly` | `string` | [src/types/message.ts:80](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L80) |
| <a id="uidmap"></a> `uidMap` | `readonly` | `ReadonlyMap`\<`number`, `number`\> | [src/types/message.ts:82](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L82) |
| <a id="uidvalidity"></a> `uidValidity` | `readonly` | `bigint` | [src/types/message.ts:81](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L81) |

***

### CopyResult

```ts
type CopyResult = 
  | {
  destination: MailboxPath;
  path: MailboxPath;
  uidMap?: ReadonlyMap<number, number>;
  uidValidity?: UIDValidity;
}
  | false;
```

Defined in: [src/shell/commands/types.ts:147](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L147)

***

### ErrResult

```ts
type ErrResult<E> = {
  error: E;
  ok: false;
};
```

Defined in: [src/types/result.ts:2](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L2)

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `Error` |

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="error"></a> `error` | `readonly` | `E` | [src/types/result.ts:2](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L2) |
| <a id="ok"></a> `ok` | `readonly` | `false` | [src/types/result.ts:2](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L2) |

***

### ExecOptions

```ts
type ExecOptions = {
  comment?: string;
  onPlusTag?: PlusTagHandler;
  untagged?: UntaggedHandlers;
};
```

Defined in: [src/shell/commands/types.ts:14](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L14)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="comment"></a> `comment?` | `readonly` | `string` | [src/shell/commands/types.ts:17](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L17) |
| <a id="onplustag"></a> `onPlusTag?` | `readonly` | [`PlusTagHandler`](#plustaghandler) | [src/shell/commands/types.ts:16](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L16) |
| <a id="untagged"></a> `untagged?` | `readonly` | [`UntaggedHandlers`](#untaggedhandlers) | [src/shell/commands/types.ts:15](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L15) |

***

### ExecResponse

```ts
type ExecResponse = {
  next: () => void;
  response: ParsedResponse;
  tag: Tag;
};
```

Defined in: [src/shell/commands/types.ts:20](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L20)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="next"></a> `next` | `readonly` | () => `void` | [src/shell/commands/types.ts:23](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L23) |
| <a id="response"></a> `response` | `readonly` | [`ParsedResponse`](#parsedresponse) | [src/shell/commands/types.ts:22](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L22) |
| <a id="tag"></a> `tag` | `readonly` | [`Tag`](#tag-2) | [src/shell/commands/types.ts:21](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L21) |

***

### ExpungeOptions

```ts
type ExpungeOptions = {
  uid?: boolean;
};
```

Defined in: [src/shell/commands/types.ts:178](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L178)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="uid-1"></a> `uid?` | `readonly` | `boolean` | [src/shell/commands/types.ts:179](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L179) |

***

### FetchedMessage

```ts
type FetchedMessage = {
  bodyParts?: ReadonlyMap<string, Buffer>;
  bodyStructure?: MessageStructure;
  emailId?: string;
  envelope?: MessageEnvelope;
  flagColor?: FlagColor;
  flags?: ReadonlySet<string>;
  headers?: Buffer;
  id?: string;
  internalDate?: Date;
  labels?: ReadonlySet<string>;
  modseq?: ModSeq;
  seq: SequenceNumber;
  size?: number;
  source?: Buffer;
  threadId?: string;
  uid: UID;
};
```

Defined in: [src/types/message.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L39)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bodyparts"></a> `bodyParts?` | `readonly` | `ReadonlyMap`\<`string`, `Buffer`\> | [src/types/message.ts:54](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L54) |
| <a id="bodystructure"></a> `bodyStructure?` | `readonly` | [`MessageStructure`](#messagestructure) | [src/types/message.ts:52](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L52) |
| <a id="emailid"></a> `emailId?` | `readonly` | `string` | [src/types/message.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L45) |
| <a id="envelope"></a> `envelope?` | `readonly` | [`MessageEnvelope`](#messageenvelope) | [src/types/message.ts:51](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L51) |
| <a id="flagcolor"></a> `flagColor?` | `readonly` | [`FlagColor`](#flagcolor-1) | [src/types/message.ts:50](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L50) |
| <a id="flags-1"></a> `flags?` | `readonly` | `ReadonlySet`\<`string`\> | [src/types/message.ts:49](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L49) |
| <a id="headers"></a> `headers?` | `readonly` | `Buffer` | [src/types/message.ts:55](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L55) |
| <a id="id-3"></a> `id?` | `readonly` | `string` | [src/types/message.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L42) |
| <a id="internaldate"></a> `internalDate?` | `readonly` | `Date` | [src/types/message.ts:53](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L53) |
| <a id="labels"></a> `labels?` | `readonly` | `ReadonlySet`\<`string`\> | [src/types/message.ts:47](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L47) |
| <a id="modseq"></a> `modseq?` | `readonly` | [`ModSeq`](#modseq-2) | [src/types/message.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L44) |
| <a id="seq"></a> `seq` | `readonly` | [`SequenceNumber`](#sequencenumber) | [src/types/message.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L40) |
| <a id="size"></a> `size?` | `readonly` | `number` | [src/types/message.ts:48](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L48) |
| <a id="source"></a> `source?` | `readonly` | `Buffer` | [src/types/message.ts:43](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L43) |
| <a id="threadid"></a> `threadId?` | `readonly` | `string` | [src/types/message.ts:46](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L46) |
| <a id="uid-2"></a> `uid` | `readonly` | [`UID`](#uid-8) | [src/types/message.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L41) |

***

### FetchQuery

```ts
type FetchQuery = {
  bodyParts?: readonly string[];
  bodyStructure?: boolean;
  emailId?: boolean;
  envelope?: boolean;
  flags?: boolean;
  headers?: boolean | readonly string[];
  internalDate?: boolean;
  labels?: boolean;
  modseq?: boolean;
  size?: boolean;
  source?:   | boolean
     | {
     maxLength?: number;
     start?: number;
   };
  threadId?: boolean;
  uid?: boolean;
};
```

Defined in: [src/types/message.ts:58](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L58)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bodyparts-1"></a> `bodyParts?` | `readonly` | readonly `string`[] | [src/types/message.ts:67](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L67) |
| <a id="bodystructure-1"></a> `bodyStructure?` | `readonly` | `boolean` | [src/types/message.ts:61](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L61) |
| <a id="emailid-1"></a> `emailId?` | `readonly` | `boolean` | [src/types/message.ts:70](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L70) |
| <a id="envelope-1"></a> `envelope?` | `readonly` | `boolean` | [src/types/message.ts:62](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L62) |
| <a id="flags-2"></a> `flags?` | `readonly` | `boolean` | [src/types/message.ts:60](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L60) |
| <a id="headers-1"></a> `headers?` | `readonly` | `boolean` \| readonly `string`[] | [src/types/message.ts:66](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L66) |
| <a id="internaldate-1"></a> `internalDate?` | `readonly` | `boolean` | [src/types/message.ts:63](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L63) |
| <a id="labels-1"></a> `labels?` | `readonly` | `boolean` | [src/types/message.ts:68](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L68) |
| <a id="modseq-1"></a> `modseq?` | `readonly` | `boolean` | [src/types/message.ts:71](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L71) |
| <a id="size-1"></a> `size?` | `readonly` | `boolean` | [src/types/message.ts:64](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L64) |
| <a id="source-1"></a> `source?` | `readonly` | \| `boolean` \| \{ `maxLength?`: `number`; `start?`: `number`; \} | [src/types/message.ts:65](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L65) |
| <a id="threadid-1"></a> `threadId?` | `readonly` | `boolean` | [src/types/message.ts:69](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L69) |
| <a id="uid-3"></a> `uid?` | `readonly` | `boolean` | [src/types/message.ts:59](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L59) |

***

### FlagColor

```ts
type FlagColor = "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "grey";
```

Defined in: [src/types/common.ts:22](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L22)

***

### IdInfo

```ts
type IdInfo = {
[key: string]: string | Date | undefined;
  date?: Date;
  name?: string;
  os?: string;
  support-url?: string;
  vendor?: string;
  version?: string;
};
```

Defined in: [src/types/connection.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L44)

#### Indexable

```ts
[key: string]: string | Date | undefined
```

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="date-1"></a> `date?` | `readonly` | `Date` | [src/types/connection.ts:50](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L50) |
| <a id="name-8"></a> `name?` | `readonly` | `string` | [src/types/connection.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L45) |
| <a id="os"></a> `os?` | `readonly` | `string` | [src/types/connection.ts:47](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L47) |
| <a id="support-url"></a> `support-url?` | `readonly` | `string` | [src/types/connection.ts:49](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L49) |
| <a id="vendor"></a> `vendor?` | `readonly` | `string` | [src/types/connection.ts:48](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L48) |
| <a id="version"></a> `version?` | `readonly` | `string` | [src/types/connection.ts:46](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/connection.ts#L46) |

***

### IMAPClientEvents

```ts
type IMAPClientEvents = {
  close: [];
  error: [Error];
  exists: [{
     count: number;
     path: MailboxPath;
     prevCount: number;
  }];
  expunge: [{
     path: MailboxPath;
     seq: number;
     vanished: boolean;
  }];
  flags: [{
     flags: Set<string>;
     modseq?: ModSeq;
     path: MailboxPath;
     seq: number;
     uid?: number;
  }];
  log: [object];
  mailboxClose: [MailboxInfo];
  mailboxOpen: [MailboxInfo];
};
```

Defined in: [src/shell/client/index.ts:33](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L33)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="close-2"></a> `close` | \[\] | [src/shell/client/index.ts:34](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L34) |
| <a id="error-1"></a> `error` | \[`Error`\] | [src/shell/client/index.ts:35](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L35) |
| <a id="exists"></a> `exists` | \[\{ `count`: `number`; `path`: [`MailboxPath`](#mailboxpath); `prevCount`: `number`; \}\] | [src/shell/client/index.ts:36](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L36) |
| <a id="expunge"></a> `expunge` | \[\{ `path`: [`MailboxPath`](#mailboxpath); `seq`: `number`; `vanished`: `boolean`; \}\] | [src/shell/client/index.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L37) |
| <a id="flags-3"></a> `flags` | \[\{ `flags`: `Set`\<`string`\>; `modseq?`: [`ModSeq`](#modseq-2); `path`: [`MailboxPath`](#mailboxpath); `seq`: `number`; `uid?`: `number`; \}\] | [src/shell/client/index.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L38) |
| <a id="log-2"></a> `log` | \[`object`\] | [src/shell/client/index.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L39) |
| <a id="mailboxclose"></a> `mailboxClose` | \[[`MailboxInfo`](#mailboxinfo)\] | [src/shell/client/index.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L40) |
| <a id="mailboxopen"></a> `mailboxOpen` | \[[`MailboxInfo`](#mailboxinfo)\] | [src/shell/client/index.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L41) |

***

### IMAPClientOptions

```ts
type IMAPClientOptions = ConnectionOptions & {
  id?: string;
};
```

Defined in: [src/shell/client/index.ts:29](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L29)

#### Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `id?` | `string` | [src/shell/client/index.ts:30](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L30) |

***

### IMAPError

```ts
type IMAPError = IMAPSDKError;
```

Defined in: [src/types/errors.ts:222](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L222)

***

### IMAPSDKErrorCode

```ts
type IMAPSDKErrorCode = typeof IMAPSDKErrorCode[keyof typeof IMAPSDKErrorCode];
```

Defined in: [src/types/errors.ts:1](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L1)

***

### IMAPSDKErrorOptions

```ts
type IMAPSDKErrorOptions = {
  cause?: unknown;
  extension?: string;
  oauthError?: unknown;
  parserInput?: string;
  parserPosition?: number;
  responseStatus?: "NO" | "BAD";
  responseText?: string;
  serverResponseCode?: string;
  throttleReset?: number;
};
```

Defined in: [src/types/errors.ts:23](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L23)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="cause-7"></a> `cause?` | `readonly` | `unknown` | [src/types/errors.ts:24](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L24) |
| <a id="extension-7"></a> `extension?` | `readonly` | `string` | [src/types/errors.ts:30](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L30) |
| <a id="oautherror-7"></a> `oauthError?` | `readonly` | `unknown` | [src/types/errors.ts:26](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L26) |
| <a id="parserinput-7"></a> `parserInput?` | `readonly` | `string` | [src/types/errors.ts:32](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L32) |
| <a id="parserposition-7"></a> `parserPosition?` | `readonly` | `number` | [src/types/errors.ts:31](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L31) |
| <a id="responsestatus-7"></a> `responseStatus?` | `readonly` | `"NO"` \| `"BAD"` | [src/types/errors.ts:27](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L27) |
| <a id="responsetext-7"></a> `responseText?` | `readonly` | `string` | [src/types/errors.ts:28](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L28) |
| <a id="serverresponsecode-7"></a> `serverResponseCode?` | `readonly` | `string` | [src/types/errors.ts:25](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L25) |
| <a id="throttlereset-7"></a> `throttleReset?` | `readonly` | `number` | [src/types/errors.ts:29](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L29) |

***

### ListOptions

```ts
type ListOptions = {
  listOnly?: boolean;
  specialUseHints?: SpecialUseHints;
  statusQuery?: StatusQueryOptions;
};
```

Defined in: [src/shell/commands/types.ts:87](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L87)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="listonly"></a> `listOnly?` | `readonly` | `boolean` | [src/shell/commands/types.ts:90](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L90) |
| <a id="specialusehints"></a> `specialUseHints?` | `readonly` | [`SpecialUseHints`](#specialusehints-1) | [src/shell/commands/types.ts:89](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L89) |
| <a id="statusquery"></a> `statusQuery?` | `readonly` | [`StatusQueryOptions`](#statusqueryoptions) | [src/shell/commands/types.ts:88](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L88) |

***

### Lock

```ts
type Lock = {
  lockId: string;
  path: MailboxPath;
  release: () => void;
};
```

Defined in: [src/shell/client/mailbox-lock.ts:3](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/mailbox-lock.ts#L3)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="lockid"></a> `lockId` | `readonly` | `string` | [src/shell/client/mailbox-lock.ts:4](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/mailbox-lock.ts#L4) |
| <a id="path-1"></a> `path` | `readonly` | [`MailboxPath`](#mailboxpath) | [src/shell/client/mailbox-lock.ts:5](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/mailbox-lock.ts#L5) |
| <a id="release"></a> `release` | `readonly` | () => `void` | [src/shell/client/mailbox-lock.ts:6](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/mailbox-lock.ts#L6) |

***

### Logger

```ts
type Logger = {
  child: (bindings: object) => Logger;
  debug: (obj: object, msg?: string) => void;
  error: (obj: object, msg?: string) => void;
  info: (obj: object, msg?: string) => void;
  trace: (obj: object, msg?: string) => void;
  warn: (obj: object, msg?: string) => void;
};
```

Defined in: [src/types/common.ts:24](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L24)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="child"></a> `child` | (`bindings`: `object`) => [`Logger`](#logger-1) | [src/types/common.ts:30](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L30) |
| <a id="debug"></a> `debug` | (`obj`: `object`, `msg?`: `string`) => `void` | [src/types/common.ts:26](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L26) |
| <a id="error-2"></a> `error` | (`obj`: `object`, `msg?`: `string`) => `void` | [src/types/common.ts:29](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L29) |
| <a id="info"></a> `info` | (`obj`: `object`, `msg?`: `string`) => `void` | [src/types/common.ts:27](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L27) |
| <a id="trace"></a> `trace` | (`obj`: `object`, `msg?`: `string`) => `void` | [src/types/common.ts:25](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L25) |
| <a id="warn"></a> `warn` | (`obj`: `object`, `msg?`: `string`) => `void` | [src/types/common.ts:28](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L28) |

***

### MailboxInfo

```ts
type MailboxInfo = {
  delimiter: string;
  exists: number;
  flags: ReadonlySet<string>;
  highestModseq?: ModSeq;
  listed?: boolean;
  mailboxId?: string;
  noModseq?: boolean;
  path: MailboxPath;
  permanentFlags?: ReadonlySet<string>;
  readOnly?: boolean;
  specialUse?: string;
  subscribed?: boolean;
  uidNext: number;
  uidValidity: UIDValidity;
};
```

Defined in: [src/types/mailbox.ts:3](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L3)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="delimiter"></a> `delimiter` | `readonly` | `string` | [src/types/mailbox.ts:5](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L5) |
| <a id="exists-1"></a> `exists` | `readonly` | `number` | [src/types/mailbox.ts:16](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L16) |
| <a id="flags-4"></a> `flags` | `readonly` | `ReadonlySet`\<`string`\> | [src/types/mailbox.ts:6](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L6) |
| <a id="highestmodseq"></a> `highestModseq?` | `readonly` | [`ModSeq`](#modseq-2) | [src/types/mailbox.ts:12](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L12) |
| <a id="listed"></a> `listed?` | `readonly` | `boolean` | [src/types/mailbox.ts:9](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L9) |
| <a id="mailboxid"></a> `mailboxId?` | `readonly` | `string` | [src/types/mailbox.ts:11](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L11) |
| <a id="nomodseq"></a> `noModseq?` | `readonly` | `boolean` | [src/types/mailbox.ts:13](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L13) |
| <a id="path-2"></a> `path` | `readonly` | [`MailboxPath`](#mailboxpath) | [src/types/mailbox.ts:4](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L4) |
| <a id="permanentflags"></a> `permanentFlags?` | `readonly` | `ReadonlySet`\<`string`\> | [src/types/mailbox.ts:7](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L7) |
| <a id="readonly"></a> `readOnly?` | `readonly` | `boolean` | [src/types/mailbox.ts:17](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L17) |
| <a id="specialuse"></a> `specialUse?` | `readonly` | `string` | [src/types/mailbox.ts:8](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L8) |
| <a id="subscribed"></a> `subscribed?` | `readonly` | `boolean` | [src/types/mailbox.ts:10](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L10) |
| <a id="uidnext"></a> `uidNext` | `readonly` | `number` | [src/types/mailbox.ts:15](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L15) |
| <a id="uidvalidity-1"></a> `uidValidity` | `readonly` | [`UIDValidity`](#uidvalidity-5) | [src/types/mailbox.ts:14](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L14) |

***

### MailboxListEntry

```ts
type MailboxListEntry = {
  delimiter: string;
  flags: ReadonlySet<string>;
  listed: boolean;
  name: string;
  parent: readonly string[];
  parentPath: string;
  path: MailboxPath;
  pathAsListed: string;
  specialUse?: string;
  status?: StatusInfo;
  subscribed: boolean;
};
```

Defined in: [src/types/mailbox.ts:20](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L20)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="delimiter-1"></a> `delimiter` | `readonly` | `string` | [src/types/mailbox.ts:24](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L24) |
| <a id="flags-5"></a> `flags` | `readonly` | `ReadonlySet`\<`string`\> | [src/types/mailbox.ts:27](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L27) |
| <a id="listed-1"></a> `listed` | `readonly` | `boolean` | [src/types/mailbox.ts:29](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L29) |
| <a id="name-9"></a> `name` | `readonly` | `string` | [src/types/mailbox.ts:23](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L23) |
| <a id="parent"></a> `parent` | `readonly` | readonly `string`[] | [src/types/mailbox.ts:25](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L25) |
| <a id="parentpath"></a> `parentPath` | `readonly` | `string` | [src/types/mailbox.ts:26](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L26) |
| <a id="path-3"></a> `path` | `readonly` | [`MailboxPath`](#mailboxpath) | [src/types/mailbox.ts:21](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L21) |
| <a id="pathaslisted"></a> `pathAsListed` | `readonly` | `string` | [src/types/mailbox.ts:22](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L22) |
| <a id="specialuse-1"></a> `specialUse?` | `readonly` | `string` | [src/types/mailbox.ts:28](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L28) |
| <a id="status"></a> `status?` | `readonly` | [`StatusInfo`](#statusinfo) | [src/types/mailbox.ts:31](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L31) |
| <a id="subscribed-1"></a> `subscribed` | `readonly` | `boolean` | [src/types/mailbox.ts:30](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L30) |

***

### MailboxPath

```ts
type MailboxPath = Brand<string, "MailboxPath">;
```

Defined in: [src/types/common.ts:8](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L8)

***

### MessageEnvelope

```ts
type MessageEnvelope = {
  bcc?: readonly Address[];
  cc?: readonly Address[];
  date?: Date;
  from?: readonly Address[];
  inReplyTo?: string;
  messageId?: string;
  replyTo?: readonly Address[];
  sender?: readonly Address[];
  subject?: string;
  to?: readonly Address[];
};
```

Defined in: [src/types/message.ts:8](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L8)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bcc"></a> `bcc?` | `readonly` | readonly [`Address`](#address)[] | [src/types/message.ts:18](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L18) |
| <a id="cc"></a> `cc?` | `readonly` | readonly [`Address`](#address)[] | [src/types/message.ts:17](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L17) |
| <a id="date-2"></a> `date?` | `readonly` | `Date` | [src/types/message.ts:9](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L9) |
| <a id="from"></a> `from?` | `readonly` | readonly [`Address`](#address)[] | [src/types/message.ts:13](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L13) |
| <a id="inreplyto"></a> `inReplyTo?` | `readonly` | `string` | [src/types/message.ts:12](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L12) |
| <a id="messageid"></a> `messageId?` | `readonly` | `string` | [src/types/message.ts:11](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L11) |
| <a id="replyto"></a> `replyTo?` | `readonly` | readonly [`Address`](#address)[] | [src/types/message.ts:15](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L15) |
| <a id="sender"></a> `sender?` | `readonly` | readonly [`Address`](#address)[] | [src/types/message.ts:14](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L14) |
| <a id="subject"></a> `subject?` | `readonly` | `string` | [src/types/message.ts:10](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L10) |
| <a id="to"></a> `to?` | `readonly` | readonly [`Address`](#address)[] | [src/types/message.ts:16](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L16) |

***

### MessageStructure

```ts
type MessageStructure = {
  childNodes?: readonly MessageStructure[];
  description?: string;
  disposition?: string;
  dispositionParameters?: Readonly<Record<string, string>>;
  encoding?: string;
  envelope?: MessageEnvelope;
  id?: string;
  language?: readonly string[];
  lineCount?: number;
  location?: string;
  md5?: string;
  parameters?: Readonly<Record<string, string>>;
  part?: string;
  size?: number;
  type: string;
};
```

Defined in: [src/types/message.ts:21](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L21)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="childnodes"></a> `childNodes?` | `readonly` | readonly [`MessageStructure`](#messagestructure)[] | [src/types/message.ts:36](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L36) |
| <a id="description"></a> `description?` | `readonly` | `string` | [src/types/message.ts:26](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L26) |
| <a id="disposition"></a> `disposition?` | `readonly` | `string` | [src/types/message.ts:30](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L30) |
| <a id="dispositionparameters"></a> `dispositionParameters?` | `readonly` | `Readonly`\<`Record`\<`string`, `string`\>\> | [src/types/message.ts:31](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L31) |
| <a id="encoding"></a> `encoding?` | `readonly` | `string` | [src/types/message.ts:27](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L27) |
| <a id="envelope-2"></a> `envelope?` | `readonly` | [`MessageEnvelope`](#messageenvelope) | [src/types/message.ts:29](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L29) |
| <a id="id-4"></a> `id?` | `readonly` | `string` | [src/types/message.ts:25](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L25) |
| <a id="language"></a> `language?` | `readonly` | readonly `string`[] | [src/types/message.ts:33](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L33) |
| <a id="linecount"></a> `lineCount?` | `readonly` | `number` | [src/types/message.ts:35](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L35) |
| <a id="location"></a> `location?` | `readonly` | `string` | [src/types/message.ts:34](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L34) |
| <a id="md5"></a> `md5?` | `readonly` | `string` | [src/types/message.ts:32](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L32) |
| <a id="parameters"></a> `parameters?` | `readonly` | `Readonly`\<`Record`\<`string`, `string`\>\> | [src/types/message.ts:24](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L24) |
| <a id="part"></a> `part?` | `readonly` | `string` | [src/types/message.ts:22](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L22) |
| <a id="size-2"></a> `size?` | `readonly` | `number` | [src/types/message.ts:28](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L28) |
| <a id="type"></a> `type` | `readonly` | `string` | [src/types/message.ts:23](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L23) |

***

### ModSeq

```ts
type ModSeq = Brand<bigint, "ModSeq">;
```

Defined in: [src/types/common.ts:6](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L6)

***

### MoveOptions

```ts
type MoveOptions = {
  uid?: boolean;
};
```

Defined in: [src/shell/commands/types.ts:156](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L156)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="uid-4"></a> `uid?` | `readonly` | `boolean` | [src/shell/commands/types.ts:157](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L157) |

***

### MoveResult

```ts
type MoveResult = CopyResult;
```

Defined in: [src/shell/commands/types.ts:160](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L160)

***

### NamespaceEntry

```ts
type NamespaceEntry = {
  delimiter: string;
  prefix: string;
};
```

Defined in: [src/types/mailbox.ts:63](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L63)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="delimiter-2"></a> `delimiter` | `string` | [src/types/mailbox.ts:65](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L65) |
| <a id="prefix"></a> `prefix` | `string` | [src/types/mailbox.ts:64](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L64) |

***

### NamespaceInfo

```ts
type NamespaceInfo = {
  other: NamespaceEntry[] | false;
  personal: NamespaceEntry[];
  shared: NamespaceEntry[] | false;
};
```

Defined in: [src/types/mailbox.ts:57](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L57)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="other"></a> `other` | [`NamespaceEntry`](#namespaceentry)[] \| `false` | [src/types/mailbox.ts:59](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L59) |
| <a id="personal"></a> `personal` | [`NamespaceEntry`](#namespaceentry)[] | [src/types/mailbox.ts:58](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L58) |
| <a id="shared"></a> `shared` | [`NamespaceEntry`](#namespaceentry)[] \| `false` | [src/types/mailbox.ts:60](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L60) |

***

### OkResult

```ts
type OkResult<T> = {
  ok: true;
  value: T;
};
```

Defined in: [src/types/result.ts:1](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L1)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="ok-1"></a> `ok` | `readonly` | `true` | [src/types/result.ts:1](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L1) |
| <a id="value"></a> `value` | `readonly` | `T` | [src/types/result.ts:1](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L1) |

***

### ParsedResponse

```ts
type ParsedResponse = {
  attributes?: readonly Token[];
  command: string;
  humanReadable?: string;
  nullBytesRemoved?: number;
  tag: Tag | "*" | "+";
};
```

Defined in: [src/types/protocol.ts:12](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L12)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="attributes"></a> `attributes?` | `readonly` | readonly [`Token`](#token)[] | [src/types/protocol.ts:15](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L15) |
| <a id="command"></a> `command` | `readonly` | `string` | [src/types/protocol.ts:14](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L14) |
| <a id="humanreadable"></a> `humanReadable?` | `readonly` | `string` | [src/types/protocol.ts:16](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L16) |
| <a id="nullbytesremoved"></a> `nullBytesRemoved?` | `readonly` | `number` | [src/types/protocol.ts:17](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L17) |
| <a id="tag-1"></a> `tag` | `readonly` | [`Tag`](#tag-2) \| `"*"` \| `"+"` | [src/types/protocol.ts:13](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L13) |

***

### PlusTagHandler()

```ts
type PlusTagHandler = (response: ParsedResponse) => Promise<void> | void;
```

Defined in: [src/shell/commands/types.ts:12](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L12)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | [`ParsedResponse`](#parsedresponse) |

#### Returns

`Promise`\<`void`\> \| `void`

***

### QuotaInfo

```ts
type QuotaInfo = {
  messages?: QuotaResource;
  path: MailboxPath;
  quotaRoot?: string;
  storage?: QuotaResource;
};
```

Defined in: [src/types/mailbox.ts:50](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L50)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="messages"></a> `messages?` | `public` | [`QuotaResource`](#quotaresource) | [src/types/mailbox.ts:54](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L54) |
| <a id="path-4"></a> `path` | `readonly` | [`MailboxPath`](#mailboxpath) | [src/types/mailbox.ts:51](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L51) |
| <a id="quotaroot"></a> `quotaRoot?` | `public` | `string` | [src/types/mailbox.ts:52](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L52) |
| <a id="storage"></a> `storage?` | `public` | [`QuotaResource`](#quotaresource) | [src/types/mailbox.ts:53](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L53) |

***

### QuotaResource

```ts
type QuotaResource = {
  limit?: number;
  status?: string;
  usage?: number;
};
```

Defined in: [src/types/mailbox.ts:44](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L44)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="limit"></a> `limit?` | `number` | [src/types/mailbox.ts:46](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L46) |
| <a id="status-1"></a> `status?` | `string` | [src/types/mailbox.ts:47](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L47) |
| <a id="usage"></a> `usage?` | `number` | [src/types/mailbox.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L45) |

***

### Result

```ts
type Result<T, E> = OkResult<T> | ErrResult<E>;
```

Defined in: [src/types/result.ts:3](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L3)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | - |
| `E` *extends* `Error` | `Error` |

***

### SearchAllTerm

```ts
type SearchAllTerm = {
  all: true;
};
```

Defined in: [src/types/search.ts:43](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L43)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="all"></a> `all` | `readonly` | `true` | [src/types/search.ts:43](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L43) |

***

### SearchDateTerm

```ts
type SearchDateTerm = 
  | {
  before: Date;
}
  | {
  since: Date;
}
  | {
  on: Date;
}
  | {
  sentBefore: Date;
}
  | {
  sentSince: Date;
}
  | {
  sentOn: Date;
};
```

Defined in: [src/types/search.ts:1](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L1)

***

### SearchEmailIdTerm

```ts
type SearchEmailIdTerm = {
  emailId: string;
};
```

Defined in: [src/types/search.ts:33](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L33)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="emailid-2"></a> `emailId` | `readonly` | `string` | [src/types/search.ts:33](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L33) |

***

### SearchFlagTerm

```ts
type SearchFlagTerm = 
  | {
  seen: boolean;
}
  | {
  answered: boolean;
}
  | {
  flagged: boolean;
}
  | {
  deleted: boolean;
}
  | {
  draft: boolean;
};
```

Defined in: [src/types/search.ts:11](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L11)

***

### SearchGmailRawTerm

```ts
type SearchGmailRawTerm = {
  gmailRaw: string;
};
```

Defined in: [src/types/search.ts:35](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L35)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="gmailraw"></a> `gmailRaw` | `readonly` | `string` | [src/types/search.ts:35](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L35) |

***

### SearchKeywordTerm

```ts
type SearchKeywordTerm = 
  | {
  keyword: string;
}
  | {
  unkeyword: string;
};
```

Defined in: [src/types/search.ts:28](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L28)

***

### SearchModseqTerm

```ts
type SearchModseqTerm = {
  modseq: bigint;
};
```

Defined in: [src/types/search.ts:32](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L32)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="modseq-3"></a> `modseq` | `readonly` | `bigint` | [src/types/search.ts:32](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L32) |

***

### SearchNotTerm

```ts
type SearchNotTerm = {
  not: SearchQuery;
};
```

Defined in: [src/types/search.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L42)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="not"></a> `not` | `readonly` | [`SearchQuery`](#searchquery) | [src/types/search.ts:42](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L42) |

***

### SearchOptions

```ts
type SearchOptions = {
  uid?: boolean;
};
```

Defined in: [src/types/message.ts:85](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L85)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="uid-5"></a> `uid?` | `readonly` | `boolean` | [src/types/message.ts:86](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/message.ts#L86) |

***

### SearchOrTerm

```ts
type SearchOrTerm = {
  or: readonly [SearchQuery, SearchQuery];
};
```

Defined in: [src/types/search.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L39)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="or"></a> `or` | `readonly` | readonly \[[`SearchQuery`](#searchquery), [`SearchQuery`](#searchquery)\] | [src/types/search.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L40) |

***

### SearchQuery

```ts
type SearchQuery = SearchTerm | readonly SearchTerm[];
```

Defined in: [src/types/search.ts:62](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L62)

***

### SearchSeqTerm

```ts
type SearchSeqTerm = {
  seq: string;
};
```

Defined in: [src/types/search.ts:31](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L31)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="seq-1"></a> `seq` | `readonly` | `string` | [src/types/search.ts:31](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L31) |

***

### SearchSizeTerm

```ts
type SearchSizeTerm = 
  | {
  larger: number;
}
  | {
  smaller: number;
};
```

Defined in: [src/types/search.ts:9](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L9)

***

### SearchTerm

```ts
type SearchTerm = 
  | SearchDateTerm
  | SearchSizeTerm
  | SearchFlagTerm
  | SearchTextTerm
  | SearchKeywordTerm
  | SearchUidTerm
  | SearchSeqTerm
  | SearchModseqTerm
  | SearchEmailIdTerm
  | SearchThreadIdTerm
  | SearchGmailRawTerm
  | SearchWithinTerm
  | SearchOrTerm
  | SearchNotTerm
  | SearchAllTerm;
```

Defined in: [src/types/search.ts:45](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L45)

***

### SearchTextTerm

```ts
type SearchTextTerm = 
  | {
  from: string;
}
  | {
  to: string;
}
  | {
  cc: string;
}
  | {
  bcc: string;
}
  | {
  subject: string;
}
  | {
  body: string;
}
  | {
  text: string;
}
  | {
  header: {
     field: string;
     value: string;
  };
};
```

Defined in: [src/types/search.ts:18](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L18)

***

### SearchThreadIdTerm

```ts
type SearchThreadIdTerm = {
  threadId: string;
};
```

Defined in: [src/types/search.ts:34](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L34)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="threadid-2"></a> `threadId` | `readonly` | `string` | [src/types/search.ts:34](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L34) |

***

### SearchUidTerm

```ts
type SearchUidTerm = {
  uid: string;
};
```

Defined in: [src/types/search.ts:30](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L30)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="uid-6"></a> `uid` | `readonly` | `string` | [src/types/search.ts:30](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L30) |

***

### SearchWithinTerm

```ts
type SearchWithinTerm = 
  | {
  younger: number;
}
  | {
  older: number;
};
```

Defined in: [src/types/search.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/search.ts#L37)

***

### SelectOptions

```ts
type SelectOptions = {
  changedSince?: ModSeq;
  readOnly?: boolean;
  uidValidity?: UIDValidity;
};
```

Defined in: [src/shell/commands/types.ts:71](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L71)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="changedsince"></a> `changedSince?` | `readonly` | [`ModSeq`](#modseq-2) | [src/shell/commands/types.ts:73](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L73) |
| <a id="readonly-1"></a> `readOnly?` | `readonly` | `boolean` | [src/shell/commands/types.ts:72](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L72) |
| <a id="uidvalidity-2"></a> `uidValidity?` | `readonly` | [`UIDValidity`](#uidvalidity-5) | [src/shell/commands/types.ts:74](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L74) |

***

### SequenceNumber

```ts
type SequenceNumber = Brand<number, "SequenceNumber">;
```

Defined in: [src/types/common.ts:5](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L5)

***

### SequenceRange

```ts
type SequenceRange = 
  | UID
  | SequenceNumber
  | `${number}:${number}`
  | `${number}:*`
  | "*";
```

Defined in: [src/types/common.ts:20](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L20)

***

### SpecialUseHints

```ts
type SpecialUseHints = {
  archive?: string;
  drafts?: string;
  junk?: string;
  sent?: string;
  trash?: string;
};
```

Defined in: [src/shell/commands/types.ts:79](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L79)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="archive"></a> `archive?` | `readonly` | `string` | [src/shell/commands/types.ts:84](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L84) |
| <a id="drafts"></a> `drafts?` | `readonly` | `string` | [src/shell/commands/types.ts:83](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L83) |
| <a id="junk"></a> `junk?` | `readonly` | `string` | [src/shell/commands/types.ts:81](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L81) |
| <a id="sent"></a> `sent?` | `readonly` | `string` | [src/shell/commands/types.ts:80](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L80) |
| <a id="trash"></a> `trash?` | `readonly` | `string` | [src/shell/commands/types.ts:82](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L82) |

***

### StatusInfo

```ts
type StatusInfo = {
  highestModseq?: ModSeq;
  messages?: number;
  path: MailboxPath;
  recent?: number;
  uidNext?: number;
  uidValidity?: UIDValidity;
  unseen?: number;
};
```

Defined in: [src/types/mailbox.ts:34](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L34)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="highestmodseq-1"></a> `highestModseq?` | `readonly` | [`ModSeq`](#modseq-2) | [src/types/mailbox.ts:41](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L41) |
| <a id="messages-1"></a> `messages?` | `readonly` | `number` | [src/types/mailbox.ts:36](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L36) |
| <a id="path-5"></a> `path` | `readonly` | [`MailboxPath`](#mailboxpath) | [src/types/mailbox.ts:35](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L35) |
| <a id="recent"></a> `recent?` | `readonly` | `number` | [src/types/mailbox.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L37) |
| <a id="uidnext-1"></a> `uidNext?` | `readonly` | `number` | [src/types/mailbox.ts:38](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L38) |
| <a id="uidvalidity-3"></a> `uidValidity?` | `readonly` | [`UIDValidity`](#uidvalidity-5) | [src/types/mailbox.ts:39](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L39) |
| <a id="unseen"></a> `unseen?` | `readonly` | `number` | [src/types/mailbox.ts:40](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/mailbox.ts#L40) |

***

### StatusQueryOptions

```ts
type StatusQueryOptions = {
  highestModseq?: boolean;
  messages?: boolean;
  recent?: boolean;
  uidNext?: boolean;
  uidValidity?: boolean;
  unseen?: boolean;
};
```

Defined in: [src/shell/commands/types.ts:93](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L93)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="highestmodseq-2"></a> `highestModseq?` | `readonly` | `boolean` | [src/shell/commands/types.ts:99](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L99) |
| <a id="messages-2"></a> `messages?` | `readonly` | `boolean` | [src/shell/commands/types.ts:94](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L94) |
| <a id="recent-1"></a> `recent?` | `readonly` | `boolean` | [src/shell/commands/types.ts:95](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L95) |
| <a id="uidnext-2"></a> `uidNext?` | `readonly` | `boolean` | [src/shell/commands/types.ts:96](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L96) |
| <a id="uidvalidity-4"></a> `uidValidity?` | `readonly` | `boolean` | [src/shell/commands/types.ts:97](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L97) |
| <a id="unseen-1"></a> `unseen?` | `readonly` | `boolean` | [src/shell/commands/types.ts:98](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L98) |

***

### StoreOptions

```ts
type StoreOptions = {
  operation?: "add" | "remove" | "set";
  silent?: boolean;
  uid?: boolean;
  unchangedSince?: ModSeq;
  useLabels?: boolean;
};
```

Defined in: [src/shell/commands/types.ts:168](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L168)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="operation"></a> `operation?` | `readonly` | `"add"` \| `"remove"` \| `"set"` | [src/shell/commands/types.ts:172](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L172) |
| <a id="silent"></a> `silent?` | `readonly` | `boolean` | [src/shell/commands/types.ts:170](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L170) |
| <a id="uid-7"></a> `uid?` | `readonly` | `boolean` | [src/shell/commands/types.ts:169](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L169) |
| <a id="unchangedsince"></a> `unchangedSince?` | `readonly` | [`ModSeq`](#modseq-2) | [src/shell/commands/types.ts:173](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L173) |
| <a id="uselabels"></a> `useLabels?` | `readonly` | `boolean` | [src/shell/commands/types.ts:171](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L171) |

***

### Tag

```ts
type Tag = Brand<string, "Tag">;
```

Defined in: [src/types/common.ts:9](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L9)

***

### Token

```ts
type Token = {
  partial?: readonly [number] | readonly [number, number];
  section?: readonly Token[];
  type: TokenType;
  value: string | Buffer | null;
};
```

Defined in: [src/types/protocol.ts:5](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L5)

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="partial"></a> `partial?` | `readonly` | readonly \[`number`\] \| readonly \[`number`, `number`\] | [src/types/protocol.ts:9](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L9) |
| <a id="section"></a> `section?` | `readonly` | readonly [`Token`](#token)[] | [src/types/protocol.ts:8](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L8) |
| <a id="type-1"></a> `type` | `readonly` | [`TokenType`](#tokentype-1) | [src/types/protocol.ts:6](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L6) |
| <a id="value-1"></a> `value` | `readonly` | `string` \| `Buffer` \| `null` | [src/types/protocol.ts:7](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L7) |

***

### TokenType

```ts
type TokenType = 
  | "ATOM"
  | "STRING"
  | "LITERAL"
  | "NUMBER"
  | "SEQUENCE"
  | "SECTION"
  | "PARTIAL"
  | "TEXT"
  | "NIL";
```

Defined in: [src/types/protocol.ts:3](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/protocol.ts#L3)

***

### UID

```ts
type UID = Brand<number, "UID">;
```

Defined in: [src/types/common.ts:4](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L4)

***

### UIDValidity

```ts
type UIDValidity = Brand<bigint, "UIDValidity">;
```

Defined in: [src/types/common.ts:7](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L7)

***

### UntaggedHandler()

```ts
type UntaggedHandler = (response: ParsedResponse) => Promise<void> | void;
```

Defined in: [src/shell/commands/types.ts:6](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L6)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | [`ParsedResponse`](#parsedresponse) |

#### Returns

`Promise`\<`void`\> \| `void`

***

### UntaggedHandlers

```ts
type UntaggedHandlers = {
[key: string]: UntaggedHandler;
};
```

Defined in: [src/shell/commands/types.ts:8](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/commands/types.ts#L8)

#### Index Signature

```ts
[key: string]: UntaggedHandler
```

## Variables

### ConnectionId()

```ts
ConnectionId: (s: string) => ConnectionId;
```

Defined in: [src/types/common.ts:10](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `s` | `string` |

#### Returns

[`ConnectionId`](#connectionid)

***

### IMAPSDKErrorCode

```ts
const IMAPSDKErrorCode: {
  AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED";
  COMMAND_FAILED: "COMMAND_FAILED";
  CONNECT_TIMEOUT: "CONNECT_TIMEOUT";
  CONNECTION_CLOSED: "CONNECTION_CLOSED";
  DISPOSED: "DISPOSED";
  GREETING_TIMEOUT: "GREETING_TIMEOUT";
  INTERNAL: "INTERNAL";
  INVALID_STATE: "INVALID_STATE";
  MISSING_EXTENSION: "MISSING_EXTENSION";
  NO_CONNECTION: "NO_CONNECTION";
  PARSER_ERROR: "PARSER_ERROR";
  PROTOCOL_ERROR: "PROTOCOL_ERROR";
  SOCKET_TIMEOUT: "SOCKET_TIMEOUT";
  THROTTLED: "THROTTLED";
  TLS_FAILED: "TLS_FAILED";
  UNKNOWN: "UNKNOWN";
  UPGRADE_TIMEOUT: "UPGRADE_TIMEOUT";
};
```

Defined in: [src/types/errors.ts:1](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L1)

#### Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="authentication_failed"></a> `AUTHENTICATION_FAILED` | `"AUTHENTICATION_FAILED"` | `'AUTHENTICATION_FAILED'` | [src/types/errors.ts:2](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L2) |
| <a id="command_failed"></a> `COMMAND_FAILED` | `"COMMAND_FAILED"` | `'COMMAND_FAILED'` | [src/types/errors.ts:3](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L3) |
| <a id="connect_timeout"></a> `CONNECT_TIMEOUT` | `"CONNECT_TIMEOUT"` | `'CONNECT_TIMEOUT'` | [src/types/errors.ts:4](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L4) |
| <a id="connection_closed"></a> `CONNECTION_CLOSED` | `"CONNECTION_CLOSED"` | `'CONNECTION_CLOSED'` | [src/types/errors.ts:5](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L5) |
| <a id="disposed-14"></a> `DISPOSED` | `"DISPOSED"` | `'DISPOSED'` | [src/types/errors.ts:6](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L6) |
| <a id="greeting_timeout"></a> `GREETING_TIMEOUT` | `"GREETING_TIMEOUT"` | `'GREETING_TIMEOUT'` | [src/types/errors.ts:7](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L7) |
| <a id="internal-14"></a> `INTERNAL` | `"INTERNAL"` | `'INTERNAL'` | [src/types/errors.ts:8](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L8) |
| <a id="invalid_state"></a> `INVALID_STATE` | `"INVALID_STATE"` | `'INVALID_STATE'` | [src/types/errors.ts:9](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L9) |
| <a id="missing_extension"></a> `MISSING_EXTENSION` | `"MISSING_EXTENSION"` | `'MISSING_EXTENSION'` | [src/types/errors.ts:10](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L10) |
| <a id="no_connection"></a> `NO_CONNECTION` | `"NO_CONNECTION"` | `'NO_CONNECTION'` | [src/types/errors.ts:11](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L11) |
| <a id="parser_error"></a> `PARSER_ERROR` | `"PARSER_ERROR"` | `'PARSER_ERROR'` | [src/types/errors.ts:12](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L12) |
| <a id="protocol_error"></a> `PROTOCOL_ERROR` | `"PROTOCOL_ERROR"` | `'PROTOCOL_ERROR'` | [src/types/errors.ts:13](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L13) |
| <a id="socket_timeout"></a> `SOCKET_TIMEOUT` | `"SOCKET_TIMEOUT"` | `'SOCKET_TIMEOUT'` | [src/types/errors.ts:14](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L14) |
| <a id="throttled-14"></a> `THROTTLED` | `"THROTTLED"` | `'THROTTLED'` | [src/types/errors.ts:15](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L15) |
| <a id="tls_failed"></a> `TLS_FAILED` | `"TLS_FAILED"` | `'TLS_FAILED'` | [src/types/errors.ts:16](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L16) |
| <a id="unknown"></a> `UNKNOWN` | `"UNKNOWN"` | `'UNKNOWN'` | [src/types/errors.ts:17](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L17) |
| <a id="upgrade_timeout"></a> `UPGRADE_TIMEOUT` | `"UPGRADE_TIMEOUT"` | `'UPGRADE_TIMEOUT'` | [src/types/errors.ts:18](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L18) |

***

### MailboxPath()

```ts
MailboxPath: (s: string) => MailboxPath;
```

Defined in: [src/types/common.ts:8](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L8)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `s` | `string` |

#### Returns

[`MailboxPath`](#mailboxpath)

***

### ModSeq()

```ts
ModSeq: (n: bigint) => ModSeq;
```

Defined in: [src/types/common.ts:6](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L6)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `bigint` |

#### Returns

[`ModSeq`](#modseq-2)

***

### SequenceNumber()

```ts
SequenceNumber: (n: number) => SequenceNumber;
```

Defined in: [src/types/common.ts:5](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L5)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `number` |

#### Returns

[`SequenceNumber`](#sequencenumber)

***

### Tag()

```ts
Tag: (s: string) => Tag;
```

Defined in: [src/types/common.ts:9](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L9)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `s` | `string` |

#### Returns

[`Tag`](#tag-2)

***

### UID()

```ts
UID: (n: number) => UID;
```

Defined in: [src/types/common.ts:4](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `number` |

#### Returns

[`UID`](#uid-8)

***

### UIDValidity()

```ts
UIDValidity: (n: bigint) => UIDValidity;
```

Defined in: [src/types/common.ts:7](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/common.ts#L7)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `bigint` |

#### Returns

[`UIDValidity`](#uidvalidity-5)

## Functions

### brand()

```ts
function brand<T, B>(value: T): Brand<T, B>;
```

Defined in: [src/types/brand.ts:5](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/brand.ts#L5)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `B` *extends* `string` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

#### Returns

[`Brand`](#brand)\<`T`, `B`\>

***

### createIMAPClient()

```ts
function createIMAPClient(options: IMAPClientOptions): IMAPClient;
```

Defined in: [src/shell/client/index.ts:679](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/shell/client/index.ts#L679)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`IMAPClientOptions`](#imapclientoptions) |

#### Returns

[`IMAPClient`](#imapclient)

***

### Err()

```ts
function Err<E>(error: E): ErrResult<E>;
```

Defined in: [src/types/result.ts:6](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L6)

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `Error` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `E` |

#### Returns

[`ErrResult`](#errresult)\<`E`\>

***

### flatMapResult()

```ts
function flatMapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E>;
```

Defined in: [src/types/result.ts:14](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L14)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |
| `E` *extends* `Error` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`Result`](#result)\<`T`, `E`\> |
| `fn` | (`value`: `T`) => [`Result`](#result)\<`U`, `E`\> |

#### Returns

[`Result`](#result)\<`U`, `E`\>

***

### isErr()

```ts
function isErr<T, E>(result: Result<T, E>): result is ErrResult<E>;
```

Defined in: [src/types/result.ts:9](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L9)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `E` *extends* `Error` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`Result`](#result)\<`T`, `E`\> |

#### Returns

`result is ErrResult<E>`

***

### isOk()

```ts
function isOk<T, E>(result: Result<T, E>): result is OkResult<T>;
```

Defined in: [src/types/result.ts:8](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L8)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `E` *extends* `Error` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`Result`](#result)\<`T`, `E`\> |

#### Returns

`result is OkResult<T>`

***

### mapResult()

```ts
function mapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E>;
```

Defined in: [src/types/result.ts:11](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L11)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |
| `E` *extends* `Error` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`Result`](#result)\<`T`, `E`\> |
| `fn` | (`value`: `T`) => `U` |

#### Returns

[`Result`](#result)\<`U`, `E`\>

***

### Ok()

```ts
function Ok<T>(value: T): OkResult<T>;
```

Defined in: [src/types/result.ts:5](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L5)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

#### Returns

[`OkResult`](#okresult)\<`T`\>

***

### tryAsync()

```ts
function tryAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>>;
```

Defined in: [src/types/result.ts:37](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L37)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | () => `Promise`\<`T`\> |

#### Returns

`Promise`\<[`Result`](#result)\<`T`, `Error`\>\>

***

### trySync()

```ts
function trySync<T>(fn: () => T): Result<T, Error>;
```

Defined in: [src/types/result.ts:29](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L29)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | () => `T` |

#### Returns

[`Result`](#result)\<`T`, `Error`\>

***

### unwrap()

```ts
function unwrap<T, E>(result: Result<T, E>): T;
```

Defined in: [src/types/result.ts:19](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L19)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `E` *extends* `Error` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`Result`](#result)\<`T`, `E`\> |

#### Returns

`T`

***

### unwrapOr()

```ts
function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T;
```

Defined in: [src/types/result.ts:26](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/result.ts#L26)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `E` *extends* `Error` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `result` | [`Result`](#result)\<`T`, `E`\> |
| `defaultValue` | `T` |

#### Returns

`T`

***

### wrapError()

```ts
function wrapError(
   error: unknown, 
   code: IMAPSDKErrorCode, 
   message?: string): IMAPSDKError;
```

Defined in: [src/types/errors.ts:133](https://github.com/marcoappio/imap-sdk/blob/f77fc04a08fa2803ebab2d0e39335f238c9fd73c/src/types/errors.ts#L133)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |
| `code` | [`IMAPSDKErrorCode`](#imapsdkerrorcode-1) |
| `message?` | `string` |

#### Returns

[`IMAPSDKError`](#imapsdkerror)
