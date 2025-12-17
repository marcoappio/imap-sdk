import { IMAPSDKError } from '@imap-sdk/types/errors'

import type { AuthenticateOptions, AuthenticateResult, CommandContext } from './types'
import { createAuthError, IMAPAuthError } from './utils'

const SOH = '\x01'
// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional for stripping trailing nulls/colons
const LOGIN_QUESTION_CLEANUP = /[:\x00]*$/

const authOauth = async (ctx: CommandContext, username: string, accessToken: string): Promise<string> => {
  let oauthbearer: string
  let command: string
  let breaker: string

  if (ctx.capabilities.has('AUTH=OAUTHBEARER')) {
    oauthbearer = [`n,a=${username},`, `host=${ctx.servername}`, 'port=993', `auth=Bearer ${accessToken}`, '', ''].join(
      SOH,
    )
    command = 'OAUTHBEARER'
    breaker = 'AQ=='
  } else if (ctx.capabilities.has('AUTH=XOAUTH') || ctx.capabilities.has('AUTH=XOAUTH2')) {
    oauthbearer = [`user=${username}`, `auth=Bearer ${accessToken}`, '', ''].join(SOH)
    command = 'XOAUTH2'
    breaker = ''
  } else {
    throw new IMAPAuthError('No OAuth authentication method available')
  }

  let errorResponse: unknown = false

  try {
    const response = await ctx.exec(
      'AUTHENTICATE',
      [
        { type: 'ATOM', value: command },
        { sensitive: true, type: 'ATOM', value: Buffer.from(oauthbearer).toString('base64') },
      ],
      {
        onPlusTag: resp => {
          if (resp.attributes?.[0] && 'value' in resp.attributes[0] && resp.attributes[0].type === 'TEXT') {
            try {
              const value = resp.attributes[0].value
              if (typeof value === 'string') {
                errorResponse = JSON.parse(Buffer.from(value, 'base64').toString())
              }
            } catch (parseError) {
              ctx.log.debug({ cid: ctx.id, errorResponse: resp.attributes[0].value, parseError })
            }
          }

          ctx.log.debug({ comment: `Error response for ${command}`, msg: breaker, src: 'c' })
          ctx.write(breaker)
        },
      },
    )
    response.next()

    ctx.setAuthCapability(`AUTH=${command}`, true)

    return username
  } catch (err) {
    throw createAuthError(err, errorResponse || undefined)
  }
}

const authLogin = async (ctx: CommandContext, username: string, password: string): Promise<string> => {
  try {
    const response = await ctx.exec('AUTHENTICATE', [{ type: 'ATOM', value: 'LOGIN' }], {
      onPlusTag: resp => {
        if (resp.attributes?.[0] && 'value' in resp.attributes[0] && resp.attributes[0].type === 'TEXT') {
          const value = resp.attributes[0].value
          if (typeof value === 'string') {
            const question = Buffer.from(value, 'base64').toString()
            const normalized = question.toLowerCase().replace(LOGIN_QUESTION_CLEANUP, '').trim()

            switch (normalized) {
              case 'username':
              case 'user name': {
                const encodedUsername = Buffer.from(username).toString('base64')
                ctx.log.debug({ comment: 'Encoded username for AUTH=LOGIN', msg: encodedUsername, src: 'c' })
                ctx.write(encodedUsername)

                break
              }
              case 'password': {
                ctx.log.debug({ comment: 'Encoded password for AUTH=LOGIN', msg: '(* value hidden *)', src: 'c' })
                ctx.write(Buffer.from(password).toString('base64'))

                break
              }
              default: {
                throw IMAPSDKError.internal(`Unknown LOGIN question "${question}"`)
              }
            }
          }
        }
      },
    })

    response.next()

    ctx.setAuthCapability('AUTH=LOGIN', true)

    return username
  } catch (err) {
    throw createAuthError(err)
  }
}

const authPlain = async (
  ctx: CommandContext,
  username: string,
  password: string,
  authzid?: string,
): Promise<string> => {
  try {
    const response = await ctx.exec('AUTHENTICATE', [{ type: 'ATOM', value: 'PLAIN' }], {
      onPlusTag: () => {
        const authzidValue = authzid ?? ''
        const encodedResponse = Buffer.from([authzidValue, username, password].join('\x00')).toString('base64')
        const loggedResponse = Buffer.from([authzidValue, username, '(* value hidden *)'].join('\x00')).toString(
          'base64',
        )
        ctx.log.debug({
          comment: `Encoded response for AUTH=PLAIN${authzid ? ' with authzid' : ''}`,
          msg: loggedResponse,
          src: 'c',
        })
        ctx.write(encodedResponse)
      },
    })

    response.next()

    ctx.setAuthCapability('AUTH=PLAIN', true)

    return authzid ?? username
  } catch (err) {
    throw createAuthError(err)
  }
}

export const authenticate = async (ctx: CommandContext, options: AuthenticateOptions): Promise<AuthenticateResult> => {
  if (ctx.state !== 'NOT_AUTHENTICATED') {
    throw IMAPSDKError.invalidState('Cannot authenticate: not in NOT_AUTHENTICATED state')
  }

  const { accessToken, authzid, loginMethod, pass, user } = options

  if (
    accessToken &&
    (ctx.capabilities.has('AUTH=OAUTHBEARER') ||
      ctx.capabilities.has('AUTH=XOAUTH') ||
      ctx.capabilities.has('AUTH=XOAUTH2'))
  ) {
    return await authOauth(ctx, user, accessToken)
  }

  if (pass) {
    if ((!loginMethod && ctx.capabilities.has('AUTH=PLAIN')) || loginMethod === 'AUTH=PLAIN') {
      return await authPlain(ctx, user, pass, authzid)
    }

    if ((!loginMethod && ctx.capabilities.has('AUTH=LOGIN')) || loginMethod === 'AUTH=LOGIN') {
      return await authLogin(ctx, user, pass)
    }
  }

  throw new IMAPAuthError('Unsupported authentication mechanism')
}
