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
import 'crypto';
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
import 'http';
import 'mongoose';
import './str.mjs';
import './crawler.mjs';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import 'googlethis';
import './message.mjs';
import './deleteConversation.mjs';

const discord = defineEventHandler(async () => {
  const { connected } = discordBot;
  return { connected };
});

export { discord as default };
//# sourceMappingURL=discord.mjs.map
