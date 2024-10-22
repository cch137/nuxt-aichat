import { d as defineEventHandler, r as readBody } from './nitro/node-server.mjs';
import { parse, serialize } from 'cookie';
import { r as read, p as pack } from './token.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';

const replaceUser_post = defineEventHandler(async function(event) {
  var _a;
  const { req, res } = event.node;
  const body = await readBody(event);
  if (!body) {
    return { error: "No form" };
  }
  const { id, password } = body;
  if (!id || !password) {
    return { error: "Form incomplete" };
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Password incorrect" };
  }
  const rawCookie = (_a = req == null ? void 0 : req.headers) == null ? void 0 : _a.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token) || {};
  token.uid = id;
  res.setHeader("Set-Cookie", serialize("token", pack(token), {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true
  }));
  return { error: false };
});

export { replaceUser_post as default };
//# sourceMappingURL=replaceUser.post.mjs.map
