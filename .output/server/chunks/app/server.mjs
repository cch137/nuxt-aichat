import { hasInjectionContext, getCurrentInstance, toRef, isRef, version, inject, ref, computed, unref, watchEffect, watch, useSSRContext, createApp, reactive, provide, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, shallowRef, shallowReactive, isReadonly, defineAsyncComponent, isShallow, isReactive, toRaw, withCtx, mergeProps, nextTick, defineComponent, h, Suspense, Transition } from 'vue';
import { $fetch } from 'ofetch';
import { createHooks } from 'hookable';
import { getContext, executeAsync } from 'unctx';
import { createMemoryHistory, createRouter, START_LOCATION, useRoute as useRoute$1, RouterView } from 'vue-router';
import { createError as createError$1, sanitizeStatusCode } from 'h3';
import { withQuery, hasProtocol, parseURL, joinURL } from 'ufo';
import { renderSSRHead } from '@unhead/ssr';
import { composableNames, getActiveHead, createServerHead as createServerHead$1 } from 'unhead';
import { defineHeadPlugin } from '@unhead/shared';
import { useNavigatorLanguage } from '@vueuse/core';
import { parse, serialize } from 'cookie';
import { createI18n } from 'vue-i18n';
import sha3 from 'crypto-js/sha3.js';
import Prism from 'prismjs';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode } from 'vue/server-renderer';
import { defu } from 'defu';
import { a as useRuntimeConfig$1 } from '../nitro/node-server.mjs';
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var _beforeUpdateCallbacks, _afterUpdateCallbacks;
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.6.5";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    runWithContext: (fn) => callWithNuxt(nuxtApp, fn),
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    _payloadRevivers: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    async function contextCaller(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    }
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const parallels = [];
  const errors = [];
  for (const plugin2 of plugins2) {
    const promise = applyPlugin(nuxtApp, plugin2);
    if (plugin2.parallel) {
      parallels.push(promise.catch((e) => errors.push(e)));
    } else {
      await promise;
    }
  }
  await Promise.all(parallels);
  if (errors.length) {
    throw errors[0];
  }
}
/*! @__NO_SIDE_EFFECTS__ */
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
/*! @__NO_SIDE_EFFECTS__ */
function useNuxtApp() {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
/*! @__NO_SIDE_EFFECTS__ */
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
/*! @__NO_SIDE_EFFECTS__ */
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : withQuery(to.path || "/", to.query || {}) + (to.hash || "");
  if (options == null ? void 0 : options.open) {
    return Promise.resolve();
  }
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `navigateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, fullPath);
      async function redirect(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: location2 }
        };
        return response;
      }
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    const error = useError();
    if (false)
      ;
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const isNuxtError = (err) => !!(err && typeof err === "object" && "__nuxt_error" in err);
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
const __nuxt_page_meta$c = {
  layout: "default",
  middleware: ["auto-redirector", "only-auth"]
};
const __nuxt_page_meta$b = {
  layout: "default",
  middleware: ["auto-redirector"]
};
const __nuxt_page_meta$a = {
  layout: "default",
  middleware: ["only-admin-auth"]
};
const __nuxt_page_meta$9 = {
  layout: "default",
  middleware: ["only-admin-auth"]
};
const __nuxt_page_meta$8 = {
  layout: "default"
};
const __nuxt_page_meta$7 = {
  layout: "chat",
  middleware: ["auto-redirector", "chat"]
};
const __nuxt_page_meta$6 = {
  layout: "chat",
  middleware: ["auto-redirector", "chat"]
};
const __nuxt_page_meta$5 = {
  layout: "default",
  middleware: ["auto-redirector"]
};
const __nuxt_page_meta$4 = {
  layout: "default"
};
const __nuxt_page_meta$3 = {
  layout: "default",
  middleware: ["auto-redirector", "only-no-auth"]
};
const __nuxt_page_meta$2 = {
  layout: "default",
  middleware: ["auto-redirector", "only-no-auth"]
};
const __nuxt_page_meta$1 = {
  layout: "default"
};
const __nuxt_page_meta = {
  layout: "default"
};
const _routes = [
  {
    name: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.name) ?? "acc-profile",
    path: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.path) ?? "/acc/profile",
    meta: __nuxt_page_meta$c || {},
    alias: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.alias) || [],
    redirect: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.redirect) || void 0,
    component: () => import('./_nuxt/profile-b9256e5f.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.name) ?? "acc-reset-password",
    path: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.path) ?? "/acc/reset-password",
    meta: __nuxt_page_meta$b || {},
    alias: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.alias) || [],
    redirect: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.redirect) || void 0,
    component: () => import('./_nuxt/reset-password-266febbb.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.name) ?? "admin-dashboard",
    path: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.path) ?? "/admin/dashboard",
    meta: __nuxt_page_meta$a || {},
    alias: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.alias) || [],
    redirect: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.redirect) || void 0,
    component: () => import('./_nuxt/dashboard-68351155.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.name) ?? "admin-entrance",
    path: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.path) ?? "/admin/entrance",
    meta: __nuxt_page_meta$9 || {},
    alias: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.alias) || [],
    redirect: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.redirect) || void 0,
    component: () => import('./_nuxt/entrance-c1eaef8f.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.name) ?? "admin-login",
    path: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.path) ?? "/admin/login",
    meta: __nuxt_page_meta$8 || {},
    alias: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.alias) || [],
    redirect: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.redirect) || void 0,
    component: () => import('./_nuxt/login-bf0a47f0.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.name) ?? "c-conv",
    path: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.path) ?? "/c/:conv()",
    meta: __nuxt_page_meta$7 || {},
    alias: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.alias) || [],
    redirect: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.redirect) || void 0,
    component: () => import('./_nuxt/_conv_-e8485e4c.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.name) ?? "c",
    path: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.path) ?? "/c",
    meta: __nuxt_page_meta$6 || {},
    alias: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.alias) || [],
    redirect: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.redirect) || void 0,
    component: () => import('./_nuxt/index-52e53032.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.name) ?? "coder",
    path: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.path) ?? "/coder",
    meta: __nuxt_page_meta$5 || {},
    alias: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.alias) || [],
    redirect: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.redirect) || void 0,
    component: () => import('./_nuxt/index-466cd0ed.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.name) ?? "index",
    path: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.path) ?? "/",
    meta: __nuxt_page_meta$4 || {},
    alias: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.alias) || [],
    redirect: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.redirect) || void 0,
    component: () => import('./_nuxt/index-b6313604.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.name) ?? "login",
    path: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.path) ?? "/login",
    meta: __nuxt_page_meta$3 || {},
    alias: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.alias) || [],
    redirect: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.redirect) || void 0,
    component: () => import('./_nuxt/login-08916bc5.mjs').then((m) => m.default || m)
  },
  {
    name: "perspective",
    path: "/perspective",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/perspective-33dfb196.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.name) ?? "signup",
    path: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.path) ?? "/signup",
    meta: __nuxt_page_meta$2 || {},
    alias: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.alias) || [],
    redirect: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.redirect) || void 0,
    component: () => import('./_nuxt/signup-bfb06713.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.name) ?? "tools-currency-converter",
    path: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.path) ?? "/tools/currency-converter",
    meta: __nuxt_page_meta$1 || {},
    alias: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.alias) || [],
    redirect: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.redirect) || void 0,
    component: () => import('./_nuxt/currency-converter-7719e1dc.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.name) ?? "tools-qr-code",
    path: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.path) ?? "/tools/qr-code",
    meta: __nuxt_page_meta || {},
    alias: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.alias) || [],
    redirect: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.redirect) || void 0,
    component: () => import('./_nuxt/qr-code-f46f3ed3.mjs').then((m) => m.default || m)
  }
];
const appHead = { "meta": [{ "charset": "UTF-8" }, { "http-equiv": "X-UA-Compatible", "content": "IE=edge" }, { "name": "viewport", "content": "width=device-width,initial-scale=1,user-scalable=no" }, { "name": "author", "content": "cch137" }, { "name": "keywords", "content": "CH4" }, { "name": "description", "content": "A free GPT-4 AI chatbot that can browse the web. This is for everyone." }, { "property": "twitter:card", "content": "summary_large_image" }, { "property": "twitter:description", "content": "A free GPT-4 AI chatbot that can browse the web. This is for everyone." }, { "property": "twitter:image", "content": "https://voodex.netlify.app/EVO/EVO-full.png" }, { "property": "og:type", "content": "website" }, { "property": "og:site_name", "content": "CH4" }, { "property": "og:description", "content": "A free GPT-4 AI chatbot that can browse the web. This is for everyone." }, { "property": "og:image", "content": "https://voodex.netlify.app/EVO/EVO-full.png" }], "link": [], "style": [], "script": [], "noscript": [{ "innerHTML": "<strong>We're sorry but this website doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>" }] };
const appLayoutTransition = true;
const appPageTransition = true;
const appKeepalive = false;
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    let position = savedPosition || void 0;
    if (!position && from && to && to.meta.scrollToTop !== false && _isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
      }
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
function _isDifferentRoute(from, to) {
  const samePageComponent = to.matched.every((comp, index) => {
    var _a, _b, _c;
    return ((_a = comp.components) == null ? void 0 : _a.default) === ((_c = (_b = from.matched[index]) == null ? void 0 : _b.components) == null ? void 0 : _c.default);
  });
  if (!samePageComponent) {
    return true;
  }
  if (samePageComponent && JSON.stringify(from.params) !== JSON.stringify(to.params)) {
    return true;
  }
  return false;
}
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root;
}
const Vue3 = version.startsWith("3");
const headSymbol = "usehead";
function injectHead() {
  return getCurrentInstance() && inject(headSymbol) || getActiveHead();
}
function vueInstall(head) {
  const plugin2 = {
    install(app) {
      if (Vue3) {
        app.config.globalProperties.$unhead = head;
        app.config.globalProperties.$head = head;
        app.provide(headSymbol, head);
      }
    }
  };
  return plugin2.install;
}
function createServerHead(options = {}) {
  const head = createServerHead$1({
    ...options,
    plugins: [
      VueReactiveUseHeadPlugin(),
      ...(options == null ? void 0 : options.plugins) || []
    ]
  });
  head.install = vueInstall(head);
  return head;
}
function VueReactiveUseHeadPlugin() {
  return defineHeadPlugin({
    hooks: {
      "entries:resolve": function(ctx) {
        for (const entry2 of ctx.entries)
          entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
      }
    }
  });
}
function clientUseHead(input, options = {}) {
  const head = injectHead();
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
function serverUseHead(input, options = {}) {
  const head = injectHead();
  return head.push(input, options);
}
function useHead(input, options = {}) {
  var _a;
  const head = injectHead();
  if (head) {
    const isBrowser = !!((_a = head.resolvedOptions) == null ? void 0 : _a.document);
    if (options.mode === "server" && isBrowser || options.mode === "client" && !isBrowser)
      return;
    return isBrowser ? clientUseHead(input, options) : serverUseHead(input, options);
  }
}
const coreComposableNames = [
  "injectHead"
];
({
  "@unhead/vue": [...coreComposableNames, ...composableNames]
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const appName = "CH4";
const client_45global = /* @__PURE__ */ defineNuxtRouteMiddleware(() => {
  useState("appName", () => appName);
});
const globalMiddleware = [
  validate,
  client_45global
];
const namedMiddleware = {
  "auto-redirector": () => import('./_nuxt/autoRedirector-486779eb.mjs'),
  chat: () => import('./_nuxt/chat-c4fac576.mjs'),
  "only-admin-auth": () => import('./_nuxt/onlyAdminAuth-5d573836.mjs'),
  "only-auth": () => import('./_nuxt/onlyAuth-fbfcc882.mjs'),
  "only-no-auth": () => import('./_nuxt/onlyNoAuth-eb1d0f3a.mjs')
};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b;
    let __temp, __restore;
    let routerBase = useRuntimeConfig().app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
    let startPosition;
    const initialURL = nuxtApp.ssrContext.url;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        var _a2;
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
        return (_a2 = routerOptions.scrollBehavior) == null ? void 0 : _a2.call(routerOptions, to, START_LOCATION, startPosition || savedPosition);
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const _route = shallowRef(router.resolve(initialURL));
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key]
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const initialLayout = useState("_layout");
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout.value && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout.value;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          if (Array.isArray(componentMiddleware)) {
            for (const entry2 of componentMiddleware) {
              middlewareEntries.add(entry2);
            }
          } else {
            middlewareEntries.add(componentMiddleware);
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(() => {
      delete nuxtApp._processingMiddleware;
    });
    router.afterEach(async (to, _from, failure) => {
      var _a2;
      delete nuxtApp._processingMiddleware;
      if ((failure == null ? void 0 : failure.type) === 4) {
        return;
      }
      if (to.matched.length === 0 && !((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        await nuxtApp.runWithContext(() => showError(createError$1({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`
        })));
      } else if (to.redirectedFrom && to.fullPath !== initialURL) {
        await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        await router.replace({
          ...router.resolve(initialURL),
          name: void 0,
          // #4920, #4982
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  setup(nuxtApp) {
    const createHead = createServerHead;
    const head = createHead();
    head.push(appHead);
    nuxtApp.vueApp.use(head);
    {
      nuxtApp.ssrContext.renderMeta = async () => {
        const meta = await renderSSRHead(head);
        return {
          ...meta,
          bodyScriptsPrepend: meta.bodyTagsOpen,
          // resolves naming difference with NuxtMeta and Unhead
          bodyScripts: meta.bodyTags
        };
      };
    }
  }
});
const preference = "system";
const plugin_server_XNCxeHyTuP = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const colorMode = useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const element_plus_teleports_plugin_h4Dmekbj62 = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:rendered", (ctx) => {
    var _a;
    if ((_a = ctx.ssrContext) == null ? void 0 : _a.teleports) {
      ctx.ssrContext.teleports = renderTeleports(ctx.ssrContext.teleports);
    }
  });
});
function renderTeleports(teleports) {
  const body = Object.entries(teleports).reduce((all, [key, value]) => {
    if (key.startsWith("#el-popper-container-") || [].includes(key)) {
      return `${all}<div id="${key.slice(1)}">${value}</div>`;
    }
    return all;
  }, teleports.body || "");
  return { ...teleports, body };
}
class ElementPlusError extends Error {
  constructor(m) {
    super(m);
    this.name = "ElementPlusError";
  }
}
function throwError(scope, m) {
  throw new ElementPlusError(`[${scope}] ${m}`);
}
function debugWarn(scope, message) {
}
const defaultNamespace = "el";
const statePrefix = "is-";
const _bem = (namespace, block, blockSuffix, element, modifier) => {
  let cls = `${namespace}-${block}`;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return cls;
};
const namespaceContextKey = Symbol("namespaceContextKey");
const useGetDerivedNamespace = (namespaceOverrides) => {
  const derivedNamespace = namespaceOverrides || (getCurrentInstance() ? inject(namespaceContextKey, ref(defaultNamespace)) : ref(defaultNamespace));
  const namespace = computed(() => {
    return unref(derivedNamespace) || defaultNamespace;
  });
  return namespace;
};
const useNamespace = (block, namespaceOverrides) => {
  const namespace = useGetDerivedNamespace(namespaceOverrides);
  const b = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
  const e = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
  const m = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
  const be = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
  const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
  const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
  const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
  const is = (name, ...args) => {
    const state = args.length >= 1 ? args[0] : true;
    return name && state ? `${statePrefix}${name}` : "";
  };
  const cssVar = (object) => {
    const styles = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key];
      }
    }
    return styles;
  };
  const cssVarBlock = (object) => {
    const styles = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key];
      }
    }
    return styles;
  };
  const cssVarName = (name) => `--${namespace.value}-${name}`;
  const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName
  };
};
const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 1e4),
  current: 0
};
const ID_INJECTION_KEY = Symbol("elIdInjection");
const useIdInjection = () => {
  return getCurrentInstance() ? inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection;
};
const useId = (deterministicId) => {
  const idInjection = useIdInjection();
  const namespace = useGetDerivedNamespace();
  const idRef = computed(() => unref(deterministicId) || `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`);
  return idRef;
};
const element_plus_injection_plugin_1RNPi6ogby = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(ID_INJECTION_KEY, { "prefix": 1024, "current": 0 });
});
function getNode(nuxtApp) {
  var _a, _b, _c, _d;
  return (_d = (_c = (_b = (_a = nuxtApp == null ? void 0 : nuxtApp.vueApp) == null ? void 0 : _a.$nuxt) == null ? void 0 : _b.ssrContext) == null ? void 0 : _c.event) == null ? void 0 : _d.node;
}
function builder(rawCookieGetter, setter) {
  const operator = {
    get nuxtApp() {
      return useNuxtApp();
    },
    get parsed() {
      const raw = rawCookieGetter();
      return parse(typeof raw === "string" ? raw : "");
    },
    has(name) {
      return name in operator.parsed;
    },
    get(name) {
      return operator.parsed[name];
    },
    set(name, value, options = {}) {
      if (/^(?:expires|max-age|path|domain|secure|samesite)$/i.test(name)) {
        throw new Error("Invalid cookie name");
      }
      if (!("path" in options)) {
        options.path = "/";
      }
      const serializedCookie = serialize(name, value, options);
      return setter(serializedCookie);
    },
    delete(name, options = {}) {
      if (!operator.has(name)) {
        return true;
      }
      if (!("path" in options)) {
        options.path = "/";
      }
      options.expires = /* @__PURE__ */ new Date();
      const serializedCookie = serialize(name, "", options);
      return setter(serializedCookie);
    },
    keys() {
      return Object.keys(operator.parsed);
    },
    values() {
      return Object.values(operator.parsed);
    }
  };
  return operator;
}
function useUniCookie() {
  const svrCookie = builder(
    () => {
      var _a, _b, _c;
      return (_c = (_b = (_a = getNode(svrCookie.nuxtApp)) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.cookie;
    },
    (serializedCookie) => {
      var _a;
      const res = (_a = getNode(svrCookie.nuxtApp)) == null ? void 0 : _a.res;
      if (res !== void 0) {
        res.setHeader("Set-Cookie", serializedCookie);
      }
      return true;
    }
  );
  const cliCookie = builder(
    () => {
      return document.cookie;
    },
    (serializedCookie) => {
      document.cookie = serializedCookie;
      return true;
    }
  );
  const uniCookie = new Proxy(cliCookie, {
    get(target, name) {
      {
        return svrCookie[name];
      }
    }
  });
  return uniCookie;
}
const table1 = [
  ["㑳", "㑇"],
  ["㘚", "㘎"],
  ["㥮", "㤘"],
  ["㩳", "㧐"],
  ["䎱", "䎬"],
  ["䙡", "䙌"],
  ["䝼", "䞍"],
  ["䥇", "䦂"],
  ["䦛", "䦶"],
  ["䦟", "䦷"],
  ["䱷", "䲣"],
  ["丟", "丢"],
  ["並", "并"],
  ["亂", "乱"],
  ["亙", "亘"],
  ["亞", "亚"],
  ["佇", "伫"],
  ["佪", "徊"],
  ["來", "来"],
  ["侖", "仑"],
  ["侚", "徇"],
  ["侶", "侣"],
  ["俁", "俣"],
  ["係", "系"],
  ["俠", "侠"],
  ["倀", "伥"],
  ["倆", "俩"],
  ["倉", "仓"],
  ["個", "个"],
  ["們", "们"],
  ["倣", "仿"],
  ["倫", "伦"],
  ["偉", "伟"],
  ["側", "侧"],
  ["偵", "侦"],
  ["偺", "咱"],
  ["偽", "伪"],
  ["傑", "杰"],
  ["傖", "伧"],
  ["傘", "伞"],
  ["備", "备"],
  ["傚", "效"],
  ["傭", "佣"],
  ["傯", "偬"],
  ["傳", "传"],
  ["傴", "伛"],
  ["債", "债"],
  ["傷", "伤"],
  ["傾", "倾"],
  ["僂", "偻"],
  ["僅", "仅"],
  ["僉", "佥"],
  ["僊", "仙"],
  ["僑", "侨"],
  ["僕", "仆"],
  ["僞", "伪"],
  ["僣", "僭"],
  ["僥", "侥"],
  ["僨", "偾"],
  ["僱", "雇"],
  ["價", "价"],
  ["儀", "仪"],
  ["儂", "侬"],
  ["億", "亿"],
  ["儈", "侩"],
  ["儉", "俭"],
  ["儐", "傧"],
  ["儔", "俦"],
  ["儕", "侪"],
  ["儘", "尽"],
  ["償", "偿"],
  ["優", "优"],
  ["儲", "储"],
  ["儷", "俪"],
  ["儺", "傩"],
  ["儻", "傥"],
  ["儼", "俨"],
  ["兇", "凶"],
  ["兌", "兑"],
  ["兒", "儿"],
  ["兗", "兖"],
  ["內", "内"],
  ["兩", "两"],
  ["冊", "册"],
  ["冑", "胄"],
  ["冪", "幂"],
  ["凅", "涸"],
  ["凈", "净"],
  ["凍", "冻"],
  ["凜", "凛"],
  ["凱", "凯"],
  ["別", "别"],
  ["刪", "删"],
  ["剄", "刭"],
  ["則", "则"],
  ["剉", "锉"],
  ["剎", "刹"],
  ["剗", "刬"],
  ["剛", "刚"],
  ["剝", "剥"],
  ["剮", "剐"],
  ["剴", "剀"],
  ["創", "创"],
  ["剷", "铲"],
  ["劃", "划"],
  ["劄", "札"],
  ["劇", "剧"],
  ["劉", "刘"],
  ["劊", "刽"],
  ["劌", "刿"],
  ["劍", "剑"],
  ["劑", "剂"],
  ["劻", "匡"],
  ["勁", "劲"],
  ["動", "动"],
  ["勗", "勖"],
  ["務", "务"],
  ["勛", "勋"],
  ["勝", "胜"],
  ["勞", "劳"],
  ["勢", "势"],
  ["勣", "绩"],
  ["勦", "剿"],
  ["勩", "勚"],
  ["勱", "劢"],
  ["勳", "勋"],
  ["勵", "励"],
  ["勸", "劝"],
  ["匋", "陶"],
  ["匭", "匦"],
  ["匯", "汇"],
  ["匱", "匮"],
  ["區", "区"],
  ["卄", "廿"],
  ["協", "协"],
  ["卹", "恤"],
  ["卻", "却"],
  ["厙", "厍"],
  ["厭", "厌"],
  ["厲", "厉"],
  ["厴", "厣"],
  ["參", "参"],
  ["叡", "睿"],
  ["叢", "丛"],
  ["後", "后"],
  ["后", "后"],
  ["吳", "吴"],
  ["吶", "呐"],
  ["呂", "吕"],
  ["咼", "呙"],
  ["員", "员"],
  ["唄", "呗"],
  ["唝", "嗊"],
  ["問", "问"],
  ["啓", "启"],
  ["啗", "啖"],
  ["啞", "哑"],
  ["啟", "启"],
  ["啢", "唡"],
  ["啣", "衔"],
  ["喎", "㖞"],
  ["喚", "唤"],
  ["喪", "丧"],
  ["喬", "乔"],
  ["單", "单"],
  ["喲", "哟"],
  ["嗆", "呛"],
  ["嗇", "啬"],
  ["嗎", "吗"],
  ["嗚", "呜"],
  ["嗩", "唢"],
  ["嗶", "哔"],
  ["嘆", "叹"],
  ["嘍", "喽"],
  ["嘔", "呕"],
  ["嘖", "啧"],
  ["嘗", "尝"],
  ["嘜", "唛"],
  ["嘩", "哗"],
  ["嘮", "唠"],
  ["嘯", "啸"],
  ["嘰", "叽"],
  ["嘵", "哓"],
  ["嘸", "呒"],
  ["噓", "嘘"],
  ["噝", "咝"],
  ["噠", "哒"],
  ["噥", "哝"],
  ["噦", "哕"],
  ["噯", "嗳"],
  ["噲", "哙"],
  ["噴", "喷"],
  ["噸", "吨"],
  ["嚀", "咛"],
  ["嚇", "吓"],
  ["嚌", "哜"],
  ["嚕", "噜"],
  ["嚙", "啮"],
  ["嚥", "咽"],
  ["嚦", "呖"],
  ["嚨", "咙"],
  ["嚮", "向"],
  ["嚳", "喾"],
  ["嚴", "严"],
  ["嚶", "嘤"],
  ["囀", "啭"],
  ["囁", "嗫"],
  ["囂", "嚣"],
  ["囅", "冁"],
  ["囈", "呓"],
  ["囉", "啰"],
  ["囑", "嘱"],
  ["囓", "啮"],
  ["囪", "囱"],
  ["圇", "囵"],
  ["國", "国"],
  ["圍", "围"],
  ["圏", "圈"],
  ["園", "园"],
  ["圓", "圆"],
  ["圖", "图"],
  ["團", "团"],
  ["埡", "垭"],
  ["執", "执"],
  ["埼", "崎"],
  ["堅", "坚"],
  ["堊", "垩"],
  ["堖", "垴"],
  ["堝", "埚"],
  ["堯", "尧"],
  ["報", "报"],
  ["場", "场"],
  ["塊", "块"],
  ["塋", "茔"],
  ["塏", "垲"],
  ["塒", "埘"],
  ["塗", "涂"],
  ["塚", "冢"],
  ["塢", "坞"],
  ["塤", "埙"],
  ["塵", "尘"],
  ["塹", "堑"],
  ["墊", "垫"],
  ["墑", "墒"],
  ["墜", "坠"],
  ["墫", "樽"],
  ["墮", "堕"],
  ["墳", "坟"],
  ["墻", "墙"],
  ["墾", "垦"],
  ["壇", "坛"],
  ["壎", "埙"],
  ["壓", "压"],
  ["壘", "垒"],
  ["壙", "圹"],
  ["壚", "垆"],
  ["壞", "坏"],
  ["壟", "垄"],
  ["壢", "坜"],
  ["壩", "坝"],
  ["壯", "壮"],
  ["壺", "壶"],
  ["壽", "寿"],
  ["夠", "够"],
  ["夢", "梦"],
  ["夾", "夹"],
  ["奐", "奂"],
  ["奧", "奥"],
  ["奩", "奁"],
  ["奪", "夺"],
  ["奮", "奋"],
  ["妝", "妆"],
  ["姍", "姗"],
  ["姦", "奸"],
  ["姪", "侄"],
  ["娛", "娱"],
  ["婁", "娄"],
  ["婦", "妇"],
  ["婬", "淫"],
  ["婭", "娅"],
  ["媧", "娲"],
  ["媮", "偷"],
  ["媯", "妫"],
  ["媼", "媪"],
  ["媽", "妈"],
  ["媿", "愧"],
  ["嫋", "袅"],
  ["嫗", "妪"],
  ["嫵", "妩"],
  ["嫻", "娴"],
  ["嫿", "婳"],
  ["嬈", "娆"],
  ["嬋", "婵"],
  ["嬌", "娇"],
  ["嬙", "嫱"],
  ["嬝", "袅"],
  ["嬡", "嫒"],
  ["嬤", "嬷"],
  ["嬪", "嫔"],
  ["嬭", "奶"],
  ["嬰", "婴"],
  ["嬸", "婶"],
  ["孌", "娈"],
  ["孫", "孙"],
  ["學", "学"],
  ["孿", "孪"],
  ["宮", "宫"],
  ["寢", "寝"],
  ["實", "实"],
  ["寧", "宁"],
  ["審", "审"],
  ["寫", "写"],
  ["寬", "宽"],
  ["寵", "宠"],
  ["寶", "宝"],
  ["將", "将"],
  ["專", "专"],
  ["尋", "寻"],
  ["對", "对"],
  ["導", "导"],
  ["尷", "尴"],
  ["屆", "届"],
  ["屍", "尸"],
  ["屜", "屉"],
  ["屝", "扉"],
  ["屢", "屡"],
  ["層", "层"],
  ["屨", "屦"],
  ["屬", "属"],
  ["岡", "冈"],
  ["峴", "岘"],
  ["島", "岛"],
  ["峽", "峡"],
  ["崍", "崃"],
  ["崗", "岗"],
  ["崠", "岽"],
  ["崢", "峥"],
  ["崳", "嵛"],
  ["嵐", "岚"],
  ["嶁", "嵝"],
  ["嶄", "崭"],
  ["嶇", "岖"],
  ["嶔", "嵚"],
  ["嶗", "崂"],
  ["嶠", "峤"],
  ["嶢", "峣"],
  ["嶧", "峄"],
  ["嶨", "峃"],
  ["嶸", "嵘"],
  ["嶺", "岭"],
  ["嶼", "屿"],
  ["嶽", "岳"],
  ["巋", "岿"],
  ["巒", "峦"],
  ["巔", "巅"],
  ["巰", "巯"],
  ["巹", "卺"],
  ["帥", "帅"],
  ["師", "师"],
  ["帳", "帐"],
  ["帶", "带"],
  ["幀", "帧"],
  ["幃", "帏"],
  ["幗", "帼"],
  ["幘", "帻"],
  ["幟", "帜"],
  ["幣", "币"],
  ["幫", "帮"],
  ["幬", "帱"],
  ["幹", "干"],
  ["幾", "几"],
  ["庂", "仄"],
  ["庫", "库"],
  ["廁", "厕"],
  ["廂", "厢"],
  ["廄", "厩"],
  ["廈", "厦"],
  ["廎", "庼"],
  ["廚", "厨"],
  ["廝", "厮"],
  ["廟", "庙"],
  ["廠", "厂"],
  ["廡", "庑"],
  ["廢", "废"],
  ["廣", "广"],
  ["廩", "廪"],
  ["廬", "庐"],
  ["廱", "痈"],
  ["廳", "厅"],
  ["弒", "弑"],
  ["弳", "弪"],
  ["張", "张"],
  ["強", "强"],
  ["彆", "别"],
  ["彈", "弹"],
  ["彌", "弥"],
  ["彎", "弯"],
  ["匯", "汇"],
  ["彥", "彦"],
  ["徑", "径"],
  ["從", "从"],
  ["徠", "徕"],
  ["復", "复"],
  ["徵", "征"],
  ["徹", "彻"],
  ["恆", "恒"],
  ["恥", "耻"],
  ["悅", "悦"],
  ["悵", "怅"],
  ["悶", "闷"],
  ["悽", "凄"],
  ["惇", "敦"],
  ["惡", "恶"],
  ["惱", "恼"],
  ["惲", "恽"],
  ["惷", "蠢"],
  ["惻", "恻"],
  ["愛", "爱"],
  ["愜", "惬"],
  ["愨", "悫"],
  ["愴", "怆"],
  ["愷", "恺"],
  ["愾", "忾"],
  ["慄", "栗"],
  ["慇", "殷"],
  ["態", "态"],
  ["慍", "愠"],
  ["慘", "惨"],
  ["慚", "惭"],
  ["慟", "恸"],
  ["慣", "惯"],
  ["慪", "怄"],
  ["慫", "怂"],
  ["慮", "虑"],
  ["慳", "悭"],
  ["慶", "庆"],
  ["慼", "戚"],
  ["慾", "欲"],
  ["憂", "忧"],
  ["憊", "惫"],
  ["憐", "怜"],
  ["憑", "凭"],
  ["憒", "愦"],
  ["憚", "惮"],
  ["憤", "愤"],
  ["憫", "悯"],
  ["憮", "怃"],
  ["憲", "宪"],
  ["憶", "忆"],
  ["懃", "勤"],
  ["懇", "恳"],
  ["應", "应"],
  ["懌", "怿"],
  ["懍", "懔"],
  ["懟", "怼"],
  ["懣", "懑"],
  ["懨", "恹"],
  ["懲", "惩"],
  ["懶", "懒"],
  ["懷", "怀"],
  ["懸", "悬"],
  ["懺", "忏"],
  ["懼", "惧"],
  ["懾", "慑"],
  ["戀", "恋"],
  ["戇", "戆"],
  ["戉", "钺"],
  ["戔", "戋"],
  ["戧", "戗"],
  ["戩", "戬"],
  ["戰", "战"],
  ["戲", "戏"],
  ["戶", "户"],
  ["扐", "仂"],
  ["扞", "捍"],
  ["扱", "插"],
  ["扺", "抵"],
  ["抃", "拚"],
  ["抔", "抱"],
  ["抴", "曳"],
  ["拋", "抛"],
  ["拑", "钳"],
  ["挾", "挟"],
  ["捨", "舍"],
  ["捫", "扪"],
  ["捲", "卷"],
  ["掃", "扫"],
  ["掄", "抡"],
  ["掆", "㧏"],
  ["掗", "挜"],
  ["掙", "挣"],
  ["掛", "挂"],
  ["採", "采"],
  ["揀", "拣"],
  ["揚", "扬"],
  ["換", "换"],
  ["揮", "挥"],
  ["搆", "构"],
  ["損", "损"],
  ["搖", "摇"],
  ["搗", "捣"],
  ["搟", "擀"],
  ["搥", "捶"],
  ["搶", "抢"],
  ["搾", "榨"],
  ["摀", "捂"],
  ["摃", "扛"],
  ["摑", "掴"],
  ["摜", "掼"],
  ["摟", "搂"],
  ["摯", "挚"],
  ["摳", "抠"],
  ["摶", "抟"],
  ["摻", "掺"],
  ["撈", "捞"],
  ["撏", "挦"],
  ["撐", "撑"],
  ["撓", "挠"],
  ["撚", "拈"],
  ["撟", "挢"],
  ["撢", "掸"],
  ["撣", "掸"],
  ["撥", "拨"],
  ["撦", "扯"],
  ["撫", "抚"],
  ["撲", "扑"],
  ["撳", "揿"],
  ["撻", "挞"],
  ["撾", "挝"],
  ["撿", "捡"],
  ["擁", "拥"],
  ["擄", "掳"],
  ["擇", "择"],
  ["擊", "击"],
  ["擋", "挡"],
  ["擓", "㧟"],
  ["擔", "担"],
  ["據", "据"],
  ["擠", "挤"],
  ["擡", "抬"],
  ["擣", "捣"],
  ["擬", "拟"],
  ["擯", "摈"],
  ["擰", "拧"],
  ["擱", "搁"],
  ["擲", "掷"],
  ["擴", "扩"],
  ["擷", "撷"],
  ["擺", "摆"],
  ["擻", "擞"],
  ["擼", "撸"],
  ["擾", "扰"],
  ["攄", "摅"],
  ["攆", "撵"],
  ["攏", "拢"],
  ["攔", "拦"],
  ["攖", "撄"],
  ["攙", "搀"],
  ["攛", "撺"],
  ["攜", "携"],
  ["攝", "摄"],
  ["攢", "攒"],
  ["攣", "挛"],
  ["攤", "摊"],
  ["攪", "搅"],
  ["攬", "揽"],
  ["敗", "败"],
  ["敘", "叙"],
  ["敵", "敌"],
  ["數", "数"],
  ["斂", "敛"],
  ["斃", "毙"],
  ["斕", "斓"],
  ["斬", "斩"],
  ["斷", "断"],
  ["於", "于"],
  ["旛", "幡"],
  ["昇", "升"],
  ["時", "时"],
  ["晉", "晋"],
  ["晝", "昼"],
  ["晞", "曦"],
  ["晢", "晰"],
  ["晳", "晰"],
  ["暈", "晕"],
  ["暉", "晖"],
  ["暘", "阳"],
  ["暢", "畅"],
  ["暫", "暂"],
  ["暱", "昵"],
  ["曄", "晔"],
  ["曆", "历"],
  ["曇", "昙"],
  ["曉", "晓"],
  ["曏", "向"],
  ["曖", "暧"],
  ["曠", "旷"],
  ["曨", "昽"],
  ["曬", "晒"],
  ["書", "书"],
  ["會", "会"],
  ["朢", "望"],
  ["朧", "胧"],
  ["杇", "圬"],
  ["東", "东"],
  ["枴", "拐"],
  ["柵", "栅"],
  ["柺", "拐"],
  ["栒", "旬"],
  ["桿", "杆"],
  ["梔", "栀"],
  ["梘", "枧"],
  ["條", "条"],
  ["梟", "枭"],
  ["梱", "捆"],
  ["棄", "弃"],
  ["棖", "枨"],
  ["棗", "枣"],
  ["棟", "栋"],
  ["棡", "㭎"],
  ["棧", "栈"],
  ["棲", "栖"],
  ["椏", "桠"],
  ["楄", "匾"],
  ["楊", "杨"],
  ["楓", "枫"],
  ["楙", "茂"],
  ["楨", "桢"],
  ["業", "业"],
  ["極", "极"],
  ["榪", "杩"],
  ["榮", "荣"],
  ["榿", "桤"],
  ["構", "构"],
  ["槍", "枪"],
  ["槓", "杠"],
  ["槧", "椠"],
  ["槨", "椁"],
  ["槳", "桨"],
  ["樁", "桩"],
  ["樂", "乐"],
  ["樅", "枞"],
  ["樑", "梁"],
  ["樓", "楼"],
  ["標", "标"],
  ["樞", "枢"],
  ["樣", "样"],
  ["樸", "朴"],
  ["樹", "树"],
  ["樺", "桦"],
  ["橈", "桡"],
  ["橋", "桥"],
  ["機", "机"],
  ["橢", "椭"],
  ["橦", "幢"],
  ["橫", "横"],
  ["檁", "檩"],
  ["檉", "柽"],
  ["檔", "档"],
  ["檜", "桧"],
  ["檟", "槚"],
  ["檢", "检"],
  ["檣", "樯"],
  ["檳", "槟"],
  ["檸", "柠"],
  ["檻", "槛"],
  ["櫂", "棹"],
  ["櫃", "柜"],
  ["櫐", "累"],
  ["櫓", "橹"],
  ["櫚", "榈"],
  ["櫛", "栉"],
  ["櫝", "椟"],
  ["櫞", "橼"],
  ["櫟", "栎"],
  ["櫥", "橱"],
  ["櫧", "槠"],
  ["櫨", "栌"],
  ["櫪", "枥"],
  ["櫫", "橥"],
  ["櫬", "榇"],
  ["櫳", "栊"],
  ["櫸", "榉"],
  ["櫺", "棂"],
  ["櫻", "樱"],
  ["欄", "栏"],
  ["權", "权"],
  ["欏", "椤"],
  ["欒", "栾"],
  ["欖", "榄"],
  ["欞", "棂"],
  ["欸", "唉"],
  ["欽", "钦"],
  ["歎", "叹"],
  ["歐", "欧"],
  ["歟", "欤"],
  ["歡", "欢"],
  ["歲", "岁"],
  ["歷", "历"],
  ["歸", "归"],
  ["歿", "殁"],
  ["殘", "残"],
  ["殞", "殒"],
  ["殤", "殇"],
  ["殫", "殚"],
  ["殮", "殓"],
  ["殯", "殡"],
  ["殲", "歼"],
  ["殺", "杀"],
  ["殼", "壳"],
  ["殽", "肴"],
  ["毀", "毁"],
  ["毆", "殴"],
  ["毿", "毵"],
  ["氈", "毡"],
  ["氌", "氇"],
  ["氣", "气"],
  ["氫", "氢"],
  ["氬", "氩"],
  ["氳", "氲"],
  ["氾", "泛"],
  ["汎", "泛"],
  ["決", "决"],
  ["沍", "冱"],
  ["沒", "没"],
  ["沖", "冲"],
  ["況", "况"],
  ["泝", "溯"],
  ["洟", "涕"],
  ["洩", "泄"],
  ["洶", "汹"],
  ["浹", "浃"],
  ["涇", "泾"],
  ["涼", "凉"],
  ["淒", "凄"],
  ["淚", "泪"],
  ["淥", "渌"],
  ["淨", "净"],
  ["淪", "沦"],
  ["淵", "渊"],
  ["淶", "涞"],
  ["淺", "浅"],
  ["渙", "涣"],
  ["減", "减"],
  ["渢", "沨"],
  ["渦", "涡"],
  ["測", "测"],
  ["渾", "浑"],
  ["湊", "凑"],
  ["湞", "浈"],
  ["湣", "闵"],
  ["湧", "涌"],
  ["湯", "汤"],
  ["溈", "沩"],
  ["準", "准"],
  ["溝", "沟"],
  ["溫", "温"],
  ["溮", "浉"],
  ["溳", "涢"],
  ["溼", "湿"],
  ["滄", "沧"],
  ["滅", "灭"],
  ["滌", "涤"],
  ["滎", "荥"],
  ["滬", "沪"],
  ["滯", "滞"],
  ["滲", "渗"],
  ["滷", "卤"],
  ["滸", "浒"],
  ["滻", "浐"],
  ["滾", "滚"],
  ["滿", "满"],
  ["漁", "渔"],
  ["漊", "溇"],
  ["漚", "沤"],
  ["漢", "汉"],
  ["漣", "涟"],
  ["漬", "渍"],
  ["漲", "涨"],
  ["漵", "溆"],
  ["漸", "渐"],
  ["漿", "浆"],
  ["潁", "颍"],
  ["潑", "泼"],
  ["潔", "洁"],
  ["潛", "潜"],
  ["潤", "润"],
  ["潯", "浔"],
  ["潰", "溃"],
  ["潷", "滗"],
  ["潿", "涠"],
  ["澀", "涩"],
  ["澂", "澄"],
  ["澆", "浇"],
  ["澇", "涝"],
  ["澔", "浩"],
  ["澗", "涧"],
  ["澠", "渑"],
  ["澤", "泽"],
  ["澦", "滪"],
  ["澩", "泶"],
  ["澮", "浍"],
  ["澱", "淀"],
  ["澾", "㳠"],
  ["濁", "浊"],
  ["濃", "浓"],
  ["濕", "湿"],
  ["濘", "泞"],
  ["濜", "浕"],
  ["濟", "济"],
  ["濤", "涛"],
  ["濫", "滥"],
  ["濬", "浚"],
  ["濰", "潍"],
  ["濱", "滨"],
  ["濺", "溅"],
  ["濼", "泺"],
  ["濾", "滤"],
  ["瀁", "漾"],
  ["瀅", "滢"],
  ["瀆", "渎"],
  ["瀉", "泻"],
  ["瀋", "沈"],
  ["瀏", "浏"],
  ["瀕", "濒"],
  ["瀘", "泸"],
  ["瀝", "沥"],
  ["瀟", "潇"],
  ["瀠", "潆"],
  ["瀦", "潴"],
  ["瀧", "泷"],
  ["瀨", "濑"],
  ["瀲", "潋"],
  ["瀾", "澜"],
  ["灃", "沣"],
  ["灄", "滠"],
  ["灑", "洒"],
  ["灕", "漓"],
  ["灘", "滩"],
  ["灝", "灏"],
  ["灣", "湾"],
  ["灤", "滦"],
  ["灩", "滟"],
  ["災", "灾"],
  ["為", "为"],
  ["烏", "乌"],
  ["烴", "烃"],
  ["無", "无"],
  ["煉", "炼"],
  ["煒", "炜"],
  ["煖", "暖"],
  ["煙", "烟"],
  ["煢", "茕"],
  ["煥", "焕"],
  ["煩", "烦"],
  ["煬", "炀"],
  ["熒", "荧"],
  ["熗", "炝"],
  ["熱", "热"],
  ["熾", "炽"],
  ["燁", "烨"],
  ["燈", "灯"],
  ["燉", "炖"],
  ["燐", "磷"],
  ["燒", "烧"],
  ["燙", "烫"],
  ["燜", "焖"],
  ["營", "营"],
  ["燦", "灿"],
  ["燬", "毁"],
  ["燭", "烛"],
  ["燴", "烩"],
  ["燻", "熏"],
  ["燼", "烬"],
  ["燾", "焘"],
  ["燿", "耀"],
  ["爍", "烁"],
  ["爐", "炉"],
  ["爛", "烂"],
  ["爭", "争"],
  ["爲", "为"],
  ["爺", "爷"],
  ["爾", "尔"],
  ["牆", "墙"],
  ["牘", "牍"],
  ["牴", "抵"],
  ["牽", "牵"],
  ["犖", "荦"],
  ["犛", "牦"],
  ["犢", "犊"],
  ["犧", "牺"],
  ["狀", "状"],
  ["狹", "狭"],
  ["狽", "狈"],
  ["猙", "狰"],
  ["猶", "犹"],
  ["猻", "狲"],
  ["獁", "犸"],
  ["獃", "呆"],
  ["獄", "狱"],
  ["獅", "狮"],
  ["獎", "奖"],
  ["獨", "独"],
  ["獪", "狯"],
  ["獫", "猃"],
  ["獮", "狝"],
  ["獰", "狞"],
  ["獲", "获"],
  ["獵", "猎"],
  ["獷", "犷"],
  ["獸", "兽"],
  ["獺", "獭"],
  ["獻", "献"],
  ["獼", "猕"],
  ["玀", "猡"],
  ["玆", "兹"],
  ["玨", "珏"],
  ["珪", "圭"],
  ["珮", "佩"],
  ["現", "现"],
  ["琱", "雕"],
  ["琺", "珐"],
  ["琿", "珲"],
  ["瑋", "玮"],
  ["瑣", "琐"],
  ["瑤", "瑶"],
  ["瑩", "莹"],
  ["瑪", "玛"],
  ["瑯", "琅"],
  ["瑲", "玱"],
  ["璉", "琏"],
  ["璡", "琎"],
  ["璣", "玑"],
  ["璦", "瑷"],
  ["環", "环"],
  ["璽", "玺"],
  ["璿", "璇"],
  ["瓊", "琼"],
  ["瓏", "珑"],
  ["瓔", "璎"],
  ["瓖", "镶"],
  ["瓚", "瓒"],
  ["甌", "瓯"],
  ["甕", "瓮"],
  ["産", "产"],
  ["甦", "苏"],
  ["畝", "亩"],
  ["畢", "毕"],
  ["畫", "画"],
  ["畬", "畲"],
  ["異", "异"],
  ["當", "当"],
  ["疇", "畴"],
  ["疊", "叠"],
  ["疿", "痱"],
  ["痙", "痉"],
  ["痠", "酸"],
  ["痲", "麻"],
  ["痳", "麻"],
  ["痺", "痹"],
  ["痾", "疴"],
  ["瘂", "痖"],
  ["瘉", "愈"],
  ["瘋", "疯"],
  ["瘍", "疡"],
  ["瘓", "痪"],
  ["瘞", "瘗"],
  ["瘡", "疮"],
  ["瘧", "疟"],
  ["瘺", "瘘"],
  ["瘻", "瘘"],
  ["療", "疗"],
  ["癆", "痨"],
  ["癇", "痫"],
  ["癉", "瘅"],
  ["癒", "愈"],
  ["癘", "疠"],
  ["癟", "瘪"],
  ["癡", "痴"],
  ["癢", "痒"],
  ["癤", "疖"],
  ["癥", "症"],
  ["癧", "疬"],
  ["癩", "癞"],
  ["癬", "癣"],
  ["癭", "瘿"],
  ["癮", "瘾"],
  ["癰", "痈"],
  ["癱", "瘫"],
  ["癲", "癫"],
  ["發", "发"],
  ["皚", "皑"],
  ["皰", "疱"],
  ["皸", "皲"],
  ["皺", "皱"],
  ["盜", "盗"],
  ["盞", "盏"],
  ["盡", "尽"],
  ["監", "监"],
  ["盤", "盘"],
  ["盧", "卢"],
  ["盪", "荡"],
  ["眥", "眦"],
  ["眾", "众"],
  ["睏", "困"],
  ["睜", "睁"],
  ["睞", "睐"],
  ["睪", "睾"],
  ["瞇", "眯"],
  ["瞘", "眍"],
  ["瞜", "䁖"],
  ["瞞", "瞒"],
  ["瞼", "睑"],
  ["矓", "眬"],
  ["矚", "瞩"],
  ["矯", "矫"],
  ["砲", "炮"],
  ["硃", "朱"],
  ["硤", "硖"],
  ["硨", "砗"],
  ["硯", "砚"],
  ["碕", "崎"],
  ["碩", "硕"],
  ["碪", "砧"],
  ["碭", "砀"],
  ["碸", "砜"],
  ["確", "确"],
  ["碼", "码"],
  ["磑", "硙"],
  ["磚", "砖"],
  ["磣", "碜"],
  ["磧", "碛"],
  ["磯", "矶"],
  ["磽", "硗"],
  ["礄", "硚"],
  ["礎", "础"],
  ["礙", "碍"],
  ["礦", "矿"],
  ["礪", "砺"],
  ["礫", "砾"],
  ["礬", "矾"],
  ["礱", "砻"],
  ["祅", "祆"],
  ["祇", "只"],
  ["祐", "佑"],
  ["祼", "裸"],
  ["祿", "禄"],
  ["禍", "祸"],
  ["禎", "祯"],
  ["禕", "祎"],
  ["禦", "御"],
  ["禪", "禅"],
  ["禮", "礼"],
  ["禱", "祷"],
  ["禿", "秃"],
  ["秈", "籼"],
  ["秏", "耗"],
  ["稅", "税"],
  ["稈", "秆"],
  ["稜", "棱"],
  ["稟", "禀"],
  ["稨", "扁"],
  ["種", "种"],
  ["稱", "称"],
  ["穀", "谷"],
  ["穇", "䅟"],
  ["穌", "稣"],
  ["積", "积"],
  ["穎", "颖"],
  ["穡", "穑"],
  ["穢", "秽"],
  ["穨", "颓"],
  ["穩", "稳"],
  ["穫", "获"],
  ["窩", "窝"],
  ["窪", "洼"],
  ["窮", "穷"],
  ["窯", "窑"],
  ["窵", "窎"],
  ["窶", "窭"],
  ["窺", "窥"],
  ["竄", "窜"],
  ["竅", "窍"],
  ["竇", "窦"],
  ["竊", "窃"],
  ["競", "竞"],
  ["笻", "筇"],
  ["筆", "笔"],
  ["筍", "笋"],
  ["筧", "笕"],
  ["筴", "策"],
  ["箄", "箅"],
  ["箇", "个"],
  ["箋", "笺"],
  ["箏", "筝"],
  ["箠", "棰"],
  ["節", "节"],
  ["範", "范"],
  ["築", "筑"],
  ["篋", "箧"],
  ["篛", "箬"],
  ["篠", "筱"],
  ["篤", "笃"],
  ["篩", "筛"],
  ["篳", "筚"],
  ["簀", "箦"],
  ["簍", "篓"],
  ["簑", "蓑"],
  ["簞", "箪"],
  ["簡", "简"],
  ["簣", "篑"],
  ["簫", "箫"],
  ["簷", "檐"],
  ["簽", "签"],
  ["簾", "帘"],
  ["籃", "篮"],
  ["籌", "筹"],
  ["籐", "藤"],
  ["籙", "箓"],
  ["籜", "箨"],
  ["籟", "籁"],
  ["籠", "笼"],
  ["籤", "签"],
  ["籥", "龠"],
  ["籩", "笾"],
  ["籪", "簖"],
  ["籬", "篱"],
  ["籮", "箩"],
  ["籲", "吁"],
  ["粧", "妆"],
  ["粵", "粤"],
  ["糝", "糁"],
  ["糞", "粪"],
  ["糧", "粮"],
  ["糰", "团"],
  ["糲", "粝"],
  ["糴", "籴"],
  ["糶", "粜"],
  ["糾", "纠"],
  ["紀", "纪"],
  ["紂", "纣"],
  ["約", "约"],
  ["紅", "红"],
  ["紆", "纡"],
  ["紇", "纥"],
  ["紈", "纨"],
  ["紉", "纫"],
  ["紋", "纹"],
  ["納", "纳"],
  ["紐", "纽"],
  ["紓", "纾"],
  ["純", "纯"],
  ["紕", "纰"],
  ["紖", "纼"],
  ["紗", "纱"],
  ["紘", "纮"],
  ["紙", "纸"],
  ["級", "级"],
  ["紛", "纷"],
  ["紜", "纭"],
  ["紝", "纴"],
  ["紡", "纺"],
  ["紬", "䌷"],
  ["紮", "扎"],
  ["細", "细"],
  ["紱", "绂"],
  ["紲", "绁"],
  ["紳", "绅"],
  ["紹", "绍"],
  ["紺", "绀"],
  ["紼", "绋"],
  ["紿", "绐"],
  ["絀", "绌"],
  ["終", "终"],
  ["絃", "弦"],
  ["組", "组"],
  ["絆", "绊"],
  ["絎", "绗"],
  ["結", "结"],
  ["絕", "绝"],
  ["絛", "绦"],
  ["絝", "绔"],
  ["絞", "绞"],
  ["絡", "络"],
  ["絢", "绚"],
  ["給", "给"],
  ["絨", "绒"],
  ["絰", "绖"],
  ["統", "统"],
  ["絲", "丝"],
  ["絳", "绛"],
  ["絹", "绢"],
  ["綁", "绑"],
  ["綃", "绡"],
  ["綆", "绠"],
  ["綈", "绨"],
  ["綏", "绥"],
  ["綑", "捆"],
  ["經", "经"],
  ["綜", "综"],
  ["綞", "缍"],
  ["綠", "绿"],
  ["綢", "绸"],
  ["綣", "绻"],
  ["綬", "绶"],
  ["維", "维"],
  ["綰", "绾"],
  ["綱", "纲"],
  ["網", "网"],
  ["綴", "缀"],
  ["綵", "彩"],
  ["綸", "纶"],
  ["綹", "绺"],
  ["綺", "绮"],
  ["綻", "绽"],
  ["綽", "绰"],
  ["綾", "绫"],
  ["綿", "绵"],
  ["緄", "绲"],
  ["緇", "缁"],
  ["緊", "紧"],
  ["緋", "绯"],
  ["緒", "绪"],
  ["緔", "绱"],
  ["緗", "缃"],
  ["緘", "缄"],
  ["緙", "缂"],
  ["線", "线"],
  ["緝", "缉"],
  ["緞", "缎"],
  ["締", "缔"],
  ["緡", "缗"],
  ["緣", "缘"],
  ["緦", "缌"],
  ["編", "编"],
  ["緩", "缓"],
  ["緬", "缅"],
  ["緯", "纬"],
  ["緱", "缑"],
  ["緲", "缈"],
  ["練", "练"],
  ["緶", "缏"],
  ["緹", "缇"],
  ["縈", "萦"],
  ["縉", "缙"],
  ["縊", "缢"],
  ["縋", "缒"],
  ["縐", "绉"],
  ["縑", "缣"],
  ["縕", "缊"],
  ["縗", "缞"],
  ["縚", "绦"],
  ["縛", "缚"],
  ["縝", "缜"],
  ["縞", "缟"],
  ["縟", "缛"],
  ["縣", "县"],
  ["縫", "缝"],
  ["縭", "缡"],
  ["縮", "缩"],
  ["縯", "演"],
  ["縱", "纵"],
  ["縲", "缧"],
  ["縳", "缚"],
  ["縴", "纤"],
  ["縵", "缦"],
  ["縶", "絷"],
  ["縷", "缕"],
  ["縹", "缥"],
  ["總", "总"],
  ["績", "绩"],
  ["繃", "绷"],
  ["繅", "缫"],
  ["繆", "缪"],
  ["繈", "襁"],
  ["繒", "缯"],
  ["織", "织"],
  ["繕", "缮"],
  ["繚", "缭"],
  ["繞", "绕"],
  ["繡", "绣"],
  ["繢", "缋"],
  ["繩", "绳"],
  ["繪", "绘"],
  ["繫", "系"],
  ["繭", "茧"],
  ["繯", "缳"],
  ["繰", "缲"],
  ["繳", "缴"],
  ["繹", "绎"],
  ["繼", "继"],
  ["繽", "缤"],
  ["繾", "缱"],
  ["纈", "缬"],
  ["纊", "纩"],
  ["續", "续"],
  ["纍", "累"],
  ["纏", "缠"],
  ["纓", "缨"],
  ["纖", "纤"],
  ["纘", "缵"],
  ["纜", "缆"],
  ["缽", "钵"],
  ["罈", "坛"],
  ["罌", "罂"],
  ["罦", "罘"],
  ["罰", "罚"],
  ["罵", "骂"],
  ["罷", "罢"],
  ["羅", "罗"],
  ["羆", "罴"],
  ["羈", "羁"],
  ["羋", "芈"],
  ["羥", "羟"],
  ["羨", "羡"],
  ["義", "义"],
  ["羶", "膻"],
  ["習", "习"],
  ["翬", "翚"],
  ["翹", "翘"],
  ["耑", "端"],
  ["耡", "助"],
  ["耤", "藉"],
  ["耬", "耧"],
  ["耮", "耢"],
  ["聖", "圣"],
  ["聞", "闻"],
  ["聯", "联"],
  ["聰", "聪"],
  ["聲", "声"],
  ["聳", "耸"],
  ["聵", "聩"],
  ["聶", "聂"],
  ["職", "职"],
  ["聹", "聍"],
  ["聽", "听"],
  ["聾", "聋"],
  ["肅", "肃"],
  ["肐", "胳"],
  ["胇", "肺"],
  ["胊", "朐"],
  ["脅", "胁"],
  ["脈", "脉"],
  ["脛", "胫"],
  ["脫", "脱"],
  ["脹", "胀"],
  ["腎", "肾"],
  ["腖", "胨"],
  ["腡", "脶"],
  ["腦", "脑"],
  ["腫", "肿"],
  ["腳", "脚"],
  ["腸", "肠"],
  ["膃", "腽"],
  ["膆", "嗉"],
  ["膕", "腘"],
  ["膚", "肤"],
  ["膞", "䏝"],
  ["膠", "胶"],
  ["膩", "腻"],
  ["膽", "胆"],
  ["膾", "脍"],
  ["膿", "脓"],
  ["臉", "脸"],
  ["臍", "脐"],
  ["臏", "膑"],
  ["臕", "膘"],
  ["臘", "腊"],
  ["臙", "胭"],
  ["臚", "胪"],
  ["臟", "脏"],
  ["臠", "脔"],
  ["臢", "臜"],
  ["臥", "卧"],
  ["臨", "临"],
  ["與", "与"],
  ["興", "兴"],
  ["舉", "举"],
  ["舊", "旧"],
  ["舋", "衅"],
  ["舖", "铺"],
  ["艙", "舱"],
  ["艣", "橹"],
  ["艤", "舣"],
  ["艦", "舰"],
  ["艫", "舻"],
  ["艱", "艰"],
  ["艷", "艳"],
  ["芻", "刍"],
  ["苧", "苎"],
  ["茍", "苟"],
  ["荊", "荆"],
  ["莊", "庄"],
  ["莖", "茎"],
  ["莢", "荚"],
  ["莧", "苋"],
  ["菫", "堇"],
  ["華", "华"],
  ["菴", "庵"],
  ["萇", "苌"],
  ["萊", "莱"],
  ["萬", "万"],
  ["萵", "莴"],
  ["葉", "叶"],
  ["葒", "荭"],
  ["著", "着"],
  ["葤", "荮"],
  ["葦", "苇"],
  ["葯", "药"],
  ["葷", "荤"],
  ["蒔", "莳"],
  ["蒞", "莅"],
  ["蒼", "苍"],
  ["蓀", "荪"],
  ["蓆", "席"],
  ["蓋", "盖"],
  ["蓮", "莲"],
  ["蓯", "苁"],
  ["蓴", "莼"],
  ["蓽", "荜"],
  ["蔆", "菱"],
  ["蔔", "卜"],
  ["蔞", "蒌"],
  ["蔣", "蒋"],
  ["蔥", "葱"],
  ["蔦", "茑"],
  ["蔭", "荫"],
  ["蕁", "荨"],
  ["蕆", "蒇"],
  ["蕎", "荞"],
  ["蕒", "荬"],
  ["蕕", "莸"],
  ["蕘", "荛"],
  ["蕢", "蒉"],
  ["蕩", "荡"],
  ["蕪", "芜"],
  ["蕭", "萧"],
  ["蕷", "蓣"],
  ["薈", "荟"],
  ["薊", "蓟"],
  ["薌", "芗"],
  ["薑", "姜"],
  ["薔", "蔷"],
  ["薙", "剃"],
  ["薟", "莶"],
  ["薦", "荐"],
  ["薩", "萨"],
  ["薺", "荠"],
  ["藍", "蓝"],
  ["藎", "荩"],
  ["藝", "艺"],
  ["藥", "药"],
  ["藪", "薮"],
  ["藭", "䓖"],
  ["藶", "苈"],
  ["藷", "薯"],
  ["藹", "蔼"],
  ["藺", "蔺"],
  ["蘀", "萚"],
  ["蘄", "蕲"],
  ["蘆", "芦"],
  ["蘇", "苏"],
  ["蘊", "蕴"],
  ["蘋", "苹"],
  ["蘗", "蘖"],
  ["蘚", "藓"],
  ["蘞", "蔹"],
  ["蘢", "茏"],
  ["蘭", "兰"],
  ["蘺", "蓠"],
  ["蘿", "萝"],
  ["處", "处"],
  ["虖", "呼"],
  ["虛", "虚"],
  ["虜", "虏"],
  ["號", "号"],
  ["虧", "亏"],
  ["虯", "虬"],
  ["蛺", "蛱"],
  ["蛻", "蜕"],
  ["蜆", "蚬"],
  ["蜺", "霓"],
  ["蝕", "蚀"],
  ["蝟", "猬"],
  ["蝦", "虾"],
  ["蝨", "虱"],
  ["蝸", "蜗"],
  ["螄", "蛳"],
  ["螞", "蚂"],
  ["螢", "萤"],
  ["螻", "蝼"],
  ["蟄", "蛰"],
  ["蟈", "蝈"],
  ["蟎", "螨"],
  ["蟣", "虮"],
  ["蟬", "蝉"],
  ["蟯", "蛲"],
  ["蟲", "虫"],
  ["蟶", "蛏"],
  ["蟺", "蟮"],
  ["蟻", "蚁"],
  ["蠅", "蝇"],
  ["蠆", "虿"],
  ["蠍", "蝎"],
  ["蠐", "蛴"],
  ["蠑", "蝾"],
  ["蠔", "蚝"],
  ["蠟", "蜡"],
  ["蠣", "蛎"],
  ["蠨", "蟏"],
  ["蠱", "蛊"],
  ["蠶", "蚕"],
  ["蠷", "蠼"],
  ["蠻", "蛮"],
  ["衆", "众"],
  ["衊", "蔑"],
  ["衒", "炫"],
  ["術", "术"],
  ["衚", "胡"],
  ["衛", "卫"],
  ["衝", "冲"],
  ["衹", "只"],
  ["袞", "衮"],
  ["袪", "祛"],
  ["裊", "袅"],
  ["補", "补"],
  ["裝", "装"],
  ["裡", "里"],
  ["製", "制"],
  ["複", "复"],
  ["褎", "袖"],
  ["褲", "裤"],
  ["褳", "裢"],
  ["褸", "褛"],
  ["褻", "亵"],
  ["襉", "裥"],
  ["襖", "袄"],
  ["襝", "裣"],
  ["襠", "裆"],
  ["襤", "褴"],
  ["襪", "袜"],
  ["襬", "摆"],
  ["襯", "衬"],
  ["襲", "袭"],
  ["覈", "核"],
  ["見", "见"],
  ["覎", "觃"],
  ["規", "规"],
  ["覓", "觅"],
  ["視", "视"],
  ["覘", "觇"],
  ["覡", "觋"],
  ["覦", "觎"],
  ["親", "亲"],
  ["覬", "觊"],
  ["覯", "觏"],
  ["覲", "觐"],
  ["覷", "觑"],
  ["覺", "觉"],
  ["覽", "览"],
  ["覿", "觌"],
  ["觀", "观"],
  ["觔", "筋"],
  ["觝", "抵"],
  ["觴", "觞"],
  ["觶", "觯"],
  ["觸", "触"],
  ["訂", "订"],
  ["訃", "讣"],
  ["計", "计"],
  ["訊", "讯"],
  ["訌", "讧"],
  ["討", "讨"],
  ["訐", "讦"],
  ["訓", "训"],
  ["訕", "讪"],
  ["訖", "讫"],
  ["託", "托"],
  ["記", "记"],
  ["訛", "讹"],
  ["訝", "讶"],
  ["訟", "讼"],
  ["訢", "欣"],
  ["訣", "诀"],
  ["訥", "讷"],
  ["訩", "讻"],
  ["訪", "访"],
  ["設", "设"],
  ["許", "许"],
  ["訴", "诉"],
  ["訶", "诃"],
  ["診", "诊"],
  ["註", "注"],
  ["証", "证"],
  ["詁", "诂"],
  ["詆", "诋"],
  ["詎", "讵"],
  ["詐", "诈"],
  ["詒", "诒"],
  ["詔", "诏"],
  ["評", "评"],
  ["詗", "诇"],
  ["詘", "诎"],
  ["詛", "诅"],
  ["詞", "词"],
  ["詠", "咏"],
  ["詡", "诩"],
  ["詢", "询"],
  ["詣", "诣"],
  ["試", "试"],
  ["詩", "诗"],
  ["詫", "诧"],
  ["詬", "诟"],
  ["詭", "诡"],
  ["詮", "诠"],
  ["詰", "诘"],
  ["話", "话"],
  ["該", "该"],
  ["詳", "详"],
  ["詵", "诜"],
  ["詶", "酬"],
  ["詻", "咯"],
  ["詼", "诙"],
  ["詿", "诖"],
  ["誄", "诔"],
  ["誅", "诛"],
  ["誆", "诓"],
  ["誇", "夸"],
  ["誌", "志"],
  ["認", "认"],
  ["誑", "诳"],
  ["誒", "诶"],
  ["誕", "诞"],
  ["誘", "诱"],
  ["誚", "诮"],
  ["語", "语"],
  ["誠", "诚"],
  ["誡", "诫"],
  ["誣", "诬"],
  ["誤", "误"],
  ["誥", "诰"],
  ["誦", "诵"],
  ["誨", "诲"],
  ["說", "说"],
  ["説", "说"],
  ["誰", "谁"],
  ["課", "课"],
  ["誶", "谇"],
  ["誹", "诽"],
  ["誼", "谊"],
  ["調", "调"],
  ["諂", "谄"],
  ["諄", "谆"],
  ["談", "谈"],
  ["諉", "诿"],
  ["請", "请"],
  ["諍", "诤"],
  ["諏", "诹"],
  ["諑", "诼"],
  ["諒", "谅"],
  ["論", "论"],
  ["諗", "谂"],
  ["諛", "谀"],
  ["諜", "谍"],
  ["諝", "谞"],
  ["諞", "谝"],
  ["諠", "喧"],
  ["諢", "诨"],
  ["諤", "谔"],
  ["諦", "谛"],
  ["諧", "谐"],
  ["諫", "谏"],
  ["諭", "谕"],
  ["諮", "谘"],
  ["諱", "讳"],
  ["諳", "谙"],
  ["諶", "谌"],
  ["諷", "讽"],
  ["諸", "诸"],
  ["諺", "谚"],
  ["諼", "谖"],
  ["諾", "诺"],
  ["謀", "谋"],
  ["謁", "谒"],
  ["謂", "谓"],
  ["謄", "誊"],
  ["謅", "诌"],
  ["謊", "谎"],
  ["謎", "谜"],
  ["謐", "谧"],
  ["謔", "谑"],
  ["謖", "谡"],
  ["謗", "谤"],
  ["謙", "谦"],
  ["謚", "谥"],
  ["講", "讲"],
  ["謝", "谢"],
  ["謠", "谣"],
  ["謨", "谟"],
  ["謫", "谪"],
  ["謬", "谬"],
  ["謳", "讴"],
  ["謹", "谨"],
  ["謼", "呼"],
  ["謾", "谩"],
  ["譁", "哗"],
  ["譆", "嘻"],
  ["證", "证"],
  ["譎", "谲"],
  ["譏", "讥"],
  ["譔", "撰"],
  ["譖", "谮"],
  ["識", "识"],
  ["譙", "谯"],
  ["譚", "谭"],
  ["譜", "谱"],
  ["譟", "噪"],
  ["譫", "谵"],
  ["譭", "毁"],
  ["譯", "译"],
  ["議", "议"],
  ["譴", "谴"],
  ["護", "护"],
  ["譽", "誉"],
  ["譾", "谫"],
  ["讀", "读"],
  ["讅", "谉"],
  ["變", "变"],
  ["讌", "宴"],
  ["讎", "雠"],
  ["讒", "谗"],
  ["讓", "让"],
  ["讕", "谰"],
  ["讖", "谶"],
  ["讚", "赞"],
  ["讜", "谠"],
  ["讞", "谳"],
  ["谿", "溪"],
  ["豈", "岂"],
  ["豎", "竖"],
  ["豐", "丰"],
  ["豔", "艳"],
  ["豬", "猪"],
  ["豶", "豮"],
  ["貍", "狸"],
  ["貓", "猫"],
  ["貝", "贝"],
  ["貞", "贞"],
  ["負", "负"],
  ["財", "财"],
  ["貢", "贡"],
  ["貧", "贫"],
  ["貨", "货"],
  ["販", "贩"],
  ["貪", "贪"],
  ["貫", "贯"],
  ["責", "责"],
  ["貯", "贮"],
  ["貰", "贳"],
  ["貲", "赀"],
  ["貳", "贰"],
  ["貴", "贵"],
  ["貶", "贬"],
  ["買", "买"],
  ["貸", "贷"],
  ["貺", "贶"],
  ["費", "费"],
  ["貼", "贴"],
  ["貽", "贻"],
  ["貿", "贸"],
  ["賀", "贺"],
  ["賁", "贲"],
  ["賂", "赂"],
  ["賃", "赁"],
  ["賄", "贿"],
  ["賅", "赅"],
  ["資", "资"],
  ["賈", "贾"],
  ["賊", "贼"],
  ["賑", "赈"],
  ["賒", "赊"],
  ["賓", "宾"],
  ["賕", "赇"],
  ["賙", "赒"],
  ["賚", "赉"],
  ["賜", "赐"],
  ["賞", "赏"],
  ["賠", "赔"],
  ["賡", "赓"],
  ["賢", "贤"],
  ["賣", "卖"],
  ["賤", "贱"],
  ["賦", "赋"],
  ["賧", "赕"],
  ["質", "质"],
  ["賬", "账"],
  ["賭", "赌"],
  ["賴", "赖"],
  ["賵", "赗"],
  ["賸", "剩"],
  ["賺", "赚"],
  ["賻", "赙"],
  ["購", "购"],
  ["賽", "赛"],
  ["賾", "赜"],
  ["贄", "贽"],
  ["贅", "赘"],
  ["贈", "赠"],
  ["贊", "赞"],
  ["贋", "赝"],
  ["贍", "赡"],
  ["贏", "赢"],
  ["贐", "赆"],
  ["贓", "赃"],
  ["贖", "赎"],
  ["贛", "赣"],
  ["趕", "赶"],
  ["趙", "赵"],
  ["趨", "趋"],
  ["趲", "趱"],
  ["跡", "迹"],
  ["踐", "践"],
  ["踡", "蜷"],
  ["踰", "逾"],
  ["踴", "踊"],
  ["蹌", "跄"],
  ["蹕", "跸"],
  ["蹟", "迹"],
  ["蹠", "跖"],
  ["蹣", "蹒"],
  ["蹤", "踪"],
  ["蹧", "糟"],
  ["蹺", "跷"],
  ["躉", "趸"],
  ["躊", "踌"],
  ["躋", "跻"],
  ["躍", "跃"],
  ["躑", "踯"],
  ["躒", "跞"],
  ["躓", "踬"],
  ["躕", "蹰"],
  ["躚", "跹"],
  ["躡", "蹑"],
  ["躥", "蹿"],
  ["躦", "躜"],
  ["躪", "躏"],
  ["軀", "躯"],
  ["車", "车"],
  ["軋", "轧"],
  ["軌", "轨"],
  ["軍", "军"],
  ["軒", "轩"],
  ["軔", "轫"],
  ["軛", "轭"],
  ["軟", "软"],
  ["軤", "轷"],
  ["軫", "轸"],
  ["軲", "轱"],
  ["軸", "轴"],
  ["軹", "轵"],
  ["軺", "轺"],
  ["軻", "轲"],
  ["軼", "轶"],
  ["軾", "轼"],
  ["較", "较"],
  ["輅", "辂"],
  ["輇", "辁"],
  ["載", "载"],
  ["輊", "轾"],
  ["輒", "辄"],
  ["輓", "挽"],
  ["輔", "辅"],
  ["輕", "轻"],
  ["輛", "辆"],
  ["輜", "辎"],
  ["輝", "辉"],
  ["輞", "辋"],
  ["輟", "辍"],
  ["輥", "辊"],
  ["輦", "辇"],
  ["輩", "辈"],
  ["輪", "轮"],
  ["輯", "辑"],
  ["輳", "辏"],
  ["輸", "输"],
  ["輻", "辐"],
  ["輾", "辗"],
  ["輿", "舆"],
  ["轂", "毂"],
  ["轄", "辖"],
  ["轅", "辕"],
  ["轆", "辘"],
  ["轉", "转"],
  ["轍", "辙"],
  ["轎", "轿"],
  ["轔", "辚"],
  ["轟", "轰"],
  ["轡", "辔"],
  ["轢", "轹"],
  ["轤", "轳"],
  ["辦", "办"],
  ["辭", "辞"],
  ["辮", "辫"],
  ["辯", "辩"],
  ["農", "农"],
  ["迆", "迤"],
  ["逕", "迳"],
  ["這", "这"],
  ["連", "连"],
  ["進", "进"],
  ["遊", "游"],
  ["運", "运"],
  ["過", "过"],
  ["達", "达"],
  ["違", "违"],
  ["遙", "遥"],
  ["遜", "逊"],
  ["遞", "递"],
  ["遠", "远"],
  ["適", "适"],
  ["遲", "迟"],
  ["遷", "迁"],
  ["選", "选"],
  ["遺", "遗"],
  ["遼", "辽"],
  ["邁", "迈"],
  ["還", "还"],
  ["邇", "迩"],
  ["邊", "边"],
  ["邏", "逻"],
  ["邐", "逦"],
  ["郟", "郏"],
  ["郵", "邮"],
  ["鄆", "郓"],
  ["鄉", "乡"],
  ["鄒", "邹"],
  ["鄔", "邬"],
  ["鄖", "郧"],
  ["鄧", "邓"],
  ["鄭", "郑"],
  ["鄰", "邻"],
  ["鄲", "郸"],
  ["鄴", "邺"],
  ["鄶", "郐"],
  ["鄺", "邝"],
  ["酈", "郦"],
  ["酖", "鸩"],
  ["醃", "腌"],
  ["醆", "盏"],
  ["醜", "丑"],
  ["醞", "酝"],
  ["醫", "医"],
  ["醬", "酱"],
  ["醱", "发"],
  ["醼", "宴"],
  ["釀", "酿"],
  ["釁", "衅"],
  ["釃", "酾"],
  ["釅", "酽"],
  ["釆", "采"],
  ["釋", "释"],
  ["釐", "厘"],
  ["釓", "钆"],
  ["釔", "钇"],
  ["釕", "钌"],
  ["釗", "钊"],
  ["釘", "钉"],
  ["釙", "钋"],
  ["針", "针"],
  ["釣", "钓"],
  ["釤", "钐"],
  ["釦", "扣"],
  ["釧", "钏"],
  ["釩", "钒"],
  ["釵", "钗"],
  ["釷", "钍"],
  ["釹", "钕"],
  ["釺", "钎"],
  ["釾", "䥺"],
  ["鈀", "钯"],
  ["鈁", "钫"],
  ["鈃", "钘"],
  ["鈄", "钭"],
  ["鈈", "钚"],
  ["鈉", "钠"],
  ["鈍", "钝"],
  ["鈐", "钤"],
  ["鈑", "钣"],
  ["鈔", "钞"],
  ["鈕", "钮"],
  ["鈞", "钧"],
  ["鈣", "钙"],
  ["鈥", "钬"],
  ["鈦", "钛"],
  ["鈧", "钪"],
  ["鈮", "铌"],
  ["鈰", "铈"],
  ["鈳", "钶"],
  ["鈴", "铃"],
  ["鈷", "钴"],
  ["鈸", "钹"],
  ["鈹", "铍"],
  ["鈺", "钰"],
  ["鈽", "钸"],
  ["鈾", "铀"],
  ["鈿", "钿"],
  ["鉀", "钾"],
  ["鉅", "钜"],
  ["鉆", "钻"],
  ["鉈", "铊"],
  ["鉉", "铉"],
  ["鉋", "刨"],
  ["鉍", "铋"],
  ["鉑", "铂"],
  ["鉕", "钷"],
  ["鉗", "钳"],
  ["鉚", "铆"],
  ["鉛", "铅"],
  ["鉞", "钺"],
  ["鉢", "钵"],
  ["鈎", "钩"],
  ["鉦", "钲"],
  ["鉬", "钼"],
  ["鉭", "钽"],
  ["鉶", "铏"],
  ["鉸", "铰"],
  ["鉺", "铒"],
  ["鉻", "铬"],
  ["鉿", "铪"],
  ["銀", "银"],
  ["銃", "铳"],
  ["銅", "铜"],
  ["銑", "铣"],
  ["銓", "铨"],
  ["銖", "铢"],
  ["銘", "铭"],
  ["銚", "铫"],
  ["銜", "衔"],
  ["銠", "铑"],
  ["銣", "铷"],
  ["銥", "铱"],
  ["銦", "铟"],
  ["銨", "铵"],
  ["銩", "铥"],
  ["銪", "铕"],
  ["銫", "铯"],
  ["銬", "铐"],
  ["銱", "铞"],
  ["銲", "焊"],
  ["銳", "锐"],
  ["銷", "销"],
  ["銹", "锈"],
  ["銻", "锑"],
  ["銼", "锉"],
  ["鋁", "铝"],
  ["鋃", "锒"],
  ["鋅", "锌"],
  ["鋇", "钡"],
  ["鋌", "铤"],
  ["鋏", "铗"],
  ["鋒", "锋"],
  ["鋝", "锊"],
  ["鋟", "锓"],
  ["鋣", "铘"],
  ["鋤", "锄"],
  ["鋥", "锃"],
  ["鋦", "锔"],
  ["鋨", "锇"],
  ["鋩", "铓"],
  ["鋪", "铺"],
  ["鋮", "铖"],
  ["鋯", "锆"],
  ["鋰", "锂"],
  ["鋱", "铽"],
  ["鋶", "锍"],
  ["鋸", "锯"],
  ["鋻", "鉴"],
  ["鋼", "钢"],
  ["錁", "锞"],
  ["錄", "录"],
  ["錆", "锖"],
  ["錇", "锫"],
  ["錈", "锩"],
  ["錐", "锥"],
  ["錒", "锕"],
  ["錕", "锟"],
  ["錘", "锤"],
  ["錙", "锱"],
  ["錚", "铮"],
  ["錛", "锛"],
  ["錟", "锬"],
  ["錠", "锭"],
  ["錢", "钱"],
  ["錦", "锦"],
  ["錨", "锚"],
  ["錫", "锡"],
  ["錮", "锢"],
  ["錯", "错"],
  ["錳", "锰"],
  ["錸", "铼"],
  ["鍀", "锝"],
  ["鍁", "锨"],
  ["鍃", "锪"],
  ["鍆", "钔"],
  ["鍇", "锴"],
  ["鍊", "炼"],
  ["鍋", "锅"],
  ["鍍", "镀"],
  ["鍔", "锷"],
  ["鍘", "铡"],
  ["鍚", "钖"],
  ["鍛", "锻"],
  ["鍤", "锸"],
  ["鍥", "锲"],
  ["鍩", "锘"],
  ["鍬", "锹"],
  ["鍰", "锾"],
  ["鍵", "键"],
  ["鍶", "锶"],
  ["鍺", "锗"],
  ["鍼", "针"],
  ["鎂", "镁"],
  ["鎄", "锿"],
  ["鎇", "镅"],
  ["鎊", "镑"],
  ["鎌", "镰"],
  ["鎔", "镕"],
  ["鎖", "锁"],
  ["鎗", "枪"],
  ["鎘", "镉"],
  ["鎚", "锤"],
  ["鎡", "镃"],
  ["鎢", "钨"],
  ["鎣", "蓥"],
  ["鎦", "镏"],
  ["鎧", "铠"],
  ["鎩", "铩"],
  ["鎪", "锼"],
  ["鎬", "镐"],
  ["鎮", "镇"],
  ["鎰", "镒"],
  ["鎳", "镍"],
  ["鎵", "镓"],
  ["鎿", "镎"],
  ["鏃", "镞"],
  ["鏇", "镟"],
  ["鏈", "链"],
  ["鏌", "镆"],
  ["鏍", "镙"],
  ["鏑", "镝"],
  ["鏗", "铿"],
  ["鏘", "锵"],
  ["鏜", "镗"],
  ["鏝", "镘"],
  ["鏞", "镛"],
  ["鏟", "铲"],
  ["鏡", "镜"],
  ["鏢", "镖"],
  ["鏤", "镂"],
  ["鏨", "錾"],
  ["鏰", "镚"],
  ["鏵", "铧"],
  ["鏷", "镤"],
  ["鏹", "镪"],
  ["鏺", "䥽"],
  ["鏽", "锈"],
  ["鐃", "铙"],
  ["鐉", "铣"],
  ["鐋", "铴"],
  ["鐐", "镣"],
  ["鐒", "铹"],
  ["鐓", "镦"],
  ["鐔", "镡"],
  ["鐘", "钟"],
  ["鐙", "镫"],
  ["鐝", "镢"],
  ["鐠", "镨"],
  ["鐥", "䦅"],
  ["鐦", "锎"],
  ["鐧", "锏"],
  ["鐨", "镄"],
  ["鐫", "镌"],
  ["鐮", "镰"],
  ["鐯", "䦃"],
  ["鐲", "镯"],
  ["鐳", "镭"],
  ["鐵", "铁"],
  ["鐶", "镮"],
  ["鐸", "铎"],
  ["鐺", "铛"],
  ["鐿", "镱"],
  ["鑄", "铸"],
  ["鑊", "镬"],
  ["鑌", "镔"],
  ["鑑", "鉴"],
  ["鑒", "鉴"],
  ["鑔", "镲"],
  ["鑕", "锧"],
  ["鑞", "镴"],
  ["鑠", "铄"],
  ["鑣", "镳"],
  ["鑥", "镥"],
  ["鑪", "炉"],
  ["鑭", "镧"],
  ["鑰", "钥"],
  ["鑲", "镶"],
  ["鑷", "镊"],
  ["鑹", "镩"],
  ["鑼", "锣"],
  ["鑽", "钻"],
  ["鑾", "銮"],
  ["鑿", "凿"],
  ["钁", "䦆"],
  ["钂", "镋"],
  ["長", "长"],
  ["門", "门"],
  ["閂", "闩"],
  ["閃", "闪"],
  ["閆", "闫"],
  ["閉", "闭"],
  ["開", "开"],
  ["閌", "闶"],
  ["閎", "闳"],
  ["閏", "闰"],
  ["閑", "闲"],
  ["閒", "闲"],
  ["間", "间"],
  ["閔", "闵"],
  ["閘", "闸"],
  ["閡", "阂"],
  ["閣", "阁"],
  ["閥", "阀"],
  ["閨", "闺"],
  ["閩", "闽"],
  ["閫", "阃"],
  ["閬", "阆"],
  ["閭", "闾"],
  ["閱", "阅"],
  ["閶", "阊"],
  ["閹", "阉"],
  ["閻", "阎"],
  ["閼", "阏"],
  ["閽", "阍"],
  ["閾", "阈"],
  ["閿", "阌"],
  ["闃", "阒"],
  ["闇", "暗"],
  ["闈", "闱"],
  ["闊", "阔"],
  ["闋", "阕"],
  ["闌", "阑"],
  ["闐", "阗"],
  ["闓", "闿"],
  ["闔", "阖"],
  ["闕", "阙"],
  ["闖", "闯"],
  ["關", "关"],
  ["闞", "阚"],
  ["闡", "阐"],
  ["闢", "辟"],
  ["闥", "闼"],
  ["阬", "坑"],
  ["阯", "址"],
  ["陏", "隋"],
  ["陘", "陉"],
  ["陝", "陕"],
  ["陣", "阵"],
  ["陰", "阴"],
  ["陳", "陈"],
  ["陸", "陆"],
  ["陽", "阳"],
  ["隄", "堤"],
  ["隉", "陧"],
  ["隊", "队"],
  ["階", "阶"],
  ["隕", "陨"],
  ["際", "际"],
  ["隤", "颓"],
  ["隨", "随"],
  ["險", "险"],
  ["隱", "隐"],
  ["隴", "陇"],
  ["隸", "隶"],
  ["隻", "只"],
  ["雋", "隽"],
  ["雖", "虽"],
  ["雙", "双"],
  ["雛", "雏"],
  ["雜", "杂"],
  ["雞", "鸡"],
  ["離", "离"],
  ["難", "难"],
  ["雲", "云"],
  ["電", "电"],
  ["霧", "雾"],
  ["霽", "霁"],
  ["靂", "雳"],
  ["靄", "霭"],
  ["靆", "叇"],
  ["靈", "灵"],
  ["靉", "叆"],
  ["靚", "靓"],
  ["靜", "静"],
  ["靦", "腼"],
  ["靨", "靥"],
  ["鞏", "巩"],
  ["韁", "缰"],
  ["韃", "鞑"],
  ["韉", "鞯"],
  ["韋", "韦"],
  ["韌", "韧"],
  ["韍", "韨"],
  ["韓", "韩"],
  ["韙", "韪"],
  ["韜", "韬"],
  ["韞", "韫"],
  ["韻", "韵"],
  ["響", "响"],
  ["頁", "页"],
  ["頂", "顶"],
  ["頃", "顷"],
  ["項", "项"],
  ["順", "顺"],
  ["頇", "顸"],
  ["須", "须"],
  ["頊", "顼"],
  ["頌", "颂"],
  ["頎", "颀"],
  ["頏", "颃"],
  ["預", "预"],
  ["頑", "顽"],
  ["頒", "颁"],
  ["頓", "顿"],
  ["頗", "颇"],
  ["領", "领"],
  ["頜", "颌"],
  ["頡", "颉"],
  ["頤", "颐"],
  ["頦", "颏"],
  ["頫", "俯"],
  ["頭", "头"],
  ["頰", "颊"],
  ["頲", "颋"],
  ["頷", "颔"],
  ["頸", "颈"],
  ["頹", "颓"],
  ["頻", "频"],
  ["顆", "颗"],
  ["題", "题"],
  ["額", "额"],
  ["顎", "腭"],
  ["顏", "颜"],
  ["顒", "颙"],
  ["顓", "颛"],
  ["顔", "颜"],
  ["願", "愿"],
  ["顙", "颡"],
  ["顛", "颠"],
  ["類", "类"],
  ["顢", "颟"],
  ["顥", "颢"],
  ["顧", "顾"],
  ["顫", "颤"],
  ["顬", "颥"],
  ["顯", "显"],
  ["顰", "颦"],
  ["顱", "颅"],
  ["顳", "颞"],
  ["顴", "颧"],
  ["風", "风"],
  ["颮", "飑"],
  ["颯", "飒"],
  ["颳", "刮"],
  ["颶", "飓"],
  ["颸", "飔"],
  ["颺", "扬"],
  ["颼", "飕"],
  ["飀", "飗"],
  ["飄", "飘"],
  ["飆", "飙"],
  ["飈", "飚"],
  ["飛", "飞"],
  ["飢", "饥"],
  ["飥", "饦"],
  ["飩", "饨"],
  ["飪", "饪"],
  ["飫", "饫"],
  ["飭", "饬"],
  ["飯", "饭"],
  ["飲", "饮"],
  ["飴", "饴"],
  ["飼", "饲"],
  ["飽", "饱"],
  ["飾", "饰"],
  ["飿", "饳"],
  ["餃", "饺"],
  ["餄", "饸"],
  ["餅", "饼"],
  ["餈", "糍"],
  ["餉", "饷"],
  ["養", "养"],
  ["餌", "饵"],
  ["餎", "饹"],
  ["餏", "饻"],
  ["餑", "饽"],
  ["餒", "馁"],
  ["餓", "饿"],
  ["餔", "哺"],
  ["餘", "余"],
  ["餚", "肴"],
  ["餛", "馄"],
  ["餜", "馃"],
  ["餞", "饯"],
  ["餡", "馅"],
  ["館", "馆"],
  ["餬", "糊"],
  ["餱", "糇"],
  ["餳", "饧"],
  ["餵", "喂"],
  ["餶", "馉"],
  ["餷", "馇"],
  ["餺", "馎"],
  ["餼", "饩"],
  ["餽", "馈"],
  ["餾", "馏"],
  ["餿", "馊"],
  ["饃", "馍"],
  ["饅", "馒"],
  ["饈", "馐"],
  ["饉", "馑"],
  ["饊", "馓"],
  ["饋", "馈"],
  ["饌", "馔"],
  ["饑", "饥"],
  ["饒", "饶"],
  ["饗", "飨"],
  ["饜", "餍"],
  ["饞", "馋"],
  ["饟", "馕"],
  ["馬", "马"],
  ["馭", "驭"],
  ["馮", "冯"],
  ["馱", "驮"],
  ["馳", "驰"],
  ["馴", "驯"],
  ["駁", "驳"],
  ["駐", "驻"],
  ["駑", "驽"],
  ["駒", "驹"],
  ["駔", "驵"],
  ["駕", "驾"],
  ["駘", "骀"],
  ["駙", "驸"],
  ["駛", "驶"],
  ["駝", "驼"],
  ["駟", "驷"],
  ["駢", "骈"],
  ["駭", "骇"],
  ["駮", "驳"],
  ["駱", "骆"],
  ["駸", "骎"],
  ["駿", "骏"],
  ["騁", "骋"],
  ["騃", "呆"],
  ["騅", "骓"],
  ["騍", "骒"],
  ["騎", "骑"],
  ["騏", "骐"],
  ["騖", "骛"],
  ["騙", "骗"],
  ["騣", "鬃"],
  ["騫", "骞"],
  ["騭", "骘"],
  ["騮", "骝"],
  ["騰", "腾"],
  ["騶", "驺"],
  ["騷", "骚"],
  ["騸", "骟"],
  ["騾", "骡"],
  ["驀", "蓦"],
  ["驁", "骜"],
  ["驂", "骖"],
  ["驃", "骠"],
  ["驄", "骢"],
  ["驅", "驱"],
  ["驊", "骅"],
  ["驍", "骁"],
  ["驏", "骣"],
  ["驕", "骄"],
  ["驗", "验"],
  ["驚", "惊"],
  ["驛", "驿"],
  ["驟", "骤"],
  ["驢", "驴"],
  ["驤", "骧"],
  ["驥", "骥"],
  ["驪", "骊"],
  ["骯", "肮"],
  ["髏", "髅"],
  ["髒", "脏"],
  ["體", "体"],
  ["髕", "髌"],
  ["髖", "髋"],
  ["髣", "仿"],
  ["髮", "发"],
  ["鬆", "松"],
  ["鬚", "须"],
  ["鬢", "鬓"],
  ["鬥", "斗"],
  ["鬧", "闹"],
  ["鬨", "哄"],
  ["鬩", "阋"],
  ["鬮", "阄"],
  ["鬱", "郁"],
  ["魎", "魉"],
  ["魘", "魇"],
  ["魚", "鱼"],
  ["魛", "鱽"],
  ["魨", "豚"],
  ["魯", "鲁"],
  ["魴", "鲂"],
  ["魷", "鱿"],
  ["鮁", "鲅"],
  ["鮃", "鲆"],
  ["鮍", "鲏"],
  ["鮐", "鲐"],
  ["鮑", "鲍"],
  ["鮒", "鲋"],
  ["鮓", "鲊"],
  ["鮚", "鲒"],
  ["鮞", "鲕"],
  ["鮣", "䲟"],
  ["鮦", "鲖"],
  ["鮪", "鲔"],
  ["鮫", "鲛"],
  ["鮭", "鲑"],
  ["鮮", "鲜"],
  ["鮺", "鲝"],
  ["鯀", "鲧"],
  ["鯁", "鲠"],
  ["鯇", "鲩"],
  ["鯉", "鲤"],
  ["鯊", "鲨"],
  ["鯔", "鲻"],
  ["鯖", "鲭"],
  ["鯗", "鲞"],
  ["鯛", "鲷"],
  ["鯝", "鲴"],
  ["鯡", "鲱"],
  ["鯢", "鲵"],
  ["鯤", "鲲"],
  ["鯧", "鲳"],
  ["鯨", "鲸"],
  ["鯪", "鲮"],
  ["鯫", "鲰"],
  ["鯰", "鲇"],
  ["鯴", "鲺"],
  ["鯽", "鲫"],
  ["鯿", "鳊"],
  ["鰂", "鲗"],
  ["鰈", "鲽"],
  ["鰉", "鳇"],
  ["鰌", "䲡"],
  ["鰍", "鳅"],
  ["鰒", "鳆"],
  ["鰓", "鳃"],
  ["鰛", "鳁"],
  ["鰜", "鳒"],
  ["鰟", "鳑"],
  ["鰠", "鳋"],
  ["鰣", "鲥"],
  ["鰥", "鳏"],
  ["鰧", "䲢"],
  ["鰨", "鳎"],
  ["鰩", "鳐"],
  ["鰭", "鳍"],
  ["鰱", "鲢"],
  ["鰲", "鳌"],
  ["鰳", "鳓"],
  ["鰵", "鳘"],
  ["鰷", "鲦"],
  ["鰹", "鲣"],
  ["鰻", "鳗"],
  ["鰼", "鳛"],
  ["鰾", "鳔"],
  ["鱅", "鳙"],
  ["鱈", "鳕"],
  ["鱉", "鳖"],
  ["鱒", "鳟"],
  ["鱔", "鳝"],
  ["鱖", "鳜"],
  ["鱗", "鳞"],
  ["鱘", "鲟"],
  ["鱝", "鲼"],
  ["鱟", "鲎"],
  ["鱠", "鲙"],
  ["鱣", "鳣"],
  ["鱧", "鳢"],
  ["鱨", "鲿"],
  ["鱭", "鲚"],
  ["鱷", "鳄"],
  ["鱸", "鲈"],
  ["鱺", "鲡"],
  ["鳥", "鸟"],
  ["鳧", "凫"],
  ["鳩", "鸠"],
  ["鳳", "凤"],
  ["鳴", "鸣"],
  ["鳶", "鸢"],
  ["鳾", "䴓"],
  ["鴆", "鸩"],
  ["鴇", "鸨"],
  ["鴈", "雁"],
  ["鴉", "鸦"],
  ["鴒", "鸰"],
  ["鴕", "鸵"],
  ["鴛", "鸳"],
  ["鴝", "鸲"],
  ["鴞", "鸮"],
  ["鴟", "鸱"],
  ["鴣", "鸪"],
  ["鴦", "鸯"],
  ["鴨", "鸭"],
  ["鴯", "鸸"],
  ["鴰", "鸹"],
  ["鴴", "鸻"],
  ["鴷", "䴕"],
  ["鴻", "鸿"],
  ["鴿", "鸽"],
  ["鵁", "䴔"],
  ["鵂", "鸺"],
  ["鵃", "鸼"],
  ["鵑", "鹃"],
  ["鵒", "鹆"],
  ["鵓", "鹁"],
  ["鵜", "鹈"],
  ["鵝", "鹅"],
  ["鵠", "鹄"],
  ["鵡", "鹉"],
  ["鵪", "鹌"],
  ["鵬", "鹏"],
  ["鵮", "鹐"],
  ["鵯", "鹎"],
  ["鵰", "雕"],
  ["鵲", "鹊"],
  ["鶄", "䴖"],
  ["鶇", "鸫"],
  ["鶉", "鹑"],
  ["鶊", "鹒"],
  ["鶏", "鸡"],
  ["鶓", "鹋"],
  ["鶖", "鹙"],
  ["鶘", "鹕"],
  ["鶚", "鹗"],
  ["鶡", "鹖"],
  ["鶥", "鹛"],
  ["鶩", "鹜"],
  ["鶪", "䴗"],
  ["鶬", "鸧"],
  ["鶯", "莺"],
  ["鶱", "骞"],
  ["鶴", "鹤"],
  ["鶺", "鹡"],
  ["鶻", "鹘"],
  ["鶼", "鹣"],
  ["鶿", "鹚"],
  ["鷂", "鹞"],
  ["鷉", "䴘"],
  ["鷓", "鹧"],
  ["鷖", "鹥"],
  ["鷗", "鸥"],
  ["鷙", "鸷"],
  ["鷚", "鹨"],
  ["鷥", "鸶"],
  ["鷦", "鹪"],
  ["鷯", "鹩"],
  ["鷰", "燕"],
  ["鷲", "鹫"],
  ["鷳", "鹇"],
  ["鷴", "鹇"],
  ["鷸", "鹬"],
  ["鷹", "鹰"],
  ["鷺", "鹭"],
  ["鸇", "鹯"],
  ["鸊", "䴙"],
  ["鸌", "鹱"],
  ["鸕", "鸬"],
  ["鸚", "鹦"],
  ["鸛", "鹳"],
  ["鸝", "鹂"],
  ["鸞", "鸾"],
  ["鹵", "卤"],
  ["鹹", "咸"],
  ["鹺", "鹾"],
  ["鹼", "硷"],
  ["鹽", "盐"],
  ["麗", "丽"],
  ["麥", "麦"],
  ["麩", "麸"],
  ["麵", "面"],
  ["麼", "么"],
  ["黃", "黄"],
  ["黌", "黉"],
  ["點", "点"],
  ["黨", "党"],
  ["黲", "黪"],
  ["黴", "霉"],
  ["黶", "黡"],
  ["黷", "黩"],
  ["黽", "黾"],
  ["黿", "鼋"],
  ["鼇", "鳌"],
  ["鼉", "鼍"],
  ["鼴", "鼹"],
  ["齊", "齐"],
  ["齋", "斋"],
  ["齎", "赍"],
  ["齏", "齑"],
  ["齒", "齿"],
  ["齔", "龀"],
  ["齙", "龅"],
  ["齜", "龇"],
  ["齟", "龃"],
  ["齠", "龆"],
  ["齡", "龄"],
  ["齦", "龈"],
  ["齧", "啮"],
  ["齪", "龊"],
  ["齬", "龉"],
  ["齲", "龋"],
  ["齶", "腭"],
  ["齷", "龌"],
  ["龍", "龙"],
  ["龐", "庞"],
  ["龑", "䶮"],
  ["龔", "龚"],
  ["龕", "龛"],
  ["龜", "龟"],
  ["兀", "兀"]
];
const table2 = [
  ["王后", "王后"],
  ["天后", "天后"],
  ["皇后", "皇后"],
  ["後面", "后面"],
  ["發現", "发现"],
  ["發明", "发明"],
  ["發行", "发行"],
  ["頭髮", "头发"],
  ["毛髮", "毛发"],
  ["紅髮", "红发"],
  ["白髮", "白发"],
  ["理髮", "理发"],
  ["長髮", "长发"],
  ["短髮", "短发"],
  ["一里", "一里"],
  ["千里", "千里"],
  ["英里", "英里"],
  ["裡面", "里面"],
  ["裡外", "里外"],
  ["家裡", "家里"],
  ["上面", "上面"],
  ["下面", "下面"],
  ["左面", "左面"],
  ["右面", "右面"],
  ["外面", "外面"],
  ["前面", "前面"],
  ["側面", "侧面"],
  ["對面", "对面"],
  ["雙面", "双面"],
  ["顔面", "颜面"],
  ["面板", "面板"],
  ["面版", "面版"],
  ["面具", "面具"],
  ["人面", "人面"],
  ["面前", "面前"],
  ["瞭解", "了解"],
  ["天干", "天干"],
  ["幹掉", "干掉"],
  ["幹死", "干死"],
  ["幹什", "干什"],
  ["幹嘛", "干嘛"],
  ["曬乾", "晒干"],
  ["晾乾", "晾干"],
  ["肉乾", "肉干"],
  ["乾燥", "干燥"],
  ["乾脆", "干脆"],
  ["乾净", "干净"],
  ["峽谷", "峡谷"],
  ["山谷", "山谷"],
  ["溪谷", "溪谷"],
  ["谷底", "谷底"],
  ["那隻", "那只"],
  ["這隻", "这只"],
  ["幾隻", "几只"],
  ["一隻", "一只"],
  ["兩隻", "两只"],
  ["三隻", "三只"],
  ["四隻", "四只"],
  ["五隻", "五只"],
  ["1隻", "1只"],
  ["2隻", "2只"],
  ["3隻", "3只"],
  ["4隻", "4只"],
  ["5隻", "5只"],
  ["老闆", "老板"],
  ["颱風", "台风"],
  ["臺灣", "台湾"],
  ["日曆", "日历"],
  ["公曆", "公历"],
  ["陽曆", "阳历"],
  ["月曆", "月历"],
  ["陰曆", "阴历"],
  ["合并", "合并"],
  ["占卜", "占卜"],
  ["鞦韆", "秋千"],
  ["鬍子", "胡子"],
  ["鬍鬚", "胡须"]
];
const zhConverter = {
  /**
   * Convert SimpCh to TradCh
   * @param text
   * @return
   */
  s2t(text) {
    if (text.length === 0) {
      return "";
    }
    const tmptext = text;
    const result = Array(text.length);
    if (text.length > 1) {
      table2.forEach((couple) => {
        for (let i = 0; i < tmptext.length - 1; i++) {
          if (tmptext.substring(i, i + 2) === couple[1] && result[i] === void 0) {
            result[i] = couple[0].charAt(0);
            result[i + 1] = couple[0].charAt(1);
          }
        }
      });
    }
    table1.forEach((couple) => {
      for (let i = 0; i < tmptext.length; i++) {
        if (tmptext.substring(i, i + 1) === couple[1] && result[i] === void 0) {
          result[i] = couple[0].charAt(0);
        }
      }
    });
    for (let i = 0; i < result.length; i++) {
      if (result[i] === void 0) {
        result[i] = tmptext.charAt(i);
      }
    }
    return result.join("");
  },
  /**
   * Convert TradCh to SimpCh
   * @param text
   * @returns
   */
  t2s(text) {
    if (text.length === 0) {
      return "";
    }
    let resText = text;
    table1.forEach((charSet) => {
      resText = resText.replace(new RegExp(charSet[0], "g"), charSet[1]);
    });
    return resText;
  },
  /**
   * Convert TC to SC or SC to TC
   * @param text
   * @param convertType 0: don't convert, 1: S->T, 2: T->S
   * @returns
   */
  convert(text, convertType) {
    switch (convertType) {
      case 0:
        return text;
      case 1:
        return zhConverter.s2t(text);
      case 2:
        return zhConverter.t2s(text);
      default:
        return text;
    }
  }
};
const en = {
  excl: "!",
  colon: ":",
  page: {
    aiChat: "AI Chat",
    coder: "Coder",
    qrCode: "QR Code Generator",
    currencyCvt: "Currency Converter"
  },
  header: {
    joinDc: "Join"
  },
  auth: {
    title: "Account",
    profile: "Profile",
    login: "Log In",
    logout: "Log Out",
    signup: "Sign Up",
    email: "Email address",
    username: "Username",
    usernameOrEmail: "Username / email address",
    passwd: "Password",
    veriCode: "Verification code",
    getVeriCode: "Get verification code",
    sendingVeriCode: "Sending verification code...",
    loggingIn: "Logging in...",
    alreadyHaveAnAcc: "Already have an account?",
    createNewAcc: "Create a new account!",
    forgotPw: "Forgot password?",
    resetPw: "Reset password",
    emailRequired: "The email address is required.",
    emailInvalid: "The email address format is invalid.",
    usernameOrEmailRequired: "A username or email address is required.",
    usernameRequired: "The username is required.",
    usernameLength: "Username length: 5-32 characters",
    passwdRequired: "The password is required.",
    passwdLength: "Password length: 8-64 characters",
    veriCodeRequired: "The verification code is required.",
    confirmChangeEmail: "Are you sure you want to change the email address?",
    notReceiveVeriCode: "Did not receive the verification code?",
    formIncomplete: "Form incomplete!",
    loginTip1: "After logging in or signing up, ownership of the conversations on this device will be transferred to the associated account."
  },
  action: {
    back: "Back",
    submit: "Submit",
    save: "Save",
    saveNSubmit: "Save & Submit",
    scrollToBtm: "Scroll to bottom",
    more: "More actions",
    rename: "Rename",
    renameConv: "Rename conversation",
    refresh: "Refresh conversation",
    resetConv: "Reset conversation settings",
    regenerate: "Regenerate",
    continueGenerate: "Continue generate",
    resend: "Resend",
    change: "Change",
    edit: "Edit",
    copy: "Copy",
    copySuccess: "Copied!",
    copyFailed: "Copy failed.",
    delete: "Delete",
    download: "Download",
    deleteConv: "Delete conversation",
    exportAs: "Export as",
    newVersion: "A new version has been released! The page needs to be refreshed.",
    opCanceled: "The operation has been canceled.",
    opExecuted: "The operation has been executed.",
    submitting: "Submitting"
  },
  message: {
    renameConvHint: "Please enter a conversation title: ",
    renameSuccess: "Conversation has been renamed.",
    deleteConvConfirm: "Are you sure you want to delete this conversation? This action cannot be undone!",
    deleteMsgConfirm: "Delete this message?",
    notice: "Notice",
    warning: "Warning",
    setting: "Setting",
    ok: "OK",
    cancel: "Cancel",
    yes: "Yes",
    no: "No"
  },
  menu: {
    title: "Menu",
    about: "About",
    joinDcMessage: "Join our Discord server to keep up with the latest news!",
    expFeat1: "This takes a little while.",
    expFeat2: "This will take longer.",
    tempInfo: "With higher values increase randomness and diversity, while lower values decrease randomness and make the output more predictable."
  },
  settings: {
    title: "Settings",
    model: "Model",
    webBrowsing: "Web Browsing",
    off: "Off",
    on: "On",
    enable: "Enable",
    disable: "Disable",
    basic: "Basic",
    advanced: "Advanced",
    context: "Context",
    appearance: "Appearance",
    lang: "UI Language",
    theme: "Theme"
  },
  chat: {
    title: "Chat",
    welcomeTo: "Welcome to",
    editQues: "Edit Question",
    editAns: "Edit Answer",
    chats: "Conversations",
    newChat: "New Chat",
    letsStart: "Let's start!",
    send: "Send",
    ldConv: "Loading conversation",
    dltConv: "Deleting conversation"
  },
  error: {
    qTooLong: "Question too long.",
    plzRefresh: "Please refresh the page."
  },
  footer: {
    patient: "Please be patient, this may take a few minutes."
  }
};
const zhTW = {
  excl: "！",
  colon: "：",
  page: {
    aiChat: "AI 聊天",
    coder: "編程助手",
    qrCode: "QR 碼生成器",
    currencyCvt: "貨幣轉換器"
  },
  header: {
    joinDc: "加入"
  },
  auth: {
    title: "帳號",
    profile: "個人主頁",
    login: "登入",
    logout: "登出",
    signup: "註冊",
    email: "電子郵件地址",
    username: "用戶名",
    usernameOrEmail: "用戶名 / 電子郵件地址",
    passwd: "密碼",
    veriCode: "驗證碼",
    getVeriCode: "取得驗證碼",
    sendingVeriCode: "正在發送驗證碼…",
    loggingIn: "正在登錄…",
    alreadyHaveAnAcc: "已有帳號？",
    createNewAcc: "創建新帳號！",
    forgotPw: "忘記密碼？",
    resetPw: "重設密碼",
    emailRequired: "需要電子郵件地址",
    emailInvalid: "電子郵件地址格式不符",
    usernameOrEmailRequired: "需要用戶名或電子郵件地址",
    usernameRequired: "需要用戶名",
    usernameLength: "用戶名長度須介於 5 至 32。",
    passwdRequired: "需要密碼",
    passwdLength: "密碼長度須介於 8 至 64。",
    veriCodeRequired: "需要驗證碼",
    confirmChangeEmail: "是否確認更換電子郵件地址？",
    notReceiveVeriCode: "未收到驗證碼？",
    formIncomplete: "表單未完成！",
    loginTip1: "在登錄或註冊後，此設備上的對話的所有權會轉移至相關帳號。"
  },
  action: {
    back: "返回",
    submit: "提交",
    save: "保存",
    saveNSubmit: "保存並提交",
    scrollToBtm: "滑到底部",
    more: "更多操作",
    rename: "重命名",
    renameConv: "重命名對話",
    refresh: "刷新對話",
    resetConv: "重置對話設置",
    regenerate: "重新生成",
    continueGenerate: "繼續生成",
    resend: "重新發送",
    change: "更換",
    edit: "編輯",
    copy: "複製",
    copySuccess: "已複製！",
    copyFailed: "複製失敗。",
    delete: "刪除",
    download: "下載",
    deleteConv: "刪除對話",
    exportAs: "導出為",
    newVersion: "新版本已經發布！頁面將要被刷新。",
    opCanceled: "操作已取消。",
    opExecuted: "操作已執行。",
    submitting: "正在提交"
  },
  message: {
    renameConvHint: "請輸入對話標題：",
    renameSuccess: "對話已重命名。",
    deleteConvConfirm: "你確定要刪除此對話嗎？此操作將無法撤消！",
    deleteMsgConfirm: "是否刪除此訊息？",
    notice: "通告",
    warning: "警告",
    setting: "設置",
    ok: "確認",
    cancel: "取消",
    yes: "是",
    no: "否"
  },
  menu: {
    title: "菜單",
    about: "關於",
    joinDcMessage: "加入我們的 Discord 服務器以跟進最新消息！",
    expFeat1: "這需要一點時間。",
    expFeat2: "這需要更久。",
    tempInfo: "較高的值會增加隨機性和多樣性，而較低的值會降低隨機性並使輸出更具可預測性。"
  },
  settings: {
    title: "設置",
    model: "模型",
    webBrowsing: "訪問網絡",
    off: "關閉",
    on: "開啟",
    enable: "啟用",
    disable: "禁用",
    basic: "基礎",
    advanced: "進階",
    context: "上下文關係",
    appearance: "外觀",
    lang: "UI 語言 (Language)",
    theme: "主題"
  },
  chat: {
    title: "對話",
    welcomeTo: "歡迎來到",
    editQues: "編輯問題",
    editAns: "編輯回答",
    chats: "對話列表",
    newChat: "新對話",
    letsStart: "讓我們開始吧！",
    send: "發送",
    ldConv: "加載對話中",
    dltConv: "刪除對話中"
  },
  error: {
    qTooLong: "問題過長。",
    plzRefresh: "請刷新頁面。"
  },
  footer: {
    patient: "請耐心等待，這可能需要幾分鐘的時間。"
  }
};
const ru = {
  excl: "!",
  colon: ":",
  page: {
    aiChat: "AI Чат"
  },
  header: {
    joinDc: "Присоединиться"
  },
  auth: {
    title: "Аккаунт",
    profile: "Профиль",
    login: "Войти",
    logout: "Выйти",
    signup: "Зарегистрироваться",
    email: "Адрес электронной почты",
    username: "Имя пользователя",
    usernameOrEmail: "Имя пользователя / адрес электронной почты",
    passwd: "Пароль",
    veriCode: "Код подтверждения",
    getVeriCode: "Получить код подтверждения",
    sendingVeriCode: "Отправка кода подтверждения...",
    loggingIn: "Вход в систему...",
    alreadyHaveAnAcc: "Уже есть аккаунт?",
    createNewAcc: "Создать новый аккаунт!",
    forgotPw: "Забыли пароль?",
    resetPw: "Сбросить пароль",
    emailRequired: "Требуется адрес электронной почты.",
    emailInvalid: "Недопустимый формат адреса электронной почты.",
    usernameOrEmailRequired: "Требуется имя пользователя или адрес электронной почты.",
    usernameRequired: "Требуется имя пользователя.",
    usernameLength: "Длина имени пользователя: 5-32 символа",
    passwdRequired: "Требуется пароль.",
    passwdLength: "Длина пароля: 8-64 символа",
    veriCodeRequired: "Требуется код подтверждения.",
    confirmChangeEmail: "Вы уверены, что хотите изменить адрес электронной почты?",
    notReceiveVeriCode: "Не получили код подтверждения?",
    formIncomplete: "Форма заполнена неполностью!",
    loginTip1: "После входа в систему или регистрации, владение беседами на этом устройстве будет передано на связанный аккаунт."
  },
  action: {
    back: "Назад",
    submit: "Подтвердить",
    save: "Сохранить",
    saveNSubmit: "Сохранить и подтвердить",
    scrollToBtm: "Прокрутить вниз",
    more: "Дополнительные действия",
    rename: "Переименовать",
    renameConv: "Переименовать диалог",
    refresh: "Обновить диалог",
    resetConv: "Сбросить настройки диалога",
    regenerate: "Сгенерировать заново",
    continueGenerate: "Продолжить генерацию",
    resend: "Повторно отправить",
    change: "Изменить",
    edit: "Редактировать",
    copy: "Копировать",
    copySuccess: "Скопировано!",
    copyFailed: "Не удалось скопировать.",
    delete: "Удалить",
    deleteConv: "Удалить диалог",
    exportAs: "Экспортировать как",
    newVersion: "Вышла новая версия! Необходимо обновление страницы.",
    opCanceled: "Операция отменена.",
    opExecuted: "Операция выполнена.",
    submitting: "Выполняется отправка..."
  },
  message: {
    renameConvHint: "Пожалуйста, введите новое название диалога:",
    renameSuccess: "Диалог был переименован.",
    deleteConvConfirm: "Вы уверены, что хотите удалить этот диалог? Это действие нельзя отменить!",
    deleteMsgConfirm: "Удалить это сообщение?",
    notice: "Уведомление",
    warning: "Предупреждение",
    setting: "Настройка",
    ok: "OK",
    cancel: "Отмена",
    yes: "Да",
    no: "Нет"
  },
  menu: {
    title: "Меню",
    about: "О программе",
    joinDcMessage: "Присоединяйтесь к нашему серверу Discord, чтобы быть в курсе последних новостей от CH4!",
    expFeat1: "Это займет некоторое время.",
    expFeat2: "Это займет больше времени.",
    tempInfo: "Более высокие значения увеличивают случайность и разнообразие, а более низкие значения уменьшают случайность и делают вывод более предсказуемым."
  },
  settings: {
    title: "Настройки",
    model: "Модель",
    lang: "Язык интерфейса",
    webBrowsing: "Поиск по вебу",
    off: "Выкл.",
    on: "Вкл.",
    enable: "Включить",
    disable: "Отключить",
    basic: "Базовые",
    advanced: "Расширенные",
    context: "Контекст"
  },
  chat: {
    chats: "Диалоги",
    newChat: "Новый диалог",
    letsStart: "Давайте начнем!",
    send: "Отправить"
  },
  error: {
    qTooLong: "Вопрос слишком длинный.",
    plzRefresh: "Пожалуйста, обновите страницу."
  },
  footer: {
    patient: "Пожалуйста, будьте терпеливы, это может занять несколько минут."
  }
};
const ja = {
  excl: "！",
  colon: "：",
  page: {
    aiChat: "AI チャット"
  },
  header: {
    joinDc: "参加"
  },
  auth: {
    title: "アカウント",
    profile: "プロフィール",
    login: "ログイン",
    logout: "ログアウト",
    signup: "サインアップ",
    email: "メールアドレス",
    username: "ユーザー名",
    usernameOrEmail: "ユーザー名 / メールアドレス",
    passwd: "パスワード",
    veriCode: "認証コード",
    getVeriCode: "認証コードを取得",
    sendingVeriCode: "認証コードを送信中...",
    loggingIn: "ログイン中...",
    alreadyHaveAnAcc: "既にアカウントをお持ちですか？",
    createNewAcc: "新しいアカウントを作成！",
    forgotPw: "パスワードを忘れましたか？",
    resetPw: "パスワードをリセット",
    emailRequired: "メールアドレスが必要です",
    emailInvalid: "メールアドレスの形式が無効です",
    usernameOrEmailRequired: "ユーザー名またはメールアドレスが必要です",
    usernameRequired: "ユーザー名が必要です",
    usernameLength: "ユーザー名の長さ：5～32文字",
    passwdRequired: "パスワードが必要です",
    passwdLength: "パスワードの長さ：8～64文字",
    veriCodeRequired: "認証コードが必要です",
    confirmChangeEmail: "メールアドレスを変更しますか？",
    notReceiveVeriCode: "認証コードが届かない場合",
    formIncomplete: "フォームが不完全です",
    loginTip1: "ログインまたはサインアップ後、このデバイス上の対話の所有権が関連するアカウントに移動します"
  },
  action: {
    back: "戻る",
    submit: "送信",
    save: "保存",
    saveNSubmit: "保存して送信",
    scrollToBtm: "一番下までスクロール",
    more: "詳細な操作",
    rename: "名前変更",
    renameConv: "対話の名前変更",
    refresh: "対話の更新",
    resetConv: "対話の設定リセット",
    regenerate: "再生成",
    continueGenerate: "生成を続ける",
    resend: "再送信",
    change: "変更",
    edit: "編集",
    copy: "コピー",
    copySuccess: "コピーしました！",
    copyFailed: "コピーに失敗しました。",
    delete: "削除",
    deleteConv: "対話の削除",
    exportAs: "エクスポート",
    newVersion: "新しいバージョンがリリースされました！ページをリフレッシュしてください。",
    opCanceled: "操作がキャンセルされました。",
    opExecuted: "操作が実行されました。",
    submitting: "送信中..."
  },
  message: {
    renameConvHint: "対話のタイトルを入力してください：",
    renameSuccess: "対話が名前変更されました。",
    deleteConvConfirm: "この対話を削除してもよろしいですか？この操作は元に戻すことはできません！",
    deleteMsgConfirm: "このメッセージを削除しますか？",
    notice: "お知らせ",
    warning: "警告",
    setting: "設定",
    ok: "OK",
    cancel: "キャンセル",
    yes: "はい",
    no: "いいえ"
  },
  menu: {
    title: "メニュー",
    about: "詳細情報",
    joinDcMessage: "最新情報を得るために、Discord サーバーに参加してください！",
    expFeat1: "これには少し時間がかかります。",
    expFeat2: "これにはさらに時間がかかります。",
    tempInfo: "高い値はランダム性と多様性を増加させ、低い値はランダム性を減少させて出力をより予測可能にします。"
  },
  settings: {
    title: "設定",
    model: "モデル",
    webBrowsing: "Web ブラウジング",
    off: "オフ",
    on: "オン",
    enable: "有効",
    disable: "無効",
    basic: "基本",
    advanced: "高度",
    context: "コンテキスト",
    appearance: "外観",
    lang: "UI 言語",
    theme: "テーマ"
  },
  chat: {
    title: "チャット",
    welcomeTo: "ようこそ",
    editQues: "質問を編集",
    editAns: "回答を編集",
    chats: "対話一覧",
    newChat: "新しい対話",
    letsStart: "始めましょう！",
    send: "送信",
    ldConv: "対話を読み込み中",
    dltConv: "対話を削除中"
  },
  error: {
    qTooLong: "質問が長すぎます。",
    plzRefresh: "ページをリフレッシュしてください。"
  },
  footer: {
    patient: "少々お待ちください。数分かかる場合があります。"
  }
};
const es = {
  excl: "!",
  colon: ":",
  page: {
    aiChat: "AI Chat"
  },
  header: {
    joinDc: "Unirse"
  },
  auth: {
    title: "Cuenta",
    profile: "Página de perfil",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    signup: "Registrarse",
    email: "Dirección de correo electrónico",
    username: "Nombre de usuario",
    usernameOrEmail: "Nombre de usuario / dirección de correo electrónico",
    passwd: "Contraseña",
    veriCode: "Código de verificación",
    getVeriCode: "Obtener código de verificación",
    sendingVeriCode: "Enviando código de verificación...",
    loggingIn: "Iniciando sesión...",
    alreadyHaveAnAcc: "¿Ya tienes una cuenta?",
    createNewAcc: "¡Crear una nueva cuenta!",
    forgotPw: "¿Olvidaste la contraseña?",
    resetPw: "Restablecer contraseña",
    emailRequired: "Se requiere la dirección de correo electrónico.",
    emailInvalid: "El formato de la dirección de correo electrónico no es válido.",
    usernameOrEmailRequired: "Se requiere un nombre de usuario o una dirección de correo electrónico.",
    usernameRequired: "Se requiere el nombre de usuario.",
    usernameLength: "Longitud del nombre de usuario: 5-32 caracteres",
    passwdRequired: "Se requiere la contraseña.",
    passwdLength: "Longitud de la contraseña: 8-64 caracteres",
    veriCodeRequired: "Se requiere el código de verificación.",
    confirmChangeEmail: "¿Estás seguro de que deseas cambiar la dirección de correo electrónico?",
    notReceiveVeriCode: "¿No recibiste el código de verificación?",
    formIncomplete: "¡Formulario incompleto!",
    loginTip1: "Después de iniciar sesión o registrarse, la propiedad de las conversaciones en este dispositivo se transferirá a la cuenta asociada."
  },
  action: {
    back: "Atrás",
    submit: "Enviar",
    save: "Guardar",
    saveNSubmit: "Guardar y enviar",
    scrollToBtm: "Desplazar hacia abajo",
    more: "Más acciones",
    rename: "Renombrar",
    renameConv: "Renombrar conversación",
    refresh: "Actualizar conversación",
    regenerate: "Regenerar",
    continueGenerate: "Continuar generando",
    resend: "Reenviar",
    change: "Cambiar",
    edit: "Editar",
    copy: "Copiar",
    copySuccess: "¡Copiado!",
    copyFailed: "Error al copiar.",
    delete: "Eliminar",
    deleteConv: "Eliminar conversación",
    exportAs: "Exportar como",
    newVersion: "¡Se ha lanzado una nueva versión! ¿Deseas recargar la página?",
    opCanceled: "La operación se ha cancelado.",
    opExecuted: "La operación se ha ejecutado.",
    submitting: "Enviando"
  },
  message: {
    renameConvHint: "Por favor, ingresa un título de conversación:",
    renameSuccess: "La conversación ha sido renombrada.",
    deleteConvConfirm: "¿Estás seguro/a de que deseas eliminar esta conversación? ¡Esta acción no se puede deshacer!",
    deleteMsgConfirm: "¿Eliminar este mensaje?",
    notice: "Aviso",
    warning: "Advertencia",
    setting: "Configuración",
    ok: "Aceptar",
    cancel: "Cancelar",
    yes: "Sí",
    no: "No"
  },
  menu: {
    title: "Menú",
    about: "Acerca de",
    joinDcMessage: "¡Únete a nuestro servidor de Discord para estar al día con las últimas noticias!",
    expFeat1: "Esto lleva un poco de tiempo.",
    expFeat2: "Esto llevará más tiempo.",
    tempInfo: "Con valores más altos aumenta la aleatoriedad y diversidad, mientras que con valores más bajos disminuye la aleatoriedad y hace que la salida sea más predecible."
  },
  settings: {
    title: "Configuración",
    model: "Modelo",
    webBrowsing: "Navegación web",
    off: "Desactivado",
    on: "Activado",
    enable: "Habilitar",
    disable: "Deshabilitar",
    basic: "Básico",
    advanced: "Avanzado",
    context: "Contexto"
  },
  chat: {
    title: "Chat",
    welcomeTo: "Bienvenido/a a",
    editQues: "Editar pregunta",
    editAns: "Editar respuesta",
    chats: "Conversaciones",
    newChat: "Nueva conversación",
    letsStart: "¡Empecemos!",
    send: "Enviar",
    ldConv: "Cargando conversación",
    dltConv: "Eliminando conversación"
  },
  error: {
    qTooLong: "Pregunta demasiado larga.",
    plzRefresh: "Por favor, actualiza la página."
  },
  footer: {
    patient: "Por favor, ten paciencia. Esto puede llevar algunos minutos."
  }
};
const zhCN = JSON.parse(zhConverter.t2s(JSON.stringify(zhTW)));
const LOCALE_COOKIE_NAME = "lang";
const DEFAULT_LOCALE = "en";
class LocaleChangeTrigger {
  constructor() {
    __publicField(this, "forceUpdatePaths", /* @__PURE__ */ new Set());
    __privateAdd(this, _beforeUpdateCallbacks, /* @__PURE__ */ new Map());
    __privateAdd(this, _afterUpdateCallbacks, /* @__PURE__ */ new Map());
  }
  forceUpdate(beforeUpdateCallback, afterUpdateCallback) {
    const pathname = useNuxtApp()._route.path;
    if (typeof beforeUpdateCallback === "function") {
      __privateGet(this, _beforeUpdateCallbacks).set(pathname, beforeUpdateCallback);
    }
    if (typeof afterUpdateCallback === "function") {
      __privateGet(this, _afterUpdateCallbacks).set(pathname, afterUpdateCallback);
    }
    this.forceUpdatePaths.add(pathname);
  }
}
_beforeUpdateCallbacks = new WeakMap();
_afterUpdateCallbacks = new WeakMap();
const i18n = createI18n({
  messages: {
    en,
    "zh-TW": zhTW,
    "zh-CN": zhCN,
    ru,
    ja,
    es
  },
  fallbackLocale: {
    "zh-TW": ["zh-CN", "en"],
    "zh-CN": ["zh-TW", "en"],
    "ru": ["en"],
    "ja": ["en"],
    "es": ["en"]
  }
}).global;
const checkLocale = (code) => {
  if (code === null || code === void 0) {
    return DEFAULT_LOCALE;
  } else if (i18n.availableLocales.includes(code)) {
    return code;
  } else if (code.startsWith("en-")) {
    return "en";
  } else if (code === "zh-Hant" || code === "zh-hant") {
    return "zh-TW";
  } else if (code.startsWith("zh-") || code === "zh") {
    return "zh-CN";
  } else {
    return DEFAULT_LOCALE;
  }
};
const localeChangeTrigger = new LocaleChangeTrigger();
function useLocale() {
  const uniCookie = useUniCookie();
  const getLocale = () => {
    let locale = uniCookie.get(LOCALE_COOKIE_NAME);
    if (locale === void 0) {
      locale = useNavigatorLanguage().language.value;
    }
    return checkLocale(locale);
  };
  const i18nProxy = new Proxy(i18n, {
    get: (target, key) => {
      if (key === "ChangeEventTarget") {
        return localeChangeTrigger;
      }
      return target[key];
    },
    set: (target, key, value) => {
      if (key === "locale") {
        value = checkLocale(value);
        if (i18n.locale === value) {
          return true;
        }
      }
      target[key] = value;
      return true;
    }
  });
  i18nProxy.locale = getLocale();
  return i18nProxy;
}
const composables_BevcPrpBa3 = /* @__PURE__ */ defineNuxtPlugin(() => {
  return {
    provide: {
      // @ts-ignore
      t: useLocale().t
    }
  };
});
const str = (obj) => {
  try {
    if ((obj == null ? void 0 : obj.toString) === void 0) {
      return `${obj}`;
    } else {
      const _str = obj.toString();
      return _str.startsWith("[object ") && _str.endsWith("]") ? JSON.stringify(obj) : _str;
    }
  } catch {
    return "";
  }
};
const lower = (o) => {
  return str(o).toLowerCase();
};
function isIterable(obj) {
  try {
    return typeof obj[Symbol == null ? void 0 : Symbol.iterator] === "function";
  } catch {
    return false;
  }
}
function safeStringify(obj) {
  const seenObjects = /* @__PURE__ */ new Set();
  const reviver = (_, value) => {
    if (typeof value === "object" && value !== null) {
      if (seenObjects.has(value)) {
        return void 0;
      }
      seenObjects.add(value);
      if (isIterable(value)) {
        value = [...value];
      }
    }
    return value;
  };
  return JSON.stringify(obj, reviver);
}
const BASE2_CHARSET = "01";
const BASE10_CHARSET$1 = "0123456789";
const BASE16_CHARSET$1 = "0123456789abcdef";
const BASE36_CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";
const BASE62_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE64_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const BASE64WEB_CHARSET$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const getCharset = (radix) => {
  if (typeof radix !== "string") {
    radix = lower(radix);
  }
  switch (radix) {
    case "2":
      return BASE2_CHARSET;
    case "10":
      return BASE10_CHARSET$1;
    case "16":
      return BASE16_CHARSET$1;
    case "36":
      return BASE36_CHARSET;
    case "62":
      return BASE62_CHARSET;
    case "64":
      return BASE64_CHARSET;
    case "64w":
    case "64+":
      return BASE64WEB_CHARSET$1;
    default:
      return radix;
  }
};
const convert = (value, fromCharset, toCharset, minLen = 0) => {
  if (typeof value !== "string") {
    value = str(value);
  }
  let decimalValue = BigInt(0);
  fromCharset = getCharset(fromCharset);
  const baseFrom = fromCharset.length;
  for (let i = 0; i < value.length; i++) {
    decimalValue += BigInt(fromCharset.indexOf(value[i]) * Math.pow(baseFrom, value.length - 1 - i));
  }
  let result = "";
  toCharset = getCharset(toCharset);
  if (result === "") {
    const baseTo = BigInt(toCharset.length);
    while (decimalValue > 0) {
      result = toCharset.charAt(+BigInt(decimalValue % baseTo).toString()) + result;
      decimalValue = BigInt(decimalValue / baseTo);
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
  BASE10_CHARSET: BASE10_CHARSET$1,
  BASE16_CHARSET: BASE16_CHARSET$1,
  BASE36_CHARSET,
  BASE62_CHARSET,
  BASE64_CHARSET,
  BASE64WEB_CHARSET: BASE64WEB_CHARSET$1,
  convert,
  getCharset,
  secureBase64,
  textToBase64,
  base64ToText
};
function sum(...args) {
  return args.reduce((a, b) => a + b, 0);
}
const sha256 = (message) => {
  return sha3(message, { outputLength: 256 }).toString();
};
const binaryStrRegex = /0b[0-1]+/i;
function toSeed(seed) {
  if (typeof seed === "number") {
    return Math.round(seed);
  } else if (seed instanceof Object) {
    seed = safeStringify(seed);
  }
  if (typeof seed === "string") {
    if (binaryStrRegex.test(seed)) {
      return parseInt(seed.substring(2, seed.length - 1), 2);
    }
    const num = parseInt(seed);
    if (Number.isNaN(num)) {
      return num;
    } else {
      return sum(parseInt(sha256(seed), 16));
    }
  } else {
    return Date.now();
  }
}
const N = 624;
const M = 397;
const MATRIX_A = 2567483615;
const UPPER_MASK = 2147483648;
const LOWER_MASK = 2147483647;
class MersenneTwister {
  /** @param {Number} [seed] */
  constructor(seed) {
    __publicField(this, "mt", new Array(N));
    __publicField(this, "mti", N + 1);
    __publicField(this, "seed");
    this.seed = seed = toSeed(seed);
    if (Array.isArray(seed)) {
      this.init_by_array(seed, seed.length);
    } else {
      this.init_seed(seed);
    }
    return this;
  }
  init_seed(s) {
    this.mt[0] = s >>> 0;
    for (this.mti = 1; this.mti < N; this.mti++) {
      s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
      this.mt[this.mti] = (((s & 4294901760) >>> 16) * 1812433253 << 16) + (s & 65535) * 1812433253 + this.mti;
      this.mt[this.mti] >>>= 0;
    }
  }
  init_by_array(initKey, keyLength) {
    let i, j, k;
    this.init_seed(19650218);
    i = 1;
    j = 0;
    k = N > keyLength ? N : keyLength;
    for (; k !== 0; k--) {
      const s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
      this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1664525 << 16) + (s & 65535) * 1664525) + initKey[j] + j;
      this.mt[i] >>>= 0;
      i++;
      j++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
      if (j >= keyLength) {
        j = 0;
      }
    }
    for (k = N - 1; k !== 0; k--) {
      const s = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
      this.mt[i] = (this.mt[i] ^ (((s & 4294901760) >>> 16) * 1566083941 << 16) + (s & 65535) * 1566083941) - i;
      this.mt[i] >>>= 0;
      i++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
    }
    this.mt[0] = 2147483648;
  }
  random_int() {
    let y;
    const mag01 = new Array(0, MATRIX_A);
    if (this.mti >= N) {
      let kk;
      if (this.mti === N + 1) {
        this.init_seed(5489);
      }
      for (kk = 0; kk < N - M; kk++) {
        y = this.mt[kk] & UPPER_MASK | this.mt[kk + 1] & LOWER_MASK;
        this.mt[kk] = this.mt[kk + M] ^ y >>> 1 ^ mag01[y & 1];
      }
      for (; kk < N - 1; kk++) {
        y = this.mt[kk] & UPPER_MASK | this.mt[kk + 1] & LOWER_MASK;
        this.mt[kk] = this.mt[kk + (M - N)] ^ y >>> 1 ^ mag01[y & 1];
      }
      y = this.mt[N - 1] & UPPER_MASK | this.mt[0] & LOWER_MASK;
      this.mt[N - 1] = this.mt[M - 1] ^ y >>> 1 ^ mag01[y & 1];
      this.mti = 0;
    }
    y = this.mt[this.mti++];
    y ^= y >>> 11;
    y ^= y << 7 & 2636928640;
    y ^= y << 15 & 4022730752;
    y ^= y >>> 18;
    return y >>> 0;
  }
  random_int31() {
    return this.random_int() >>> 1;
  }
  random_incl() {
    return this.random_int() * (1 / 4294967295);
  }
  random() {
    return this.random_int() * (1 / 4294967296);
  }
  random_excl() {
    return (this.random_int() + 0.5) * (1 / 4294967296);
  }
  random_long() {
    return ((this.random_int() >>> 5) * 67108864 + (this.random_int() >>> 6)) * (1 / 9007199254740992);
  }
}
function MT(seed) {
  return new MersenneTwister(seed);
}
const {
  BASE10_CHARSET,
  BASE16_CHARSET,
  BASE64WEB_CHARSET
} = baseConverter;
const _MT = MT();
const rand = (mt = _MT) => {
  return mt.random();
};
const randInt = (start, end, mt) => {
  if (end === void 0 || end === 0) {
    end = start;
    start = 0;
  }
  return Math.floor(start + rand(mt) * end);
};
const choice = (array, mt) => {
  return array[randInt(0, array.length, mt)];
};
const choices = (array, amount = 1, mt) => {
  const result = [];
  const options = [];
  for (let i = 0; i < amount; i++) {
    if (options.length === 0) {
      options.push(...array);
    }
    result.push(options.splice(randInt(0, options.length, mt), 1)[0]);
  }
  return result;
};
const shuffle = (array, mt) => {
  return choices(array, array.length, mt);
};
const charset = (charset2, len = 8, mt) => {
  return new Array(len).fill(0).map((_) => choice(charset2, mt)).join("");
};
const random = {
  MT,
  toSeed,
  rand,
  randInt,
  charset,
  choice,
  choices,
  shuffle,
  base10: (len = 6, mt) => {
    return charset(BASE10_CHARSET, len, mt);
  },
  base16: (len = 32, mt) => {
    return charset(BASE16_CHARSET, len, mt);
  },
  base64: (len = 32, mt) => {
    return charset(BASE64WEB_CHARSET, len, mt);
  },
  /** Linear Congruential Generator */
  lcg(_seed) {
    let seed = toSeed(_seed);
    return () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  }
};
function isAtBottom(tolerance = 160) {
  return false;
}
(async () => {
})();
async function useScrollToBottom(delayMs = 0, behavior = "smooth") {
  return await new Promise((resolve, reject) => {
    {
      resolve(null);
    }
  });
}
async function keepAtBottom(delayMs = 0, behavior = "instant", tolerance = 50) {
  return null;
}
useScrollToBottom.isAtBottom = isAtBottom;
useScrollToBottom.keepAtBottom = keepAtBottom;
Prism.manual = true;
const renderCodeBlocks_qIyVp6jM6U = /* @__PURE__ */ defineNuxtPlugin(() => {
  return {};
});
const useColorMode = () => {
  return useState("color-mode").value;
};
const themes_AdwqX1mhAQ = /* @__PURE__ */ defineNuxtPlugin(() => {
  const colorMode = useColorMode();
  const isDark = ref(false);
  const isLight = ref(!isDark.value);
  watch(isDark, (newVal) => {
    if (isLight.value === newVal) {
      isLight.value = !newVal;
    }
    if (newVal) {
      colorMode.preference = "dark";
    } else {
      colorMode.preference = "light";
    }
  });
  watch(isLight, (newVal) => {
    if (isDark.value === newVal) {
      isDark.value = !newVal;
    }
  });
  const init = () => {
    if (colorMode.preference === "system") {
      colorMode.preference = "dark";
    }
    const _isDark = colorMode.preference === "dark";
    if (isDark.value !== _isDark) {
      isDark.value = _isDark;
    }
  };
  init();
  return {
    provide: {
      themes: {
        get isDark() {
          init();
          return isDark;
        },
        get isLight() {
          init();
          return isLight;
        }
      }
    }
  };
});
const plugins = [
  plugin,
  revive_payload_server_eJ33V7gbc6,
  components_plugin_KR1HBZs4kY,
  unhead_KgADcZ0jPj,
  plugin_server_XNCxeHyTuP,
  element_plus_teleports_plugin_h4Dmekbj62,
  element_plus_injection_plugin_1RNPi6ogby,
  composables_BevcPrpBa3,
  renderCodeBlocks_qIyVp6jM6U,
  themes_AdwqX1mhAQ
];
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h(component, props, slots) : (_a = slots.default) == null ? void 0 : _a.call(slots);
  } };
};
const layouts = {
  chat: () => import('./_nuxt/chat-ef87ce8c.mjs').then((m) => m.default || m),
  default: () => import('./_nuxt/default-f0000424.mjs').then((m) => m.default || m)
};
const LayoutLoader = /* @__PURE__ */ defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => h(LayoutComponent, props.layoutProps, context.slots);
  }
});
const __nuxt_component_0 = /* @__PURE__ */ defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => unref(props.name) ?? route.meta.layout ?? "default");
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            // @ts-expect-error seems to be an issue in vue types
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = /* @__PURE__ */ defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a);
      }
      return h(
        // @ts-expect-error seems to be an issue in vue types
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const RouteProvider = /* @__PURE__ */ defineComponent({
  name: "RouteProvider",
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key]
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_1 = /* @__PURE__ */ defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(routeProps, props.pageKey);
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, {
                // @ts-expect-error seems to be an issue in vue types
                default: () => h(RouteProvider, {
                  key,
                  vnode: routeProps.Component,
                  route: routeProps.route,
                  renderKey: key,
                  trackRootNodes: hasTransition,
                  vnodeRef: pageRef
                })
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_NuxtPage = __nuxt_component_1;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    (_error.stack || "").split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n");
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = /* @__PURE__ */ defineAsyncComponent(() => import('./_nuxt/error-404-4153a69a.mjs').then((r) => r.default || r));
    const _Error = /* @__PURE__ */ defineAsyncComponent(() => import('./_nuxt/error-500-73ec8718.mjs').then((r) => r.default || r));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ErrorComponent = _sfc_main$1;
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = /* @__PURE__ */ defineAsyncComponent(() => import('./_nuxt/island-renderer-45df5e5f.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const { islandContext } = nuxtApp.ssrContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.hooks.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { _export_sfc as _, useRouter as a, useLocale as b, createError as c, useState as d, entry$1 as default, debugWarn as e, useNamespace as f, useNuxtApp as g, defaultNamespace as h, namespaceContextKey as i, useId as j, toSeed as k, baseConverter as l, str as m, navigateTo as n, useUniCookie as o, useScrollToBottom as p, useGetDerivedNamespace as q, random as r, safeStringify as s, throwError as t, useHead as u, useIdInjection as v, defineNuxtRouteMiddleware as w };
//# sourceMappingURL=server.mjs.map
