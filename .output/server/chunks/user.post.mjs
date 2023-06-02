import { defineEventHandler } from 'h3';
import { parse } from 'cookie';
import { r as read, m as mask } from './token.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './str.mjs';

const user_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const rawCookie = (_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  return mask((token == null ? void 0 : token.user) || "", "64w", 1, 4896).substring(1);
});

export { user_post as default };
//# sourceMappingURL=user.post.mjs.map
