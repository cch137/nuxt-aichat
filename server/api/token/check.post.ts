import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import getIp from '~/server/services/getIp'
import {
  generate as tokenGenerator,
  pack as tokenPacker,
  read as tokenReader
} from '~/server/services/token'
import random from '~/utils/random'
import { message, conversation } from '~/server/services/mongoose/index'

export default defineEventHandler(async (event) => {
  const { req, res } = event.node
  const ip = getIp(req)
  const rawCookie = req.headers.cookie
  const oldToken = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  let token: string
  let user: string
  if (oldToken !== null) {
    oldToken.checked = Date.now()
    user = oldToken.user
    token = tokenPacker(oldToken)
  } else {
    user = random.base64(16)
    token = tokenGenerator(user, ip)
  }
  res.setHeader('Set-Cookie', serializeCookie('token', token, {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true
  }))
  try {
    const conversations = (await message.aggregate([
      { $match: { user } },
      { $group: { _id: '$user', conv: { $addToSet: '$conv' } } },
      { $project: { _id: 0, conv: 1 } }
    ]).exec())[0]?.conv as string[]
    if (Array.isArray(conversations)) {
      const record: Record<string, string>  = {}
      const items = await conversation.find(
        { $or: conversations.map((id) => ({ user, id })) },
        { _id: 0, id: 1, name: 1 }
      )
      for (const item of items) {
        if (typeof item.name === 'string') {
          record[item.id] = item.name
        }
      }
      return {
        list: conversations.filter((c) => !c.startsWith('~')),
        named: record
      }
    }
  } catch (err) {
    console.error(err)
  }
  return {
    list: [] as string[],
    named: {} as Record<string, string>
  }
})
