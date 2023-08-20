import { readBody } from 'h3'
import { ObjectId } from 'mongodb'
import { parse as parseCookie } from 'cookie'
import { message as messagesCollection } from '~/server/services/mongoose/index'
import { read as tokenReader } from '~/server/services/token'
import baseConverter from '~/utils/baseConverter'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // @ts-ignore
  if (!body) {
    return { error: 1 }
  }
  const { conv, id } = body
  // @ts-ignore
  if (!conv || !id) {
    return { error: 2 }
  }
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const user = token?.user
  // Validate token
  if (token === null || typeof user !== 'string') {
    return { error: 3 }
  }
  try {
    const _id = new ObjectId(baseConverter.convert(id, '64', 16))
    await messagesCollection.updateOne({ _id, conv, user }, { $set: { user: `~${user}` } })
    return {}
  } catch (err) {
    return { error: 4 }
  }
})
