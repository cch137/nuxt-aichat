import { message as messagesCollection } from '~/server/services/mongoose'

interface AchivedChatMessage {
  Q: string;
  A: string;
  id: string;
  t: number;
  queries?: string[];
  urls?: string[];
  dt?: number;
}

export type {
  AchivedChatMessage
}

export default async function (user: string, conv: string): Promise<AchivedChatMessage[]> {
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
    dt: 1,
  }).sort({ createdAt: 1 })).map((doc) => ({
    Q: doc.Q,
    A: doc.A,
    id: doc._id.toString('base64'),
    t: doc._id.getTimestamp().getTime(),
    queries: doc.queries,
    urls: doc.urls,
    dt: doc.dt,
  }))
}