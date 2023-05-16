import { _ as __nuxt_component_0$1 } from './client-only-29ef7f45.mjs';
import { useSSRContext, ref } from 'vue';
import { a as useState } from '../server.mjs';
import { ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = {
  __name: "ChatCore",
  __ssrInlineRender: true,
  setup(__props) {
    const loadingDots = ref(".");
    setInterval(() => {
      if (loadingDots.value.length < 4) {
        loadingDots.value += ".";
      } else {
        loadingDots.value = ".";
      }
    }, 500);
    useState("messages", () => []);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatCore.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main;

export { __nuxt_component_0 as _ };
//# sourceMappingURL=ChatCore-14cdd898.mjs.map
