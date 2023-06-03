import { defineEventHandler } from 'h3';
import { d as discordBot } from './index.mjs';
import 'dotenv';
import 'discord.js';
import './mindsdbClient.mjs';
import 'sequelize';
import './createAxiosSession.mjs';
import 'axios';
import 'cookie';
import './index2.mjs';
import 'mongoose';
import './log.mjs';

const discord_get = defineEventHandler(async () => {
  const { connected } = discordBot;
  return { connected };
});

export { discord_get as default };
//# sourceMappingURL=discord.get.mjs.map
