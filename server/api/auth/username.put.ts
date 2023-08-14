import { parse as parseCookie } from 'cookie'
import { read as tokenReader } from '~/server/services/token'
import auth from '~/server/services/auth'
import { readBody } from 'h3'

export default defineEventHandler(async function (event): Promise<{ error?: string, username?: string }> {
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
    return await auth.changeUsername(uid, username)
  } catch (err) {
    return { error: typeof err === 'string' ? err : 'Username change failed.' }
  }
})
