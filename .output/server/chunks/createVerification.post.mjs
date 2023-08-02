import { defineEventHandler, readBody } from 'h3';
import { a as auth } from './auth.mjs';
import 'crypto-js/sha3.js';
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

const createVerification_post = defineEventHandler(async function(event) {
  const body = await readBody(event);
  if (!body) {
    return { error: "No form" };
  }
  const { email } = body;
  if (!email) {
    return { error: "Form incomplete" };
  }
  try {
    await auth.createEmailVerification(email);
    return { error: false };
  } catch (err) {
    return { error: typeof err === "string" ? err : "Verification code creation failed." };
  }
});

export { createVerification_post as default };
//# sourceMappingURL=createVerification.post.mjs.map
