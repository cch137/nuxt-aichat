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
  const falseUser = `~${user}`
  await message.updateMany({
    user,
    conv
  }, {
    $set: {
      user: falseUser
    }
  }, {
    projection: { _id: 0 }
  }).exec()
  return {}
})
