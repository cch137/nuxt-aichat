import { defineEventHandler, readBody } from 'h3';
import { a as getUidByToken } from './token.mjs';
import { a as auth } from './auth.mjs';
import { R as RateLimiter } from './rate-limiter.mjs';
import { g as getIp } from './getIp.mjs';
import 'cookie';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';
import './mailer.mjs';
import 'nodemailer';
import 'dotenv';
import './index2.mjs';
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
import './message.mjs';

const rateLimiter = new RateLimiter(5, 5 * 60 * 1e3);
const signup_post = defineEventHandler(async function(event) {
  if (!rateLimiter.check(getIp(event.node.req))) {
    return { error: rateLimiter.hint, isLoggedIn: false };
  }
  const body = await readBody(event);
  if (!body) {
    return { error: "No form" };
  }
  const { email, username, password, code } = body;
  if (!email || !username || !password || !code) {
    return { error: "Form incomplete." };
  }
  const uid = getUidByToken(event);
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
