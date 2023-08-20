import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import { m as message } from './index3.mjs';
import qs from 'qs';
import { c as conversation } from './conversation.mjs';
import './troll.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';
import 'mongoose';
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

function validKeyValuePair(key, value) {
  switch (key) {
    case "model":
      if (["gpt3", "gpt4", "gpt-web", "claude-2-web", "gpt3-fga"].includes(value)) {
        return true;
      }
      break;
    case "temperature":
      if (typeof value === "number") {
        if (value >= 0 && value <= 1) {
          return true;
        }
      }
      break;
    case "context":
      if (typeof value === "boolean") {
        return true;
      }
      break;
  }
  return false;
}
function tryParseJson(obj) {
  try {
    return JSON.parse(obj);
  } catch {
    return obj;
  }
}
function toStdConvConfig(obj) {
  try {
    const resultObj = {};
    for (const key in obj) {
      const value = tryParseJson(obj[key]);
      if (validKeyValuePair(key, value)) {
        resultObj[key] = value;
      }
    }
    return resultObj;
  } catch {
    return {};
  }
}
function parseConvConfig(objString) {
  try {
    return toStdConvConfig(qs.parse(objString));
  } catch {
    return {};
  }
}
function stringifyConvConfig(obj) {
  try {
    return qs.stringify(toStdConvConfig(obj));
  } catch {
    return "";
  }
}
function toStdConvConfigString(configString) {
  return stringifyConvConfig(parseConvConfig(configString));
}

const conv_put = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const body = await readBody(event);
  const conv = body == null ? void 0 : body.id;
  const name = (body == null ? void 0 : body.name) || "";
  const config = toStdConvConfigString((body == null ? void 0 : body.config) || "");
  const rawCookie = (_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.user;
  if (!user) {
    return { error: "No permission" };
  }
  const data = {};
  if (typeof name === "string") {
    const trimmedName = name.trim().substring(0, 64);
    data.name = trimmedName;
  }
  if (config) {
    data.config = config;
  }
  const isExistConv = Boolean(await message.findOne({ user, conv }));
  if (!isExistConv) {
    return {};
  }
  await conversation.updateOne(
    { id: conv, user },
    { $set: { id: conv, user, ...data } },
    { upsert: true }
  );
  return {};
});

export { conv_put as default };
//# sourceMappingURL=conv.put.mjs.map
