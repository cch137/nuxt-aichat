import { Schema, model } from 'mongoose'

export default model('Log', new Schema({
  type: { type: String, required: true },
  refer: { type: String },
  text: { type: String, required: true },
}, {
  versionKey: false
}), 'logs')
