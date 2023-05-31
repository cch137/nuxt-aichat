import { defineEventHandler } from 'h3';
import { v as version$1 } from './server.mjs';

const version = defineEventHandler(async () => {
  return { version: version$1 };
});

export { version as default };
//# sourceMappingURL=version.mjs.map
