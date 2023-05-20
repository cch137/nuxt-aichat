import { readBody } from 'h3'
import { message } from '~/server/services/mongoose/index'
import { getAllKey, getDeletedKey } from './keys'

export default defineEventHandler(async (event) => {
  const key = (await readBody(event))?.key
  if (!(key === getAllKey || key === getDeletedKey)) {
    return []
  }
  const messages = await message.aggregate([
    {
      $group: {
        _id: '$user',
        conv: { $addToSet: { conv: '$conv', Q: '$Q', A: '$A' } }
      }
    },
    {
      $project: {
        _id: 0,
        user: '$_id',
        conv: 1,
        Q: 1,
        A: 1,
      }
    },
  ]).exec()
  if (key === getAllKey) {
    return messages
  }
  if (key === getDeletedKey) {
    return messages.filter((u) => (u.user as string).startsWith('~'))
  }
  return []
})
