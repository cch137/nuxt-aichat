import { defineEventHandler, readBody } from 'h3';
import { d as discordBot } from './index3.mjs';
import { c as checkPassword } from './checkPassword.mjs';
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
import 'fs';
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
import './ytCrawler.mjs';
import 'qs';
import 'cookie';

function getSettings() {
  return {
    dcBotConnected: discordBot.connected
  };
}

const setting_post = defineEventHandler(async function(event) {
  if (!await checkPassword(event)) {
    return null;
  }
  const body = await readBody(event);
  const name = body.name;
  const value = body.value;
  switch (name) {
    case "dcBot":
      if (value) {
        await discordBot.connect();
      } else {
        await discordBot.disconnect();
      }
      break;
  }
  return getSettings();
});

export { setting_post as default };
//# sourceMappingURL=setting.post.mjs.map
