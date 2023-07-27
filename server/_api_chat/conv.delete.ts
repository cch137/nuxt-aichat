import { readBody } from 'h3'
import { parse as parseCookie } from 'cookie'
import { read as tokenReader } from '~/server/services/token'
import deleteConversation from '~/server/services/evo/deleteConversation'

export default defineEventHandler(async (event) => {
  const conv = (await readBody(event))?.id as string | undefined
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const user = token?.user
  if (!user || !conv) {
    return { error: 1 }
  }
  return await deleteConversation(user, conv)
})
