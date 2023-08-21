import { _ as __nuxt_component_0$1 } from './client-only-29ef7f45.mjs';
import { useSSRContext, reactive, watch, ref } from 'vue';
import { u as useChat } from './useChat-5060e158.mjs';
import { ssrRenderComponent } from 'vue/server-renderer';
import { marked } from 'marked';

const _sfc_main = {
  __name: "ConvMain",
  __ssrInlineRender: true,
  setup(__props) {
    const { showScrollToBottomButton, messages, openSidebarController, callEditMessageDialog, sendMessage, deleteMessage, regenerateMessage, focusInput } = useChat();
    marked.setOptions({ headerIds: false, mangle: false });
    const more = reactive({
      start: 0,
      end: 3,
      step: 3,
      run(maxLength = 8) {
        if (more.end >= maxLength) {
          more.reset();
        } else {
          more.start += more.step;
          more.end += more.step;
        }
      },
      reset() {
        more.start = 0;
        more.end = more.step;
      }
    });
    watch(messages, () => more.reset());
    const loadingDots = ref(".");
    setInterval(() => {
      if (loadingDots.value.length < 4) {
        loadingDots.value += ".";
      } else {
        loadingDots.value = ".";
      }
    }, 500);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Chatbot/ConvMain.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main;

export { __nuxt_component_0 as _ };
//# sourceMappingURL=ConvMain-3211e855.mjs.map
