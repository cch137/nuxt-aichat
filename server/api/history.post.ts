import { readBody } from 'h3'
import { parse as parseCookie } from 'cookie'
import { read as tokenReader } from '~/server/services/token'
import { message } from '~/server/services/mongoose/index'

export default defineEventHandler(async (event) => {
  const conv = (await readBody(event))?.id as string | undefined
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const user = token?.user
  if (!user) {
    return {
      error: 1
    }
  }
  const messages = (await message.find({
    user,
    conv
  }, {
    _id: 1,
    Q: 1,
    A: 1
  }).lean()).map((doc) => {
    const _doc: any = {
      ...doc,
      t: doc._id.getTimestamp().getTime()
    }
    delete _doc._id
    return _doc
  })
  return messages
})
