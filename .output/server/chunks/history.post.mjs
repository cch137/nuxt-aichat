import { defineEventHandler, readBody } from 'h3';
import { a as getUidByToken } from './token.mjs';
import { C as Conversation } from './index4.mjs';
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
import './streamManager.mjs';
import '@dqbd/tiktoken';
import './search.mjs';
import 'googlethis';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import './ytCrawler.mjs';
import 'qs';

const history_post = defineEventHandler(async (event) => {
  var _a;
  const conv = (_a = await readBody(event)) == null ? void 0 : _a.id;
  const uid = getUidByToken(event);
  if (!uid) {
    return { error: 1 };
  }
  try {
    return await new Conversation(uid, conv).getHistory();
  } catch {
    return { error: 2 };
  }
});

export { history_post as default };
//# sourceMappingURL=history.post.mjs.map
