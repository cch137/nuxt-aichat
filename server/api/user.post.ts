import { parse as parseCookie } from 'cookie'
import { read as tokenReader } from '~/server/services/token'
import { mask } from '~/utils/masker'

export default defineEventHandler(async (event) => {
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  return mask(token?.uid || '', '64w', 1, 4896).substring(1)
})
