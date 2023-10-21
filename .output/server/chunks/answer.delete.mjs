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

const answer_delete = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    return { error: 1 };
  }
  const { conv, id } = body;
  if (!conv || !id) {
    return { error: 2 };
  }
  const uid = getUidByToken(event);
  if (typeof uid !== "string") {
    return { error: 3 };
  }
  try {
    const _id = new libExports.ObjectId(baseConverter.convert(id, "64", 16));
    await message.updateOne({ _id, conv, uid }, { $set: { uid: `~${uid}` } });
    return {};
  } catch (err) {
    return { error: 4 };
  }
});

export { answer_delete as default };
//# sourceMappingURL=answer.delete.mjs.map
