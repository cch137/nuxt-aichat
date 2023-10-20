import { _ as __nuxt_component_0 } from './client-only-f67cc156.mjs';
import { useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_ClientOnly = __nuxt_component_0;
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
  _push(`<div style="${ssrRenderStyle({ "padding-top": "56px" })}" class="w-full">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
  _push(`</div><!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/chat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const chat = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { chat as default };
//# sourceMappingURL=chat-346d8cc9.mjs.map
