import { _ as __nuxt_component_0$1 } from './client-only-29ef7f45.mjs';
import { d as useHead, a as useUniCookie, b as useNuxtApp } from '../server.mjs';
import { ref, useSSRContext, watch } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { marked } from 'marked';

const webBrowsing = "web-browsing";
const CONTEXT_MAX_LENGTH = 2048;
const contexts = [];
const checkContext = () => {
  while (contexts.length > 1 && contexts.slice(1, contexts.length).join("").length > CONTEXT_MAX_LENGTH) {
    contexts.shift();
  }
};
const getContext = () => {
  checkContext();
  const joinedContexts = [...contexts].reverse().join("\n---\n");
  if (joinedContexts.length === 0) {
    return "";
  }
  return `Here are your replies, from newest to oldest:
${joinedContexts}`.substring(0, CONTEXT_MAX_LENGTH);
};
const addContext = (...texts) => {
  contexts.push(...texts);
  checkContext();
};
const clearContext = () => {
  contexts.splice(0, contexts.length);
};
const allowedWebBrowsingModes = ["OFF", "BASIC", "ADVANCED"];
const DEFAULT_WEB_BROWSING_MODE = "BASIC";
const webBrowsingMode = ref(DEFAULT_WEB_BROWSING_MODE);
const messages = ref([]);
const conversations = ref([]);
const context = {
  add: addContext,
  get: getContext,
  clear: clearContext
};
function useChat() {
  const cookie = useUniCookie();
  const previousWebBrowsingMode = cookie.get(webBrowsing);
  if (allowedWebBrowsingModes.includes(previousWebBrowsingMode)) {
    webBrowsingMode.value = previousWebBrowsingMode;
  }
  watch(webBrowsingMode, (newValue) => {
    if (typeof newValue === "string") {
      cookie.set(webBrowsing, newValue, {
        path: "/"
      });
    }
  });
  const nuxtApp = useNuxtApp();
  const getCurrentConvId = () => {
    var _a, _b;
    return (_b = (_a = nuxtApp._route) == null ? void 0 : _a.params) == null ? void 0 : _b.conv;
  };
  return {
    conversations,
    messages,
    context,
    webBrowsingMode,
    getCurrentConvId
  };
}
const _sfc_main = {
  __name: "ChatCore",
  __ssrInlineRender: true,
  setup(__props) {
    useChat();
    marked.setOptions({ headerIds: false, mangle: false });
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
//# sourceMappingURL=useTitle-18bdbb22.mjs.map
