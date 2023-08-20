import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import { a as auth } from './auth.mjs';
import './troll.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';
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

const username_put = defineEventHandler(async function(event) {
  const rawCookie = event.node.req.headers.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const uid = token == null ? void 0 : token.user;
  if (!uid) {
    return { error: "No authentication" };
  }
  const body = await readBody(event);
  if (!body) {
    return { error: "No form" };
  }
  const { username } = body;
  if (!username) {
    return { error: "Form incomplete" };
  }
  try {
    await auth.changeUsername(uid, username);
    return {};
  } catch (err) {
    return { error: typeof err === "string" ? err : "Username change failed." };
  }
});

export { username_put as default };
//# sourceMappingURL=username.put.mjs.map
