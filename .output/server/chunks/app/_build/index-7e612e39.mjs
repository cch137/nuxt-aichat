import { _ as __nuxt_component_0 } from './ConvMain-af8d2bbf.mjs';
import { d as useLocale, e as useState } from '../server.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import './client-only-f67cc156.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './useAuth-f046bc40.mjs';
import './index-06917876.mjs';
import '@vueuse/core';
import './index-036fcace.mjs';
import 'lodash-unified';
import '@vue/shared';
import './use-global-config-65a30ca3.mjs';
import './aria-30c2b077.mjs';
import './index-d1178361.mjs';
import 'qs';
import './index-02be6721.mjs';
import './index-2b5c388d.mjs';
import './index-fa6727cb.mjs';
import '@ctrl/tinycolor';
import './focus-trap-4a5f0f0d.mjs';
import '@vue/reactivity';
import 'marked';
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
import 'cookie';
import 'vue-i18n';
import 'prismjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const i18n = useLocale();
    const _t = i18n.t;
    useTitle(`${_t("chat.newChat")} - ${useState("appName").value}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ChatbotConvMain = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "w-full grid-pattern-bg",
        style: { "min-height": "calc(100vh - 56px)" }
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ChatbotConvMain, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/c/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-7e612e39.mjs.map