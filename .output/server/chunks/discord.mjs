import { defineEventHandler } from 'h3';
import { d as discordBot } from './index.mjs';
import 'discord.js';
import './ytCrawler.mjs';
import 'qs';
import 'axios';
import './ytLinks.mjs';
import './str.mjs';

const discord = defineEventHandler(async () => {
  const { connected } = discordBot;
  return { connected };
});

export { discord as default };
//# sourceMappingURL=discord.mjs.map
