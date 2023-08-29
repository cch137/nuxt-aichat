import { defineEventHandler } from 'h3';
import { c as curva } from './index4.mjs';
import './index2.mjs';
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
import 'mongoose';
import './conversation.mjs';
import './message.mjs';
import 'sequelize';
import './createAxiosSession.mjs';
import 'axios';
import 'cookie';
import './random.mjs';
import 'crypto-js/sha3.js';
import './streamManager.mjs';
import '@dqbd/tiktoken';
import './search.mjs';
import 'googlethis';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import './ytCrawler.mjs';
import 'qs';

const status = defineEventHandler(async (event) => {
  return curva.status;
});

export { status as default };
//# sourceMappingURL=status.mjs.map
