import { defineEventHandler } from 'h3';
import { parse, serialize } from 'cookie';
import { g as getIp } from './getIp.mjs';
import { r as read, p as pack, g as generate } from './token.mjs';
import { r as random } from './random.mjs';
import { m as message } from './index3.mjs';
import { c as conversation } from './conversation.mjs';
import './troll.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'mongoose';
import 'dotenv';
import 'crypto';
import './rollup/_commonjsHelpers.mjs';
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

const check_post = defineEventHandler(async (event) => {
  var _a;
  const { req, res } = event.node;
  const ip = getIp(req);
  const rawCookie = req.headers.cookie;
  const oldToken = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  let token;
  let user;
  if (oldToken !== null) {
    oldToken.checked = Date.now();
    user = oldToken.user;
    token = pack(oldToken);
  } else {
    user = random.base64(16);
    token = generate(user, ip);
  }
  res.setHeader("Set-Cookie", serialize("token", token, {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true
  }));
  try {
    const conversations = (_a = (await message.aggregate([
      { $match: { user } },
      { $group: { _id: "$user", conv: { $addToSet: "$conv" } } },
      { $project: { _id: 0, conv: 1 } }
    ]).exec())[0]) == null ? void 0 : _a.conv;
    if (Array.isArray(conversations)) {
      const record = {};
      const items = await conversation.find(
        { $or: conversations.map((id) => ({ user, id })) },
        { _id: 0, id: 1, name: 1 }
      );
      for (const item of items) {
        if (typeof item.name === "string") {
          record[item.id] = item.name;
        }
      }
      return {
        list: conversations.filter((c) => !c.startsWith("~")),
        named: record
      };
    }
  } catch (err) {
    console.error(err);
  }
  return {
    list: [],
    named: {}
  };
});

export { check_post as default };
//# sourceMappingURL=check.post4.mjs.map
