import { readBody } from 'h3'
import { message } from '~/server/services/mongoose/index'
import realKey from './key'

export default defineEventHandler(async (event) => {
  const key = (await readBody(event))?.key
  if (key !== realKey) {
    return []
  }
  const tree = await message.aggregate([
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
  return tree
})
