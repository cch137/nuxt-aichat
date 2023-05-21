import { Schema, model } from 'mongoose'

export default model('Log', new Schema({
  type: { type: String, required: true },
  text: { type: String, required: true },
}, {
  versionKey: false
}), 'logs')
