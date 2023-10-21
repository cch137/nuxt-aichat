import { d as defineEventHandler } from './nitro/node-server.mjs';
import { v as version$1 } from './server.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

const version = defineEventHandler(async () => {
  return { version: version$1 };
});

export { version as default };
//# sourceMappingURL=version.mjs.map
