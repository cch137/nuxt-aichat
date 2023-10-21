import { _ as __nuxt_component_0 } from './client-only-f67cc156.mjs';
import { _ as _export_sfc, e as useState } from '../server.mjs';
import { useSSRContext, defineComponent, ref, mergeProps } from 'vue';
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
  __name: "ls",
  __ssrInlineRender: true,
  setup(__props) {
    ref("");
    ref([]);
    ref([]);
    ref(false);
    const appName = useState("appName");
    useTitle(`LS - ${appName.value}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8 flex-col gap-4 flex-center" }, _attrs))} data-v-8484fbc1>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/ls.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ls = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8484fbc1"]]);

export { ls as default };
//# sourceMappingURL=ls-99f423d6.mjs.map
