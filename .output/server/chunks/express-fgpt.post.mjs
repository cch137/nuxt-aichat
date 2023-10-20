import { d as defineEventHandler, r as readBody } from './nitro/node-server.mjs';
import { c as curva } from './index4.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import './index2.mjs';
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
import 'mongodb-connection-string-url';
import 'os';
import 'process';
import 'zlib';
import 'net';
import 'socks';
import 'tls';
import 'mongoose';
import './conversation.mjs';
import './message.mjs';
import 'axios';
import './random.mjs';
import 'crypto-js/sha3.js';
import './streamManager.mjs';
import './search.mjs';
import 'googlethis';

const trueKey = "bwAmMGcccc9BraUShKlJwDxfwW59zUjiQUstz7dGoX91JQr9bdsrZ7F73uDSTOic";
const expressFgpt_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const question = (body == null ? void 0 : body.question) || "Hi";
  const key = body == null ? void 0 : body.key;
  if (key !== trueKey) {
    return { answer: "", error: "API KEY ERROR" };
  }
  console.log("curva express-fgpt", Date.now());
  const { answer, error = "" } = await curva.fgpt(question);
  return { answer, error };
});

export { expressFgpt_post as default };
//# sourceMappingURL=express-fgpt.post.mjs.map
