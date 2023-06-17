import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import getIp from '~/server/services/getIp'
import {
  generate as tokenGenerator,
  pack as tokenPacker,
  read as tokenReader
} from '~/server/services/token'
import random from '~/utils/random'
import auth from '~/server/services/auth'

export default defineEventHandler(async (event) => {
  const { req, res } = event.node
  const ip = getIp(req)
  const rawCookie = req.headers.cookie
  const oldToken = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  let token: string
  let user: string
  if (oldToken !== null) {
    oldToken.checked = Date.now()
    user = oldToken.user
    token = tokenPacker(oldToken)
  } else {
    user = random.base64(16)
    token = tokenGenerator(user, ip)
  }
  res.setHeader('Set-Cookie', serializeCookie('token', token, {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true
  }))
  return {
    isLoggedIn: Boolean(await auth.getUser(user || '-'))
  }
})
