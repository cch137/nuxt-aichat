import { defineEventHandler } from 'h3';
import { d as discordBot } from './index2.mjs';
import 'dotenv';
import 'discord.js';
import './makeRequest.mjs';
import 'sequelize';

const discord_get = defineEventHandler(async () => {
  const { connected } = discordBot;
  return { connected };
});

export { discord_get as default };
//# sourceMappingURL=discord.get.mjs.map
