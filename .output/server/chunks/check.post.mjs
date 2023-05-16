import { defineEventHandler } from 'h3';
import { parse, serialize } from 'cookie';
import { g as getIp, a as random, r as read, p as pack, b as generate } from './token.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';

const check_post = defineEventHandler(async (event) => {
  const { req, res } = event.node;
  const ip = getIp(req);
  const user = random.base64(16);
  const rawCookie = req.headers.cookie;
  const oldToken = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  let token;
  if (oldToken !== null) {
    oldToken.checked = Date.now();
    token = pack(oldToken);
  } else {
    token = generate(user, ip);
  }
  res.setHeader("Set-Cookie", serialize("token", token, {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true
  }));
  return "";
});

export { check_post as default };
//# sourceMappingURL=check.post.mjs.map
