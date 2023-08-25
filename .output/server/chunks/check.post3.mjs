import { defineEventHandler } from 'h3';
import { parse, serialize } from 'cookie';
import { g as getIp } from './getIp.mjs';
import { r as read, p as pack, g as generate } from './token.mjs';
import { r as random } from './random.mjs';
import './index2.mjs';
import { m as message } from './message.mjs';
import { c as conversation } from './conversation.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'dotenv';
import 'crypto';
import 'http';
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
import 'mongoose';

const check_post = defineEventHandler(async (event) => {
  var _a;
  const { req, res } = event.node;
  const ip = getIp(req);
  const rawCookie = req.headers.cookie;
  const oldToken = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  let token;
  let uid;
  if (oldToken !== null) {
    oldToken.checked = Date.now();
    uid = oldToken.uid;
    token = pack(oldToken);
  } else {
    uid = random.base64(16);
    token = generate(uid, ip);
  }
  res.setHeader("Set-Cookie", serialize("token", token, {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true
  }));
  try {
    const conversations = (((_a = (await message.aggregate([
      { $match: { uid } },
      { $group: { _id: "$uid", conv: { $addToSet: "$conv" } } },
      { $project: { _id: 0, conv: 1 } }
    ]))[0]) == null ? void 0 : _a.conv) || []).filter((c) => !c.startsWith("~"));
    if (Array.isArray(conversations)) {
      if (conversations.length === 0) {
        return [];
      }
      const savedConverations = await conversation.find(
        { $or: conversations.map((id) => ({ uid, id })) },
        { _id: 0, id: 1, name: 1, config: 1, mtime: 1 }
      );
      return conversations.map((convId) => {
        const { id = convId, name = "", config = "", mtime = 0 } = savedConverations.find((conv) => conv.id === convId) || {};
        return { id, name, config, mtime };
      }).sort((a, b) => b.mtime - a.mtime);
    }
  } catch (err) {
    console.error(err);
  }
  return [];
});

export { check_post as default };
//# sourceMappingURL=check.post3.mjs.map
