import { defineEventHandler, readBody } from 'h3';
import { d as discordBot } from './index.mjs';
import { s as setConnectMethod, g as getConnectMethod } from './mindsdbClient.mjs';
import 'dotenv';
import 'discord.js';
import 'sequelize';
import './createAxiosSession.mjs';
import 'axios';
import 'cookie';
import './index2.mjs';
import 'mongoose';
import './log.mjs';

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
      setConnectMethod("WEB");
      break;
    case "SQLCONN":
      setConnectMethod("SQL");
      break;
  }
  return {
    mdbConnectMethod: getConnectMethod(),
    dcBotConnected: discordBot.connected,
    pass: true
  };
});

export { admin_post as default };
//# sourceMappingURL=admin.post.mjs.map
