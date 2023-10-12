import { defineEventHandler } from 'h3';
import { c as curva } from './index4.mjs';
import './index2.mjs';
import { m as message } from './message.mjs';
import { u as user } from './user.mjs';
import mongoose from 'mongoose';
import './conversation.mjs';
import 'sequelize';
import './createAxiosSession.mjs';
import 'axios';
import 'cookie';
import './random.mjs';
import 'crypto-js/sha3.js';
import './streamManager.mjs';
import './search.mjs';
import 'googlethis';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import './ytCrawler.mjs';
import 'qs';
import '@dqbd/tiktoken';
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
import 'fs';
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
