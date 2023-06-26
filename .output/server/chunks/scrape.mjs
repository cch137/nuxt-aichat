import { defineEventHandler, readBody } from 'h3';
import qs from 'qs';
import { c as crawler } from './crawler.mjs';
import 'axios';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import 'googlethis';
import './sogouTranslate.mjs';
import 'crypto-js/md5.js';
import './createAxiosSession.mjs';
import 'cookie';
import './index3.mjs';
import 'dotenv';
import 'crypto';
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
import 'http';
import 'mongoose';
import './str.mjs';
import './log.mjs';

const scrape = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  const url = ((_d = qs.parse((_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.url) == null ? void 0 : _c.split("?")[1])) == null ? void 0 : _d.url) || (event.node.req.method === "POST" ? (_e = await readBody(event)) == null ? void 0 : _e.url : "");
  if (url) {
    event.node.res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return await crawler.scrape(url);
  }
});

export { scrape as default };
//# sourceMappingURL=scrape.mjs.map
