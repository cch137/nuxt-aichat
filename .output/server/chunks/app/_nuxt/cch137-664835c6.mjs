import { _ as __nuxt_component_0 } from './client-only-29ef7f45.mjs';
import { d as useState } from '../server.mjs';
import { defineComponent, reactive, ref, watch, useSSRContext } from 'vue';
import { u as useAdmin } from './useAdmin-bb9a93e6.mjs';
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
import './el-input-ac99cace.mjs';
import 'lodash-unified';
import '@vue/shared';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cch137",
  __ssrInlineRender: true,
  setup(__props) {
    const appName = useState("appName").value;
    const {
      haveAccess,
      adminPassword,
      adminSettings,
      checkAdminLogin,
      changeSetting,
      curvaUsageList,
      updateCurvaUsageList
    } = useAdmin();
    reactive({
      curvaUsageRecord: false,
      dcBot: false
    });
    ref(false);
    const analysedCurvaUsageList = reactive([]);
    watch(curvaUsageList, (value) => {
      analysedCurvaUsageList.splice(0, analysedCurvaUsageList.length);
      analysedCurvaUsageList.push(...[...new Set(value.map((item) => item.user))].map((user) => ({
        user,
        times: value.filter((i) => i.user === user).length
      })));
    });
    useTitle(`Admin - ${appName}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/cch137.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cch137-664835c6.mjs.map
