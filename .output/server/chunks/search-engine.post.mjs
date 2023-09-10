import { defineEventHandler, readBody } from 'h3';
import { c as checkPassword } from './checkPassword.mjs';
import { a as admin } from './index.mjs';
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

const searchEngine_post = defineEventHandler(async function(event) {
  var _a;
  let isLoggedIn = await checkPassword(event);
  if (!isLoggedIn) {
    return { error: "Not Logged In" };
  }
  try {
    admin.searchEngineConfig.value = (_a = await readBody(event)) == null ? void 0 : _a.value;
    return {};
  } catch (error) {
    return { error };
  }
});

export { searchEngine_post as default };
//# sourceMappingURL=search-engine.post.mjs.map
