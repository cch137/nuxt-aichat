import { _ as __nuxt_component_0 } from './client-only-f67cc156.mjs';
import { e as useState } from '../server.mjs';
import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    ref(false);
    ref(false);
    ref("google");
    ref(["google", "duckduckgo", "all"]);
    const appName = useState("appName").value;
    useTitle(`Admin - ${appName}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-col flex-center gap-2" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-19cd1f5b.mjs.map
