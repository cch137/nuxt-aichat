import { defineEventHandler, readBody } from 'h3';
import { a as auth } from './auth.mjs';
import { parse, serialize } from 'cookie';
import { r as read, p as pack } from './token.mjs';
import 'crypto-js/sha3.js';
import './mailer.mjs';
import 'nodemailer';
import 'dotenv';
import './index3.mjs';
import 'mongoose';
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
import './random.mjs';
import './troll.mjs';
import 'crypto-js/md5.js';

const login_post = defineEventHandler(async function(event) {
  var _a;
  const { req, res } = event.node;
  const body = await readBody(event);
  if (!body) {
    return { error: "No form" };
  }
  const { usernameOrEmail, password } = body;
  if (!usernameOrEmail || !password) {
    return { error: "Form incomplete" };
  }
  const rawCookie = (_a = req == null ? void 0 : req.headers) == null ? void 0 : _a.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token) || {};
  const oldUid = token.user;
  const oldUidIsExists = oldUid ? auth.getUser(oldUid) : null;
  const uid = await auth.getUid(usernameOrEmail, password);
  if (uid) {
    token.user = uid;
    if (!await oldUidIsExists) {
      try {
        await auth.mergeUser(uid, oldUid);
      } catch {
      }
    }
  } else {
    return { error: "The user does not exist or the password is incorrect." };
  }
  res.setHeader("Set-Cookie", serialize("token", pack(token), {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true
  }));
  return { isLoggedIn: true, user: await auth.getUser(uid) };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
