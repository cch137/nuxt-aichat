globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { klona } from 'klona';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import gracefulShutdown from 'http-graceful-shutdown';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {}
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const script = "\"use strict\";(()=>{const a=window,e=document.documentElement,m=[\"dark\",\"light\"],c=window.localStorage.getItem(\"nuxt-color-mode\")||\"system\";let n=c===\"system\"?f():c;const l=e.getAttribute(\"data-color-mode-forced\");l&&(n=l),i(n),a[\"__NUXT_COLOR_MODE__\"]={preference:c,value:n,getColorScheme:f,addColorScheme:i,removeColorScheme:d};function i(o){const t=\"\"+o+\"\",s=\"\";e.classList?e.classList.add(t):e.className+=\" \"+t,s&&e.setAttribute(\"data-\"+s,o)}function d(o){const t=\"\"+o+\"\",s=\"\";e.classList?e.classList.remove(t):e.className=e.className.replace(new RegExp(t,\"g\"),\"\"),s&&e.removeAttribute(\"data-\"+s)}function r(o){return a.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function f(){if(a.matchMedia&&r(\"\").media!==\"not all\"){for(const o of m)if(r(\":\"+o).matches)return o}return\"light\"}})();\n";

const _ECGazFG8pN = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _ECGazFG8pN
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function trapUnhandledNodeErrors() {
  {
    process.on(
      "unhandledRejection",
      (err) => console.error("[nitro] [unhandledRejection] " + err)
    );
    process.on(
      "uncaughtException",
      (err) => console.error("[nitro]  [uncaughtException] " + err)
    );
  }
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(html);
});

