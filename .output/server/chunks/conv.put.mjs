import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import './index3.mjs';
import { m as message } from './message.mjs';
import { c as conversation } from './conversation.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './str.mjs';
import './random.mjs';
import 'dotenv';
import 'crypto';
import 'url';
import 'bson';
import 'timers';
import 'util';
import 'stream';
import 'events';
import 'dns';
import 'fs';
import 'mongodb-connection-string-url';
import 'os';
import 'process';
import 'zlib';
import 'net';
import 'socks';
import 'tls';
import 'http';
import 'mongoose';

const conv_put = defineEventHandler(async (event) => {
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

export { conv_put as default };
//# sourceMappingURL=conv.put.mjs.map
