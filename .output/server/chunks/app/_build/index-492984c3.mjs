import { u as useChat, _ as __nuxt_component_0 } from './ConvMain-d8f3f6b9.mjs';
import { d as useLocale, e as useState } from '../server.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import './client-only-f67cc156.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './useAuth-91a53f8d.mjs';
import './index-e8f7e5e8.mjs';
import '@vueuse/core';
import './index-40342afc.mjs';
import 'lodash-unified';
import '@vue/shared';
import './typescript-f58cd02a.mjs';
import './use-global-config-bcc1ef91.mjs';
import './aria-30c2b077.mjs';
import 'qs';
import './index-8d90ea71.mjs';
import './use-form-item-5a5c18c7.mjs';
import '@ctrl/tinycolor';
import './index-e64e1996.mjs';
import './focus-trap-a99f19e3.mjs';
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
    useChat().resetConvConfig();
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
//# sourceMappingURL=index-492984c3.mjs.map