const assets = {
  "/curva_favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"7d26-V6y7wATsXG8KebK8Ckq/ON41mn4\"",
    "mtime": "2023-09-11T10:01:05.139Z",
    "size": 32038,
    "path": "../public/curva_favicon.ico"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"7d26-UhUNCz6v/vGTOfHEATYsYktF31E\"",
    "mtime": "2023-09-11T10:01:05.139Z",
    "size": 32038,
    "path": "../public/favicon.ico"
  },
  "/_favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"7d26-msK/5wOlQI+ENfzUn8FM3lri6b8\"",
    "mtime": "2023-09-11T10:01:05.138Z",
    "size": 32038,
    "path": "../public/_favicon.ico"
  },
  "/_nuxt/abap.b029dff1.js": {
    "type": "application/javascript",
    "etag": "\"3849-+AFq523M9nBhBK4d+QklBzSWtys\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 14409,
    "path": "../public/_nuxt/abap.b029dff1.js"
  },
  "/_nuxt/apex.3c83662c.js": {
    "type": "application/javascript",
    "etag": "\"1066-F3vzsj3ZZ5711hanoAKmDIsRcUY\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 4198,
    "path": "../public/_nuxt/apex.3c83662c.js"
  },
  "/_nuxt/autoRedirector.181c9aae.js": {
    "type": "application/javascript",
    "etag": "\"4fa-ftutMxOJYqUDmrthFsWzNnK7g3w\"",
    "mtime": "2023-10-12T07:40:47.315Z",
    "size": 1274,
    "path": "../public/_nuxt/autoRedirector.181c9aae.js"
  },
  "/_nuxt/azcli.f1f7c576.js": {
    "type": "application/javascript",
    "etag": "\"446-onwGTuS1yaGYH2pp3JjCd+Wq91A\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 1094,
    "path": "../public/_nuxt/azcli.f1f7c576.js"
  },
  "/_nuxt/bat.86aea46a.js": {
    "type": "application/javascript",
    "etag": "\"82b-8BPMwZ1AL3t3J0SfeHIII9/Dc5k\"",
    "mtime": "2023-10-12T07:40:47.326Z",
    "size": 2091,
    "path": "../public/_nuxt/bat.86aea46a.js"
  },
  "/_nuxt/bicep.75c0c4d5.js": {
    "type": "application/javascript",
    "etag": "\"ade-wf6QboOfggtOXrAdvgq8/bPEeTE\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 2782,
    "path": "../public/_nuxt/bicep.75c0c4d5.js"
  },
  "/_nuxt/cameligo.8043f913.js": {
    "type": "application/javascript",
    "etag": "\"97f-bzctTFi1sW3QkO+D5g1hoO58ky4\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 2431,
    "path": "../public/_nuxt/cameligo.8043f913.js"
  },
  "/_nuxt/castArray.c3f34895.js": {
    "type": "application/javascript",
    "etag": "\"89-XTiFOJpZKFDseskIvRQG8yf3438\"",
    "mtime": "2023-10-12T07:40:47.396Z",
    "size": 137,
    "path": "../public/_nuxt/castArray.c3f34895.js"
  },
  "/_nuxt/chat.77e9a818.js": {
    "type": "application/javascript",
    "etag": "\"209-K5ud4Xp/yusRxr4zrPh5aeur6eM\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 521,
    "path": "../public/_nuxt/chat.77e9a818.js"
  },
  "/_nuxt/chat.cde59948.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"230f-9NwVwFUwW0B7r4AOd6TnLj7WWfM\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 8975,
    "path": "../public/_nuxt/chat.cde59948.css"
  },
  "/_nuxt/chat.d3ca26a4.js": {
    "type": "application/javascript",
    "etag": "\"677d-exVPhrioGaGmhP9+zat3FSBQl0Q\"",
    "mtime": "2023-10-12T07:40:47.462Z",
    "size": 26493,
    "path": "../public/_nuxt/chat.d3ca26a4.js"
  },
  "/_nuxt/client-only.e379cb48.js": {
    "type": "application/javascript",
    "etag": "\"1d5-sSS8kiVnCM+x8ay2FQGRIcaNoZw\"",
    "mtime": "2023-10-12T07:40:47.315Z",
    "size": 469,
    "path": "../public/_nuxt/client-only.e379cb48.js"
  },
  "/_nuxt/clojure.73642b02.js": {
    "type": "application/javascript",
    "etag": "\"26a1-nchmBrX9ni+hlNjIgsBS1NvGufQ\"",
    "mtime": "2023-10-12T07:40:47.315Z",
    "size": 9889,
    "path": "../public/_nuxt/clojure.73642b02.js"
  },
  "/_nuxt/codicon.79f233d0.ttf": {
    "type": "font/ttf",
    "etag": "\"11ef8-evdcUoyWz7S4f1wCN+ixrSwdR/w\"",
    "mtime": "2023-10-12T07:40:47.277Z",
    "size": 73464,
    "path": "../public/_nuxt/codicon.79f233d0.ttf"
  },
  "/_nuxt/coffee.a18badcf.js": {
    "type": "application/javascript",
    "etag": "\"efc-OSbl660lS3W4S/7r19mk6NuwUXo\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 3836,
    "path": "../public/_nuxt/coffee.a18badcf.js"
  },
  "/_nuxt/CommonSettings.49aa66d4.js": {
    "type": "application/javascript",
    "etag": "\"7e6-o9U/cz6B9KNdqOdMxxUCTmxIPW8\"",
    "mtime": "2023-10-12T07:40:47.322Z",
    "size": 2022,
    "path": "../public/_nuxt/CommonSettings.49aa66d4.js"
  },
  "/_nuxt/ConvMain.4dcfdfa4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1727-HcTPwH7w8FXEke3qaqCZLPhstdM\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 5927,
    "path": "../public/_nuxt/ConvMain.4dcfdfa4.css"
  },
  "/_nuxt/ConvMain.7726088c.js": {
    "type": "application/javascript",
    "etag": "\"cca3-GxW+RLOqzPTqxz0WdwBIhQrSEPs\"",
    "mtime": "2023-10-12T07:40:47.451Z",
    "size": 52387,
    "path": "../public/_nuxt/ConvMain.7726088c.js"
  },
  "/_nuxt/cpp.4034161e.js": {
    "type": "application/javascript",
    "etag": "\"165c-gpqa68DXgmse4J4s16F/Ay+DNK0\"",
    "mtime": "2023-10-12T07:40:47.396Z",
    "size": 5724,
    "path": "../public/_nuxt/cpp.4034161e.js"
  },
  "/_nuxt/csharp.49cbf0d2.js": {
    "type": "application/javascript",
    "etag": "\"12a2-HLWZlYSBz4PY/9pC8Vr3F03PMHM\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 4770,
    "path": "../public/_nuxt/csharp.49cbf0d2.js"
  },
  "/_nuxt/csp.d207cac4.js": {
    "type": "application/javascript",
    "etag": "\"681-vmTwGqqcswznBYWU2jvEmnfgDb0\"",
    "mtime": "2023-10-12T07:40:47.370Z",
    "size": 1665,
    "path": "../public/_nuxt/csp.d207cac4.js"
  },
  "/_nuxt/css.74326df0.js": {
    "type": "application/javascript",
    "etag": "\"1294-B4regreLr8k+9ratcsOgZTEfp68\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 4756,
    "path": "../public/_nuxt/css.74326df0.js"
  },
  "/_nuxt/cssMode.939df19b.js": {
    "type": "application/javascript",
    "etag": "\"842d-eUbIBQ68JQ4gQd11VwzweYGsB9s\"",
    "mtime": "2023-10-12T07:40:47.448Z",
    "size": 33837,
    "path": "../public/_nuxt/cssMode.939df19b.js"
  },
  "/_nuxt/currency-converter.0c159a8d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"104-R3MO0f4fhmUcrtc74ldcEjR89Xk\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 260,
    "path": "../public/_nuxt/currency-converter.0c159a8d.css"
  },
  "/_nuxt/currency-converter.a4428b45.js": {
    "type": "application/javascript",
    "etag": "\"3b83-OA41no4fe/3h9NedtUe5X//km1M\"",
    "mtime": "2023-10-12T07:40:47.462Z",
    "size": 15235,
    "path": "../public/_nuxt/currency-converter.a4428b45.js"
  },
  "/_nuxt/cypher.49f5f839.js": {
    "type": "application/javascript",
    "etag": "\"e2f-DBrVDGPz3hy7Hvh22Nyn4zW1Uk0\"",
    "mtime": "2023-10-12T07:40:47.396Z",
    "size": 3631,
    "path": "../public/_nuxt/cypher.49f5f839.js"
  },
  "/_nuxt/dart.84b7c6b4.js": {
    "type": "application/javascript",
    "etag": "\"1190-3L6x7AOHVjAAvJsiNSvWdsK8RFc\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 4496,
    "path": "../public/_nuxt/dart.84b7c6b4.js"
  },
  "/_nuxt/dashboard.7e1eef9c.js": {
    "type": "application/javascript",
    "etag": "\"7af-keMXSmry7V7O6MCcL93LOQTrs6c\"",
    "mtime": "2023-10-12T07:40:47.370Z",
    "size": 1967,
    "path": "../public/_nuxt/dashboard.7e1eef9c.js"
  },
  "/_nuxt/default.364be200.js": {
    "type": "application/javascript",
    "etag": "\"5d7-7JMJ1Ssif1XkrVKZRvv2LuO1m4s\"",
    "mtime": "2023-10-12T07:40:47.459Z",
    "size": 1495,
    "path": "../public/_nuxt/default.364be200.js"
  },
  "/_nuxt/default.39fe3d1b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9e-rI+KacqkCoZvi4kBvOhWmhC7LL0\"",
    "mtime": "2023-10-12T07:40:47.292Z",
    "size": 158,
    "path": "../public/_nuxt/default.39fe3d1b.css"
  },
  "/_nuxt/DefaultHeaderButtons.90a88d8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b78-H6nx0Vloo4Jw0cRDV8I93EfnL0U\"",
    "mtime": "2023-10-12T07:40:47.290Z",
    "size": 11128,
    "path": "../public/_nuxt/DefaultHeaderButtons.90a88d8a.css"
  },
  "/_nuxt/DefaultHeaderButtons.d0b27647.js": {
    "type": "application/javascript",
    "etag": "\"788f-NAQ/tcFnU8Shs284WGZJdrEI2+Y\"",
    "mtime": "2023-10-12T07:40:47.464Z",
    "size": 30863,
    "path": "../public/_nuxt/DefaultHeaderButtons.d0b27647.js"
  },
  "/_nuxt/dockerfile.bbf114b2.js": {
    "type": "application/javascript",
    "etag": "\"843-0+TAATCh6phmIFWRYXJUJ40YrPA\"",
    "mtime": "2023-10-12T07:40:47.325Z",
    "size": 2115,
    "path": "../public/_nuxt/dockerfile.bbf114b2.js"
  },
  "/_nuxt/dropdown.95f102e8.js": {
    "type": "application/javascript",
    "etag": "\"925-snWNMJE/qW2rNy4wRoUwvgyetVY\"",
    "mtime": "2023-10-12T07:40:47.315Z",
    "size": 2341,
    "path": "../public/_nuxt/dropdown.95f102e8.js"
  },
  "/_nuxt/ecl.15840f49.js": {
    "type": "application/javascript",
    "etag": "\"15d4-zUrU4ChloTmYGWn2Vx5rqRB8wY8\"",
    "mtime": "2023-10-12T07:40:47.322Z",
    "size": 5588,
    "path": "../public/_nuxt/ecl.15840f49.js"
  },
  "/_nuxt/el-button.2689f638.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d33-RzIPFKzgWgJB1bVDsB1E+qI9A3Y\"",
    "mtime": "2023-10-12T07:40:47.315Z",
    "size": 15667,
    "path": "../public/_nuxt/el-button.2689f638.css"
  },
  "/_nuxt/el-button.721abc11.js": {
    "type": "application/javascript",
    "etag": "\"4a88-FHcD5nQ6VmMlEZHNKvs9+tVAOMY\"",
    "mtime": "2023-10-12T07:40:47.462Z",
    "size": 19080,
    "path": "../public/_nuxt/el-button.721abc11.js"
  },
  "/_nuxt/el-form.7235a9a0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f0d-qCH0MR9J+ccrp40iuwPw59h7yJI\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 3853,
    "path": "../public/_nuxt/el-form.7235a9a0.css"
  },
  "/_nuxt/el-form.dc797ed9.js": {
    "type": "application/javascript",
    "etag": "\"79e4-Yb767XIlA3mfduLjgMhqPU7Difc\"",
    "mtime": "2023-10-12T07:40:47.464Z",
    "size": 31204,
    "path": "../public/_nuxt/el-form.dc797ed9.js"
  },
  "/_nuxt/el-icon.12f2798b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e0-rUUgX55PeSysz9mOdM+T2qj0QS4\"",
    "mtime": "2023-10-12T07:40:47.269Z",
    "size": 480,
    "path": "../public/_nuxt/el-icon.12f2798b.css"
  },
  "/_nuxt/el-input.3fc85dc7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"302b-3v8oiy4O6e1HBuSVz4u1Whl7kIY\"",
    "mtime": "2023-10-12T07:40:47.315Z",
    "size": 12331,
    "path": "../public/_nuxt/el-input.3fc85dc7.css"
  },
  "/_nuxt/el-input.47ef0dfc.js": {
    "type": "application/javascript",
    "etag": "\"33c4-/zJgubW64ZmLVaWVwNYnJWNdHJk\"",
    "mtime": "2023-10-12T07:40:47.464Z",
    "size": 13252,
    "path": "../public/_nuxt/el-input.47ef0dfc.js"
  },
  "/_nuxt/el-link.4eae1793.js": {
    "type": "application/javascript",
    "etag": "\"479-zWH+73YxTYxWtalUal9Hc6GZt4k\"",
    "mtime": "2023-10-12T07:40:47.459Z",
    "size": 1145,
    "path": "../public/_nuxt/el-link.4eae1793.js"
  },
  "/_nuxt/el-link.d9789c6b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b4b-2nLfNoRS3IyBEXstRQu5vwaPiPg\"",
    "mtime": "2023-10-12T07:40:47.290Z",
    "size": 2891,
    "path": "../public/_nuxt/el-link.d9789c6b.css"
  },
  "/_nuxt/el-overlay.276552bd.js": {
    "type": "application/javascript",
    "etag": "\"380f-wOycH7g39fomZvz2mJzOTZzxi2s\"",
    "mtime": "2023-10-12T07:40:47.462Z",
    "size": 14351,
    "path": "../public/_nuxt/el-overlay.276552bd.js"
  },
  "/_nuxt/el-overlay.adec720f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14a9-S5SbV5gD5xWhD5fPG/Pul9XX7VQ\"",
    "mtime": "2023-10-12T07:40:47.315Z",
    "size": 5289,
    "path": "../public/_nuxt/el-overlay.adec720f.css"
  },
  "/_nuxt/el-popover.42c2bc56.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"558-F1/tgAS2U8PplrTLocXW2lf10tg\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 1368,
    "path": "../public/_nuxt/el-popover.42c2bc56.css"
  },
  "/_nuxt/el-popover.fb5db2d4.js": {
    "type": "application/javascript",
    "etag": "\"bf4-zMijESsaezi+pzrezLXds9VMwkM\"",
    "mtime": "2023-10-12T07:40:47.451Z",
    "size": 3060,
    "path": "../public/_nuxt/el-popover.fb5db2d4.js"
  },
  "/_nuxt/el-popper.5c116131.js": {
    "type": "application/javascript",
    "etag": "\"a0e5-mJY8AOVY5YK38+EHKhZ0n8l3Aw8\"",
    "mtime": "2023-10-12T07:40:47.480Z",
    "size": 41189,
    "path": "../public/_nuxt/el-popper.5c116131.js"
  },
  "/_nuxt/el-popper.854ddd02.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1fd4-0uk2Uz3ZxPdGTo0NHlSCdY512co\"",
    "mtime": "2023-10-12T07:40:47.315Z",
    "size": 8148,
    "path": "../public/_nuxt/el-popper.854ddd02.css"
  },
  "/_nuxt/el-select.0b7086fa.js": {
    "type": "application/javascript",
    "etag": "\"a480-EtWzZOlTziKpDCsF3wZbRqu8TPM\"",
    "mtime": "2023-10-12T07:40:47.480Z",
    "size": 42112,
    "path": "../public/_nuxt/el-select.0b7086fa.js"
  },
  "/_nuxt/el-select.7a020f23.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2afe-/xBmWyYeNDbXyHf940VmXlVVKWA\"",
    "mtime": "2023-10-12T07:40:47.313Z",
    "size": 11006,
    "path": "../public/_nuxt/el-select.7a020f23.css"
  },
  "/_nuxt/el-switch.e0856ead.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f4e-7KHKfELgm39cYdoek67imGgUGjc\"",
    "mtime": "2023-10-12T07:40:47.290Z",
    "size": 3918,
    "path": "../public/_nuxt/el-switch.e0856ead.css"
  },
  "/_nuxt/el-switch.e4f9d49b.js": {
    "type": "application/javascript",
    "etag": "\"159e-GKohyG5Bsvyx6Ni8ouNszZCVzBQ\"",
    "mtime": "2023-10-12T07:40:47.460Z",
    "size": 5534,
    "path": "../public/_nuxt/el-switch.e4f9d49b.js"
  },
  "/_nuxt/el-text.733f3a70.js": {
    "type": "application/javascript",
    "etag": "\"2ff-TrdTi6D9SAl2iBdb8uEIYbKxXwY\"",
    "mtime": "2023-10-12T07:40:47.460Z",
    "size": 767,
    "path": "../public/_nuxt/el-text.733f3a70.js"
  },
  "/_nuxt/el-text.7dc6a0f8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b8-ilGyRmsxar56yv5WdPXI1YlRsU4\"",
    "mtime": "2023-10-12T07:40:47.292Z",
    "size": 952,
    "path": "../public/_nuxt/el-text.7dc6a0f8.css"
  },
  "/_nuxt/elixir.e479e18e.js": {
    "type": "application/javascript",
    "etag": "\"2907-EhkQpTz8NuOzBSdPVmmIKvaIwE8\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 10503,
    "path": "../public/_nuxt/elixir.e479e18e.js"
  },
  "/_nuxt/entrance.fa5e444c.js": {
    "type": "application/javascript",
    "etag": "\"46a-J70doDv3kCLFLZnvTiPdtEgL0AE\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 1130,
    "path": "../public/_nuxt/entrance.fa5e444c.js"
  },
  "/_nuxt/entry.6f815613.js": {
    "type": "application/javascript",
    "etag": "\"662f5-JYFYVyBOv3arA1ieJm/muujtK/k\"",
    "mtime": "2023-10-12T07:40:47.480Z",
    "size": 418549,
    "path": "../public/_nuxt/entry.6f815613.js"
  },
  "/_nuxt/entry.7068c0e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3562-N8S/oB5JcdCkIZnNvgadH30Mww8\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 13666,
    "path": "../public/_nuxt/entry.7068c0e9.css"
  },
  "/_nuxt/error-404.7e97f1f2.js": {
    "type": "application/javascript",
    "etag": "\"8cd-BbGJBwiY5XCMsOTbGIK9BhjSqBc\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 2253,
    "path": "../public/_nuxt/error-404.7e97f1f2.js"
  },
  "/_nuxt/error-404.7fc72018.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-iNt1cqPQ0WDudfCTZVQd31BeRGs\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.7fc72018.css"
  },
  "/_nuxt/error-500.c5df6088.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-ByRo+49BgcevWdRjJy3CMx2IA5k\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.c5df6088.css"
  },
  "/_nuxt/error-500.def611f7.js": {
    "type": "application/javascript",
    "etag": "\"756-tvurC1jGQ9284Q9FpUP1AtL6D8c\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.def611f7.js"
  },
  "/_nuxt/flow9.42a61225.js": {
    "type": "application/javascript",
    "etag": "\"808-Sq1uEsdOVM02CVlCexHC6AMiZfM\"",
    "mtime": "2023-10-12T07:40:47.326Z",
    "size": 2056,
    "path": "../public/_nuxt/flow9.42a61225.js"
  },
  "/_nuxt/focus-trap.07cd3c7d.js": {
    "type": "application/javascript",
    "etag": "\"1505-HPV9pefWyDRb3f1T4f2FlrmfJF0\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 5381,
    "path": "../public/_nuxt/focus-trap.07cd3c7d.js"
  },
  "/_nuxt/freemarker2.ece56290.js": {
    "type": "application/javascript",
    "etag": "\"406f-UFr0e1MkBwbMi1AqJxpQYXYtyGU\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 16495,
    "path": "../public/_nuxt/freemarker2.ece56290.js"
  },
  "/_nuxt/fsharp.8abe6da0.js": {
    "type": "application/javascript",
    "etag": "\"c9d-bfcDEOpJax6Kk+wVlQWA8NEG1gk\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 3229,
    "path": "../public/_nuxt/fsharp.8abe6da0.js"
  },
  "/_nuxt/go.8759e9f7.js": {
    "type": "application/javascript",
    "etag": "\"b57-KdIe5gnvI+0UZjjRNmlGjBYQQjc\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 2903,
    "path": "../public/_nuxt/go.8759e9f7.js"
  },
  "/_nuxt/graphql.387d549c.js": {
    "type": "application/javascript",
    "etag": "\"9ca-s+ejpp+B6NwKnhsAyrLq6USVBIg\"",
    "mtime": "2023-10-12T07:40:47.338Z",
    "size": 2506,
    "path": "../public/_nuxt/graphql.387d549c.js"
  },
  "/_nuxt/handlebars.a91695bf.js": {
    "type": "application/javascript",
    "etag": "\"1c05-eALd2WR/f4GVBtI9SGSfMCmK1Ms\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 7173,
    "path": "../public/_nuxt/handlebars.a91695bf.js"
  },
  "/_nuxt/hcl.a88f331a.js": {
    "type": "application/javascript",
    "etag": "\"efc-BzCMGnNs54LIeeuDOIBA/UXYByE\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 3836,
    "path": "../public/_nuxt/hcl.a88f331a.js"
  },
  "/_nuxt/html.18d1b44b.js": {
    "type": "application/javascript",
    "etag": "\"1525-hN/VNg/x1+z2UMS02i5SRql8c6M\"",
    "mtime": "2023-10-12T07:40:47.328Z",
    "size": 5413,
    "path": "../public/_nuxt/html.18d1b44b.js"
  },
  "/_nuxt/htmlMode.761eb926.js": {
    "type": "application/javascript",
    "etag": "\"8654-OZ31VR+T1Z07AtzBg39qEezAkzA\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 34388,
    "path": "../public/_nuxt/htmlMode.761eb926.js"
  },
  "/_nuxt/index.075550ef.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1aa9d-ElilReAb+IAHX6F0AdmH/vc+Nr4\"",
    "mtime": "2023-10-12T07:40:47.292Z",
    "size": 109213,
    "path": "../public/_nuxt/index.075550ef.css"
  },
  "/_nuxt/index.b514fb5b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"278-0pup7TF8hCneNOiJN1LMu+0R8J8\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 632,
    "path": "../public/_nuxt/index.b514fb5b.css"
  },
  "/_nuxt/index.d7c8b38f.js": {
    "type": "application/javascript",
    "etag": "\"2fd22e-EeaRZqq6ggxERTGsvQb6myW1hA0\"",
    "mtime": "2023-10-12T07:40:47.480Z",
    "size": 3133998,
    "path": "../public/_nuxt/index.d7c8b38f.js"
  },
  "/_nuxt/index.f38d3ff5.js": {
    "type": "application/javascript",
    "etag": "\"29f-rCvDkgK5Cod1m+4X4cgj1SiPzeE\"",
    "mtime": "2023-10-12T07:40:47.451Z",
    "size": 671,
    "path": "../public/_nuxt/index.f38d3ff5.js"
  },
  "/_nuxt/index.fab67ef0.js": {
    "type": "application/javascript",
    "etag": "\"348-wAqQA2Duuywtt23aMX1hBIvtGfU\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 840,
    "path": "../public/_nuxt/index.fab67ef0.js"
  },
  "/_nuxt/ini.18bf1153.js": {
    "type": "application/javascript",
    "etag": "\"543-dy/9UzsXT+StF+O64v2WLtuJTQE\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 1347,
    "path": "../public/_nuxt/ini.18bf1153.js"
  },
  "/_nuxt/isEqual.8220b5aa.js": {
    "type": "application/javascript",
    "etag": "\"e9f-HW7OAAtYbv7PU9YgirZE3Aq9O4g\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 3743,
    "path": "../public/_nuxt/isEqual.8220b5aa.js"
  },
  "/_nuxt/java.000a6283.js": {
    "type": "application/javascript",
    "etag": "\"d8b-BjKmHwhUGBS84vH0LUPtwJ+KZNE\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 3467,
    "path": "../public/_nuxt/java.000a6283.js"
  },
  "/_nuxt/javascript.9ad18a76.js": {
    "type": "application/javascript",
    "etag": "\"51d-X3ndFKbzsRrdDZLNbNYeUAtugPg\"",
    "mtime": "2023-10-12T07:40:47.326Z",
    "size": 1309,
    "path": "../public/_nuxt/javascript.9ad18a76.js"
  },
  "/_nuxt/jsonMode.8126a674.js": {
    "type": "application/javascript",
    "etag": "\"9bc6-vQ1wQpNq828zuhblly7ywxe7PEw\"",
    "mtime": "2023-10-12T07:40:47.446Z",
    "size": 39878,
    "path": "../public/_nuxt/jsonMode.8126a674.js"
  },
  "/_nuxt/julia.0026391c.js": {
    "type": "application/javascript",
    "etag": "\"1ce3-s8vHkCu7EKlHCnyLHBFGhNgm1+o\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 7395,
    "path": "../public/_nuxt/julia.0026391c.js"
  },
  "/_nuxt/kotlin.06ee8898.js": {
    "type": "application/javascript",
    "etag": "\"e65-JM5scpeTja9IqwSnzQe51RI7ea0\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 3685,
    "path": "../public/_nuxt/kotlin.06ee8898.js"
  },
  "/_nuxt/less.dd86a68c.js": {
    "type": "application/javascript",
    "etag": "\"1030-Hh54fIKhKKLekWSx/Q3IxbKydGM\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 4144,
    "path": "../public/_nuxt/less.dd86a68c.js"
  },
  "/_nuxt/lexon.8d4b0444.js": {
    "type": "application/javascript",
    "etag": "\"a7b-EL1VEtEFISjySLri5KMeLfGIpWM\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 2683,
    "path": "../public/_nuxt/lexon.8d4b0444.js"
  },
  "/_nuxt/liquid.97c1443f.js": {
    "type": "application/javascript",
    "etag": "\"1107-ghDevJW9vvIdFesix0Pjlz7NYGA\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 4359,
    "path": "../public/_nuxt/liquid.97c1443f.js"
  },
  "/_nuxt/login.4eacc28f.js": {
    "type": "application/javascript",
    "etag": "\"47c-7riQc9uOGWxrlww4FpxeYAuhdCI\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 1148,
    "path": "../public/_nuxt/login.4eacc28f.js"
  },
  "/_nuxt/login.700c06bd.js": {
    "type": "application/javascript",
    "etag": "\"c4f-o0y6MI2AoGaXl+MZJWJfy8tQwi4\"",
    "mtime": "2023-10-12T07:40:47.451Z",
    "size": 3151,
    "path": "../public/_nuxt/login.700c06bd.js"
  },
  "/_nuxt/login.7707bf7b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c5-RG1RUCT5lzjhK6LVE/uMACFXHrM\"",
    "mtime": "2023-10-12T07:40:47.292Z",
    "size": 709,
    "path": "../public/_nuxt/login.7707bf7b.css"
  },
  "/_nuxt/lua.9adddcd9.js": {
    "type": "application/javascript",
    "etag": "\"941-b9EO5OV77TIzCdgq0Nyv/g98Xl4\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 2369,
    "path": "../public/_nuxt/lua.9adddcd9.js"
  },
  "/_nuxt/m3.aa2dcf72.js": {
    "type": "application/javascript",
    "etag": "\"bf7-V/GoLyiPGkpaMqr4by+pXCESbws\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 3063,
    "path": "../public/_nuxt/m3.aa2dcf72.js"
  },
  "/_nuxt/markdown.0f073a3a.js": {
    "type": "application/javascript",
    "etag": "\"fc2-EQW9lbELsOGs4LjNGaJ3J0WOOyk\"",
    "mtime": "2023-10-12T07:40:47.370Z",
    "size": 4034,
    "path": "../public/_nuxt/markdown.0f073a3a.js"
  },
  "/_nuxt/mdx.9e42133e.js": {
    "type": "application/javascript",
    "etag": "\"1490-Jr6G+vR3a08T7KeAgxw/aTXd8ao\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 5264,
    "path": "../public/_nuxt/mdx.9e42133e.js"
  },
  "/_nuxt/mips.bdd96c5a.js": {
    "type": "application/javascript",
    "etag": "\"b09-Az9vcFfj750O5TMLFeM4+sSXO+A\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 2825,
    "path": "../public/_nuxt/mips.bdd96c5a.js"
  },
  "/_nuxt/msdax.1ac55115.js": {
    "type": "application/javascript",
    "etag": "\"1426-B1G9YkX/b+V1+w2AvZAmGVcjbrA\"",
    "mtime": "2023-10-12T07:40:47.370Z",
    "size": 5158,
    "path": "../public/_nuxt/msdax.1ac55115.js"
  },
  "/_nuxt/mysql.b530c105.js": {
    "type": "application/javascript",
    "etag": "\"2d00-gqEyX9GjFH168PC1SlvZ4Gre3Tw\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 11520,
    "path": "../public/_nuxt/mysql.b530c105.js"
  },
  "/_nuxt/nuxt-link.b7e519e3.js": {
    "type": "application/javascript",
    "etag": "\"1107-hRpg9iXiQtQ5vp9xY9J3LwkU8N4\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 4359,
    "path": "../public/_nuxt/nuxt-link.b7e519e3.js"
  },
  "/_nuxt/objective-c.951ded7b.js": {
    "type": "application/javascript",
    "etag": "\"a58-SgrmSauoN6af/E48J/VzDuB1WeI\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 2648,
    "path": "../public/_nuxt/objective-c.951ded7b.js"
  },
  "/_nuxt/onlyAdminAuth.8a9e6ee6.js": {
    "type": "application/javascript",
    "etag": "\"108-Uad+Z+DEGCbT+vexm0TiJFssItM\"",
    "mtime": "2023-10-12T07:40:47.315Z",
    "size": 264,
    "path": "../public/_nuxt/onlyAdminAuth.8a9e6ee6.js"
  },
  "/_nuxt/onlyAuth.c5d37bb2.js": {
    "type": "application/javascript",
    "etag": "\"10a-vS4a6c+8TZYglsacxQNd2ARXawA\"",
    "mtime": "2023-10-12T07:40:47.322Z",
    "size": 266,
    "path": "../public/_nuxt/onlyAuth.c5d37bb2.js"
  },
  "/_nuxt/onlyNoAuth.32a5368f.js": {
    "type": "application/javascript",
    "etag": "\"e2-OYjPU7E+gn5ajnYhYvihY3NLra4\"",
    "mtime": "2023-10-12T07:40:47.433Z",
    "size": 226,
    "path": "../public/_nuxt/onlyNoAuth.32a5368f.js"
  },
  "/_nuxt/pascal.7442fd46.js": {
    "type": "application/javascript",
    "etag": "\"ca9-zqUYmdA89CxQEDucYC3S706Ida0\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 3241,
    "path": "../public/_nuxt/pascal.7442fd46.js"
  },
  "/_nuxt/pascaligo.385edc0e.js": {
    "type": "application/javascript",
    "etag": "\"8c6-wWVD8PM81uF4fhSwnnPlntHFats\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 2246,
    "path": "../public/_nuxt/pascaligo.385edc0e.js"
  },
  "/_nuxt/perl.d5fb326c.js": {
    "type": "application/javascript",
    "etag": "\"2135-HWg+JSsSV/PdUXSNfQy4tdZVg40\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 8501,
    "path": "../public/_nuxt/perl.d5fb326c.js"
  },
  "/_nuxt/perspective.001f0cf5.js": {
    "type": "application/javascript",
    "etag": "\"a1f0-7S4IpjYk1dujTFuEedSMicSyDAw\"",
    "mtime": "2023-10-12T07:40:47.464Z",
    "size": 41456,
    "path": "../public/_nuxt/perspective.001f0cf5.js"
  },
  "/_nuxt/perspective.4ba55fb4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2d16-8wdA7ud8cbt5UDDFIjYjOmbqVhY\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 11542,
    "path": "../public/_nuxt/perspective.4ba55fb4.css"
  },
  "/_nuxt/pgsql.2d7db25a.js": {
    "type": "application/javascript",
    "etag": "\"358e-MtyDB+8le8/jro7X7PKBiK2bBi4\"",
    "mtime": "2023-10-12T07:40:47.370Z",
    "size": 13710,
    "path": "../public/_nuxt/pgsql.2d7db25a.js"
  },
  "/_nuxt/php.1daff147.js": {
    "type": "application/javascript",
    "etag": "\"2051-3fRtsSUli2Lpwyntrl5anqeP180\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 8273,
    "path": "../public/_nuxt/php.1daff147.js"
  },
  "/_nuxt/pla.1b3e1614.js": {
    "type": "application/javascript",
    "etag": "\"789-8WkM2qNwt/F7Bo7HSAaQlJbl+ig\"",
    "mtime": "2023-10-12T07:40:47.328Z",
    "size": 1929,
    "path": "../public/_nuxt/pla.1b3e1614.js"
  },
  "/_nuxt/postiats.9db13649.js": {
    "type": "application/javascript",
    "etag": "\"1fa6-T6Iv89XNiulWCK9RbXhkzPrLEzA\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 8102,
    "path": "../public/_nuxt/postiats.9db13649.js"
  },
  "/_nuxt/powerquery.4c428232.js": {
    "type": "application/javascript",
    "etag": "\"4321-Mq2UCsE+QcxtEreWPlZI5FTYUFs\"",
    "mtime": "2023-10-12T07:40:47.433Z",
    "size": 17185,
    "path": "../public/_nuxt/powerquery.4c428232.js"
  },
  "/_nuxt/powershell.d3380668.js": {
    "type": "application/javascript",
    "etag": "\"dbb-M5TUy0RN9B6leeV2wuEJnpA4OUk\"",
    "mtime": "2023-10-12T07:40:47.435Z",
    "size": 3515,
    "path": "../public/_nuxt/powershell.d3380668.js"
  },
  "/_nuxt/profile.c1d929d0.js": {
    "type": "application/javascript",
    "etag": "\"9c8-u6mR2hIGZW3oxERGDXgwT/7Yz3M\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 2504,
    "path": "../public/_nuxt/profile.c1d929d0.js"
  },
  "/_nuxt/protobuf.941cf3e8.js": {
    "type": "application/javascript",
    "etag": "\"244c-OiMt3jkOXnOl4gXuf7v7ng2iElM\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 9292,
    "path": "../public/_nuxt/protobuf.941cf3e8.js"
  },
  "/_nuxt/pug.cfe384ef.js": {
    "type": "application/javascript",
    "etag": "\"13d2-2YCBv6prfbzKFntWIqfdjeuNysU\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 5074,
    "path": "../public/_nuxt/pug.cfe384ef.js"
  },
  "/_nuxt/python.f8f42247.js": {
    "type": "application/javascript",
    "etag": "\"fb0-fwfoigqQnakmZ/ANgBpittHB6Xw\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 4016,
    "path": "../public/_nuxt/python.f8f42247.js"
  },
  "/_nuxt/qr-code.63d6584e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ce-IgNvD7dMr9Wx5VB+p94Qub+9ciM\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 206,
    "path": "../public/_nuxt/qr-code.63d6584e.css"
  },
  "/_nuxt/qr-code.7ec440aa.js": {
    "type": "application/javascript",
    "etag": "\"673a-o01eydbaQxEpftMBlunIifMBF/I\"",
    "mtime": "2023-10-12T07:40:47.464Z",
    "size": 26426,
    "path": "../public/_nuxt/qr-code.7ec440aa.js"
  },
  "/_nuxt/qsharp.e125d03f.js": {
    "type": "application/javascript",
    "etag": "\"c6d-xzSf34J3MYK0VPYlGwN7zdSryF8\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 3181,
    "path": "../public/_nuxt/qsharp.e125d03f.js"
  },
  "/_nuxt/r.e0a01d4f.js": {
    "type": "application/javascript",
    "etag": "\"d31-H5xB9+xkCq7doobub70qKOItFTY\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 3377,
    "path": "../public/_nuxt/r.e0a01d4f.js"
  },
  "/_nuxt/razor.a261d655.js": {
    "type": "application/javascript",
    "etag": "\"23d9-Irp1HaKCI0l5xcyePKmA7ZSYxbw\"",
    "mtime": "2023-10-12T07:40:47.435Z",
    "size": 9177,
    "path": "../public/_nuxt/razor.a261d655.js"
  },
  "/_nuxt/redis.d0a12fea.js": {
    "type": "application/javascript",
    "etag": "\"eda-AaC0XwoeTIJyo0a8fEzXI4ZtqLk\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 3802,
    "path": "../public/_nuxt/redis.d0a12fea.js"
  },
  "/_nuxt/redshift.a163b94a.js": {
    "type": "application/javascript",
    "etag": "\"2f0e-cTrKFvzjH7TtQr9UI4qA/yobJnU\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 12046,
    "path": "../public/_nuxt/redshift.a163b94a.js"
  },
  "/_nuxt/reset-password.57439420.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2cd-ykzE3D7J8on6MCCO6QyxHOWuhuI\"",
    "mtime": "2023-10-12T07:40:47.283Z",
    "size": 717,
    "path": "../public/_nuxt/reset-password.57439420.css"
  },
  "/_nuxt/reset-password.66948ef5.js": {
    "type": "application/javascript",
    "etag": "\"1576-N9YHQAaVukMkNXBfIT/6I7dvrHE\"",
    "mtime": "2023-10-12T07:40:47.446Z",
    "size": 5494,
    "path": "../public/_nuxt/reset-password.66948ef5.js"
  },
  "/_nuxt/restructuredtext.5a906e1a.js": {
    "type": "application/javascript",
    "etag": "\"102b-t62hMsr+3uAkQsSAHCu3lAyL5yY\"",
    "mtime": "2023-10-12T07:40:47.417Z",
    "size": 4139,
    "path": "../public/_nuxt/restructuredtext.5a906e1a.js"
  },
  "/_nuxt/ruby.05b021bf.js": {
    "type": "application/javascript",
    "etag": "\"222e-ubRyC6000X89sIe2Tyum3HIHXbw\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 8750,
    "path": "../public/_nuxt/ruby.05b021bf.js"
  },
  "/_nuxt/rust.3d80982c.js": {
    "type": "application/javascript",
    "etag": "\"1136-QaNoz5j3XkFurqotQSUvMlfzf5k\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 4406,
    "path": "../public/_nuxt/rust.3d80982c.js"
  },
  "/_nuxt/sb.2020a5af.js": {
    "type": "application/javascript",
    "etag": "\"81b-OmhTSIvQSKLAYVXZ4B95lxFq2AQ\"",
    "mtime": "2023-10-12T07:40:47.433Z",
    "size": 2075,
    "path": "../public/_nuxt/sb.2020a5af.js"
  },
  "/_nuxt/scala.54469b4b.js": {
    "type": "application/javascript",
    "etag": "\"1d8c-0V1cAbDfbIgXaOZk+WOi5xkPwiU\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 7564,
    "path": "../public/_nuxt/scala.54469b4b.js"
  },
  "/_nuxt/scheme.ff6e5671.js": {
    "type": "application/javascript",
    "etag": "\"7dd-M+TTFoDim/3IK6crcHGgRtyXh0k\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 2013,
    "path": "../public/_nuxt/scheme.ff6e5671.js"
  },
  "/_nuxt/scroll.8c7d302b.js": {
    "type": "application/javascript",
    "etag": "\"4a6-y2AMTgEGiBSU3L9bOGjLQmYkCJs\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 1190,
    "path": "../public/_nuxt/scroll.8c7d302b.js"
  },
  "/_nuxt/scss.77902feb.js": {
    "type": "application/javascript",
    "etag": "\"19ff-eBf882Y1u/XyXUafRlHkwCiCpzM\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 6655,
    "path": "../public/_nuxt/scss.77902feb.js"
  },
  "/_nuxt/shell.3c06def6.js": {
    "type": "application/javascript",
    "etag": "\"cf7-D4EfbK05ppWOZBtV+fkcmfAgZnY\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 3319,
    "path": "../public/_nuxt/shell.3c06def6.js"
  },
  "/_nuxt/signup.ed641955.js": {
    "type": "application/javascript",
    "etag": "\"1911-hJQmUBXYqWeQxDfyTJEymqDPaK0\"",
    "mtime": "2023-10-12T07:40:47.464Z",
    "size": 6417,
    "path": "../public/_nuxt/signup.ed641955.js"
  },
  "/_nuxt/solidity.3d59d6a7.js": {
    "type": "application/javascript",
    "etag": "\"499b-XOtDEkVR87tNBqI0m4A4u040ass\"",
    "mtime": "2023-10-12T07:40:47.370Z",
    "size": 18843,
    "path": "../public/_nuxt/solidity.3d59d6a7.js"
  },
  "/_nuxt/sophia.12eb7ba8.js": {
    "type": "application/javascript",
    "etag": "\"bc2-cyNQUwEyEXqKLuPDbTzqPoECTR8\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 3010,
    "path": "../public/_nuxt/sophia.12eb7ba8.js"
  },
  "/_nuxt/sparql.e42fb28a.js": {
    "type": "application/javascript",
    "etag": "\"aee-2IENVcsvtg26oL9unpghDwJwyc8\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 2798,
    "path": "../public/_nuxt/sparql.e42fb28a.js"
  },
  "/_nuxt/sql.d30fd9fd.js": {
    "type": "application/javascript",
    "etag": "\"292f-CylEIydJpKrjoHcu9cqt5jsrtBY\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 10543,
    "path": "../public/_nuxt/sql.d30fd9fd.js"
  },
  "/_nuxt/st.0857f583.js": {
    "type": "application/javascript",
    "etag": "\"1ddd-hrnZzgpRR1JLYB7gaJvtYCs2HBk\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 7645,
    "path": "../public/_nuxt/st.0857f583.js"
  },
  "/_nuxt/swift.f0a706dd.js": {
    "type": "application/javascript",
    "etag": "\"1529-3C53rBbE8ZaeBNnqbhuGUozRNho\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 5417,
    "path": "../public/_nuxt/swift.f0a706dd.js"
  },
  "/_nuxt/systemverilog.0cfd4211.js": {
    "type": "application/javascript",
    "etag": "\"1ea9-AgkyU7DH1OQ7qLndcPvn3QHQxv4\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 7849,
    "path": "../public/_nuxt/systemverilog.0cfd4211.js"
  },
  "/_nuxt/tcl.7df3c0c5.js": {
    "type": "application/javascript",
    "etag": "\"ee9-xk/4LydX85KWtgvu7kQKaFCVl/c\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 3817,
    "path": "../public/_nuxt/tcl.7df3c0c5.js"
  },
  "/_nuxt/tsMode.311b5f50.js": {
    "type": "application/javascript",
    "etag": "\"5b29-1Wr3/tVJ3q9e2YBQFvqQa7cbCv0\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 23337,
    "path": "../public/_nuxt/tsMode.311b5f50.js"
  },
  "/_nuxt/twig.f894aab2.js": {
    "type": "application/javascript",
    "etag": "\"184b-6ehwOqblVtOqO+JcIsaGIs3PSvQ\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 6219,
    "path": "../public/_nuxt/twig.f894aab2.js"
  },
  "/_nuxt/typescript.3ae9d0f7.js": {
    "type": "application/javascript",
    "etag": "\"16ae-u59gfAEBUluT4JbZ8egakEBFvEM\"",
    "mtime": "2023-10-12T07:40:47.370Z",
    "size": 5806,
    "path": "../public/_nuxt/typescript.3ae9d0f7.js"
  },
  "/_nuxt/useAdmin.c1131ec6.js": {
    "type": "application/javascript",
    "etag": "\"131-hWvnB8Gc5YpPOXmXKISlZZAk3EE\"",
    "mtime": "2023-10-12T07:40:47.358Z",
    "size": 305,
    "path": "../public/_nuxt/useAdmin.c1131ec6.js"
  },
  "/_nuxt/useAuth.1edd03de.js": {
    "type": "application/javascript",
    "etag": "\"94f-HGYcK68FcY+lG3PU4fjvUounqlM\"",
    "mtime": "2023-10-12T07:40:47.396Z",
    "size": 2383,
    "path": "../public/_nuxt/useAuth.1edd03de.js"
  },
  "/_nuxt/useChat.d0d93c40.js": {
    "type": "application/javascript",
    "etag": "\"37e5-/KDLE9dpfB6FITncMZDv8Xpaeb0\"",
    "mtime": "2023-10-12T07:40:47.417Z",
    "size": 14309,
    "path": "../public/_nuxt/useChat.d0d93c40.js"
  },
  "/_nuxt/useTitle.85324271.js": {
    "type": "application/javascript",
    "etag": "\"9f-xVfg5unkd6kmnIKDW8fzD3XSpuA\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 159,
    "path": "../public/_nuxt/useTitle.85324271.js"
  },
  "/_nuxt/vb.39a025f4.js": {
    "type": "application/javascript",
    "etag": "\"1795-/epUOwDtsmgorr6m3cma2PV9O1o\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 6037,
    "path": "../public/_nuxt/vb.39a025f4.js"
  },
  "/_nuxt/wgsl.afa2396f.js": {
    "type": "application/javascript",
    "etag": "\"1d97-4x8XWs+/BOE9JzY5oWJjtVNIr6M\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 7575,
    "path": "../public/_nuxt/wgsl.afa2396f.js"
  },
  "/_nuxt/xml.b774365d.js": {
    "type": "application/javascript",
    "etag": "\"af7-sJSTn9FfqGqEn4wjUfbkhj+7VVk\"",
    "mtime": "2023-10-12T07:40:47.419Z",
    "size": 2807,
    "path": "../public/_nuxt/xml.b774365d.js"
  },
  "/_nuxt/yaml.27b45a84.js": {
    "type": "application/javascript",
    "etag": "\"113e-kLG3KW/BTSyPxAYvtRTm3SPgZFI\"",
    "mtime": "2023-10-12T07:40:47.437Z",
    "size": 4414,
    "path": "../public/_nuxt/yaml.27b45a84.js"
  },
  "/_nuxt/_conv_.bb1e6ab6.js": {
    "type": "application/javascript",
    "etag": "\"347-7pKmW21FV4+ZyrptBaBiVu5Bvtg\"",
    "mtime": "2023-10-12T07:40:47.386Z",
    "size": 839,
    "path": "../public/_nuxt/_conv_.bb1e6ab6.js"
  },
  "/_nuxt/_Uint8Array.9a33d59f.js": {
    "type": "application/javascript",
    "etag": "\"11d8-8tRYlSncc/78EtN4+TEqIWQu900\"",
    "mtime": "2023-10-12T07:40:47.401Z",
    "size": 4568,
    "path": "../public/_nuxt/_Uint8Array.9a33d59f.js"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _lazy_VG7AuW = () => import('../check.delete.mjs');
const _lazy_WXPwa6 = () => import('../check.post.mjs');
const _lazy_kZXGJT = () => import('../search-engine.get.mjs');
const _lazy_KZk1WF = () => import('../search-engine.post.mjs');
const _lazy_2UEmq6 = () => import('../setting.post.mjs');
const _lazy_zvaLFk = () => import('../check.post2.mjs');
const _lazy_o5FP4N = () => import('../createVerification.post.mjs');
const _lazy_zOKIdB = () => import('../login.post.mjs');
const _lazy_WJa1oD = () => import('../logout.post.mjs');
const _lazy_dwzRuU = () => import('../replaceUser.post.mjs');
const _lazy_jesKNI = () => import('../resendCode.post.mjs');
const _lazy_Sw4omo = () => import('../resetPassword.post.mjs');
const _lazy_lxZJKs = () => import('../signup.post.mjs');
const _lazy_NeuO3u = () => import('../transfer.mjs');
const _lazy_1p3aRP = () => import('../username.put.mjs');
const _lazy_pLmyCf = () => import('../answer.delete.mjs');
const _lazy_3Mt2a8 = () => import('../answer.post.mjs');
const _lazy_kJtgCM = () => import('../check.post3.mjs');
const _lazy_4OSpWZ = () => import('../conv.delete.mjs');
const _lazy_PisHQB = () => import('../conv.put.mjs');
const _lazy_IU7ibC = () => import('../express-fgpt.post.mjs');
const _lazy_nWZ2EG = () => import('../express.post.mjs');
const _lazy_6dkoI2 = () => import('../history.post.mjs');
const _lazy_NQMWNX = () => import('../message.put.mjs');
const _lazy_eX0BIe = () => import('../stream.post.mjs');
const _lazy_gXcq4j = () => import('../suggestions.post.mjs');
const _lazy_jB3LSP = () => import('../discord.mjs');
const _lazy_0zsh9M = () => import('../memory.mjs');
const _lazy_SgsRvL = () => import('../keys.mjs');
const _lazy_MEyQpG = () => import('../messages.mjs');
const _lazy_3d4cLS = () => import('../tree.mjs');
const _lazy_4LgtKu = () => import('../yt-captions.mjs');
const _lazy_G379SO = () => import('../feedback.post.mjs');
const _lazy_52eCS0 = () => import('../status.mjs');
const _lazy_pmoUer = () => import('../test.mjs');
const _lazy_nNDnAg = () => import('../translate.mjs');
const _lazy_JceUx4 = () => import('../user.post.mjs');
const _lazy_xtJJaV = () => import('../version.mjs');
const _lazy_afirBq = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/check', handler: _lazy_VG7AuW, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/check', handler: _lazy_WXPwa6, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/search-engine', handler: _lazy_kZXGJT, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/search-engine', handler: _lazy_KZk1WF, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/setting', handler: _lazy_2UEmq6, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/check', handler: _lazy_zvaLFk, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/createVerification', handler: _lazy_o5FP4N, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_zOKIdB, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_WJa1oD, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/replaceUser', handler: _lazy_dwzRuU, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/resendCode', handler: _lazy_jesKNI, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/resetPassword', handler: _lazy_Sw4omo, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/signup', handler: _lazy_lxZJKs, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/transfer', handler: _lazy_NeuO3u, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/username', handler: _lazy_1p3aRP, lazy: true, middleware: false, method: "put" },
  { route: '/api/curva/answer', handler: _lazy_pLmyCf, lazy: true, middleware: false, method: "delete" },
  { route: '/api/curva/answer', handler: _lazy_3Mt2a8, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/check', handler: _lazy_kJtgCM, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/conv', handler: _lazy_4OSpWZ, lazy: true, middleware: false, method: "delete" },
  { route: '/api/curva/conv', handler: _lazy_PisHQB, lazy: true, middleware: false, method: "put" },
  { route: '/api/curva/express-fgpt', handler: _lazy_IU7ibC, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/express', handler: _lazy_nWZ2EG, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/history', handler: _lazy_6dkoI2, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/message', handler: _lazy_NQMWNX, lazy: true, middleware: false, method: "put" },
  { route: '/api/curva/stream', handler: _lazy_eX0BIe, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/suggestions', handler: _lazy_gXcq4j, lazy: true, middleware: false, method: "post" },
  { route: '/api/discord', handler: _lazy_jB3LSP, lazy: true, middleware: false, method: undefined },
  { route: '/api/memory', handler: _lazy_0zsh9M, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/keys', handler: _lazy_SgsRvL, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/messages', handler: _lazy_MEyQpG, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/tree', handler: _lazy_3d4cLS, lazy: true, middleware: false, method: undefined },
  { route: '/api/services/yt-captions', handler: _lazy_4LgtKu, lazy: true, middleware: false, method: undefined },
  { route: '/api/stats/feedback', handler: _lazy_G379SO, lazy: true, middleware: false, method: "post" },
  { route: '/api/status', handler: _lazy_52eCS0, lazy: true, middleware: false, method: undefined },
  { route: '/api/test', handler: _lazy_pmoUer, lazy: true, middleware: false, method: undefined },
  { route: '/api/translate', handler: _lazy_nNDnAg, lazy: true, middleware: false, method: undefined },
  { route: '/api/user', handler: _lazy_JceUx4, lazy: true, middleware: false, method: "post" },
  { route: '/api/version', handler: _lazy_xtJJaV, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_afirBq, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_afirBq, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || {};
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT, 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  gracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((err) => {
          console.error(err);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const listener = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
