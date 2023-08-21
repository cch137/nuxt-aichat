import { readBody } from 'h3'
import { parse as parseCookie } from 'cookie'
import { read as tokenReader } from '~/server/services/token'
import { Conversation } from '~/server/services/chatbots/curva'

export default defineEventHandler(async (event) => {
  const conv = (await readBody(event))?.id as string | undefined
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const user = token?.uid
  if (!user || !conv) {
    return { error: 1 }
  }
  await new Conversation(user, conv).delete()
  return {}
})
