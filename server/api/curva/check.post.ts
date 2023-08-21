import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import getIp from '~/server/services/getIp'
import {
  generate as tokenGenerator,
  pack as tokenPacker,
  read as tokenReader
} from '~/server/services/token'
import random from '~/utils/random'
import { message, conversation } from '~/server/services/mongoose/index'

export default defineEventHandler(async (event): Promise<{ id: string, name: string, config: string, mtime: number}[]> => {
  const { req, res } = event.node
  const ip = getIp(req)
  const rawCookie = req.headers.cookie
  const oldToken = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  let token: string
  let uid: string
  if (oldToken !== null) {
    oldToken.checked = Date.now()
    uid = oldToken.uid
    token = tokenPacker(oldToken)
  } else {
    uid = random.base64(16)
    token = tokenGenerator(uid, ip)
  }
  res.setHeader('Set-Cookie', serializeCookie('token', token, {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true
  }))
  try {
    const conversations = ((await message.aggregate([
      { $match: { uid } },
      { $group: { _id: '$uid', conv: { $addToSet: '$conv' } } },
      { $project: { _id: 0, conv: 1 } }
    ]))[0]?.conv as string[] || [])
      .filter((c) => !c.startsWith('~'))
    if (Array.isArray(conversations)) {
      const savedConverations = await conversation.find(
        { $or: conversations.map((id) => ({ uid, id })) },
        { _id: 0, id: 1, name: 1, config: 1, mtime: 1 }
      )
      return conversations.map((convId) => {
        const { id = convId, name = '', config = '', mtime = 0 } = savedConverations.find((conv) => conv.id === convId) || {}
        return { id, name, config, mtime }
      }).sort((a, b) => b.mtime - a.mtime)
    }
  } catch (err) {
    console.error(err)
  }
  return []
})
