import { config } from 'dotenv'
import mongoose from 'mongoose'
import message from './models/message'

config()

console.log('MONGO:', process.env.MONGODB_KEY?.slice(0, 11))
void mongoose.connect(process.env.MONGODB_KEY as string)

export default mongoose

export {
  message
}
