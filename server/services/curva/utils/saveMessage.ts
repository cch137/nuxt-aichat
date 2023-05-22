import { message as messageCollection } from '~/server/services/mongoose/index'

export default function (user: string, conv: string, Q: string, A: string, model?: string) {
  return messageCollection.create({ user, conv, model, Q, A })
}
