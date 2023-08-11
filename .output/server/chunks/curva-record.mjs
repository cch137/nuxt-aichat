import { defineEventHandler } from 'h3';
import { c as checkPassword } from './checkPassword.mjs';
import { c as curva } from './index2.mjs';
import './index3.mjs';
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
import './conversation.mjs';
import './troll.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';
import 'sequelize';
import './createAxiosSession.mjs';
import 'axios';
import 'cookie';
import 'gpt-3-encoder';
import 'googlethis';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import './ytCrawler.mjs';
import 'qs';

const curvaRecord = defineEventHandler(async (event) => {
  if (!await checkPassword(event)) {
    return null;
  }
  return curva.record.getItems();
});

export { curvaRecord as default };
//# sourceMappingURL=curva-record.mjs.map
