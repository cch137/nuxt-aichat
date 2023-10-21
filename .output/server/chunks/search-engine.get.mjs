import { d as defineEventHandler } from './nitro/node-server.mjs';
import { c as checkPassword } from './checkPassword.mjs';
import { a as admin } from './index.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'cookie';
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

const searchEngine_get = defineEventHandler(async function(event) {
  let isLoggedIn = await checkPassword(event);
  if (!isLoggedIn) {
    return { error: "Not Logged In" };
  }
  return { value: admin.searchEngineConfig.value };
});

export { searchEngine_get as default };
//# sourceMappingURL=search-engine.get.mjs.map
