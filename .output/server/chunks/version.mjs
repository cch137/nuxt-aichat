import { defineEventHandler } from 'h3';

const version$1 = process.env.npm_package_version;

const version = defineEventHandler(async () => {
  return { version: version$1 };
});

export { version as default };
//# sourceMappingURL=version.mjs.map
