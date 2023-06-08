import { _ as __nuxt_component_0 } from './ChatCore-aedd1ba3.mjs';
import { u as useTitle } from './useTitle-dc6f5342.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { u as useState } from '../server.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import './client-only-29ef7f45.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './index-e055d37d.mjs';
import '@vueuse/core';
import 'lodash-unified';
import '@vue/shared';
import '@ctrl/tinycolor';
import '@vue/reactivity';
import 'marked';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'h3';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'ufo';
import 'cookie';
import 'vue-i18n';
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

const _sfc_main = {
  __name: "[conv]",
  __ssrInlineRender: true,
  setup(__props) {
    useTitle(`Chat - ${useState("appName").value}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ChatCore = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ChatCore, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/c/[conv].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_conv_-17640c2e.mjs.map
