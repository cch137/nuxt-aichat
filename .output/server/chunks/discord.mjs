import { defineEventHandler } from 'h3';
import { d as discordBot } from './index.mjs';
import 'discord.js';

const discord = defineEventHandler(async () => {
  const { connected } = discordBot;
  return { connected };
});

export { discord as default };
//# sourceMappingURL=discord.mjs.map
