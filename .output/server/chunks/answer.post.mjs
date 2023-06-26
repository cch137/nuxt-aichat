import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { v as version } from './server.mjs';
import './index3.mjs';
import { t as troll, r as read } from './token.mjs';
import { e as evo } from './index4.mjs';
import { g as getIp } from './getIp.mjs';
import { s as str } from './str.mjs';
import { b as baseConverter } from './random.mjs';
import { l as logger } from './log.mjs';
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
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './index2.mjs';
import 'sequelize';
import './createAxiosSession.mjs';
import 'axios';
import './crawler.mjs';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import 'googlethis';
import './sogouTranslate.mjs';
import './message.mjs';

const answer_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const body = await readBody(event);
  if (!body) {
    return { error: 1 };
  }
  const { conv, prompt, context = "", model, web, t, tz = 0, id } = body;
  const _id = id ? baseConverter.convert(id, "64w", 16) : id;
  if (!conv || typeof prompt !== "string" || !model || !t) {
    return { error: 2 };
  }
  const stdHash = troll.h(`${prompt}${context}`, "MD5", t);
  const hashFromClient = (_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.hash;
  const timestamp = Number((_f = (_e = (_d = event == null ? void 0 : event.node) == null ? void 0 : _d.req) == null ? void 0 : _e.headers) == null ? void 0 : _f.timestamp);
  if (stdHash !== hashFromClient || timestamp !== t) {
    return { error: 3 };
  }
  const rawCookie = (_i = (_h = (_g = event == null ? void 0 : event.node) == null ? void 0 : _g.req) == null ? void 0 : _h.headers) == null ? void 0 : _i.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.user;
  getIp(event.node.req);
  if (token === null || typeof user !== "string") {
    return { error: 4 };
  }
  try {
    const response = await evo.ask(user, conv, model, web, prompt, context, tz, _id);
    if (typeof response.id === "string") {
      response.id = baseConverter.convert(response.id, 16, "64w");
    }
    if (response == null ? void 0 : response.error) {
      console.error(response == null ? void 0 : response.error);
    }
    return { version, ...response };
  } catch (err) {
    logger.create({ type: "error.api.response", text: str(err) });
    return { error: 5 };
  }
});

export { answer_post as default };
//# sourceMappingURL=answer.post.mjs.map
