import { defineEventHandler } from 'h3';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './str.mjs';

const show = defineEventHandler(async (event) => {
  const { req } = event.node;
  const rawCookie = req.headers.cookie;
  return read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
});

export { show as default };
//# sourceMappingURL=show.mjs.map
