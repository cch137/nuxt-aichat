import { x as defineNuxtRouteMiddleware } from '../server.mjs';
import 'vue';
import '../../nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';
import 'cookie';
import 'vue-i18n';
import 'crypto-js/sha3.js';
import 'prismjs';
import 'vue/server-renderer';

const onlyNoAuth = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
});

export { onlyNoAuth as default };
//# sourceMappingURL=onlyNoAuth-b16bdc29.mjs.map
