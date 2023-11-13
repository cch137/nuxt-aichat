import { d as defineEventHandler } from './nitro/node-server.mjs';
import { b as analyzeLanguage } from './analyzeLanguages.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

const test = defineEventHandler(async (event) => {
  return analyzeLanguage("\u7B11\u6B7B\u6211");
});

export { test as default };
//# sourceMappingURL=test.mjs.map
