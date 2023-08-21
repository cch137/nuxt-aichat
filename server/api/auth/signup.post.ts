import { parse as parseCookie } from 'cookie'
import type { TokenObject } from '~/server/services/token'
import {
  read as tokenReader
} from '~/server/services/token'
import auth from '~/server/services/auth'
import { readBody } from 'h3'
import RateLimiter from '~/server/services/rate-limiter'
import getIp from '~/server/services/getIp'

// Every 5 minutes 5 times
const rateLimiter = new RateLimiter(5, 5 * 60 * 1000)
// SignUp does not need to be strictly rate-limited because sendVerificatioCode is already rate-limited.

export default defineEventHandler(async function (event) {
  if (!rateLimiter.check(getIp(event.node.req))) {
    return { error: rateLimiter.hint, isLoggedIn: false }
  }
  const body = await readBody(event)
  if (!body) {
    return { error: 'No form' }
  }
  const { email, username, password, code } = body
  if (!email || !username || !password || !code) {
    return { error: 'Form incomplete.' }
  }
  const { req } = event.node
  const rawCookie = req.headers.cookie
  const tokenObj = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token) || {} as TokenObject
  const uid = tokenObj?.user
  if (!uid) {
    return { error: 'Please reload the page.' }
  }
  try {
    try {
      if (!auth.verifyEmail(email, code)) {
        throw 'Incorrect verification code.'
      }
    } catch (err) {
      return { error: typeof err === 'string' ? err : 'Incorrect verification code.' }
    }
    await auth.createUser(uid, email, username, password)
    return { error: false }
  } catch (err) {
    return { error: typeof err === 'string' ? err : 'User creation failed.' }
  }
})
