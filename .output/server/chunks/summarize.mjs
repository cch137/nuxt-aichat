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
import 'cookie';
import './index3.mjs';
import 'dotenv';
import 'mongoose';
import './str.mjs';

const summarize = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  const query = ((_d = qs.parse((_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.url) == null ? void 0 : _c.split("?")[1])) == null ? void 0 : _d.query) || (event.node.req.method === "POST" ? (_e = await readBody(event)) == null ? void 0 : _e.query : "");
  if (query) {
    event.node.res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return await crawler.summarize(query);
  }
});

export { summarize as default };
//# sourceMappingURL=summarize.mjs.map
