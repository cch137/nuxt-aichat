import { message as messageCollection } from '~/server/services/mongoose/index'

export default function (user: string, conv: string, Q: string, A: string, queries: string[] = [], urls: string[] = []) {
  if (queries.length > 0) {
    if (urls.length > 0) {
      return messageCollection.create({ user, conv, Q, A, queries, urls })
    } else {
      return messageCollection.create({ user, conv, Q, A, queries })
    }
  } else if (urls.length) {
    return messageCollection.create({ user, conv, Q, A, urls })
  }
  return messageCollection.create({ user, conv, Q, A })
}
