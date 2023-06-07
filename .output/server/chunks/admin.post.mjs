import { defineEventHandler, readBody } from 'h3';
import { d as discordBot } from './index.mjs';
import { m as mindsdb } from './index2.mjs';
import 'discord.js';
import './index3.mjs';
import 'dotenv';
import 'mongoose';
import './message.mjs';
import './deleteConversation.mjs';
import 'sequelize';
import './sogouTranslate.mjs';
import 'crypto-js/md5.js';
import 'axios';
import 'cookie';
import './str.mjs';
import './crawler.mjs';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import 'googlethis';

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
    case "WEBCONN":
      mindsdb.defaultConnectMethod = "WEB";
      break;
    case "SQLCONN":
      mindsdb.defaultConnectMethod = "SQL";
      break;
    case "RESTART":
      await mindsdb.restart();
      break;
  }
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        mdbConnectMethod: mindsdb.defaultConnectMethod,
        dcBotConnected: discordBot.connected,
        pass: true
      });
    }, Math.max(0, t0 - Date.now() + 500));
  });
});

export { admin_post as default };
//# sourceMappingURL=admin.post.mjs.map
