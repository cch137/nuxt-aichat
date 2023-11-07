import { d as defineEventHandler } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

const test = defineEventHandler(async (event) => {
  return "OK";
});

export { test as default };
//# sourceMappingURL=test.mjs.map
