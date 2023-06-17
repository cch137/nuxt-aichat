import { Schema, model } from 'mongoose'

export default model('User', new Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
}, {
  versionKey: false,
  strict: 'throw'
}), 'users')
