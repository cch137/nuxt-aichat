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

const _mjWO3E2Zv0 = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _mjWO3E2Zv0
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
    "mtime": "2023-07-27T13:09:56.505Z",
    "size": 32038,
    "path": "../public/curva_favicon.ico"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"7d26-UhUNCz6v/vGTOfHEATYsYktF31E\"",
    "mtime": "2023-07-27T13:09:56.506Z",
    "size": 32038,
    "path": "../public/favicon.ico"
  },
  "/_favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"7d26-msK/5wOlQI+ENfzUn8FM3lri6b8\"",
    "mtime": "2023-07-27T13:09:56.504Z",
    "size": 32038,
    "path": "../public/_favicon.ico"
  },
  "/_nuxt/cch137.57bac52a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4398-Tra+dHxq33edNcuds8ZcBLoHous\"",
    "mtime": "2023-08-03T14:30:20.185Z",
    "size": 17304,
    "path": "../public/_nuxt/cch137.57bac52a.css"
  },
  "/_nuxt/cch137.a49d1d12.js": {
    "type": "application/javascript",
    "etag": "\"12337-SvPl14ocINQ/hrXi5XoAXRn2Mjg\"",
    "mtime": "2023-08-03T14:30:20.231Z",
    "size": 74551,
    "path": "../public/_nuxt/cch137.a49d1d12.js"
  },
  "/_nuxt/chat.601da434.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4c9a-jPnY7nkP7fTXxUx3ADnXu2/LoAM\"",
    "mtime": "2023-08-03T14:30:20.186Z",
    "size": 19610,
    "path": "../public/_nuxt/chat.601da434.css"
  },
  "/_nuxt/chat.926f9dc1.js": {
    "type": "application/javascript",
    "etag": "\"e460-08yoIhXBsbo4VCz/Rz1WC/uQphY\"",
    "mtime": "2023-08-03T14:30:20.231Z",
    "size": 58464,
    "path": "../public/_nuxt/chat.926f9dc1.js"
  },
  "/_nuxt/chat.cd6b510a.js": {
    "type": "application/javascript",
    "etag": "\"1b2-tUUD60C4tV9S5nn/zp0VZXsbUTY\"",
    "mtime": "2023-08-03T14:30:20.207Z",
    "size": 434,
    "path": "../public/_nuxt/chat.cd6b510a.js"
  },
  "/_nuxt/ChatCore.742155dd.js": {
    "type": "application/javascript",
    "etag": "\"bcb4-eQynx4WVQ5wYu9wt8D0qS2QTCog\"",
    "mtime": "2023-08-03T14:30:20.228Z",
    "size": 48308,
    "path": "../public/_nuxt/ChatCore.742155dd.js"
  },
  "/_nuxt/ChatCore.ada050bd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"156a-7j7q1eN2Q8g0XwAoPzJHfEd2FZc\"",
    "mtime": "2023-08-03T14:30:20.188Z",
    "size": 5482,
    "path": "../public/_nuxt/ChatCore.ada050bd.css"
  },
  "/_nuxt/client-only.d5e2a050.js": {
    "type": "application/javascript",
    "etag": "\"1d4-QKV/GnrWUSm2VWcqEaf8UiLBR04\"",
    "mtime": "2023-08-03T14:30:20.206Z",
    "size": 468,
    "path": "../public/_nuxt/client-only.d5e2a050.js"
  },
  "/_nuxt/default.d7a2342f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11f-0FIGIyc6NoHUcrNA96+d1T3SmJQ\"",
    "mtime": "2023-08-03T14:30:20.188Z",
    "size": 287,
    "path": "../public/_nuxt/default.d7a2342f.css"
  },
  "/_nuxt/default.df67aa28.js": {
    "type": "application/javascript",
    "etag": "\"502-gw3xQhEBf3nHScorRFiE+G1uiEE\"",
    "mtime": "2023-08-03T14:30:20.229Z",
    "size": 1282,
    "path": "../public/_nuxt/default.df67aa28.js"
  },
  "/_nuxt/DiscordIconSvg.7a98d2e0.js": {
    "type": "application/javascript",
    "etag": "\"13ff-YeesYNonjqihzozMvU15Sce15Ic\"",
    "mtime": "2023-08-03T14:30:20.230Z",
    "size": 5119,
    "path": "../public/_nuxt/DiscordIconSvg.7a98d2e0.js"
  },
  "/_nuxt/DiscordIconSvg.7f557191.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"56-Xwz3l7IsU3LtYDVi5faRHKcUcZo\"",
    "mtime": "2023-08-03T14:30:20.188Z",
    "size": 86,
    "path": "../public/_nuxt/DiscordIconSvg.7f557191.css"
  },
  "/_nuxt/el-button.2689f638.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d33-RzIPFKzgWgJB1bVDsB1E+qI9A3Y\"",
    "mtime": "2023-08-03T14:30:20.203Z",
    "size": 15667,
    "path": "../public/_nuxt/el-button.2689f638.css"
  },
  "/_nuxt/el-button.9c6f1ffd.js": {
    "type": "application/javascript",
    "etag": "\"4f9a-a+/ToEWRBvcGEBSaXi8XcyCti5g\"",
    "mtime": "2023-08-03T14:30:20.230Z",
    "size": 20378,
    "path": "../public/_nuxt/el-button.9c6f1ffd.js"
  },
  "/_nuxt/el-checkbox.0780ea3d.js": {
    "type": "application/javascript",
    "etag": "\"2a0e-Vy1D/BH8qhI1KnGKaTy9OoAwi0U\"",
    "mtime": "2023-08-03T14:30:20.230Z",
    "size": 10766,
    "path": "../public/_nuxt/el-checkbox.0780ea3d.js"
  },
  "/_nuxt/el-checkbox.c7ab37fe.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1937-eRN3pgE4HTBH8Vb3NAPjUpqhuvk\"",
    "mtime": "2023-08-03T14:30:20.185Z",
    "size": 6455,
    "path": "../public/_nuxt/el-checkbox.c7ab37fe.css"
  },
  "/_nuxt/el-form.421c2af4.js": {
    "type": "application/javascript",
    "etag": "\"f19a-H9/tqBdB1imeiYMyjIdVStR4+vs\"",
    "mtime": "2023-08-03T14:30:20.230Z",
    "size": 61850,
    "path": "../public/_nuxt/el-form.421c2af4.js"
  },
  "/_nuxt/el-form.483e1d9a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34dc-8vyE3lWZ838glz1azzkKayuT2yo\"",
    "mtime": "2023-08-03T14:30:20.188Z",
    "size": 13532,
    "path": "../public/_nuxt/el-form.483e1d9a.css"
  },
  "/_nuxt/el-icon.12f2798b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e0-rUUgX55PeSysz9mOdM+T2qj0QS4\"",
    "mtime": "2023-08-03T14:30:20.188Z",
    "size": 480,
    "path": "../public/_nuxt/el-icon.12f2798b.css"
  },
  "/_nuxt/el-input.93a7722b.js": {
    "type": "application/javascript",
    "etag": "\"2ed1-movmSEYqyuoI4bK32/BZlgDjSNk\"",
    "mtime": "2023-08-03T14:30:20.230Z",
    "size": 11985,
    "path": "../public/_nuxt/el-input.93a7722b.js"
  },
  "/_nuxt/el-input.ba3ea184.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"301d-Ay2xw3MIQP/h92WIn3IPUuqU32s\"",
    "mtime": "2023-08-03T14:30:20.194Z",
    "size": 12317,
    "path": "../public/_nuxt/el-input.ba3ea184.css"
  },
  "/_nuxt/el-link.3e2d1e1b.js": {
    "type": "application/javascript",
    "etag": "\"d03-4dxWvSUNrmT1FKEZmT787ZdoMCA\"",
    "mtime": "2023-08-03T14:30:20.223Z",
    "size": 3331,
    "path": "../public/_nuxt/el-link.3e2d1e1b.js"
  },
  "/_nuxt/el-link.54caa2eb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f02-DiPob/R27rYCLqy3R6Tq93Erytc\"",
    "mtime": "2023-08-03T14:30:20.188Z",
    "size": 3842,
    "path": "../public/_nuxt/el-link.54caa2eb.css"
  },
  "/_nuxt/el-popover.42c2bc56.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"558-F1/tgAS2U8PplrTLocXW2lf10tg\"",
    "mtime": "2023-08-03T14:30:20.187Z",
    "size": 1368,
    "path": "../public/_nuxt/el-popover.42c2bc56.css"
  },
  "/_nuxt/el-popover.dddf84a1.js": {
    "type": "application/javascript",
    "etag": "\"148a-f+ePebpJmFWkaNefnYT0r5XCXFY\"",
    "mtime": "2023-08-03T14:30:20.207Z",
    "size": 5258,
    "path": "../public/_nuxt/el-popover.dddf84a1.js"
  },
  "/_nuxt/el-popper.854ddd02.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1fd4-0uk2Uz3ZxPdGTo0NHlSCdY512co\"",
    "mtime": "2023-08-03T14:30:20.188Z",
    "size": 8148,
    "path": "../public/_nuxt/el-popper.854ddd02.css"
  },
  "/_nuxt/el-popper.c633b0ea.js": {
    "type": "application/javascript",
    "etag": "\"9a9f-vA3/24XFaDJS1H4DMMK6kFnRtHY\"",
    "mtime": "2023-08-03T14:30:20.232Z",
    "size": 39583,
    "path": "../public/_nuxt/el-popper.c633b0ea.js"
  },
  "/_nuxt/el-scrollbar.36b37a34.js": {
    "type": "application/javascript",
    "etag": "\"287e-/jALn2XFwfTmW1IQILx+rsEG7xQ\"",
    "mtime": "2023-08-03T14:30:20.228Z",
    "size": 10366,
    "path": "../public/_nuxt/el-scrollbar.36b37a34.js"
  },
  "/_nuxt/el-scrollbar.633caf6b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52f-GGYkEyguhSa81PVnYeGqExThuso\"",
    "mtime": "2023-08-03T14:30:20.188Z",
    "size": 1327,
    "path": "../public/_nuxt/el-scrollbar.633caf6b.css"
  },
  "/_nuxt/el-switch.76e968f1.js": {
    "type": "application/javascript",
    "etag": "\"14b7-cHyZmV8kL+J32t7BO+GKxWd/TZg\"",
    "mtime": "2023-08-03T14:30:20.229Z",
    "size": 5303,
    "path": "../public/_nuxt/el-switch.76e968f1.js"
  },
  "/_nuxt/el-switch.e0856ead.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f4e-7KHKfELgm39cYdoek67imGgUGjc\"",
    "mtime": "2023-08-03T14:30:20.187Z",
    "size": 3918,
    "path": "../public/_nuxt/el-switch.e0856ead.css"
  },
  "/_nuxt/entrance.cc9a26b6.js": {
    "type": "application/javascript",
    "etag": "\"4bd-5ekOoqBEz6S+xMS2nSThxuuWuvA\"",
    "mtime": "2023-08-03T14:30:20.207Z",
    "size": 1213,
    "path": "../public/_nuxt/entrance.cc9a26b6.js"
  },
  "/_nuxt/entry.63b3f33c.js": {
    "type": "application/javascript",
    "etag": "\"5fc16-tXOO/vOmVDqbnMTThZXWz+GTlWU\"",
    "mtime": "2023-08-03T14:30:20.232Z",
    "size": 392214,
    "path": "../public/_nuxt/entry.63b3f33c.js"
  },
  "/_nuxt/entry.7068c0e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3562-N8S/oB5JcdCkIZnNvgadH30Mww8\"",
    "mtime": "2023-08-03T14:30:20.182Z",
    "size": 13666,
    "path": "../public/_nuxt/entry.7068c0e9.css"
  },
  "/_nuxt/error-404.312bdae4.js": {
    "type": "application/javascript",
    "etag": "\"8cd-V3wb5AuO060hmRmluI+mcnY9hhU\"",
    "mtime": "2023-08-03T14:30:20.208Z",
    "size": 2253,
    "path": "../public/_nuxt/error-404.312bdae4.js"
  },
  "/_nuxt/error-404.7fc72018.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-iNt1cqPQ0WDudfCTZVQd31BeRGs\"",
    "mtime": "2023-08-03T14:30:20.185Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.7fc72018.css"
  },
  "/_nuxt/error-500.c5df6088.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-ByRo+49BgcevWdRjJy3CMx2IA5k\"",
    "mtime": "2023-08-03T14:30:20.171Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.c5df6088.css"
  },
  "/_nuxt/error-500.e621a0ad.js": {
    "type": "application/javascript",
    "etag": "\"756-4Nd5jbTwE+WgsSPxCM/a9J0agWg\"",
    "mtime": "2023-08-03T14:30:20.207Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.e621a0ad.js"
  },
  "/_nuxt/formatDate.d262b9d6.js": {
    "type": "application/javascript",
    "etag": "\"58c-yR8OsWLIZiZG5U4LHadMRLVO6To\"",
    "mtime": "2023-08-03T14:30:20.203Z",
    "size": 1420,
    "path": "../public/_nuxt/formatDate.d262b9d6.js"
  },
  "/_nuxt/index.4ef86ce1.js": {
    "type": "application/javascript",
    "etag": "\"277-er0O8k8LsNfctjN+UWOD//wyk3s\"",
    "mtime": "2023-08-03T14:30:20.205Z",
    "size": 631,
    "path": "../public/_nuxt/index.4ef86ce1.js"
  },
  "/_nuxt/index.8f0fbc5a.js": {
    "type": "application/javascript",
    "etag": "\"2cb-qFqq0J64ATyCP52f5cw9RScHors\"",
    "mtime": "2023-08-03T14:30:20.207Z",
    "size": 715,
    "path": "../public/_nuxt/index.8f0fbc5a.js"
  },
  "/_nuxt/isEqual.b7f58890.js": {
    "type": "application/javascript",
    "etag": "\"1ec7-OHJYjQ1HiTmftzqr4k9W2HtJVMY\"",
    "mtime": "2023-08-03T14:30:20.203Z",
    "size": 7879,
    "path": "../public/_nuxt/isEqual.b7f58890.js"
  },
  "/_nuxt/login.7707bf7b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c5-RG1RUCT5lzjhK6LVE/uMACFXHrM\"",
    "mtime": "2023-08-03T14:30:20.190Z",
    "size": 709,
    "path": "../public/_nuxt/login.7707bf7b.css"
  },
  "/_nuxt/login.f8733f82.js": {
    "type": "application/javascript",
    "etag": "\"cb8-0WsJYayTtYwxhDmSFonyjBetRGo\"",
    "mtime": "2023-08-03T14:30:20.213Z",
    "size": 3256,
    "path": "../public/_nuxt/login.f8733f82.js"
  },
  "/_nuxt/nuxt-link.4f21afdb.js": {
    "type": "application/javascript",
    "etag": "\"1106-jP6DMlA3nkIHoBv4OKD+C6ZZkrA\"",
    "mtime": "2023-08-03T14:30:20.205Z",
    "size": 4358,
    "path": "../public/_nuxt/nuxt-link.4f21afdb.js"
  },
  "/_nuxt/onlyNoAuth.6c6ee8eb.js": {
    "type": "application/javascript",
    "etag": "\"195-alzQQV/VbV2QuMo2SUwvyIdK4Fg\"",
    "mtime": "2023-08-03T14:30:20.207Z",
    "size": 405,
    "path": "../public/_nuxt/onlyNoAuth.6c6ee8eb.js"
  },
  "/_nuxt/perspective.e70c8c90.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13ce-44y0CASktcvstD9IcTj4vNB5HRk\"",
    "mtime": "2023-08-03T14:30:20.185Z",
    "size": 5070,
    "path": "../public/_nuxt/perspective.e70c8c90.css"
  },
  "/_nuxt/perspective.eacadf60.js": {
    "type": "application/javascript",
    "etag": "\"7a19-4flj4cQp40dy/naCCzdwXNxi4uE\"",
    "mtime": "2023-08-03T14:30:20.230Z",
    "size": 31257,
    "path": "../public/_nuxt/perspective.eacadf60.js"
  },
  "/_nuxt/scroll.defd2da0.js": {
    "type": "application/javascript",
    "etag": "\"4a5-avXq3z8WLrZ+iHCvU1J8vsC2h/0\"",
    "mtime": "2023-08-03T14:30:20.207Z",
    "size": 1189,
    "path": "../public/_nuxt/scroll.defd2da0.js"
  },
  "/_nuxt/signup.57439420.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2cd-ykzE3D7J8on6MCCO6QyxHOWuhuI\"",
    "mtime": "2023-08-03T14:30:20.187Z",
    "size": 717,
    "path": "../public/_nuxt/signup.57439420.css"
  },
  "/_nuxt/signup.b13b1b49.js": {
    "type": "application/javascript",
    "etag": "\"19eb-BlXYdOTjfQ+NWzeHoL7xTr0tGlA\"",
    "mtime": "2023-08-03T14:30:20.229Z",
    "size": 6635,
    "path": "../public/_nuxt/signup.b13b1b49.js"
  },
  "/_nuxt/str.751aa1f4.js": {
    "type": "application/javascript",
    "etag": "\"15de-np2DdIy1RSsCBrnBCEIwP7PHA0k\"",
    "mtime": "2023-08-03T14:30:20.204Z",
    "size": 5598,
    "path": "../public/_nuxt/str.751aa1f4.js"
  },
  "/_nuxt/useAdmin.b90d75a1.js": {
    "type": "application/javascript",
    "etag": "\"3bf-XbAnua1oxd4VaM0g22oNvfnGdi0\"",
    "mtime": "2023-08-03T14:30:20.204Z",
    "size": 959,
    "path": "../public/_nuxt/useAdmin.b90d75a1.js"
  },
  "/_nuxt/useAuth.541760d3.js": {
    "type": "application/javascript",
    "etag": "\"487-Km2pHhnWvVQUJTTglARh26EnuSc\"",
    "mtime": "2023-08-03T14:30:20.207Z",
    "size": 1159,
    "path": "../public/_nuxt/useAuth.541760d3.js"
  },
  "/_nuxt/useChat.57764163.js": {
    "type": "application/javascript",
    "etag": "\"9be9-Go8WDOjX8jrbZLCwZEp3bHv8Woc\"",
    "mtime": "2023-08-03T14:30:20.231Z",
    "size": 39913,
    "path": "../public/_nuxt/useChat.57764163.js"
  },
  "/_nuxt/useChat.adec720f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14a9-S5SbV5gD5xWhD5fPG/Pul9XX7VQ\"",
    "mtime": "2023-08-03T14:30:20.188Z",
    "size": 5289,
    "path": "../public/_nuxt/useChat.adec720f.css"
  },
  "/_nuxt/useTitle.0015af00.js": {
    "type": "application/javascript",
    "etag": "\"9f-yhSrAcN+EMsPCgnmssfKbPndg/s\"",
    "mtime": "2023-08-03T14:30:20.206Z",
    "size": 159,
    "path": "../public/_nuxt/useTitle.0015af00.js"
  },
  "/_nuxt/_conv_.6860f304.js": {
    "type": "application/javascript",
    "etag": "\"2c8-KZqqqXx3jVtuUScr0LMygNrFzzU\"",
    "mtime": "2023-08-03T14:30:20.205Z",
    "size": 712,
    "path": "../public/_nuxt/_conv_.6860f304.js"
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

const _lazy_SWQJRn = () => import('../check.post.mjs');
const _lazy_oXL3ep = () => import('../curva-record.mjs');
const _lazy_7PR8AX = () => import('../setting.post.mjs');
const _lazy_UScdIi = () => import('../check.post2.mjs');
const _lazy_PBkD23 = () => import('../createVerification.post.mjs');
const _lazy_XyTMnn = () => import('../login.post.mjs');
const _lazy_xfmW64 = () => import('../logout.post.mjs');
const _lazy_187dFF = () => import('../replaceUser.post.mjs');
const _lazy_Il2qtI = () => import('../resendCode.post.mjs');
const _lazy_xqtLlJ = () => import('../signup.post.mjs');
const _lazy_vz2JyP = () => import('../answer.delete.mjs');
const _lazy_HX9str = () => import('../answer.post.mjs');
const _lazy_MlSQ7L = () => import('../check.post3.mjs');
const _lazy_wX8L45 = () => import('../conv.delete.mjs');
const _lazy_oaQnKo = () => import('../conv.put.mjs');
const _lazy_xyzH6i = () => import('../history.post.mjs');
const _lazy_ibkWJX = () => import('../suggestions.post.mjs');
const _lazy_36o9OA = () => import('../discord.mjs');
const _lazy_SrvWlI = () => import('../memory.mjs');
const _lazy_kSCyCm = () => import('../keys.mjs');
const _lazy_QcObDY = () => import('../messages.mjs');
const _lazy_D0mNky = () => import('../tree.mjs');
const _lazy_oRLWXu = () => import('../yt-captions.mjs');
const _lazy_MRbt0o = () => import('../feedback.post.mjs');
const _lazy_DkND8F = () => import('../check.post4.mjs');
const _lazy_exrXwu = () => import('../translate.mjs');
const _lazy_EcMGl8 = () => import('../user.post.mjs');
const _lazy_MNfkmp = () => import('../version.mjs');
const _lazy_G40W9i = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/check', handler: _lazy_SWQJRn, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/data/curva-record', handler: _lazy_oXL3ep, lazy: true, middleware: false, method: undefined },
  { route: '/api/admin/setting', handler: _lazy_7PR8AX, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/check', handler: _lazy_UScdIi, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/createVerification', handler: _lazy_PBkD23, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_XyTMnn, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_xfmW64, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/replaceUser', handler: _lazy_187dFF, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/resendCode', handler: _lazy_Il2qtI, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/signup', handler: _lazy_xqtLlJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/answer', handler: _lazy_vz2JyP, lazy: true, middleware: false, method: "delete" },
  { route: '/api/curva/answer', handler: _lazy_HX9str, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/check', handler: _lazy_MlSQ7L, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/conv', handler: _lazy_wX8L45, lazy: true, middleware: false, method: "delete" },
  { route: '/api/curva/conv', handler: _lazy_oaQnKo, lazy: true, middleware: false, method: "put" },
  { route: '/api/curva/history', handler: _lazy_xyzH6i, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/suggestions', handler: _lazy_ibkWJX, lazy: true, middleware: false, method: "post" },
  { route: '/api/discord', handler: _lazy_36o9OA, lazy: true, middleware: false, method: undefined },
  { route: '/api/memory', handler: _lazy_SrvWlI, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/keys', handler: _lazy_kSCyCm, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/messages', handler: _lazy_QcObDY, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/tree', handler: _lazy_D0mNky, lazy: true, middleware: false, method: undefined },
  { route: '/api/services/yt-captions', handler: _lazy_oRLWXu, lazy: true, middleware: false, method: undefined },
  { route: '/api/stats/feedback', handler: _lazy_MRbt0o, lazy: true, middleware: false, method: "post" },
  { route: '/api/token/check', handler: _lazy_DkND8F, lazy: true, middleware: false, method: "post" },
  { route: '/api/translate', handler: _lazy_exrXwu, lazy: true, middleware: false, method: undefined },
  { route: '/api/user', handler: _lazy_EcMGl8, lazy: true, middleware: false, method: "post" },
  { route: '/api/version', handler: _lazy_MNfkmp, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_G40W9i, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_G40W9i, lazy: true, middleware: false, method: undefined }
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
