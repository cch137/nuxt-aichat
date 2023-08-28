import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import getIp from '~/server/services/getIp'
import {
  TokenObject,
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
  const oldTokenObj = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  let token: TokenObject
  let uid: string
  if (oldTokenObj !== null) {
    oldTokenObj.checked = Date.now()
    uid = oldTokenObj.uid
    token = oldTokenObj || {}
  } else {
    uid = random.base64(16)
    token = tokenGenerator(uid, ip)
  }
  const user = await auth.getUser(uid || '-')
  token.authlvl = user?.authlvl || 0
  res.setHeader('Set-Cookie', serializeCookie('token', tokenPacker(token), {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true
  }))
  return {
    isLoggedIn: Boolean(user) as boolean,
    user
  }
})
