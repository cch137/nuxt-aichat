import { E as ElButton } from './index-8d90ea71.mjs';
import { _ as _export_sfc, e as useState } from '../server.mjs';
import { useSSRContext, defineComponent, ref, mergeProps, unref, withCtx, createVNode } from 'vue';
import { u as useTitle } from './useTitle-685fa114.mjs';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import formatDate from '@cch137/utils/format/date.js';
import './index-40342afc.mjs';
import 'lodash-unified';
import '@vue/shared';
import '@vueuse/core';
import './use-global-config-bcc1ef91.mjs';
import './use-form-item-5a5c18c7.mjs';
import '@ctrl/tinycolor';
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
import 'cookie';
import 'vue-i18n';
import 'crypto-js/sha3.js';
import 'prismjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "updating",
  __ssrInlineRender: true,
  setup(__props) {
    const appName = useState("appName").value;
    const endDate = new Date(2024, 0, 21, 0, 0, 0, 0).getTime();
    const remaind = ref("...");
    setInterval(() => {
      const remaindDate = new Date(endDate - Date.now());
      const [dd, HH, mm, ss] = formatDate(remaindDate, "dd:HH:mm:ss").split(":");
      remaind.value = `${dd}d ${HH}h ${mm}m ${ss}s`;
    }, 1e3);
    useTitle(`Coming Soon... | ${appName}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ElButton = ElButton;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "w-screen h-screen flex-center flex-col gap-8 select-none bg-black text-gray-400" }, _attrs))} data-v-6b118e99><div class="text-6xl text-center" style="${ssrRenderStyle({ "letter-spacing": "4px", "line-height": "4rem" })}" data-v-6b118e99> COMING SOON </div><div class="cd text-4xl text-gray-600" data-v-6b118e99>${ssrInterpolate(unref(remaind))}</div><div class="flex-center mt-16" data-v-6b118e99><a href="https://discord.gg/5v49JKKmzJ" target="_blank" data-v-6b118e99>`);
      _push(ssrRenderComponent(_component_ElButton, {
        color: "#424acf",
        size: "large"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-lg" data-v-6b118e99${_scopeId}>Join Our Discord</span>`);
          } else {
            return [
              createVNode("span", { class: "text-lg" }, "Join Our Discord")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</a></div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/updating.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const updating = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6b118e99"]]);

export { updating as default };
//# sourceMappingURL=updating-7d665302.mjs.map
