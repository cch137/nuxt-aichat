import {
  message as messageCollection,
  conversation as conversationCollection,
  ObjectId
} from '~/server/services/mongoose'
import type { ArchivedChatMessage } from './types'
import type { OpenAIMessage } from '../engines/cores/types'

class Conversation {
  conv: string
  uid: string

  constructor (uid: string, conv: string) {
    this.uid = uid
    this.conv = conv
  }

  async updateMtime () {
    const { uid, conv } = this
    if (!(uid && conv)) {
      return
    }
    await conversationCollection.updateOne(
      { uid, id: conv },
      { $set: { mtime: Date.now() } },
      { upsert: true, projection: { _id: 0 } }
    )
  }

  async delete () {
    const { uid, conv } = this
    if (!(uid && conv)) {
      return []
    }
    return await messageCollection.updateMany(
      { uid, conv },
      { $set: { uid: `~${uid}` } },
      { projection: { _id: 0 }
    })
  }

  async getHistory () {
    const { uid, conv } = this
    if (!(uid && conv)) {
      return []
    }
    const history = (await messageCollection.find({
      uid,
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
    })) as ArchivedChatMessage[]
    return history
  }

  async getContext () {
    const { uid, conv } = this
    if (!(uid && conv)) {
      return []
    }
    const processMessage = (message: { Q?: string, A?: string }): OpenAIMessage[] => {
      const { Q, A } = message
      if (Q) {
        if (A) {
          return [{ role: 'user', content: Q }, { role: 'assistant', content: A }]
        }
        return [{ role: 'user', content: Q }]
      } else if (A) {
        return [{ role: 'assistant', content: A }]
      }
      return []
    }
    const messages = (await messageCollection.find({
      uid,
      conv
    }, {
      _id: 1,
      Q: 1,
      A: 1
    }).sort({ createdAt: -1 }).limit(100)).map((doc) => ({
      Q: doc.Q,
      A: doc.A,
      t: doc._id.getTimestamp().getTime()
    }))
    if (messages.length === 0) {
      return []
    }
    return messages.map(processMessage).flat()
  }

  async saveMessage (Q: string, A: string, queries: string[] = [], urls: string[] = [], dt?: number, regenerateId?: string) {
    const { uid, conv } = this
    const record = { uid, conv, Q, A } as { Q: string, A: string, queries?: string[], urls?: string[], dt?: number }
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
      try {
        await messageCollection.updateOne({
          _id: new ObjectId(regenerateId),
          uid,
          conv
        }, {
          $set: record
        })
        return regenerateId
      } catch {}
    }
    return (await messageCollection.create(record))._id.toString()
  }
}

export default Conversation
