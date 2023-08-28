import { E as ElInput, a as ElButton } from './index-2e78dcc8.mjs';
import { d as useState, g as useNuxtApp, n as navigateTo } from '../server.mjs';
import { ref, mergeProps, unref, isRef, withCtx, createTextVNode, useSSRContext } from 'vue';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { j as ElMessage } from './index-09894d98.mjs';
import '@vueuse/core';
import 'lodash-unified';
import '@vue/shared';
import '@ctrl/tinycolor';
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
import 'crypto-js/sha3.js';
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

function useAdmin() {
  async function checkIsLoggedIn(passwd) {
    if (!passwd) {
      passwd = void 0;
    }
    return (await $fetch("/api/admin/check", {
      method: "POST",
      body: { passwd }
    })).isLoggedIn;
  }
  async function adminLogout() {
    await $fetch("/api/admin/check", {
      method: "DELETE"
    });
    navigateTo("/");
  }
  return {
    checkIsLoggedIn,
    adminLogout
  };
}
const _sfc_main = {
  __name: "entrance",
  __ssrInlineRender: true,
  setup(__props) {
    const appName = useState("appName").value;
    const id = ref("");
    const { adminPassword } = useAdmin();
    const goIsLoading = ref(false);
    const entrance = () => {
      $fetch("/api/auth/replaceUser", {
        method: "POST",
        body: { password: adminPassword.value, id: id.value }
      }).then((res) => {
        if (res == null ? void 0 : res.error) {
          ElMessage.error(res == null ? void 0 : res.error);
        } else {
          useNuxtApp().$router.push("/");
        }
      }).catch((err) => {
        ElMessage.error(err);
      });
    };
    useTitle(`Entrance - ${appName}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_input = ElInput;
      const _component_el_button = ElButton;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-col flex-center gap-2" }, _attrs))}><div class="flex gap-2 my-8">`);
      _push(ssrRenderComponent(_component_el_input, {
        type: "text",
        placeholder: "id",
        modelValue: unref(id),
        "onUpdate:modelValue": ($event) => isRef(id) ? id.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(_component_el_input, {
        type: "password",
        placeholder: "password",
        modelValue: unref(adminPassword),
        "onUpdate:modelValue": ($event) => isRef(adminPassword) ? adminPassword.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(_component_el_button, {
        type: "primary",
        onClick: entrance,
        loading: unref(goIsLoading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`GO`);
          } else {
            return [
              createTextVNode("GO")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/entrance.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=entrance-11b06653.mjs.map
