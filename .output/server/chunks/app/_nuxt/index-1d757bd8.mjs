import { _ as __nuxt_component_0 } from './ConvMain-4333e4ea.mjs';
import { u as useTitle } from './useTitle-90f4e537.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { d as useState } from '../server.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import './client-only-29ef7f45.mjs';
import './useChat-17814581.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'qs';
import './index-5d71dbaa.mjs';
import '@vueuse/core';
import 'lodash-unified';
import '@vue/shared';
import './index-57c1ada1.mjs';
import '@ctrl/tinycolor';
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
    useTitle(`New Chat - ${useState("appName").value}`);
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
//# sourceMappingURL=index-1d757bd8.mjs.map
