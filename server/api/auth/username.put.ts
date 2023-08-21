import { parse as parseCookie } from 'cookie'
import { read as tokenReader } from '~/server/services/token'
import auth from '~/server/services/auth'
import { readBody } from 'h3'
import RateLimiter from '~/server/services/rate-limiter'
import getIp from '~/server/services/getIp'

// Every 5 minutes 5 times
const rateLimiter = new RateLimiter(5, 5 * 60 * 1000)

export default defineEventHandler(async function (event): Promise<{ error?: string, username?: string }> {
  if (!rateLimiter.check(getIp(event.node.req))) {
    return { error: rateLimiter.hint }
  }
  const rawCookie = event.node.req.headers.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const uid = token?.user
  if (!uid) {
    return { error: 'No authentication' }
  }
  const body = await readBody(event)
  if (!body) {
    return { error: 'No form' }
  }
  const { username } = body
  if (!username) {
    return { error: 'Form incomplete' }
  }
  try {
    await auth.changeUsername(uid, username)
    return {}
  } catch (err) {
    return { error: typeof err === 'string' ? err : 'Username change failed.' }
  }
})
