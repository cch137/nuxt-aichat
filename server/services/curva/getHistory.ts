import { message as messagesCollection } from '~/server/services/mongoose'

export default async function (user: string, conv: string) {
  if (!(user && conv)) {
    return []
  }
  return (await messagesCollection.find({
    user,
    conv
  }, {
    _id: 1,
    Q: 1,
    A: 1,
    queries: 1,
    urls: 1,
  }).sort({ createdAt: 1 })).map((doc) => ({
    Q: doc.Q,
    A: doc.A,
    queries: doc.queries,
    urls: doc.urls,
    t: doc._id.getTimestamp().getTime()
  }))
}