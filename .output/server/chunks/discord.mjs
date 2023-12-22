import { d as defineEventHandler } from './nitro/node-server.mjs';
import { d as discordBot } from './index3.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'discord.js';
import './random.mjs';
import 'crypto-js/sha3.js';
import './index4.mjs';
import './index2.mjs';
import 'dotenv';
import 'crypto';
import './rollup/_commonjsHelpers.mjs';
import 'http';
import 'url';
import 'bson';
import 'timers';
import 'util';
import 'stream';
import 'events';
import 'dns';
import 'mongodb-connection-string-url';
import 'os';
import 'process';
import 'zlib';
import 'net';
import 'socks';
import 'tls';
import 'mongoose';
import './conversation.mjs';
import './message.mjs';
import 'axios';
import './streamManager.mjs';
import './search.mjs';
import 'googlethis';
import '@google/generative-ai';
import './ytCrawler.mjs';
import 'qs';

const discord = defineEventHandler(async () => {
  const { connected } = discordBot;
  return { connected };
});

export { discord as default };
//# sourceMappingURL=discord.mjs.map
