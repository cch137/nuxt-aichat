import { _ as __nuxt_component_0 } from './nuxt-link-c659c711.mjs';
import { mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { _ as _export_sfc, e as useState } from '../server.mjs';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const appName = useState("appName").value;
    useTitle(`${appName}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8 flex-col flex-center" }, _attrs))} data-v-5d996a62><h1 class="welcome" data-v-5d996a62>${ssrInterpolate(_ctx.$t("chat.welcomeTo"))} ${ssrInterpolate(unref(appName))}</h1><div class="flex-center flex-wrap mt-16 gap-8" data-v-5d996a62>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/c/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-outer" data-v-5d996a62${_scopeId}><div class="card-inner flex-center" data-v-5d996a62${_scopeId}>${ssrInterpolate(_ctx.$t("page.aiChat"))}</div></div>`);
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
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5d996a62"]]);

export { index as default };
//# sourceMappingURL=index-cfb10db6.mjs.map
