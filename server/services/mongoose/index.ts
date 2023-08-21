import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import log from './models/log'
import message from './models/message'
import conversation from './models/conversation'
import user from './models/user'
// import { writeFileSync } from 'fs'

config()

console.log('MONGO:', process.env.MONGODB_KEY?.slice(0, 11))
void mongoose.connect(process.env.MONGODB_KEY as string)

export default mongoose

;(async () => {
  const allMessages = await message.find({}, { _id: 1, user: 1 });
  console.log('Total messages:', allMessages.length);
  allMessages.forEach(async (m) => {
    if (!m.user) {
      return;
    };
    await message.updateOne({ _id: new ObjectId(m._id) }, {
      $set: { uid: m.user },
      $unset: { user: '' }
    });
    console.log('update message:', m._id.toString())
  })
})();
;(async () => {
  const allConversations = await conversation.find({}, { _id: 1, user: 1 });
  console.log('Total convesations:', allConversations.length);
  allConversations.forEach(async (c) => {
    if (!c.user) {
      return;
    };
    await conversation.updateOne({ _id: new ObjectId(c._id) }, {
      $set: { uid: c.user },
      $unset: { user: '' }
    });
    console.log('update conv:', c._id.toString())
  })
})();

// ;(async () => {
//   console.log('START DOWNLOAD')
//   const data = await message.find({ Q: { $regex: 'Midjourney' } })
//   console.log(data.length)
//   writeFileSync('log.json', JSON.stringify(data, null, 2), 'utf8')
//   console.log('END DOWNLOAD')
// })();

export {
  ObjectId,
  log,
  message,
  conversation,
  user
}
