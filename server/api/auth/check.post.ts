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
  let uid: string
  if (oldToken !== null) {
    oldToken.checked = Date.now()
    uid = oldToken.user
    token = tokenPacker(oldToken)
  } else {
    uid = random.base64(16)
    token = tokenGenerator(uid, ip)
  }
  res.setHeader('Set-Cookie', serializeCookie('token', token, {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true
  }))
  const user = await auth.getUser(uid || '-')
  return {
    isLoggedIn: Boolean(user) as boolean,
    user
  }
})
