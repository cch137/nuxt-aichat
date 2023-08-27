import { readBody } from 'h3'
import { getUidByToken } from '~/server/services/token'
import { message, conversation } from '~/server/services/mongoose/index'
import { toStdConvConfigString } from '~/server/services/chatbots/curva/convConfig'

export default defineEventHandler(async (event) => {
  const body = (await readBody(event))
  const conv = body?.id as string | undefined
  const name = body?.name as string || ''
  const config = toStdConvConfigString(body?.config as string || '')
  const uid = getUidByToken(event)
  if (!uid) {
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
  const isExistConv = Boolean(await message.findOne({ uid, conv }))
  if (!isExistConv) {
    return {}
  }
  await conversation.updateOne(
    { id: conv, uid },
    { $set: { id: conv, uid, ...data } },
    { upsert: true }
  )
  return {}
})
