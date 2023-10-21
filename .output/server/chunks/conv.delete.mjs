import { d as defineEventHandler, r as readBody } from './nitro/node-server.mjs';
import { a as getUidByToken } from './token.mjs';
import { C as Conversation } from './index4.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'cookie';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';
import './index2.mjs';
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
import './conversation.mjs';
import './message.mjs';
import 'axios';
import './streamManager.mjs';

const conv_delete = defineEventHandler(async (event) => {
  var _a;
  const conv = (_a = await readBody(event)) == null ? void 0 : _a.id;
  const uid = getUidByToken(event);
  if (!uid || !conv) {
    return { error: 1 };
  }
  await new Conversation(uid, conv).delete();
  return {};
});

export { conv_delete as default };
//# sourceMappingURL=conv.delete.mjs.map
