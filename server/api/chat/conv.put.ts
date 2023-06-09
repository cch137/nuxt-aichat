import { readBody } from 'h3'
import { parse as parseCookie } from 'cookie'
import { read as tokenReader } from '~/server/services/token'
import { message, conversation } from '~/server/services/mongoose/index'

export default defineEventHandler(async (event) => {
  const body = (await readBody(event))
  const conv = body?.id as string | undefined
  const name = body?.name as string || ''
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const user = token?.user
  if (!user) {
    return { error: 'No permission' }
  }
  if (typeof name !== 'string') {
    return { error: 'Invalid value' }
  }
  const isExistConv = Boolean(await message.findOne({ user, conv }))
  if (!isExistConv) {
    return {}
  }
  const trimmedName = name.trim().substring(0, 64)
  if (trimmedName.length === 0) {
    await conversation.deleteOne({ id: conv })
  } else {
    await conversation.findOneAndUpdate(
      { id: conv },
      { $set: { id: conv, user, name: trimmedName } },
      { upsert: true }
    )
  }
  return {}
})
