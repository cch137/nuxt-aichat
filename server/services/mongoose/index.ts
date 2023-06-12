import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import log from './models/log'
import message from './models/message'
import conversation from './models/conversation'
// import { writeFileSync } from 'fs'

config()

console.log('MONGO:', process.env.MONGODB_KEY?.slice(0, 11))
void mongoose.connect(process.env.MONGODB_KEY as string)

export default mongoose

// log.find().then((data) => {
//   console.log(data)
//   writeFileSync('log.json', JSON.stringify(data, null, 2), 'utf8')
// })

export {
  ObjectId,
  log,
  message,
  conversation
}
