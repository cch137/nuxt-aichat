import { model, Schema } from 'mongoose';

const user = model("User", new Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  authlvl: { type: Number, required: true }
}, {
  versionKey: false,
  strict: "throw"
}), "users");

export { user as u };
//# sourceMappingURL=user.mjs.map
