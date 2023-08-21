import auth from '~/server/services/auth'
import { readBody } from 'h3'
import RateLimiter from '~/server/services/rate-limiter'
import getIp from '~/server/services/getIp'

// Every 5 minutes 5 times
const rateLimiter = new RateLimiter(5, 5 * 60 * 1000)

export default defineEventHandler(async function (event) {
  if (!rateLimiter.check(getIp(event.node.req))) {
    return { error: rateLimiter.hint, isLoggedIn: false }
  }
  const body = await readBody(event)
  if (!body) {
    return { error: 'No form' }
  }
  const { email, password, code } = body
  if (!email || !password || !code) {
    return { error: 'Form incomplete.' }
  }
  try {
    try {
      if (!auth.verifyEmail(email, code)) {
        throw 'Incorrect verification code.'
      }
    } catch (err) {
      return { error: typeof err === 'string' ? err : 'Incorrect verification code.' }
    }
    await auth.resetPassword(email, password)
    return { error: false }
  } catch (err) {
    return { error: typeof err === 'string' ? err : 'User creation failed.' }
  }
})
