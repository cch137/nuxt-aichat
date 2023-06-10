import { model, Schema } from 'mongoose';

const message = model("Message", new Schema({
  user: { type: String, required: true },
  conv: { type: String, required: true },
  model: { type: String, required: false },
  Q: { type: String, required: true },
  A: { type: String, required: true },
  queries: { type: [String], default: void 0 },
  urls: { type: [String], default: void 0 },
  more: { type: [String], default: void 0 },
  dt: { type: Number, default: void 0 }
}, {
  versionKey: false,
  strict: "throw"
}), "messages");

export { message as m };
//# sourceMappingURL=message.mjs.map
