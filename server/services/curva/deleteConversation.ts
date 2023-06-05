import { message as messagesCollection } from '~/server/services/mongoose'

export default async function (user: string, conv: string) {
  if (!(user && conv)) {
    return []
  }
  return (await messagesCollection.updateMany({
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