import { d as defineEventHandler } from './nitro/node-server.mjs';
import { parse, serialize } from 'cookie';
import { g as getIp } from './getIp.mjs';
import { r as read, p as pack, g as generate } from './token.mjs';
import { r as random } from './random.mjs';
import { a as auth } from './auth.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './mailer.mjs';
import 'nodemailer';
import 'dotenv';
import './index2.mjs';
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
import 'mongodb-connection-string-url';
import 'os';
import 'process';
import 'zlib';
import 'net';
import 'socks';
import 'tls';
import 'mongoose';
import './user.mjs';
import './message.mjs';

const check_post = defineEventHandler(async (event) => {
  const { req, res } = event.node;
  const ip = getIp(req);
  const rawCookie = req.headers.cookie;
  const oldTokenObj = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  let token;
  let uid;
  if (oldTokenObj !== null) {
    oldTokenObj.checked = Date.now();
    uid = oldTokenObj.uid;
    token = oldTokenObj || {};
  } else {
    uid = random.base64(16);
    token = generate(uid, ip);
  }
  const user = await auth.getUser(uid || "-");
  token.authlvl = (user == null ? void 0 : user.authlvl) || 0;
  res.setHeader("Set-Cookie", serialize("token", pack(token), {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true
  }));
  return {
    isLoggedIn: Boolean(user),
    user
  };
});

export { check_post as default };
//# sourceMappingURL=check.post2.mjs.map
