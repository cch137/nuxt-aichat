import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import { d as deleteConversation } from './deleteConversation.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './str.mjs';
import './index3.mjs';
import 'dotenv';
import 'mongoose';
import './message.mjs';

const deleteConv_delete = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const conv = (_a = await readBody(event)) == null ? void 0 : _a.id;
  const rawCookie = (_d = (_c = (_b = event == null ? void 0 : event.node) == null ? void 0 : _b.req) == null ? void 0 : _c.headers) == null ? void 0 : _d.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.user;
  if (!user || !conv) {
    return { error: 1 };
  }
  return await deleteConversation(user, conv);
});

export { deleteConv_delete as default };
//# sourceMappingURL=deleteConv.delete.mjs.map
