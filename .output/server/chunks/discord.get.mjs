import { defineEventHandler } from 'h3';
import { d as discordBot } from './index.mjs';
import 'discord.js';
import './index2.mjs';
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

const discord_get = defineEventHandler(async () => {
  const { connected } = discordBot;
  return { connected };
});

export { discord_get as default };
//# sourceMappingURL=discord.get.mjs.map
