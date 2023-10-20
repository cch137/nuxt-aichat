import { d as defineEventHandler } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

const suggestions_post = defineEventHandler(async (event) => {
  return [];
});

export { suggestions_post as default };
//# sourceMappingURL=suggestions.post.mjs.map
