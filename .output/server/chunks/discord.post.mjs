import { defineEventHandler, readBody } from 'h3';
import { d as discordBot } from './index2.mjs';
import 'dotenv';
import 'discord.js';
import './makeRequest.mjs';
import 'sequelize';

const discord_post = defineEventHandler(async (event) => {
  const { ADMIN_PASSWORD } = process.env;
  const body = await readBody(event);
  const password = body == null ? void 0 : body.passwd;
  if (password !== ADMIN_PASSWORD) {
    return {
      connected: discordBot.connected,
      pass: false
    };
  }
  const action = body == null ? void 0 : body.action;
  if (action === "CONN0") {
    discordBot.disconnect();
  } else if (action === "CONN1") {
    await discordBot.connect();
  }
  return {
    connected: discordBot.connected,
    pass: true
  };
});

export { discord_post as default };
//# sourceMappingURL=discord.post.mjs.map
