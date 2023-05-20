import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import { m as message } from './index.mjs';
import { c as conversation } from './conversation.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'mongoose';
import 'dotenv';

const renameConv_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const body = await readBody(event);
  const conv = body == null ? void 0 : body.id;
  const name = (body == null ? void 0 : body.name) || "";
  const rawCookie = (_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.user;
  if (!user) {
    return { error: "No permission" };
  }
  if (typeof name !== "string") {
    return { error: "Invalid value" };
  }
  const isExistConv = Boolean(await message.findOne({ user, conv }));
  if (!isExistConv) {
    return {};
  }
  const trimmedName = name.trim().substring(0, 64);
  if (trimmedName.length === 0) {
    await conversation.deleteOne({ id: conv });
  } else {
    await conversation.findOneAndUpdate(
      { id: conv },
      { $set: { id: conv, user, name: trimmedName } },
      { upsert: true }
    );
  }
  return {};
});

export { renameConv_post as default };
//# sourceMappingURL=renameConv.post.mjs.map
