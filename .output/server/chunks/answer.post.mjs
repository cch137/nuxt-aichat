import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { v as version } from './server.mjs';
import './index3.mjs';
import { r as read } from './token.mjs';
import { e as estimateTokens, c as curva } from './index2.mjs';
import { g as getIp } from './getIp.mjs';
import { b as baseConverter, s as str } from './random.mjs';
import { t as troll } from './troll.mjs';
import { model, Schema } from 'mongoose';
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
import './conversation.mjs';
import 'sequelize';
import './createAxiosSession.mjs';
import 'axios';
import 'gpt-3-encoder';
import 'googlethis';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import './ytCrawler.mjs';
import 'qs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';

const logger = model("Log", new Schema({
  type: { type: String, required: true },
  refer: { type: String },
  text: { type: String, required: true }
}, {
  versionKey: false
}), "logs");

const answer_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const now = Date.now();
  const body = await readBody(event);
  if (!body) {
    return { error: "CH4 API ERROR 01" };
  }
  const { conv, messages = [], model, temperature, t, tz = 0, id } = body;
  if (t > now + 3e5 || t < now - 3e5) {
    return { error: "CH4 API ERROR 12", id };
  }
  const _id = id ? baseConverter.convert(id, "64", 16) : id;
  if (!conv || (messages == null ? void 0 : messages.length) < 1 || !model || !t) {
    return { error: "CH4 API ERROR 11", id };
  }
  const stdHash = troll.h(messages, "MD5", t);
  const hashFromClient = (_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.hash;
  const timestamp = Number((_f = (_e = (_d = event == null ? void 0 : event.node) == null ? void 0 : _d.req) == null ? void 0 : _e.headers) == null ? void 0 : _f.timestamp);
  if (stdHash !== hashFromClient || timestamp !== t) {
    return { error: "CH4 API ERROR 32", id };
  }
  const rawCookie = (_i = (_h = (_g = event == null ? void 0 : event.node) == null ? void 0 : _g.req) == null ? void 0 : _h.headers) == null ? void 0 : _i.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.user;
  if (token === null || typeof user !== "string") {
    return { error: "CH4 API ERROR 31", id };
  }
  const ip = getIp(event.node.req);
  if (ip.includes("106.40.15.110") || ip.includes("36.102.154.131")) {
    return { error: "CH4 API ERROR 02", id };
  }
  try {
    const croppedMessages = (() => {
      let _messages = messages;
      const maxTokens = model === "gpt4" ? 6e3 : model.startsWith("gpt3") ? 3e3 : model === "gpt-web" ? 4e3 : model === "claude-2-web" ? 8e4 : 4e3;
      while (estimateTokens(JSON.stringify(_messages)) > maxTokens && _messages.length > 1) {
        _messages.shift();
      }
      return _messages;
    })();
    const response = await curva.ask(ip, user, conv, model, temperature, croppedMessages, tz, _id);
    response.id = typeof response.id === "string" ? baseConverter.convert(response.id, 16, "64w") : id;
    if (response == null ? void 0 : response.error) {
      console.error(response == null ? void 0 : response.error);
    }
    return { version, ...response };
  } catch (err) {
    logger.create({ type: "error.api.response", text: str(err) });
    return { error: 500, id };
  }
});

export { answer_post as default };
//# sourceMappingURL=answer.post.mjs.map
