import { message as messagesLogger } from '~/server/services/mongoose/index'

export default function (user: string, conv: string, Q: string, A: string, model?: string) {
  return messagesLogger.create({ user, conv, model, Q, A })
}
