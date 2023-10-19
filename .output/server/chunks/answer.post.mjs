import { defineEventHandler, readBody } from 'h3';
import { v as version } from './server.mjs';
import './index2.mjs';
import { h as hx, a as getUidByToken, b as getAuthlvlByToken } from './token.mjs';
import { c as curva } from './index4.mjs';
import { g as getIp } from './getIp.mjs';
import { b as baseConverter, r as random, s as str } from './random.mjs';
import { encoding_for_model } from '@dqbd/tiktoken';
import { R as RateLimiter } from './rate-limiter.mjs';
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
import 'cookie';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './conversation.mjs';
import './message.mjs';
import 'axios';
import './streamManager.mjs';
import './search.mjs';
import 'googlethis';

const logger = model("Log", new Schema({
  type: { type: String, required: true },
  refer: { type: String },
  text: { type: String, required: true }
}, {
  versionKey: false
}), "logs");

const tiktokens = /* @__PURE__ */ new Map([
  ["gpt-4", encoding_for_model("gpt-4")],
  ["gpt-3.5-turbo", encoding_for_model("gpt-3.5-turbo")]
]);
function estimateTokens(_model = "gpt-4", ...texts) {
  _model = (_model || "").toLowerCase() || "gpt-4";
  const model = _model.includes("gpt3") || _model.includes("gpt-3") ? "gpt-3.5-turbo" : "gpt-4";
  return (tiktokens.get(model) || tiktokens.get("gpt-4")).encode(texts.join("\n")).length;
}

const MIN_LEVEL = 0;
const models = [
  {
    name: "GPT-3.5-Turbo",
    value: "gpt3",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL
  },
  {
    name: "GPT-4",
    value: "gpt4",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL
  },
  {
    name: "GPT-Web",
    value: "gpt-web",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: false,
    permissionLevel: MIN_LEVEL,
    redirectTo: "gpt3"
  },
  {
    name: "Claude-2",
    value: "claude-2",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL
  },
  {
    name: "Claude-2 (Web)",
    value: "claude-2-web",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL
  },
  {
    name: "GPT-3.5-Turbo (stream)",
    value: "gpt3-fga",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL,
    redirectTo: "gpt3"
  },
  {
    name: "GPT-4 (stream)",
    value: "gpt4-fga",
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL,
    redirectTo: "gpt4"
  }
];

function isHeadlessUserAgent(userAgent = "") {
  const pattern = /headless/i;
  return pattern.test(userAgent);
}
const rateLimiterBundler = RateLimiter.bundle([
  // Every 1 minutes 10 times
  new RateLimiter(10, 1 * 60 * 1e3),
  // Every 1*60 minutes 100 times
  new RateLimiter(100, 1 * 3600 * 1e3),
  // Every 4*60 minutes 200 times
  new RateLimiter(200, 4 * 3600 * 1e3),
  // Every 24*60 minutes 500 times
  new RateLimiter(500, 24 * 3600 * 1e3)
]);
const bannedIpSet = /* @__PURE__ */ new Set([]);
const answer_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  if (!rateLimiterBundler.check(getIp(event.node.req))) {
    return await new Promise((r) => setTimeout(() => r({ error: rateLimiterBundler.getHint(getIp(event.node.req)) }), 1e4));
  }
  const now = Date.now();
  const body = await readBody(event);
  if (!body) {
    return { error: "INVALID BODY" };
  }
  const userAgent = event.node.req.headers["user-agent"];
  if (isHeadlessUserAgent(userAgent)) {
    return { error: "DEVELOPER MODE" };
  }
  const { conv, messages = [], model, temperature, t, tz = 0, id: _id, streamId } = body;
  const id = _id ? baseConverter.convert(_id, "64", 16) : _id;
  const tempId = id || random.base16(24);
  if (t > now + 3e5 || t < now - 3e5) {
    return { error: "OUTDATED REQUEST", id: tempId };
  }
  if (!conv || (messages == null ? void 0 : messages.length) < 1 || !model || !t) {
    return { error: "BODY INCOMPLETE", id: tempId };
  }
  const stdHash = hx(messages, "MD5", t);
  const hashFromClient = (_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.hash;
  const timestamp = Number((_f = (_e = (_d = event == null ? void 0 : event.node) == null ? void 0 : _d.req) == null ? void 0 : _e.headers) == null ? void 0 : _f.timestamp);
  if (stdHash !== hashFromClient || timestamp !== t) {
    return { error: "VERIFICATION FAILED", id: tempId };
  }
  const uid = getUidByToken(event);
  if (typeof uid !== "string") {
    return { error: "UNAUTHENTICATED", id: tempId };
  }
  const authlvl = getAuthlvlByToken(event);
  const neededAuthlvl = ((_g = models.find((m) => m.value === model)) == null ? void 0 : _g.permissionLevel) || 0;
  if (authlvl < neededAuthlvl) {
    return { error: "NO PERMISSION", id: tempId };
  }
  const ip = getIp(event.node.req);
  if ([...bannedIpSet].find((_ip) => ip.includes(_ip))) {
    return { error: "Your actions are considered to be abusive.", id: tempId };
  }
  try {
    const lastQuestion = ((_h = messages.findLast((i) => i.role === "user")) == null ? void 0 : _h.content) || "";
    if (lastQuestion.toUpperCase().includes("ONLY SAY HELLO")) {
      console.log("ONLY SAY HELLO", ip, event.node.req.headers);
      rateLimiterBundler.check(ip, 1e3);
      return { answer: "Hello.", id: tempId };
    }
    const croppedMessages = (() => {
      let _messages = messages;
      const maxTokens = model === "gpt4" ? 6e3 : model.startsWith("gpt3") ? 3e3 : model === "gpt-web" ? 4e3 : model === "claude-2-web" ? 8e4 : 4e3;
      while (estimateTokens(model, JSON.stringify(_messages)) > maxTokens && _messages.length > 1) {
        _messages.shift();
      }
      return _messages;
    })();
    const response = await curva.ask(ip, uid, conv, model, temperature, croppedMessages, tz, id, streamId);
    response.id = typeof response.id === "string" ? baseConverter.convert(response.id, 16, "64") : id || tempId;
    if (response.error) {
      console.error(typeof response.error === "string" && response.error.length ? response.error.split("\n")[0] : response.error);
    }
    console.log(ip, uid, conv, model, "|", [...rateLimiterBundler].map((r) => `(${r.total}/${r.frequencyMin})`).join(" "));
    return { version, ...response };
  } catch (err) {
    logger.create({ type: "error.api.response", text: str(err) });
    return { error: 500, id: tempId };
  }
});

export { answer_post as default };
//# sourceMappingURL=answer.post.mjs.map
