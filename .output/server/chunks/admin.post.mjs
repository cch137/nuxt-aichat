import { defineEventHandler, readBody } from 'h3';
import { d as discordBot } from './index.mjs';
import 'discord.js';
import './ytCrawler.mjs';
import 'qs';
import 'axios';
import './index2.mjs';
import './index3.mjs';
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
import './conversation.mjs';
import './troll.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';
import 'sequelize';
import './createAxiosSession.mjs';
import 'cookie';
import 'gpt-3-encoder';
import 'googlethis';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';

const admin_post = defineEventHandler(async function(event) {
  const body = await readBody(event);
  const password = body == null ? void 0 : body.passwd;
  if (password !== process.env.ADMIN_PASSWORD) {
    return null;
  }
  const t0 = Date.now();
  const action = body == null ? void 0 : body.action;
  switch (action) {
    case "DC0":
      discordBot.disconnect();
      break;
    case "DC1":
      await discordBot.connect();
      break;
  }
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        dcBotConnected: discordBot.connected,
        pass: true
      });
    }, Math.max(0, t0 - Date.now() + 500));
  });
});

export { admin_post as default };
//# sourceMappingURL=admin.post.mjs.map
