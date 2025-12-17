import type { Tag } from '@imap-sdk/types/common'
import type { ParsedResponse } from '@imap-sdk/types/protocol'

import type { CommandQueue } from './command-queue'

export type UntaggedHandler = (response: ParsedResponse) => Promise<void> | void

export type ResponseRouterOptions = {
  readonly commandQueue: CommandQueue
  readonly onUntagged?: (command: string, response: ParsedResponse) => Promise<void> | void
  readonly onPlusTag?: (response: ParsedResponse) => Promise<void> | void
}

export type TaggedResponseHandler = {
  readonly untagged?: Readonly<Record<string, UntaggedHandler>>
  readonly onPlusTag?: (response: ParsedResponse) => Promise<void> | void
}

export type RouteResult = {
  readonly handled: boolean
  readonly tag?: Tag
  readonly status?: 'OK' | 'NO' | 'BAD' | 'BYE' | 'PREAUTH'
}

const STATUS_RESPONSES = new Set(['OK', 'NO', 'BAD', 'BYE', 'PREAUTH'])
const NUMERIC_COMMAND_PATTERN = /^\d+$/

export class ResponseRouter implements AsyncDisposable {
  private readonly commandQueue: CommandQueue
  private readonly globalUntaggedHandler?: (command: string, response: ParsedResponse) => Promise<void> | void
  private readonly globalPlusTagHandler?: (response: ParsedResponse) => Promise<void> | void
  private readonly taggedHandlers = new Map<Tag, TaggedResponseHandler>()
  private currentPlusTagHandler?: (response: ParsedResponse) => Promise<void> | void
  private disposed = false

  constructor(options: ResponseRouterOptions) {
    this.commandQueue = options.commandQueue
    this.globalUntaggedHandler = options.onUntagged
    this.globalPlusTagHandler = options.onPlusTag
  }

  get isDisposed(): boolean {
    return this.disposed
  }

  registerHandler(tag: Tag, handler: TaggedResponseHandler): void {
    if (this.disposed) {
      return
    }

    this.taggedHandlers.set(tag, handler)

    if (handler.onPlusTag) {
      this.currentPlusTagHandler = handler.onPlusTag
    }
  }

  unregisterHandler(tag: Tag): void {
    const handler = this.taggedHandlers.get(tag)

    if (handler?.onPlusTag === this.currentPlusTagHandler) {
      this.currentPlusTagHandler = undefined
    }

    this.taggedHandlers.delete(tag)
  }

  async route(response: ParsedResponse): Promise<RouteResult> {
    if (this.disposed) {
      return { handled: false }
    }

    const { tag, command } = response

    if (tag === '+') {
      return await this.handlePlusTag(response)
    }

    if (tag === '*') {
      return await this.handleUntagged(response)
    }

    return this.handleTagged(tag as Tag, command, response)
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true
    this.taggedHandlers.clear()
    this.currentPlusTagHandler = undefined
  }

  [Symbol.asyncDispose](): Promise<void> {
    this.dispose()
    return Promise.resolve()
  }

  private async handlePlusTag(response: ParsedResponse): Promise<RouteResult> {
    if (this.currentPlusTagHandler) {
      await this.currentPlusTagHandler(response)
      return { handled: true }
    }

    if (this.globalPlusTagHandler) {
      await this.globalPlusTagHandler(response)
      return { handled: true }
    }

    return { handled: false }
  }

  private async handleUntagged(response: ParsedResponse): Promise<RouteResult> {
    let command = response.command.toUpperCase()

    if (NUMERIC_COMMAND_PATTERN.test(command) && response.attributes?.length) {
      const firstAttr = response.attributes[0] as { type: string; value: string } | undefined
      if (firstAttr?.type === 'ATOM' && typeof firstAttr.value === 'string') {
        command = firstAttr.value.toUpperCase()
      }
    }

    for (const handler of this.taggedHandlers.values()) {
      if (handler.untagged?.[command]) {
        await handler.untagged[command](response)
        return { handled: true }
      }
    }

    if (this.globalUntaggedHandler) {
      await this.globalUntaggedHandler(command, response)
      return { handled: true }
    }

    return { handled: false }
  }

  private handleTagged(tag: Tag, command: string, response: ParsedResponse): RouteResult {
    const upperCommand = command.toUpperCase()

    if (!STATUS_RESPONSES.has(upperCommand)) {
      return { handled: false, tag }
    }

    const status = upperCommand as 'OK' | 'NO' | 'BAD' | 'BYE' | 'PREAUTH'

    this.unregisterHandler(tag)

    if (status === 'OK') {
      this.commandQueue.resolve(tag, response)
      return { handled: true, status, tag }
    }

    const errorMessage = response.humanReadable ?? `Command failed: ${status}`
    const error = new Error(errorMessage)
    ;(error as Error & { response: ParsedResponse }).response = response
    ;(error as Error & { status: string }).status = status

    this.commandQueue.reject(tag, error)

    return { handled: true, status, tag }
  }
}

export const createResponseRouter = (options: ResponseRouterOptions): ResponseRouter => new ResponseRouter(options)
