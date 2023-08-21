import { _ as __nuxt_component_0 } from './client-only-29ef7f45.mjs';
import { a as useLocale, b as useState } from '../server.mjs';
import { u as useAuth } from './useAuth-709c1d0a.mjs';
import { defineComponent, ref, reactive, useSSRContext } from 'vue';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
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
import './useChat-5060e158.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'qs';
import './index-97682a6c.mjs';
import 'lodash-unified';
import './use-form-item-11e2a50a.mjs';
import '@vue/shared';
import './index-291077d7.mjs';
import '@ctrl/tinycolor';
import './focus-trap-9fc9448e.mjs';
import '@vue/reactivity';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const i18n = useLocale();
    const _t = i18n.t;
    ref();
    reactive({
      usernameOrEmail: "",
      password: ""
    });
    reactive({
      usernameOrEmail: [
        { required: true, message: _t("auth.usernameOrEmailRequired"), trigger: "change" }
      ],
      password: [
        { required: true, message: _t("auth.passwdRequired"), trigger: "change" }
      ]
    });
    useTitle(`${_t("auth.login")} - ${useState("appName").value}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-08ccfc0d.mjs.map
