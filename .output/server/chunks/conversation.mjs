import { model, Schema } from 'mongoose';

const conversation = model("Conversation", new Schema({
  user: { type: String },
  id: { type: String, required: true },
  uid: { type: String, required: true },
  name: { type: String },
  config: { type: String },
  mtime: { type: Number }
}, {
  versionKey: false
}), "conversations");

export { conversation as c };
//# sourceMappingURL=conversation.mjs.map
