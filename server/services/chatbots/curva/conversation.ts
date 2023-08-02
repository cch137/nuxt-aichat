import {
  message as messageCollection,
  conversation as conversationCollection,
  ObjectId
} from '~/server/services/mongoose'
import { ArchivedChatMessage } from './types'
import { OpenAIMessage } from '../engines/cores/types'

class Conversation {
  conv: string
  user: string

  constructor (user: string, conv: string) {
    this.user = user
    this.conv = conv
  }

  async updateMtime () {
    const { user, conv } = this
    if (!(user && conv)) {
      return
    }
    return (await conversationCollection.updateOne({
      user,
      id: conv
    }, {
      $set: {
        mtime: Date.now()
      }
    }, {
      projection: { _id: 0 }
    }).exec())
  }

  async delete () {
    const { user, conv } = this
    if (!(user && conv)) {
      return []
    }
    return (await messageCollection.updateMany({
      user,
      conv
    }, {
      $set: {
        user: `~${user}`
      }
    }, {
      projection: { _id: 0 }
    }).exec())
  }

  async getHistory () {
    const { user, conv } = this
    if (!(user && conv)) {
      return []
    }
    const history = (await messageCollection.find({
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
    })) as ArchivedChatMessage[]
    return history
  }

  async getContext () {
    const { user, conv } = this
    if (!(user && conv)) {
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
      user,
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
    const { user, conv } = this
    const record = { user, conv, Q, A } as { Q: string, A: string, queries?: string[], urls?: string[], dt?: number }
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
}

export default Conversation
