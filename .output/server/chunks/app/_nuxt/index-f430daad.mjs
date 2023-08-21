import { _ as __nuxt_component_0 } from './ConvMain-fe158017.mjs';
import { a as useLocale, b as useState } from '../server.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import './client-only-29ef7f45.mjs';
import './useChat-6f838a27.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'qs';
import './index-97682a6c.mjs';
import '@vueuse/core';
import 'lodash-unified';
import './use-form-item-11e2a50a.mjs';
import '@vue/shared';
import './index-291077d7.mjs';
import '@ctrl/tinycolor';
import './focus-trap-9fc9448e.mjs';
import '@vue/reactivity';
import 'marked';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'cookie';
import 'vue-i18n';
import 'prismjs';
import 'defu';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'http-graceful-shutdown';

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
//# sourceMappingURL=index-f430daad.mjs.map
