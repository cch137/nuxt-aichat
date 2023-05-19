import mongoose, { model, Schema } from 'mongoose';
import { config } from 'dotenv';

const message = model("Message", new Schema({
  user: { type: String, required: true },
  conv: { type: String, required: true },
  model: { type: String, required: true },
  Q: { type: String, required: true },
  A: { type: String, required: true }
}, {
  versionKey: false
}), "messages");

var _a;
config();
console.log("MONGO:", (_a = process.env.MONGODB_KEY) == null ? void 0 : _a.slice(0, 11));
void mongoose.connect(process.env.MONGODB_KEY);

export { message as m };
//# sourceMappingURL=index.mjs.map
