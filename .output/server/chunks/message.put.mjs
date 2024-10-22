import { d as defineEventHandler, r as readBody } from './nitro/node-server.mjs';
import { l as libExports } from './index2.mjs';
import { a as getUidByToken } from './token.mjs';
import { b as baseConverter } from './random.mjs';
import { m as message } from './message.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'dotenv';
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
import 'cookie';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';

const message_put = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    return { error: 1 };
  }
  let { conv, id, Q, A } = body;
  if (!conv || !id || typeof Q !== "string" || typeof A !== "string") {
    return { error: 2 };
  }
  Q = Q.trim();
  A = A.trim();
  const uid = getUidByToken(event);
  if (typeof uid !== "string") {
    return { error: 3 };
  }
  try {
    const _id = new libExports.ObjectId(baseConverter.convert(id, "64", 16));
    if (Q || A) {
      if (Q) {
        await message.updateOne({ _id, conv, uid }, { $set: { Q, A } });
      } else {
        await message.updateOne({ _id, conv, uid }, { $set: { Q, A }, $unset: { urls: "", queries: "", more: "", dt: "" } });
      }
    } else {
      await message.updateOne({ _id, conv, uid }, { $set: { uid: `~${uid}` } });
    }
    return {};
  } catch (err) {
    return { error: 4 };
  }
});

export { message_put as default };
//# sourceMappingURL=message.put.mjs.map
