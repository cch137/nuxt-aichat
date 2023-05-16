import { defineEventHandler } from 'h3';
import { parse, serialize } from 'cookie';
import { g as getIp } from './getIp.mjs';
import { r as read, p as pack, a as random, g as generate } from './token.mjs';
import { m as message } from './index.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'mongoose';
import 'dotenv';

const check_post = defineEventHandler(async (event) => {
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
  const conversations = await message.aggregate([
    { $match: { user } },
    { $group: { _id: "$user", conv: { $addToSet: "$conv" } } },
    { $project: { _id: 0, conv: 1 } }
  ]).exec();
  return conversations[0].conv;
});

export { check_post as default };
//# sourceMappingURL=check.post.mjs.map
