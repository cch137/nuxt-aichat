import { _ as __nuxt_component_0$1 } from './client-only-29ef7f45.mjs';
import { d as useHead, a as useUniCookie, b as useNuxtApp, u as useState, n as navigateTo } from '../server.mjs';
import { E as ElMessage, g as getStyle, a as addClass, r as removeClass, u as useGlobalComponentSettings } from './el-button-ad5509c0.mjs';
import { ref, useSSRContext, watch, nextTick, reactive, createApp, toRefs, isRef, defineComponent, h, Transition, withCtx, withDirectives, createVNode, vShow } from 'vue';
import { isClient } from '@vueuse/core';
import { isString, isObject, hyphenate } from '@vue/shared';
import { ssrRenderComponent } from 'vue/server-renderer';
import { marked } from 'marked';

function createLoadingComponent(options) {
  let afterLeaveTimer;
  const afterLeaveFlag = ref(false);
  const data = reactive({
    ...options,
    originalPosition: "",
    originalOverflow: "",
    visible: false
  });
  function setText(text) {
    data.text = text;
  }
  function destroySelf() {
    const target = data.parent;
    const ns = vm.ns;
    if (!target.vLoadingAddClassList) {
      let loadingNumber = target.getAttribute("loading-number");
      loadingNumber = Number.parseInt(loadingNumber) - 1;
      if (!loadingNumber) {
        removeClass(target, ns.bm("parent", "relative"));
        target.removeAttribute("loading-number");
      } else {
        target.setAttribute("loading-number", loadingNumber.toString());
      }
      removeClass(target, ns.bm("parent", "hidden"));
    }
    removeElLoadingChild();
    loadingInstance.unmount();
  }
  function removeElLoadingChild() {
    var _a, _b;
    (_b = (_a = vm.$el) == null ? void 0 : _a.parentNode) == null ? void 0 : _b.removeChild(vm.$el);
  }
  function close() {
    var _a;
    if (options.beforeClose && !options.beforeClose())
      return;
    afterLeaveFlag.value = true;
    clearTimeout(afterLeaveTimer);
    afterLeaveTimer = window.setTimeout(handleAfterLeave, 400);
    data.visible = false;
    (_a = options.closed) == null ? void 0 : _a.call(options);
  }
  function handleAfterLeave() {
    if (!afterLeaveFlag.value)
      return;
    const target = data.parent;
    afterLeaveFlag.value = false;
    target.vLoadingAddClassList = void 0;
    destroySelf();
  }
  const elLoadingComponent = /* @__PURE__ */ defineComponent({
    name: "ElLoading",
    setup(_, { expose }) {
      const { ns, zIndex } = useGlobalComponentSettings("loading");
      expose({
        ns,
        zIndex
      });
      return () => {
        const svg = data.spinner || data.svg;
        const spinner = h("svg", {
          class: "circular",
          viewBox: data.svgViewBox ? data.svgViewBox : "0 0 50 50",
          ...svg ? { innerHTML: svg } : {}
        }, [
          h("circle", {
            class: "path",
            cx: "25",
            cy: "25",
            r: "20",
            fill: "none"
          })
        ]);
        const spinnerText = data.text ? h("p", { class: ns.b("text") }, [data.text]) : void 0;
        return h(Transition, {
          name: ns.b("fade"),
          onAfterLeave: handleAfterLeave
        }, {
          default: withCtx(() => [
            withDirectives(createVNode("div", {
              style: {
                backgroundColor: data.background || ""
              },
              class: [
                ns.b("mask"),
                data.customClass,
                data.fullscreen ? "is-fullscreen" : ""
              ]
            }, [
              h("div", {
                class: ns.b("spinner")
              }, [spinner, spinnerText])
            ]), [[vShow, data.visible]])
          ])
        });
      };
    }
  });
  const loadingInstance = createApp(elLoadingComponent);
  const vm = loadingInstance.mount(document.createElement("div"));
  return {
    ...toRefs(data),
    setText,
    removeElLoadingChild,
    close,
    handleAfterLeave,
    vm,
    get $el() {
      return vm.$el;
    }
  };
}
let fullscreenInstance = void 0;
const Loading = function(options = {}) {
  if (!isClient)
    return void 0;
  const resolved = resolveOptions(options);
  if (resolved.fullscreen && fullscreenInstance) {
    return fullscreenInstance;
  }
  const instance = createLoadingComponent({
    ...resolved,
    closed: () => {
      var _a;
      (_a = resolved.closed) == null ? void 0 : _a.call(resolved);
      if (resolved.fullscreen)
        fullscreenInstance = void 0;
    }
  });
  addStyle(resolved, resolved.parent, instance);
  addClassList(resolved, resolved.parent, instance);
  resolved.parent.vLoadingAddClassList = () => addClassList(resolved, resolved.parent, instance);
  let loadingNumber = resolved.parent.getAttribute("loading-number");
  if (!loadingNumber) {
    loadingNumber = "1";
  } else {
    loadingNumber = `${Number.parseInt(loadingNumber) + 1}`;
  }
  resolved.parent.setAttribute("loading-number", loadingNumber);
  resolved.parent.appendChild(instance.$el);
  nextTick(() => instance.visible.value = resolved.visible);
  if (resolved.fullscreen) {
    fullscreenInstance = instance;
  }
  return instance;
};
const resolveOptions = (options) => {
  var _a, _b, _c, _d;
  let target;
  if (isString(options.target)) {
    target = (_a = document.querySelector(options.target)) != null ? _a : document.body;
  } else {
    target = options.target || document.body;
  }
  return {
    parent: target === document.body || options.body ? document.body : target,
    background: options.background || "",
    svg: options.svg || "",
    svgViewBox: options.svgViewBox || "",
    spinner: options.spinner || false,
    text: options.text || "",
    fullscreen: target === document.body && ((_b = options.fullscreen) != null ? _b : true),
    lock: (_c = options.lock) != null ? _c : false,
    customClass: options.customClass || "",
    visible: (_d = options.visible) != null ? _d : true,
    target
  };
};
const addStyle = async (options, parent, instance) => {
  const { nextZIndex } = instance.vm.zIndex;
  const maskStyle = {};
  if (options.fullscreen) {
    instance.originalPosition.value = getStyle(document.body, "position");
    instance.originalOverflow.value = getStyle(document.body, "overflow");
    maskStyle.zIndex = nextZIndex();
  } else if (options.parent === document.body) {
    instance.originalPosition.value = getStyle(document.body, "position");
    await nextTick();
    for (const property of ["top", "left"]) {
      const scroll = property === "top" ? "scrollTop" : "scrollLeft";
      maskStyle[property] = `${options.target.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] - Number.parseInt(getStyle(document.body, `margin-${property}`), 10)}px`;
    }
    for (const property of ["height", "width"]) {
      maskStyle[property] = `${options.target.getBoundingClientRect()[property]}px`;
    }
  } else {
    instance.originalPosition.value = getStyle(parent, "position");
  }
  for (const [key, value] of Object.entries(maskStyle)) {
    instance.$el.style[key] = value;
  }
};
const addClassList = (options, parent, instance) => {
  const ns = instance.vm.ns;
  if (!["absolute", "fixed", "sticky"].includes(instance.originalPosition.value)) {
    addClass(parent, ns.bm("parent", "relative"));
  } else {
    removeClass(parent, ns.bm("parent", "relative"));
  }
  if (options.fullscreen && options.lock) {
    addClass(parent, ns.bm("parent", "hidden"));
  } else {
    removeClass(parent, ns.bm("parent", "hidden"));
  }
};
const INSTANCE_KEY = Symbol("ElLoading");
const createInstance = (el, binding) => {
  var _a, _b, _c, _d;
  const vm = binding.instance;
  const getBindingProp = (key) => isObject(binding.value) ? binding.value[key] : void 0;
  const resolveExpression = (key) => {
    const data = isString(key) && (vm == null ? void 0 : vm[key]) || key;
    if (data)
      return ref(data);
    else
      return data;
  };
  const getProp = (name) => resolveExpression(getBindingProp(name) || el.getAttribute(`element-loading-${hyphenate(name)}`));
  const fullscreen = (_a = getBindingProp("fullscreen")) != null ? _a : binding.modifiers.fullscreen;
  const options = {
    text: getProp("text"),
    svg: getProp("svg"),
    svgViewBox: getProp("svgViewBox"),
    spinner: getProp("spinner"),
    background: getProp("background"),
    customClass: getProp("customClass"),
    fullscreen,
    target: (_b = getBindingProp("target")) != null ? _b : fullscreen ? void 0 : el,
    body: (_c = getBindingProp("body")) != null ? _c : binding.modifiers.body,
    lock: (_d = getBindingProp("lock")) != null ? _d : binding.modifiers.lock
  };
  el[INSTANCE_KEY] = {
    options,
    instance: Loading(options)
  };
};
const updateOptions = (newOptions, originalOptions) => {
  for (const key of Object.keys(originalOptions)) {
    if (isRef(originalOptions[key]))
      originalOptions[key].value = newOptions[key];
  }
};
const vLoading = {
  mounted(el, binding) {
    if (binding.value) {
      createInstance(el, binding);
    }
  },
  updated(el, binding) {
    const instance = el[INSTANCE_KEY];
    if (binding.oldValue !== binding.value) {
      if (binding.value && !binding.oldValue) {
        createInstance(el, binding);
      } else if (binding.value && binding.oldValue) {
        if (isObject(binding.value))
          updateOptions(binding.value, instance.options);
      } else {
        instance == null ? void 0 : instance.instance.close();
      }
    }
  },
  unmounted(el) {
    var _a;
    (_a = el[INSTANCE_KEY]) == null ? void 0 : _a.instance.close();
  }
};
const ElLoading = {
  install(app) {
    app.directive("loading", vLoading);
    app.config.globalProperties.$loading = Loading;
  },
  directive: vLoading,
  service: Loading
};
const webBrowsing = "web-browsing";
const temperatureSuffix$1 = "temperature-suffix";
const str = (obj) => {
  if ((obj == null ? void 0 : obj.toString) === void 0) {
    return "";
  } else {
    return obj.toString();
  }
};
const lower = (o) => {
  return str(o).toLowerCase();
};
const BASE2_CHARSET = "01";
const BASE10_CHARSET = "0123456789";
const BASE16_CHARSET = "0123456789abcdef";
const BASE36_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";
const BASE62_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE64_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const BASE64WEB_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const getCharset = (radix) => {
  if (typeof radix !== "string") {
    radix = lower(radix);
  }
  switch (radix) {
    case "2":
      return BASE2_CHARSET;
    case "10":
      return BASE10_CHARSET;
    case "16":
      return BASE16_CHARSET;
    case "36":
      return BASE36_CHARSET;
    case "62":
      return BASE62_CHARSET;
    case "64":
      return BASE64_CHARSET;
    case "64w":
    case "64+":
      return BASE64WEB_CHARSET;
    default:
      return radix;
  }
};
const convert = (value, fromCharset, toCharset, minLen = 0) => {
  if (typeof value !== "string") {
    value = str(value);
  }
  let decimalValue = 0;
  if (+fromCharset === 10) {
    decimalValue = +Number(value);
  } else if (+fromCharset < 37) {
    decimalValue = parseInt(value, +fromCharset);
  } else {
    fromCharset = getCharset(fromCharset);
    const baseFrom = fromCharset.length;
    for (let i = 0; i < value.length; i++) {
      decimalValue += fromCharset.indexOf(value[i]) * Math.pow(baseFrom, value.length - 1 - i);
    }
  }
  let result = "";
  if (+toCharset < 37) {
    result = decimalValue.toString(+toCharset);
    if (minLen <= 1) {
      return result;
    }
  }
  toCharset = getCharset(toCharset);
  if (result === "") {
    const baseTo = toCharset.length;
    while (decimalValue > 0) {
      result = toCharset.charAt(decimalValue % baseTo) + result;
      decimalValue = Math.floor(decimalValue / baseTo);
    }
  }
  return (result === "" ? toCharset.charAt(0) : result).padStart(minLen, toCharset[0]);
};
const textToBase64 = (text) => {
  const input = text.split("").map((c) => c.charCodeAt(0));
  const output = [];
  let i = 0;
  while (i < input.length) {
    const [char1, char2 = 0, char3 = 0] = input.slice(i, i += 3);
    const triplet = (char1 << 16) + (char2 << 8) + char3;
    const char4 = triplet >> 18;
    const char5 = triplet >> 12 & 63;
    const char6 = triplet >> 6 & 63;
    const char7 = triplet & 63;
    output.push(BASE64_CHARSET[char4], BASE64_CHARSET[char5], BASE64_CHARSET[char6], BASE64_CHARSET[char7]);
  }
  const paddingLength = input.length % 3;
  return output.join("").slice(0, 1 + output.length - paddingLength) + (paddingLength === 2 ? "==" : paddingLength === 1 ? "=" : "");
};
const secureBase64RegEx = /[^A-Za-z0-9+/]/g;
const secureBase64 = (str2) => str2.replace(secureBase64RegEx, "");
const fromCharCode = (str2) => String.fromCharCode(+str2);
const base64ToText = (str2) => {
  const input = secureBase64(str2).split("");
  const output = [];
  let i = 0;
  while (i < input.length) {
    const [char1, char2, char3, char4] = input.slice(i, i += 4).map((l) => BASE64_CHARSET.indexOf(l));
    output.push(fromCharCode(char1 << 2 | char2 >> 4));
    if (char3 !== 64) {
      output.push(fromCharCode((char2 & 15) << 4 | char3 >> 2));
    }
    if (char4 !== 64) {
      output.push(fromCharCode((char3 & 3) << 6 | char4));
    }
  }
  return output.join("").replaceAll("\0", "");
};
const baseConverter = {
  BASE2_CHARSET,
  BASE10_CHARSET,
  BASE16_CHARSET,
  BASE36_CHARSET,
  BASE62_CHARSET,
  BASE64_CHARSET,
  BASE64WEB_CHARSET,
  convert,
  getCharset,
  secureBase64,
  textToBase64,
  base64ToText
};
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
const allowedWebBrowsingModes = ["OFF", "BASIC"];
const DEFAULT_WEB_BROWSING_MODE = "BASIC";
const webBrowsingMode = ref(DEFAULT_WEB_BROWSING_MODE);
const messages = ref([]);
const conversations = ref([]);
const context = {
  add: addContext,
  get: getContext,
  clear: clearContext
};
const currentConv = ref("");
const focusInput = () => {
  document.querySelector(".InputBox textarea").focus();
};
const checkTokenAndGetConversations = () => {
  return new Promise((resolve, reject) => {
    $fetch("/api/token/check", { method: "POST" }).then((_conversations) => {
      const { list, named } = _conversations;
      conversations.value = list.sort().map((id) => ({ id, name: named[id] }));
      resolve(true);
    }).catch((err) => {
      ElMessage.error("Initialization Failed");
      reject(err);
    });
  });
};
const fetchHistory = (conv) => {
  return new Promise((resolve, reject) => {
    const convIdDemical = baseConverter.convert(conv, "64w", 10);
    currentConv.value = convIdDemical;
    if (conv === void 0 || conv === null) {
      context.clear();
      return resolve(true);
    }
    $fetch("/api/history", { method: "POST", body: { id: conv } }).then((fetched) => {
      const records = fetched;
      if (records.length === 0) {
        navigateTo("/");
      }
      const _records = [];
      context.add(...records.map((record) => {
        const { Q, A, t: _t } = record;
        const t = new Date(_t);
        _records.push({ type: "Q", text: Q, t }, { type: "A", text: A, t });
        return A;
      }));
      messages.value.unshift(..._records);
      resolve(true);
    }).catch((err) => {
      ElMessage.error("There was an error loading the conversation.");
      reject(err);
    });
  });
};
const initPage = (conv) => {
  const loading = ElLoading.service();
  Promise.all([
    conv === null ? null : checkTokenAndGetConversations(),
    fetchHistory(conv)
  ]).finally(() => {
    setTimeout(() => {
      loading.close();
    }, 500);
  });
};
const DEFAULT_TEMPERATURE = "_05";
const temperatureSuffix = ref(DEFAULT_TEMPERATURE);
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
  watch(temperatureSuffix, (newValue) => {
    cookie.set(temperatureSuffix$1, newValue, {
      path: "/"
    });
  });
  const nuxtApp = useNuxtApp();
  const getCurrentConvId = () => {
    var _a, _b;
    return (_b = (_a = nuxtApp._route) == null ? void 0 : _a.params) == null ? void 0 : _b.conv;
  };
  const getCurrentConvName = () => {
    const currentConvId = getCurrentConvId();
    return conversations.value.filter((conv) => conv.id === currentConvId)[0].name || "";
  };
  const openDrawer = useState("openDrawer", () => false);
  const goToChat = (conv, force = false) => {
    const currentConvId = getCurrentConvId();
    if (force || (currentConvId !== conv || conv === null)) {
      messages.value = [];
      initPage(conv);
    }
    openDrawer.value = false;
    focusInput();
  };
  return {
    conversations,
    messages,
    context,
    webBrowsingMode,
    temperatureSuffix,
    getCurrentConvId,
    getCurrentConvName,
    checkTokenAndGetConversations,
    initPage,
    goToChat
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
//# sourceMappingURL=useTitle-7e47dda7.mjs.map
