import { defineEventHandler, readBody } from 'h3';
import { a as auth } from './auth.mjs';
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

const resetPassword_post = defineEventHandler(async function(event) {
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
