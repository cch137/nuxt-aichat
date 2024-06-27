import { Schema, model } from "mongoose";

export default model(
  "Conversation",
  new Schema(
    {
      user: { type: String },
      id: { type: String, required: true },
      uid: { type: String, required: true },
      name: { type: String },
      config: { type: String },
      mtime: { type: Number },
    },
    {
      versionKey: false,
    }
  ),
  "conversations"
);
