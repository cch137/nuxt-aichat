import { _ as __nuxt_component_0 } from './client-only-29ef7f45.mjs';
import { a as useState, u as useUniCookie } from '../server.mjs';
import { ref, useSSRContext } from 'vue';
import { u as useTitle } from './useTitle-8d70f262.mjs';
import { ssrRenderComponent } from 'vue/server-renderer';
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
import '@vueuse/core';
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

const haveAccess = ref(false);
const adminPassword = ref("");
const adminPasswordCookieName = "m";
const dcBotConnected = ref(false);
const mdbConnectMethod = ref("");
function useAdmin() {
  const cookie = useUniCookie();
  adminPassword.value = cookie.get(adminPasswordCookieName) || "";
  const savePassword = () => {
    cookie.set(adminPasswordCookieName, adminPassword.value, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true
    });
  };
  const adminAction = (action, loading) => {
    if (loading) {
      loading.value = true;
    }
    savePassword();
    $fetch("/api/admin", {
      method: "POST",
      body: {
        passwd: adminPassword.value,
        action
      }
    }).then((res) => {
      haveAccess.value = Boolean(res == null ? void 0 : res.pass);
      if (res === null) {
        return;
      }
      dcBotConnected.value = res.dcBotConnected;
      mdbConnectMethod.value = res.mdbConnectMethod;
    }).finally(() => {
      if (loading) {
        loading.value = false;
      }
    });
  };
  return {
    haveAccess,
    dcBotConnected,
    mdbConnectMethod,
    adminAction,
    password: adminPassword
  };
}
const _sfc_main = {
  __name: "cch137",
  __ssrInlineRender: true,
  setup(__props) {
    const appName = useState("appName").value;
    useAdmin();
    ref(false);
    ref(false);
    useTitle(`Admin - ${appName}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/cch137.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cch137-9760f2f4.mjs.map
