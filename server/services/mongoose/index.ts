import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import log from './models/log'
import message from './models/message'
import conversation from './models/conversation'
import user from './models/user'
import { writeFileSync } from 'fs'

config()

console.log('MONGO:', process.env.MONGODB_KEY?.slice(0, 11))
void mongoose.connect(process.env.MONGODB_KEY as string)

export default mongoose

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
