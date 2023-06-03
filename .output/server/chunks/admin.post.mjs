import { defineEventHandler, readBody } from 'h3';
import { d as discordBot } from './index.mjs';
import { c as curva } from './index2.mjs';
import 'discord.js';
import 'dotenv';
import 'sequelize';
import './sogouTranslate.mjs';
import 'crypto-js/md5.js';
import 'axios';
import 'cookie';
import './index3.mjs';
import 'mongoose';
import './str.mjs';
import './crawler.mjs';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import 'googlethis';
import './message.mjs';

const admin_post = defineEventHandler(async (event) => {
  const { ADMIN_PASSWORD } = process.env;
  const body = await readBody(event);
  const password = body == null ? void 0 : body.passwd;
  if (password !== ADMIN_PASSWORD) {
    return null;
  }
  const action = body == null ? void 0 : body.action;
  switch (action) {
    case "DC0":
      discordBot.disconnect();
      break;
    case "DC1":
      await discordBot.connect();
      break;
    case "WEBCONN":
      curva.setConnectMethod("WEB");
      break;
    case "SQLCONN":
      curva.setConnectMethod("SQL");
      break;
    case "RESTART":
      await curva.restart();
      break;
  }
  return {
    mdbConnectMethod: curva.getConnectMethod(),
    dcBotConnected: discordBot.connected,
    pass: true
  };
});

export { admin_post as default };
//# sourceMappingURL=admin.post.mjs.map
