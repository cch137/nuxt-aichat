import { Schema, model } from "mongoose";
interface NewSubMessageSchema {
  uid: string;
  conv: string;
  content: string;
  queries?: string[];
  urls?: string[];
  more?: string[];
  created: number;
  dt: string[];
  childrens: string[];
}
export default model(
  "Message",
  new Schema(
    {
      uid: { type: String, required: true },
      conv: { type: String, required: true },
      content: { type: String, default: "" },
      queries: { type: [String], default: undefined },
      urls: { type: [String], default: undefined },
      more: { type: [String], default: undefined },
      created: { type: Number, default: undefined },
      dt: { type: Number, default: undefined },
      childrens: { type: [String], default: undefined },
    },
    {
      versionKey: false,
      strict: "throw",
    }
  ),
  "messages"
);
