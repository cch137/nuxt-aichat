import { model, Schema } from 'mongoose';

const logger = model("Log", new Schema({
  type: { type: String, required: true },
  refer: { type: String },
  text: { type: String, required: true }
}, {
  versionKey: false
}), "logs");

export { logger as l };
//# sourceMappingURL=log.mjs.map
