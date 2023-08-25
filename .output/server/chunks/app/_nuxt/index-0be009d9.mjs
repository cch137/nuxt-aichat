import { _ as __nuxt_component_0 } from './nuxt-link-26e5a74c.mjs';
import { E as ElButton } from './index-2f37e1b5.mjs';
import { b as useState } from '../server.mjs';
import { mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import 'ufo';
import './index-2fec569f.mjs';
import 'lodash-unified';
import '@vue/shared';
import '@vueuse/core';
import '@ctrl/tinycolor';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
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
    const appName = useState("appName").value;
    useTitle(`Home - ${appName}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_el_button = ElButton;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-col flex-center" }, _attrs))}><h1>${ssrInterpolate(_ctx.$t("chat.welcomeTo"))} ${ssrInterpolate(unref(appName))}</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/c/",
        class: "m-8"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_el_button, { type: "primary" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.$t("chat.newChat"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.$t("chat.newChat")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_el_button, { type: "primary" }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.$t("chat.newChat")), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-0be009d9.mjs.map
