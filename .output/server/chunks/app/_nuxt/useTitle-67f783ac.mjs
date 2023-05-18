import { _ as __nuxt_component_0$1 } from './client-only-29ef7f45.mjs';
import { a as useHead, u as useState } from '../server.mjs';
import { useSSRContext, ref } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { marked } from 'marked';

const _sfc_main = {
  __name: "ChatCore",
  __ssrInlineRender: true,
  setup(__props) {
    marked.setOptions({ headerIds: false, mangle: false });
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
function useTitle(title) {
  useHead({
    title,
    meta: [
      { property: "og:title", content: title },
      { property: "twitter:title", content: title }
    ]
  });
}

export { __nuxt_component_0 as _, useTitle as u };
//# sourceMappingURL=useTitle-67f783ac.mjs.map
