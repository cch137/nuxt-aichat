import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import getIp from '~/server/services/getIp'
import {
  read as tokenReader
} from '~/server/services/token'

export default defineEventHandler(async (event) => {
  const { req } = event.node
  const rawCookie = req.headers.cookie
  return tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
})
