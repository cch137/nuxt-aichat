import { defineEventHandler } from 'h3';
import { d as discordBot } from './index.mjs';
import 'discord.js';
import './random.mjs';
import 'crypto-js/sha3.js';
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
import 'crypto-js/md5.js';
import 'sequelize';
import './createAxiosSession.mjs';
import 'axios';
import 'cookie';
import 'gpt-3-encoder';
import 'googlethis';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import './ytCrawler.mjs';
import 'qs';

const discord = defineEventHandler(async () => {
  const { connected } = discordBot;
  return { connected };
});

export { discord as default };
//# sourceMappingURL=discord.mjs.map
