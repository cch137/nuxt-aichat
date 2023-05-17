import { defineEventHandler } from 'h3';
import { v as version$1 } from './package.mjs';

const version = defineEventHandler(async (event) => {
  return version$1;
});

export { version as default };
//# sourceMappingURL=version.mjs.map
