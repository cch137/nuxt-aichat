import { readBody } from 'h3'
import { parse as parseCookie } from 'cookie'
import { read as tokenReader } from '~/server/services/token'
import { message, conversation } from '~/server/services/mongoose/index'
import { toStdConvConfigString } from '~/server/services/chatbots/curva/convConfig'

export default defineEventHandler(async (event) => {
  const body = (await readBody(event))
  const conv = body?.id as string | undefined
  const name = body?.name as string || ''
  const config = toStdConvConfigString(body?.config as string || '')
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const user = token?.user
  if (!user) {
    return { error: 'No permission' }
  }
  const data: { name?: string, config?: string } = {}
  if (typeof name === 'string') {
    const trimmedName = name.trim().substring(0, 64)
    data.name = trimmedName
  }
  if (config) {
    data.config = config
  }
  const isExistConv = Boolean(await message.findOne({ user, conv }))
  if (!isExistConv) {
    return {}
  }
  await conversation.findOneAndUpdate(
    { id: conv, user },
    { $set: { id: conv, user, ...data } },
    { upsert: true }
  )
  return {}
})
