import { message as messageCollection } from '~/server/services/mongoose/index'

export default function (user: string, conv: string, Q: string, A: string, queries: string[] = [], urls: string[] = [], dt?: number) {
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
  return messageCollection.create(record)
}
