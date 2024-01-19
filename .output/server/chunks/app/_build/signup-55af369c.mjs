import { _ as __nuxt_component_0 } from './client-only-f67cc156.mjs';
import { d as useLocale, e as useState } from '../server.mjs';
import { u as useAuth } from './useAuth-91a53f8d.mjs';
import { defineComponent, ref, reactive, useSSRContext } from 'vue';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
import './index-e8f7e5e8.mjs';
import './index-40342afc.mjs';
import 'lodash-unified';
import '@vue/shared';
import './typescript-f58cd02a.mjs';
import './use-global-config-bcc1ef91.mjs';
import './aria-30c2b077.mjs';

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
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
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
//# sourceMappingURL=signup-55af369c.mjs.map
