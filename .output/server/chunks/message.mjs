import { model, Schema } from 'mongoose';

const schema = new Schema({
  user: { type: String, required: true },
  conv: { type: String, required: true },
  model: { type: String, required: false },
  Q: { type: String, required: true },
  A: { type: String, required: true },
  queries: { type: [String], default: void 0 },
  urls: { type: [String], default: void 0 }
}, {
  versionKey: false,
  strict: "throw"
});
const message = model("Message", schema, "messages");

export { message as m };
//# sourceMappingURL=message.mjs.map
