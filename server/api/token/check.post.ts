import { parse as parseCookie } from 'cookie'
import getIp from '~/server/services/getIp'
import {
  generate as tokenGenerator,
  pack as tokenPacker,
  read as tokenReader
} from '~/server/services/token'
import random from '~/utils/random'
import { serialize } from 'cookie'

export default defineEventHandler(async (event) => {
  const { req, res } = event.node
  const ip = getIp(req)
  const user = random.base64(16)
  const rawCookie = req.headers.cookie
  const oldToken = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  let token: string
  if (oldToken !== null) {
    oldToken.checked = Date.now()
    token = tokenPacker(oldToken)
  } else {
    token = tokenGenerator(user, ip)
  }
  res.setHeader('Set-Cookie', serialize('token', token, {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true
  }))
  return ''
})
