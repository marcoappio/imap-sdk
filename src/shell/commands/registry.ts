import { append } from './append'
import { authenticate } from './authenticate'
import { capability } from './capability'
import { close } from './close'
import { compress } from './compress'
import { copy } from './copy'
import { create } from './create'
import { deleteMailbox } from './delete'
import { enable } from './enable'
import { expunge } from './expunge'
import { fetch } from './fetch'
import { id } from './id'
import { idle } from './idle'
import { list } from './list'
import { login } from './login'
import { logout } from './logout'
import { move } from './move'
import { namespace } from './namespace'
import { noop } from './noop'
import { quota } from './quota'
import { rename } from './rename'
import { search } from './search'
import { examine, select } from './select'
import { starttls } from './starttls'
import { status } from './status'
import { store } from './store'
import { subscribe, unsubscribe } from './subscribe'

// biome-ignore lint/suspicious/noExplicitAny: command functions have varied signatures
type CommandFn = (ctx: any, ...args: any[]) => any

const commands: Record<string, CommandFn> = {
  APPEND: append,
  AUTHENTICATE: authenticate,
  CAPABILITY: capability,
  CLOSE: close,
  COMPRESS: compress,
  COPY: copy,
  CREATE: create,
  DELETE: deleteMailbox,
  ENABLE: enable,
  EXAMINE: examine,
  EXPUNGE: expunge,
  FETCH: fetch,
  ID: id,
  IDLE: idle,
  LIST: list,
  LOGIN: login,
  LOGOUT: logout,
  MOVE: move,
  NAMESPACE: namespace,
  NOOP: noop,
  QUOTA: quota,
  RENAME: rename,
  SEARCH: search,
  SELECT: select,
  STARTTLS: starttls,
  STATUS: status,
  STORE: store,
  SUBSCRIBE: subscribe,
  UNSUBSCRIBE: unsubscribe,
}

export const getCommand = (name: string): CommandFn | null => commands[name.toUpperCase()] ?? null
