import { d as defineEventHandler } from './nitro/node-server.mjs';
import { c as curva } from './index4.mjs';
import './index2.mjs';
import { m as message } from './message.mjs';
import { u as user } from './user.mjs';
import mongoose from 'mongoose';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import './conversation.mjs';
import 'axios';
import './random.mjs';
import 'crypto-js/sha3.js';
import './streamManager.mjs';
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

const status = defineEventHandler(async () => {
  const [totalMessages, totalUsers, dbStats] = await Promise.all([
    message.countDocuments(),
    user.countDocuments(),
    mongoose.connection.db.stats()
  ]);
  return {
    models: curva.status,
    totalMessages,
    totalUsers,
    dataSize: (dbStats == null ? void 0 : dbStats.storageSize) || 0
  };
});

export { status as default };
//# sourceMappingURL=status.mjs.map
