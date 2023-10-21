import { d as defineEventHandler } from './nitro/node-server.mjs';
import qs from 'qs';
import { c as crawlYouTubeVideo } from './ytCrawler.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'axios';

const ytCaptions = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const queries = qs.parse((_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.url) == null ? void 0 : _c.split("?")[1]);
  const id = queries.id;
  const lang = queries.lang;
  event.node.res.setHeader("Content-Type", "text/plain; charset=utf-8");
  try {
    return (await (await crawlYouTubeVideo(id)).getCaptions(lang)).map((caption) => caption.text).join("\n");
  } catch (err) {
    return `${err}`;
  }
});

export { ytCaptions as default };
//# sourceMappingURL=yt-captions.mjs.map
