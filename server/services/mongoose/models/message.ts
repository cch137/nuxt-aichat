import { Schema, model } from 'mongoose'

export default model('Message', new Schema({
  user: { type: String, required: true },
  conv: { type: String, required: true },
  model: { type: String, required: true },
  Q: { type: String, required: true },
  A: { type: String, required: true }
}, {
  versionKey: false
}), 'messages')
