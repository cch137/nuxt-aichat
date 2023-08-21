import checkPassword from '~/server/services/admin/checkPassword'
import { readBody } from 'h3'
import { serialize } from 'cookie'
import RateLimiter from '~/server/services/rate-limiter'
import getIp from '~/server/services/getIp'

// Every 15 minutes 5 times
const rateLimiter = new RateLimiter(5, 15 * 60 * 1000)

export default defineEventHandler(async function (event) {
  if (!rateLimiter.check(getIp(event.node.req))) {
    return { error: rateLimiter.hint, isLoggedIn: false }
  }
  let isLoggedIn = await checkPassword(event)
  if (isLoggedIn) {
    return { isLoggedIn }
  }
  const passwd = (await readBody(event))?.passwd as string | undefined
  if (!passwd) {
    return { isLoggedIn: false }
  }
  event.node.res.setHeader('Set-Cookie', serialize('admin', passwd, {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true
  }))
  return { isLoggedIn: process.env.ADMIN_PASSWORD && passwd === process.env.ADMIN_PASSWORD }
})
