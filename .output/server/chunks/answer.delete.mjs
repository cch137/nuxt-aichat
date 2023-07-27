import { defineEventHandler, readBody } from 'h3';
import { l as libExports, m as message } from './index2.mjs';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import { b as baseConverter } from './random.mjs';
import 'mongoose';
import 'dotenv';
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
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';

const answer_delete = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const body = await readBody(event);
  if (!body) {
    return { error: 1 };
  }
  const { conv, id } = body;
  if (!conv || !id) {
    return { error: 2 };
  }
  const rawCookie = (_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.user;
  if (token === null || typeof user !== "string") {
    return { error: 3 };
  }
  try {
    const _id = new libExports.ObjectId(baseConverter.convert(id, "64", 16));
    await message.findOneAndUpdate({ _id, conv, user }, { $set: { user: `~${user}` } });
    return {};
  } catch (err) {
    return { error: 4 };
  }
});

export { answer_delete as default };
//# sourceMappingURL=answer.delete.mjs.map
