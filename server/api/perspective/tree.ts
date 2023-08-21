import { readBody } from 'h3'
import { message } from '~/server/services/mongoose/index'
import { getAllKey, getDeletedKey } from './keys'

export default defineEventHandler(async (event) => {
  const key = (await readBody(event))?.key
  if (key === getAllKey) {
    return await message.aggregate([
      {
        $group: {
          _id: '$uid',
          conv: { $addToSet: '$conv' }
        }
      },
      {
        $project: {
          _id: 0,
          uid: '$_id',
          conv: 1
        }
      },
    ]).exec()
  }
  if (key === getDeletedKey) {
    return await message.aggregate([
      {
        $match: {
          'conv': { $regex: '^~' }
        }
      },
      {
        $group: {
          _id: '$uid',
          conv: { $addToSet: '$conv' }
        }
      },
      {
        $project: {
          _id: 0,
          uid: '$_id',
          conv: 1
        }
      },
    ]).exec()
  }
  return []
})
