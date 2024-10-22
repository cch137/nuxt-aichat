import { d as defineEventHandler, r as readBody } from './nitro/node-server.mjs';
import { a as auth } from './auth.mjs';
import { R as RateLimiter } from './rate-limiter.mjs';
import { g as getIp } from './getIp.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'crypto-js/sha3.js';
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
import './random.mjs';
import './user.mjs';
import './message.mjs';

const rateLimiter = new RateLimiter(5, 5 * 60 * 1e3);
const createVerification_post = defineEventHandler(async function(event) {
  if (!rateLimiter.check(getIp(event.node.req))) {
    return { error: rateLimiter.hint };
  }
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
