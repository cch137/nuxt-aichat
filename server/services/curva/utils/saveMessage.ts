import { message as messageCollection, ObjectId } from '~/server/services/mongoose/index'

export default async function (user: string, conv: string, Q: string, A: string, queries: string[] = [], urls: string[] = [], dt?: number, regenerateId?: string) {
  const record = { user, conv, Q, A } as { user: string, conv: string, Q: string, A: string, queries?: string[], urls?: string[], dt?: number }
  if (queries.length > 0) {
    record.queries = queries
  }
  if (urls.length > 0) {
    record.urls = urls
  }
  if (dt) {
    record.dt = dt
  }
  if (regenerateId) {
    await messageCollection.updateOne({
      _id: new ObjectId(regenerateId),
      user,
      conv
    }, {
      $set: record
    })
    return regenerateId
  } else {
    return (await messageCollection.create(record))._id.toString()
  }
}
