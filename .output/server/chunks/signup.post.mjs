import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import { a as auth } from './auth.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './str.mjs';
import './random.mjs';
import 'nodemailer';
import 'dotenv';
import './index3.mjs';
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
import './message.mjs';

const signup_post = defineEventHandler(async function(event) {
  const body = await readBody(event);
  if (!body) {
    return { error: "No form" };
  }
  const { email, username, password, code } = body;
  if (!email || !username || !password || !code) {
    return { error: "Form incomplete." };
  }
  const { req } = event.node;
  const rawCookie = req.headers.cookie;
  const tokenObj = read(parse(typeof rawCookie === "string" ? rawCookie : "").token) || {};
  const uid = tokenObj == null ? void 0 : tokenObj.user;
  if (!uid) {
    return { error: "Please reload the page." };
  }
  try {
    try {
      if (!auth.verifyEmail(email, code)) {
        throw "Incorrect verification code.";
      }
    } catch (err) {
      return { error: typeof err === "string" ? err : "Incorrect verification code." };
    }
    await auth.createUser(uid, email, username, password);
    return { error: false };
  } catch (err) {
    return { error: typeof err === "string" ? err : "User creation failed." };
  }
});

export { signup_post as default };
//# sourceMappingURL=signup.post.mjs.map
