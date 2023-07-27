import { readBody } from 'h3'
import { parse as parseCookie } from 'cookie'
import { read as tokenReader } from '~/server/services/token'
import { Conversation } from '~/server/services/chatbots/curva'

export default defineEventHandler(async (event) => {
  const conv = (await readBody(event))?.id as string
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const user = token?.user
  if (!user) {
    return { error: 1 }
  }
  try {
    return await new Conversation(user, conv).getHistory()
  } catch {
    return { error: 2 }
  }
})
