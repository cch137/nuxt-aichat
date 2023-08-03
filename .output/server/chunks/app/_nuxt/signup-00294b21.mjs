import { _ as __nuxt_component_0 } from './client-only-29ef7f45.mjs';
import { j as useLocale, b as useState } from '../server.mjs';
import { u as useAuth } from './useAuth-c245033d.mjs';
import { defineComponent, ref, reactive, useSSRContext } from 'vue';
import { u as useTitle } from './useTitle-90f4e537.mjs';
import { ssrRenderComponent } from 'vue/server-renderer';
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
import './useChat-8f888e91.mjs';
import './el-input-45f4404e.mjs';
import 'lodash-unified';
import '@vue/shared';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'qs';
import './index-edb7ea74.mjs';
import '@ctrl/tinycolor';
import '@vue/reactivity';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "signup",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const i18n = useLocale();
    const _t = i18n.t;
    ref(false);
    ref(0);
    ref();
    reactive({
      email: "",
      username: "",
      password: "",
      veriCode: ""
    });
    reactive({
      email: [
        { required: true, message: _t("auth.emailRequired"), trigger: "change" },
        { type: "email", message: _t("auth.emailInvalid"), trigger: "change" }
      ],
      username: [
        { required: true, message: _t("auth.usernameRequired"), trigger: "change" },
        { min: 5, max: 32, message: _t("auth.usernameLength"), trigger: "change" }
      ],
      password: [
        { required: true, message: _t("auth.passwdRequired"), trigger: "change" },
        { min: 8, max: 64, message: _t("auth.passwdLength"), trigger: "change" }
      ],
      veriCode: [
        { required: true, message: _t("auth.veriCodeRequired"), trigger: "change" },
        { min: 6, max: 6, message: _t("auth.veriCodeRequired"), trigger: "change" }
      ]
    });
    useTitle(`${_t("auth.signup")} - ${useState("appName").value}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/signup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=signup-00294b21.mjs.map
