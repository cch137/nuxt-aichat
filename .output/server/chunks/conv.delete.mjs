import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import { C as Conversation } from './index4.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';
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
import './streamManager.mjs';
import '@dqbd/tiktoken';
import './search.mjs';
import 'googlethis';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import './ytCrawler.mjs';
import 'qs';

const conv_delete = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const conv = (_a = await readBody(event)) == null ? void 0 : _a.id;
  const rawCookie = (_d = (_c = (_b = event == null ? void 0 : event.node) == null ? void 0 : _b.req) == null ? void 0 : _c.headers) == null ? void 0 : _d.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.uid;
  if (!user || !conv) {
    return { error: 1 };
  }
  await new Conversation(user, conv).delete();
  return {};
});

export { conv_delete as default };
//# sourceMappingURL=conv.delete.mjs.map
