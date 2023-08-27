import { _ as __nuxt_component_0 } from './nuxt-link-744fccd2.mjs';
import { mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { _ as _export_sfc, d as useState } from '../server.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import 'ufo';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import '@vueuse/core';
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
    const appName = useState("appName").value;
    useTitle(`Home - ${appName}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8 flex-col flex-center" }, _attrs))} data-v-a776b2ae><h1 class="welcome" data-v-a776b2ae>${ssrInterpolate(_ctx.$t("chat.welcomeTo"))} ${ssrInterpolate(unref(appName))}</h1><div class="flex-center flex-wrap mt-16 gap-8" data-v-a776b2ae>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/c/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-outer" data-v-a776b2ae${_scopeId}><div class="card-inner flex-center" data-v-a776b2ae${_scopeId}>${ssrInterpolate(_ctx.$t("page.aiChat"))}</div></div>`);
          } else {
            return [
              createVNode("div", { class: "card-outer" }, [
                createVNode("div", { class: "card-inner flex-center" }, toDisplayString(_ctx.$t("page.aiChat")), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/coder/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-outer" data-v-a776b2ae${_scopeId}><div class="card-inner flex-center" data-v-a776b2ae${_scopeId}>${ssrInterpolate(_ctx.$t("page.coder"))}</div></div>`);
          } else {
            return [
              createVNode("div", { class: "card-outer" }, [
                createVNode("div", { class: "card-inner flex-center" }, toDisplayString(_ctx.$t("page.coder")), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a776b2ae"]]);

export { index as default };
//# sourceMappingURL=index-429d52b4.mjs.map
