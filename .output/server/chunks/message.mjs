import { model, Schema } from 'mongoose';

const message = model("Message", new Schema({
  user: { type: String, required: true },
  conv: { type: String, required: true },
  model: { type: String, required: true },
  Q: { type: String, required: true },
  A: { type: String, required: true }
}, {
  versionKey: false
}), "messages");

export { message as m };
//# sourceMappingURL=message.mjs.map
