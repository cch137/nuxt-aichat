import { defineEventHandler } from 'h3';
import { t as translateZh2En } from './sogouTranslate.mjs';
import qs from 'qs';
import 'axios';
import 'cookie';
import 'crypto-js/md5.js';

const translate = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const text = qs.parse((_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.url) == null ? void 0 : _c.split("?")[1]).text;
  return (await translateZh2En(text)).text;
});

export { translate as default };
//# sourceMappingURL=translate.mjs.map
