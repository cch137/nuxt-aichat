import { defineEventHandler, readBody } from 'h3';
import { c as curva } from './index4.mjs';
import './index2.mjs';
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
import 'mongoose';
import './conversation.mjs';
import './message.mjs';
import 'sequelize';
import './createAxiosSession.mjs';
import 'axios';
import 'cookie';
import './str.mjs';
import 'gpt-3-encoder';
import './search.mjs';
import 'googlethis';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import './ytCrawler.mjs';
import 'qs';

const trueKey = "bwAmMGcccc9BraUShKlJwDxfwW59zUjiQUstz7dGoX91JQr9bdsrZ7F73uDSTOic";
const express_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const question = (body == null ? void 0 : body.question) || "Hi";
  const context = (body == null ? void 0 : body.context) || "";
  const modelName = (body == null ? void 0 : body.modelName) || "gpt4_t05_6k";
  const key = body == null ? void 0 : body.key;
  if (key !== trueKey) {
    return { answer: "", error: "API KEY ERROR" };
  }
  console.log("curva express", Date.now());
  const { answer, error = "" } = await curva.coreAsk(modelName, question, context);
  return { answer, error };
});

export { express_post as default };
//# sourceMappingURL=express.post.mjs.map