import { defineEventHandler } from 'h3';
import { c as checkPassword } from './checkPassword.mjs';
import { a as admin } from './index.mjs';
import 'cookie';
import './index2.mjs';
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
import 'mongoose';
import './search.mjs';
import 'googlethis';
import 'axios';

const searchEngine_get = defineEventHandler(async function(event) {
  let isLoggedIn = await checkPassword(event);
  if (!isLoggedIn) {
    return { error: "Not Logged In" };
  }
  return { value: admin.searchEngineConfig.value };
});

export { searchEngine_get as default };
//# sourceMappingURL=search-engine.get.mjs.map
