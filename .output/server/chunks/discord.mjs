import { defineEventHandler } from 'h3';
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

const discord = defineEventHandler(async () => {
  const { connected } = discordBot;
  return { connected };
});

export { discord as default };
//# sourceMappingURL=discord.mjs.map
