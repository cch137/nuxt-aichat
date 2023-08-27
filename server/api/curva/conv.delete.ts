import { readBody } from 'h3'
import { getUidByToken } from '~/server/services/token'
import { Conversation } from '~/server/services/chatbots/curva'

export default defineEventHandler(async (event) => {
  const conv = (await readBody(event))?.id as string | undefined
  const uid = getUidByToken(event)
  if (!uid || !conv) {
    return { error: 1 }
  }
  await new Conversation(uid, conv).delete()
  return {}
})
