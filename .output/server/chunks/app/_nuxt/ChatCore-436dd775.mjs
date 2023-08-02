import { _ as __nuxt_component_0$1 } from './client-only-29ef7f45.mjs';
import { useSSRContext, ref, reactive, watch } from 'vue';
import { u as useChat, a as useScrollToBottom, i as isScrolledToBottom } from './useChat-1300213f.mjs';
import { ssrRenderComponent } from 'vue/server-renderer';
import { marked } from 'marked';

const _sfc_main = {
  __name: "ChatCore",
  __ssrInlineRender: true,
  setup(__props) {
    const showScrollToBottomButton = ref(true);
    function scrollToBottomOnclick() {
      useScrollToBottom().then(() => {
        if (isScrolledToBottom()) {
          showScrollToBottomButton.value = false;
        }
      });
    }
    scrollToBottomOnclick();
    const { messages, openSidebar, sendMessage, deleteMessage, regenerateMessage } = useChat();
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatCore.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main;

export { __nuxt_component_0 as _ };
//# sourceMappingURL=ChatCore-436dd775.mjs.map
