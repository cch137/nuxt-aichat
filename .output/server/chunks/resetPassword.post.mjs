import { defineEventHandler, readBody } from 'h3';
import { a as auth } from './auth.mjs';
import { R as RateLimiter } from './rate-limiter.mjs';
import { g as getIp } from './getIp.mjs';
import 'crypto-js/sha3.js';
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
import './random.mjs';
import './str.mjs';
import './message.mjs';

const rateLimiter = new RateLimiter(5, 5 * 60 * 1e3);
const resetPassword_post = defineEventHandler(async function(event) {
  if (!rateLimiter.check(getIp(event.node.req))) {
    return { error: rateLimiter.hint, isLoggedIn: false };
  }
  const body = await readBody(event);
  if (!body) {
    return { error: "No form" };
  }
  const { email, password, code } = body;
  if (!email || !password || !code) {
    return { error: "Form incomplete." };
  }
  try {
    try {
      if (!auth.verifyEmail(email, code)) {
        throw "Incorrect verification code.";
      }
    } catch (err) {
      return { error: typeof err === "string" ? err : "Incorrect verification code." };
    }
    await auth.resetPassword(email, password);
    return { error: false };
  } catch (err) {
    return { error: typeof err === "string" ? err : "User creation failed." };
  }
});

export { resetPassword_post as default };
//# sourceMappingURL=resetPassword.post.mjs.map
