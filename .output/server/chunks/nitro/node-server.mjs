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
  "/_nuxt/abap.5fd096f7.js": {
    "type": "application/javascript",
    "etag": "\"3849-pKU0YwZFEdl8cNsJy+/ubNtsO3A\"",
    "mtime": "2023-08-28T04:48:27.024Z",
    "size": 14409,
    "path": "../public/_nuxt/abap.5fd096f7.js"
  },
  "/_nuxt/apex.0b2071d4.js": {
    "type": "application/javascript",
    "etag": "\"1066-rnLNf+p57MLTSnWAEa9hz+Xzb7I\"",
    "mtime": "2023-08-28T04:48:27.010Z",
    "size": 4198,
    "path": "../public/_nuxt/apex.0b2071d4.js"
  },
  "/_nuxt/azcli.190356b5.js": {
    "type": "application/javascript",
    "etag": "\"446-zrRnEelM91WGSKcGaxV3gsQVNxE\"",
    "mtime": "2023-08-28T04:48:27.009Z",
    "size": 1094,
    "path": "../public/_nuxt/azcli.190356b5.js"
  },
  "/_nuxt/bat.8a29f90f.js": {
    "type": "application/javascript",
    "etag": "\"82b-jqYCM/4JsjZReSvEza5TnddZR4c\"",
    "mtime": "2023-08-28T04:48:27.021Z",
    "size": 2091,
    "path": "../public/_nuxt/bat.8a29f90f.js"
  },
  "/_nuxt/bicep.2030a195.js": {
    "type": "application/javascript",
    "etag": "\"ade-rPHvdLuweDxwh23hO0FsBHMz8Lg\"",
    "mtime": "2023-08-28T04:48:27.022Z",
    "size": 2782,
    "path": "../public/_nuxt/bicep.2030a195.js"
  },
  "/_nuxt/cameligo.e329b2f4.js": {
    "type": "application/javascript",
    "etag": "\"97f-XKJq8AxBsaVf9l3Bc4vX8p1reoA\"",
    "mtime": "2023-08-28T04:48:27.024Z",
    "size": 2431,
    "path": "../public/_nuxt/cameligo.e329b2f4.js"
  },
  "/_nuxt/castArray.45decfd6.js": {
    "type": "application/javascript",
    "etag": "\"89-79eAd/UrnYzc5stnnvIMRJ1DKTQ\"",
    "mtime": "2023-08-28T04:48:27.000Z",
    "size": 137,
    "path": "../public/_nuxt/castArray.45decfd6.js"
  },
  "/_nuxt/chat.0df0c1d6.js": {
    "type": "application/javascript",
    "etag": "\"65be-xEipPw5FmU759MMHpLfqaGZ3uwY\"",
    "mtime": "2023-08-28T04:48:27.096Z",
    "size": 26046,
    "path": "../public/_nuxt/chat.0df0c1d6.js"
  },
  "/_nuxt/chat.a52554a8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"230f-He89kPWMnufpHwqwieGwGGIlUFk\"",
    "mtime": "2023-08-28T04:48:26.965Z",
    "size": 8975,
    "path": "../public/_nuxt/chat.a52554a8.css"
  },
  "/_nuxt/chat.acdcc0a0.js": {
    "type": "application/javascript",
    "etag": "\"209-96wdBPSALuewXDMAzRtVI+yjUaE\"",
    "mtime": "2023-08-28T04:48:27.005Z",
    "size": 521,
    "path": "../public/_nuxt/chat.acdcc0a0.js"
  },
  "/_nuxt/client-only.0dabe081.js": {
    "type": "application/javascript",
    "etag": "\"1d5-l2oZIGSzk/yIpQyu/Mi5sIUEFL4\"",
    "mtime": "2023-08-28T04:48:26.992Z",
    "size": 469,
    "path": "../public/_nuxt/client-only.0dabe081.js"
  },
  "/_nuxt/clojure.bbb8ba32.js": {
    "type": "application/javascript",
    "etag": "\"26a1-JBIPQZ5Wk/X6LSotnEaZceSoOds\"",
    "mtime": "2023-08-28T04:48:27.022Z",
    "size": 9889,
    "path": "../public/_nuxt/clojure.bbb8ba32.js"
  },
  "/_nuxt/codicon.bff90e92.ttf": {
    "type": "font/ttf",
    "etag": "\"11c9c-qjlDAOeEXxC0f5doJagBlm69Zog\"",
    "mtime": "2023-08-28T04:48:26.952Z",
    "size": 72860,
    "path": "../public/_nuxt/codicon.bff90e92.ttf"
  },
  "/_nuxt/coffee.acac9422.js": {
    "type": "application/javascript",
    "etag": "\"efc-YLEMNjkdhL7+E7utb739lNQozyI\"",
    "mtime": "2023-08-28T04:48:27.023Z",
    "size": 3836,
    "path": "../public/_nuxt/coffee.acac9422.js"
  },
  "/_nuxt/CommonSettings.d73d67e8.js": {
    "type": "application/javascript",
    "etag": "\"7c6-XG9EuSqGQ8oII5Hmbxr1YgCGKSk\"",
    "mtime": "2023-08-28T04:48:26.988Z",
    "size": 1990,
    "path": "../public/_nuxt/CommonSettings.d73d67e8.js"
  },
  "/_nuxt/ConvMain.4dcfdfa4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1727-HcTPwH7w8FXEke3qaqCZLPhstdM\"",
    "mtime": "2023-08-28T04:48:26.964Z",
    "size": 5927,
    "path": "../public/_nuxt/ConvMain.4dcfdfa4.css"
  },
  "/_nuxt/ConvMain.b9431fe6.js": {
    "type": "application/javascript",
    "etag": "\"cca3-eCqPbOEFTsE8deHFFCysWI/qlQo\"",
    "mtime": "2023-08-28T04:48:27.036Z",
    "size": 52387,
    "path": "../public/_nuxt/ConvMain.b9431fe6.js"
  },
  "/_nuxt/cpp.9d6a58b0.js": {
    "type": "application/javascript",
    "etag": "\"165c-kU/PnWHLrYYc9r290fAvZ2QZYlM\"",
    "mtime": "2023-08-28T04:48:27.022Z",
    "size": 5724,
    "path": "../public/_nuxt/cpp.9d6a58b0.js"
  },
  "/_nuxt/csharp.91d9f9d8.js": {
    "type": "application/javascript",
    "etag": "\"12a2-fd4hSM6SM5Q3heHa80jPs0fsDZY\"",
    "mtime": "2023-08-28T04:48:27.005Z",
    "size": 4770,
    "path": "../public/_nuxt/csharp.91d9f9d8.js"
  },
  "/_nuxt/csp.763000e4.js": {
    "type": "application/javascript",
    "etag": "\"681-7w326vfKRKQQq82hA+MnVVsedho\"",
    "mtime": "2023-08-28T04:48:27.010Z",
    "size": 1665,
    "path": "../public/_nuxt/csp.763000e4.js"
  },
  "/_nuxt/css.d9a05d7d.js": {
    "type": "application/javascript",
    "etag": "\"1294-A2i4ec2Asg0JP3h2ZB0XL8qN9+U\"",
    "mtime": "2023-08-28T04:48:27.005Z",
    "size": 4756,
    "path": "../public/_nuxt/css.d9a05d7d.js"
  },
  "/_nuxt/cssMode.5fabf2cf.js": {
    "type": "application/javascript",
    "etag": "\"8408-04OGaHdBbFhrWRVgFcprI+D3rcw\"",
    "mtime": "2023-08-28T04:48:27.059Z",
    "size": 33800,
    "path": "../public/_nuxt/cssMode.5fabf2cf.js"
  },
  "/_nuxt/cypher.cba4566f.js": {
    "type": "application/javascript",
    "etag": "\"e2f-cxGOxdCw9gBmZqHS4fTptSp0fjQ\"",
    "mtime": "2023-08-28T04:48:27.005Z",
    "size": 3631,
    "path": "../public/_nuxt/cypher.cba4566f.js"
  },
  "/_nuxt/dart.30a82b35.js": {
    "type": "application/javascript",
    "etag": "\"1190-o7eyxbcWfTsROeH87ld5vrXpImw\"",
    "mtime": "2023-08-28T04:48:27.020Z",
    "size": 4496,
    "path": "../public/_nuxt/dart.30a82b35.js"
  },
  "/_nuxt/dashboard.ebc0a41c.js": {
    "type": "application/javascript",
    "etag": "\"78a-8DYPuIn4T6bDvhYxPG6+VStIul4\"",
    "mtime": "2023-08-28T04:48:26.991Z",
    "size": 1930,
    "path": "../public/_nuxt/dashboard.ebc0a41c.js"
  },
  "/_nuxt/default.169f3623.js": {
    "type": "application/javascript",
    "etag": "\"5b7-mqs4/2A7d3D1k2Fkbcrf37ekjyI\"",
    "mtime": "2023-08-28T04:48:27.100Z",
    "size": 1463,
    "path": "../public/_nuxt/default.169f3623.js"
  },
  "/_nuxt/default.39fe3d1b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9e-rI+KacqkCoZvi4kBvOhWmhC7LL0\"",
    "mtime": "2023-08-28T04:48:26.965Z",
    "size": 158,
    "path": "../public/_nuxt/default.39fe3d1b.css"
  },
  "/_nuxt/DefaultHeaderButtons.90a88d8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b78-H6nx0Vloo4Jw0cRDV8I93EfnL0U\"",
    "mtime": "2023-08-28T04:48:26.966Z",
    "size": 11128,
    "path": "../public/_nuxt/DefaultHeaderButtons.90a88d8a.css"
  },
  "/_nuxt/DefaultHeaderButtons.c1c01422.js": {
    "type": "application/javascript",
    "etag": "\"7751-yuMbjVQfXJA9/EQBKClRZb6yRt4\"",
    "mtime": "2023-08-28T04:48:27.095Z",
    "size": 30545,
    "path": "../public/_nuxt/DefaultHeaderButtons.c1c01422.js"
  },
  "/_nuxt/dockerfile.2a29d833.js": {
    "type": "application/javascript",
    "etag": "\"843-HP7nCPfMvMo4QSGJNsdnkOfHlyE\"",
    "mtime": "2023-08-28T04:48:27.010Z",
    "size": 2115,
    "path": "../public/_nuxt/dockerfile.2a29d833.js"
  },
  "/_nuxt/dropdown.85ed1ab4.js": {
    "type": "application/javascript",
    "etag": "\"925-Uw2P+TUX/oS4Q3MYfst7tvFGbBI\"",
    "mtime": "2023-08-28T04:48:26.990Z",
    "size": 2341,
    "path": "../public/_nuxt/dropdown.85ed1ab4.js"
  },
  "/_nuxt/ecl.c14b226e.js": {
    "type": "application/javascript",
    "etag": "\"15d4-kxMrjs0ufTT2UA3DU39KXwT91KA\"",
    "mtime": "2023-08-28T04:48:27.005Z",
    "size": 5588,
    "path": "../public/_nuxt/ecl.c14b226e.js"
  },
  "/_nuxt/el-button.2689f638.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d33-RzIPFKzgWgJB1bVDsB1E+qI9A3Y\"",
    "mtime": "2023-08-28T04:48:26.987Z",
    "size": 15667,
    "path": "../public/_nuxt/el-button.2689f638.css"
  },
  "/_nuxt/el-button.2c188e37.js": {
    "type": "application/javascript",
    "etag": "\"4a87-NLkodnvUoYSaqFLPQvICTZoPYDQ\"",
    "mtime": "2023-08-28T04:48:27.096Z",
    "size": 19079,
    "path": "../public/_nuxt/el-button.2c188e37.js"
  },
  "/_nuxt/el-form.3295898e.js": {
    "type": "application/javascript",
    "etag": "\"79e3-E6C4TvACku2b8qSuz3TCGCmSQwg\"",
    "mtime": "2023-08-28T04:48:27.096Z",
    "size": 31203,
    "path": "../public/_nuxt/el-form.3295898e.js"
  },
  "/_nuxt/el-form.7235a9a0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f0d-qCH0MR9J+ccrp40iuwPw59h7yJI\"",
    "mtime": "2023-08-28T04:48:26.966Z",
    "size": 3853,
    "path": "../public/_nuxt/el-form.7235a9a0.css"
  },
  "/_nuxt/el-icon.12f2798b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e0-rUUgX55PeSysz9mOdM+T2qj0QS4\"",
    "mtime": "2023-08-28T04:48:26.967Z",
    "size": 480,
    "path": "../public/_nuxt/el-icon.12f2798b.css"
  },
  "/_nuxt/el-input.3fc85dc7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"302b-3v8oiy4O6e1HBuSVz4u1Whl7kIY\"",
    "mtime": "2023-08-28T04:48:26.988Z",
    "size": 12331,
    "path": "../public/_nuxt/el-input.3fc85dc7.css"
  },
  "/_nuxt/el-input.451b62a0.js": {
    "type": "application/javascript",
    "etag": "\"33c2-aSmhsy6YlfKK/AyiCCyCeWQY7oY\"",
    "mtime": "2023-08-28T04:48:27.070Z",
    "size": 13250,
    "path": "../public/_nuxt/el-input.451b62a0.js"
  },
  "/_nuxt/el-link.1aaf93a5.js": {
    "type": "application/javascript",
    "etag": "\"478-IH+VpidhfJAja6AzIgwPtBEFT28\"",
    "mtime": "2023-08-28T04:48:27.075Z",
    "size": 1144,
    "path": "../public/_nuxt/el-link.1aaf93a5.js"
  },
  "/_nuxt/el-link.d9789c6b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b4b-2nLfNoRS3IyBEXstRQu5vwaPiPg\"",
    "mtime": "2023-08-28T04:48:26.965Z",
    "size": 2891,
    "path": "../public/_nuxt/el-link.d9789c6b.css"
  },
  "/_nuxt/el-overlay.adec720f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14a9-S5SbV5gD5xWhD5fPG/Pul9XX7VQ\"",
    "mtime": "2023-08-28T04:48:26.973Z",
    "size": 5289,
    "path": "../public/_nuxt/el-overlay.adec720f.css"
  },
  "/_nuxt/el-overlay.b5b4922e.js": {
    "type": "application/javascript",
    "etag": "\"380e-iLFk2hV9XYWEy3aVeQ32Xq5HvXA\"",
    "mtime": "2023-08-28T04:48:27.069Z",
    "size": 14350,
    "path": "../public/_nuxt/el-overlay.b5b4922e.js"
  },
  "/_nuxt/el-popover.42c2bc56.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"558-F1/tgAS2U8PplrTLocXW2lf10tg\"",
    "mtime": "2023-08-28T04:48:26.965Z",
    "size": 1368,
    "path": "../public/_nuxt/el-popover.42c2bc56.css"
  },
  "/_nuxt/el-popover.e6425895.js": {
    "type": "application/javascript",
    "etag": "\"bf3-1CzFk2TZnq9JAFw/Zuz2OsRwYz0\"",
    "mtime": "2023-08-28T04:48:27.095Z",
    "size": 3059,
    "path": "../public/_nuxt/el-popover.e6425895.js"
  },
  "/_nuxt/el-popper.854ddd02.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1fd4-0uk2Uz3ZxPdGTo0NHlSCdY512co\"",
    "mtime": "2023-08-28T04:48:26.966Z",
    "size": 8148,
    "path": "../public/_nuxt/el-popper.854ddd02.css"
  },
  "/_nuxt/el-popper.dfde8734.js": {
    "type": "application/javascript",
    "etag": "\"a0e3-vH98SFkyjEN8gNtm3aMW79mcr6g\"",
    "mtime": "2023-08-28T04:48:27.096Z",
    "size": 41187,
    "path": "../public/_nuxt/el-popper.dfde8734.js"
  },
  "/_nuxt/el-switch.a2a9fcc9.js": {
    "type": "application/javascript",
    "etag": "\"b8ab-sv4+OdzMKhlXITkc547z39r8ZpY\"",
    "mtime": "2023-08-28T04:48:27.071Z",
    "size": 47275,
    "path": "../public/_nuxt/el-switch.a2a9fcc9.js"
  },
  "/_nuxt/el-switch.f8353e0a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a4b-g55sfuJDdVY93G4WyzFEjSn965w\"",
    "mtime": "2023-08-28T04:48:26.965Z",
    "size": 14923,
    "path": "../public/_nuxt/el-switch.f8353e0a.css"
  },
  "/_nuxt/el-text.054d99d9.js": {
    "type": "application/javascript",
    "etag": "\"303-4MuWQcIB3pja33jx8DezwClLvlo\"",
    "mtime": "2023-08-28T04:48:27.070Z",
    "size": 771,
    "path": "../public/_nuxt/el-text.054d99d9.js"
  },
  "/_nuxt/el-text.7dc6a0f8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b8-ilGyRmsxar56yv5WdPXI1YlRsU4\"",
    "mtime": "2023-08-28T04:48:26.967Z",
    "size": 952,
    "path": "../public/_nuxt/el-text.7dc6a0f8.css"
  },
  "/_nuxt/elixir.4a1aad71.js": {
    "type": "application/javascript",
    "etag": "\"28e8-fPIH0orxgK3cZ4qsm3pWnLQ1Ic0\"",
    "mtime": "2023-08-28T04:48:27.023Z",
    "size": 10472,
    "path": "../public/_nuxt/elixir.4a1aad71.js"
  },
  "/_nuxt/entrance.c0176df6.js": {
    "type": "application/javascript",
    "etag": "\"46a-4Zvp+RaZpcFEJqQnTE3n8umDi38\"",
    "mtime": "2023-08-28T04:48:27.005Z",
    "size": 1130,
    "path": "../public/_nuxt/entrance.c0176df6.js"
  },
  "/_nuxt/entry.5d0b034b.js": {
    "type": "application/javascript",
    "etag": "\"6536c-iOPLcwvunmAFY8nBoZW0PbztlwQ\"",
    "mtime": "2023-08-28T04:48:27.097Z",
    "size": 414572,
    "path": "../public/_nuxt/entry.5d0b034b.js"
  },
  "/_nuxt/entry.7068c0e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3562-N8S/oB5JcdCkIZnNvgadH30Mww8\"",
    "mtime": "2023-08-28T04:48:26.964Z",
    "size": 13666,
    "path": "../public/_nuxt/entry.7068c0e9.css"
  },
  "/_nuxt/error-404.78c77275.js": {
    "type": "application/javascript",
    "etag": "\"8cd-mxRcDwlKhCUw6fkddtv4jBub4zc\"",
    "mtime": "2023-08-28T04:48:27.020Z",
    "size": 2253,
    "path": "../public/_nuxt/error-404.78c77275.js"
  },
  "/_nuxt/error-404.7fc72018.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-iNt1cqPQ0WDudfCTZVQd31BeRGs\"",
    "mtime": "2023-08-28T04:48:26.964Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.7fc72018.css"
  },
  "/_nuxt/error-500.c5df6088.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-ByRo+49BgcevWdRjJy3CMx2IA5k\"",
    "mtime": "2023-08-28T04:48:26.964Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.c5df6088.css"
  },
  "/_nuxt/error-500.eb2e5854.js": {
    "type": "application/javascript",
    "etag": "\"756-mmaCiUB3FbxUaTa26ClOfzLWLiU\"",
    "mtime": "2023-08-28T04:48:27.014Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.eb2e5854.js"
  },
  "/_nuxt/flow9.38712bd3.js": {
    "type": "application/javascript",
    "etag": "\"808-BhAAlxRI9Y+hj7aMXhchtmAgbfo\"",
    "mtime": "2023-08-28T04:48:27.005Z",
    "size": 2056,
    "path": "../public/_nuxt/flow9.38712bd3.js"
  },
  "/_nuxt/focus-trap.08265027.js": {
    "type": "application/javascript",
    "etag": "\"1505-2Pd/Zw66XgLC0pPHtY0c7F8tiyE\"",
    "mtime": "2023-08-28T04:48:27.021Z",
    "size": 5381,
    "path": "../public/_nuxt/focus-trap.08265027.js"
  },
  "/_nuxt/freemarker2.f1f071bc.js": {
    "type": "application/javascript",
    "etag": "\"406f-mSaRpL+F46zvlc1WNfXkdjRweT0\"",
    "mtime": "2023-08-28T04:48:27.020Z",
    "size": 16495,
    "path": "../public/_nuxt/freemarker2.f1f071bc.js"
  },
  "/_nuxt/fsharp.71c17f08.js": {
    "type": "application/javascript",
    "etag": "\"c9d-xMhl2/p7ECkbP00gLAxmSN1fwpU\"",
    "mtime": "2023-08-28T04:48:27.011Z",
    "size": 3229,
    "path": "../public/_nuxt/fsharp.71c17f08.js"
  },
  "/_nuxt/go.81a01631.js": {
    "type": "application/javascript",
    "etag": "\"b57-SxhGPQWQgqPjchRLCqzpof/S7pM\"",
    "mtime": "2023-08-28T04:48:27.006Z",
    "size": 2903,
    "path": "../public/_nuxt/go.81a01631.js"
  },
  "/_nuxt/graphql.4b2f9989.js": {
    "type": "application/javascript",
    "etag": "\"9ca-nH4JY7W3AXRQ/4zLZzv34pC0gqo\"",
    "mtime": "2023-08-28T04:48:27.054Z",
    "size": 2506,
    "path": "../public/_nuxt/graphql.4b2f9989.js"
  },
  "/_nuxt/handlebars.6c359026.js": {
    "type": "application/javascript",
    "etag": "\"1c05-s+QDadNtmig2KJBFOmjffuvKndI\"",
    "mtime": "2023-08-28T04:48:27.006Z",
    "size": 7173,
    "path": "../public/_nuxt/handlebars.6c359026.js"
  },
  "/_nuxt/hcl.f5583a08.js": {
    "type": "application/javascript",
    "etag": "\"efc-k2vMGkFvt8N032oFLgkVJwFCbcQ\"",
    "mtime": "2023-08-28T04:48:27.054Z",
    "size": 3836,
    "path": "../public/_nuxt/hcl.f5583a08.js"
  },
  "/_nuxt/html.09861035.js": {
    "type": "application/javascript",
    "etag": "\"1525-O382jeEk1baXSpO5ubSQ0qWFMRI\"",
    "mtime": "2023-08-28T04:48:27.068Z",
    "size": 5413,
    "path": "../public/_nuxt/html.09861035.js"
  },
  "/_nuxt/htmlMode.152dc5e7.js": {
    "type": "application/javascript",
    "etag": "\"862f-dFtl156ccqaq9O1nBzA3mmg4je0\"",
    "mtime": "2023-08-28T04:48:27.069Z",
    "size": 34351,
    "path": "../public/_nuxt/htmlMode.152dc5e7.js"
  },
  "/_nuxt/index.2df5e990.js": {
    "type": "application/javascript",
    "etag": "\"348-2Bv0uE2nNezGXDopYo6C6QCUlks\"",
    "mtime": "2023-08-28T04:48:26.988Z",
    "size": 840,
    "path": "../public/_nuxt/index.2df5e990.js"
  },
  "/_nuxt/index.3cade9fd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"278-eD1oiippIr3nfA7ZzG10QHAnN0g\"",
    "mtime": "2023-08-28T04:48:26.964Z",
    "size": 632,
    "path": "../public/_nuxt/index.3cade9fd.css"
  },
  "/_nuxt/index.5d3810e7.js": {
    "type": "application/javascript",
    "etag": "\"2c98f8-j0phPTtRtZEPkHmEd3gnXueX5TM\"",
    "mtime": "2023-08-28T04:48:27.102Z",
    "size": 2922744,
    "path": "../public/_nuxt/index.5d3810e7.js"
  },
  "/_nuxt/index.9348009b.js": {
    "type": "application/javascript",
    "etag": "\"340-CDIO8CiExWGTPqt3oanqCqnTSmI\"",
    "mtime": "2023-08-28T04:48:27.069Z",
    "size": 832,
    "path": "../public/_nuxt/index.9348009b.js"
  },
  "/_nuxt/index.a22020a4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18e83-PYYm8TdnY2QxFOECUGcN73ofH38\"",
    "mtime": "2023-08-28T04:48:26.965Z",
    "size": 102019,
    "path": "../public/_nuxt/index.a22020a4.css"
  },
  "/_nuxt/ini.93327bda.js": {
    "type": "application/javascript",
    "etag": "\"543-7aR7LyzPWLLAlMJIARhXGxVE0Qs\"",
    "mtime": "2023-08-28T04:48:27.055Z",
    "size": 1347,
    "path": "../public/_nuxt/ini.93327bda.js"
  },
  "/_nuxt/isEqual.6bd80846.js": {
    "type": "application/javascript",
    "etag": "\"e9f-/mtcRGB93VVwh1zXCTnKX9C7Y3s\"",
    "mtime": "2023-08-28T04:48:26.990Z",
    "size": 3743,
    "path": "../public/_nuxt/isEqual.6bd80846.js"
  },
  "/_nuxt/java.594fa86f.js": {
    "type": "application/javascript",
    "etag": "\"d8b-33AFzVCipcWRANHOGhyk9YRFCS0\"",
    "mtime": "2023-08-28T04:48:27.065Z",
    "size": 3467,
    "path": "../public/_nuxt/java.594fa86f.js"
  },
  "/_nuxt/javascript.5a55514a.js": {
    "type": "application/javascript",
    "etag": "\"514-Bj8IBbKFeNyzQpGNECQqGtCUokM\"",
    "mtime": "2023-08-28T04:48:27.065Z",
    "size": 1300,
    "path": "../public/_nuxt/javascript.5a55514a.js"
  },
  "/_nuxt/jsonMode.5ad7553b.js": {
    "type": "application/javascript",
    "etag": "\"9ba1-o2PKohBQpw6VaLD2H6z+C75UHi4\"",
    "mtime": "2023-08-28T04:48:27.069Z",
    "size": 39841,
    "path": "../public/_nuxt/jsonMode.5ad7553b.js"
  },
  "/_nuxt/julia.0007448b.js": {
    "type": "application/javascript",
    "etag": "\"1ce3-nSuvAs4j3zcMzRPLRkGClL3bRRU\"",
    "mtime": "2023-08-28T04:48:27.066Z",
    "size": 7395,
    "path": "../public/_nuxt/julia.0007448b.js"
  },
  "/_nuxt/kotlin.d96111b8.js": {
    "type": "application/javascript",
    "etag": "\"e65-6+vDylokgat02vD9dxnok0m/15M\"",
    "mtime": "2023-08-28T04:48:27.067Z",
    "size": 3685,
    "path": "../public/_nuxt/kotlin.d96111b8.js"
  },
  "/_nuxt/less.35bca26e.js": {
    "type": "application/javascript",
    "etag": "\"1030-KIPELgS4hrUpupgnDvFGCcxl01g\"",
    "mtime": "2023-08-28T04:48:27.007Z",
    "size": 4144,
    "path": "../public/_nuxt/less.35bca26e.js"
  },
  "/_nuxt/lexon.9e065f08.js": {
    "type": "application/javascript",
    "etag": "\"a7b-gdejzPCNnrPAVwuXo7UYiRrGEhE\"",
    "mtime": "2023-08-28T04:48:27.067Z",
    "size": 2683,
    "path": "../public/_nuxt/lexon.9e065f08.js"
  },
  "/_nuxt/liquid.dbe73006.js": {
    "type": "application/javascript",
    "etag": "\"1107-wDPbOaRgVHdWQDOHxLhWulNxWdM\"",
    "mtime": "2023-08-28T04:48:27.006Z",
    "size": 4359,
    "path": "../public/_nuxt/liquid.dbe73006.js"
  },
  "/_nuxt/login.08c97f76.js": {
    "type": "application/javascript",
    "etag": "\"47c-ogu83QlQEHKZ2ge/fb3PP3TMAWM\"",
    "mtime": "2023-08-28T04:48:26.989Z",
    "size": 1148,
    "path": "../public/_nuxt/login.08c97f76.js"
  },
  "/_nuxt/login.2653a33c.js": {
    "type": "application/javascript",
    "etag": "\"c4f-/j+LSEZKonmJiW2fWEJIlPpj8Vg\"",
    "mtime": "2023-08-28T04:48:27.096Z",
    "size": 3151,
    "path": "../public/_nuxt/login.2653a33c.js"
  },
  "/_nuxt/login.7707bf7b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c5-RG1RUCT5lzjhK6LVE/uMACFXHrM\"",
    "mtime": "2023-08-28T04:48:26.964Z",
    "size": 709,
    "path": "../public/_nuxt/login.7707bf7b.css"
  },
  "/_nuxt/lua.f5c339e1.js": {
    "type": "application/javascript",
    "etag": "\"941-LZYmP129ZN+CGq/1irSWZVbSnT8\"",
    "mtime": "2023-08-28T04:48:27.023Z",
    "size": 2369,
    "path": "../public/_nuxt/lua.f5c339e1.js"
  },
  "/_nuxt/m3.f481ba01.js": {
    "type": "application/javascript",
    "etag": "\"bf7-F8QG/xZ8WIN7Rk6YVxwe5jUuFTk\"",
    "mtime": "2023-08-28T04:48:27.007Z",
    "size": 3063,
    "path": "../public/_nuxt/m3.f481ba01.js"
  },
  "/_nuxt/markdown.9daa6125.js": {
    "type": "application/javascript",
    "etag": "\"fc2-r70Ba2qHvaCRLw1zUPTC1DTDWvM\"",
    "mtime": "2023-08-28T04:48:27.021Z",
    "size": 4034,
    "path": "../public/_nuxt/markdown.9daa6125.js"
  },
  "/_nuxt/mips.9083c690.js": {
    "type": "application/javascript",
    "etag": "\"b09-u9X8+VB/aHL9vD0uw28K4gP347A\"",
    "mtime": "2023-08-28T04:48:27.006Z",
    "size": 2825,
    "path": "../public/_nuxt/mips.9083c690.js"
  },
  "/_nuxt/msdax.407492d3.js": {
    "type": "application/javascript",
    "etag": "\"1426-m75U9iTkKbUTsV7mWZWJBR/OILM\"",
    "mtime": "2023-08-28T04:48:27.009Z",
    "size": 5158,
    "path": "../public/_nuxt/msdax.407492d3.js"
  },
  "/_nuxt/mysql.58db6cae.js": {
    "type": "application/javascript",
    "etag": "\"2d00-IsAfAiKIV9N6uKBQWOqWaA/PvIU\"",
    "mtime": "2023-08-28T04:48:27.068Z",
    "size": 11520,
    "path": "../public/_nuxt/mysql.58db6cae.js"
  },
  "/_nuxt/noHeadless.29430285.js": {
    "type": "application/javascript",
    "etag": "\"1e4-7ZhmfC48H9RCVJ2P9Tkvl2qR3hs\"",
    "mtime": "2023-08-28T04:48:26.988Z",
    "size": 484,
    "path": "../public/_nuxt/noHeadless.29430285.js"
  },
  "/_nuxt/nuxt-link.34e8d347.js": {
    "type": "application/javascript",
    "etag": "\"1106-VqSyMULtoUiqMM9fq3rXXF9x8zQ\"",
    "mtime": "2023-08-28T04:48:26.991Z",
    "size": 4358,
    "path": "../public/_nuxt/nuxt-link.34e8d347.js"
  },
  "/_nuxt/objective-c.af4e0f63.js": {
    "type": "application/javascript",
    "etag": "\"a58-UxOBz1sSh4RFzzdkFpwcdVTHrno\"",
    "mtime": "2023-08-28T04:48:27.026Z",
    "size": 2648,
    "path": "../public/_nuxt/objective-c.af4e0f63.js"
  },
  "/_nuxt/onlyAdminAuth.66bd3370.js": {
    "type": "application/javascript",
    "etag": "\"108-//Nfmrnj3rLEtB+5aU2WGwc0OHY\"",
    "mtime": "2023-08-28T04:48:26.996Z",
    "size": 264,
    "path": "../public/_nuxt/onlyAdminAuth.66bd3370.js"
  },
  "/_nuxt/onlyAuth.e8c09f5c.js": {
    "type": "application/javascript",
    "etag": "\"10a-BtjXFRlSK1t1RGHA/32snyQCRgg\"",
    "mtime": "2023-08-28T04:48:26.996Z",
    "size": 266,
    "path": "../public/_nuxt/onlyAuth.e8c09f5c.js"
  },
  "/_nuxt/onlyNoAuth.2aa1f9e7.js": {
    "type": "application/javascript",
    "etag": "\"e2-9vgZtiWRDr/eHc/knZYx7MDLChE\"",
    "mtime": "2023-08-28T04:48:26.996Z",
    "size": 226,
    "path": "../public/_nuxt/onlyNoAuth.2aa1f9e7.js"
  },
  "/_nuxt/pascal.63b284c9.js": {
    "type": "application/javascript",
    "etag": "\"ca9-oRUeg0aHY39vjzlrYM+3UvKSQq4\"",
    "mtime": "2023-08-28T04:48:27.036Z",
    "size": 3241,
    "path": "../public/_nuxt/pascal.63b284c9.js"
  },
  "/_nuxt/pascaligo.2b3d65f2.js": {
    "type": "application/javascript",
    "etag": "\"8c6-qRaVtqsIxXKMK/G2JHkNcDWbjPs\"",
    "mtime": "2023-08-28T04:48:27.028Z",
    "size": 2246,
    "path": "../public/_nuxt/pascaligo.2b3d65f2.js"
  },
  "/_nuxt/perl.b4e06d57.js": {
    "type": "application/javascript",
    "etag": "\"2135-V0npspCKqUh9LPBSfjDqw9yJdwM\"",
    "mtime": "2023-08-28T04:48:27.033Z",
    "size": 8501,
    "path": "../public/_nuxt/perl.b4e06d57.js"
  },
  "/_nuxt/perspective.4ba55fb4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2d16-8wdA7ud8cbt5UDDFIjYjOmbqVhY\"",
    "mtime": "2023-08-28T04:48:26.965Z",
    "size": 11542,
    "path": "../public/_nuxt/perspective.4ba55fb4.css"
  },
  "/_nuxt/perspective.59387ca7.js": {
    "type": "application/javascript",
    "etag": "\"a1e4-PaSU1B3YjCaFf8w3B8D9Km/Jr5c\"",
    "mtime": "2023-08-28T04:48:27.071Z",
    "size": 41444,
    "path": "../public/_nuxt/perspective.59387ca7.js"
  },
  "/_nuxt/pgsql.7382e5ae.js": {
    "type": "application/javascript",
    "etag": "\"358e-ytcXgpF7/Nz20QreI0XReyOp8Iw\"",
    "mtime": "2023-08-28T04:48:27.036Z",
    "size": 13710,
    "path": "../public/_nuxt/pgsql.7382e5ae.js"
  },
  "/_nuxt/php.135114d3.js": {
    "type": "application/javascript",
    "etag": "\"2051-kPCgJ1Oc2N4z9CJXDWwFUH2BtRs\"",
    "mtime": "2023-08-28T04:48:27.034Z",
    "size": 8273,
    "path": "../public/_nuxt/php.135114d3.js"
  },
  "/_nuxt/pla.745ec9ce.js": {
    "type": "application/javascript",
    "etag": "\"789-Y94k76bDE/cxe+0DRMyoZ4LnaP8\"",
    "mtime": "2023-08-28T04:48:27.034Z",
    "size": 1929,
    "path": "../public/_nuxt/pla.745ec9ce.js"
  },
  "/_nuxt/postiats.a3fe4f4c.js": {
    "type": "application/javascript",
    "etag": "\"1fa6-jFM0odpoRjFBSc9qHc5JFxuKMaA\"",
    "mtime": "2023-08-28T04:48:27.036Z",
    "size": 8102,
    "path": "../public/_nuxt/postiats.a3fe4f4c.js"
  },
  "/_nuxt/powerquery.47747fc0.js": {
    "type": "application/javascript",
    "etag": "\"4321-ObXpanH4OuhSjD7cSGBqGHkkzYc\"",
    "mtime": "2023-08-28T04:48:27.037Z",
    "size": 17185,
    "path": "../public/_nuxt/powerquery.47747fc0.js"
  },
  "/_nuxt/powershell.ff3577bc.js": {
    "type": "application/javascript",
    "etag": "\"dbb-h3V/GygxMYWgI8nLwsVBDvu6fy4\"",
    "mtime": "2023-08-28T04:48:27.037Z",
    "size": 3515,
    "path": "../public/_nuxt/powershell.ff3577bc.js"
  },
  "/_nuxt/profile.002e99dc.js": {
    "type": "application/javascript",
    "etag": "\"9a8-ilZxnBvD4rZHl7HbwK+ly6U7+NA\"",
    "mtime": "2023-08-28T04:48:26.990Z",
    "size": 2472,
    "path": "../public/_nuxt/profile.002e99dc.js"
  },
  "/_nuxt/protobuf.6deb4a02.js": {
    "type": "application/javascript",
    "etag": "\"244c-I/MCUnK/OKHMCW826BgLieP3lgo\"",
    "mtime": "2023-08-28T04:48:27.037Z",
    "size": 9292,
    "path": "../public/_nuxt/protobuf.6deb4a02.js"
  },
  "/_nuxt/pug.2dd33d7b.js": {
    "type": "application/javascript",
    "etag": "\"13d2-zVkwp1cYWVZuorkMSd8CCMQfRxY\"",
    "mtime": "2023-08-28T04:48:27.068Z",
    "size": 5074,
    "path": "../public/_nuxt/pug.2dd33d7b.js"
  },
  "/_nuxt/python.369c849c.js": {
    "type": "application/javascript",
    "etag": "\"fb0-NSmzeMbJ1mZak4/UvafdQ2hJjms\"",
    "mtime": "2023-08-28T04:48:27.038Z",
    "size": 4016,
    "path": "../public/_nuxt/python.369c849c.js"
  },
  "/_nuxt/qsharp.52d3483a.js": {
    "type": "application/javascript",
    "etag": "\"c6d-uAY9XhBvChu0ymhYJzUThLuKD/M\"",
    "mtime": "2023-08-28T04:48:27.040Z",
    "size": 3181,
    "path": "../public/_nuxt/qsharp.52d3483a.js"
  },
  "/_nuxt/r.419d1932.js": {
    "type": "application/javascript",
    "etag": "\"d31-LhHDF/IG0xkYfZuQ1FN0o1qFvqk\"",
    "mtime": "2023-08-28T04:48:27.038Z",
    "size": 3377,
    "path": "../public/_nuxt/r.419d1932.js"
  },
  "/_nuxt/razor.a65dbb5d.js": {
    "type": "application/javascript",
    "etag": "\"23d9-yShbKooelSJlwX1UrFbT6CLldrI\"",
    "mtime": "2023-08-28T04:48:27.041Z",
    "size": 9177,
    "path": "../public/_nuxt/razor.a65dbb5d.js"
  },
  "/_nuxt/redis.48ffdd95.js": {
    "type": "application/javascript",
    "etag": "\"eda-p94G2TX5y8HNr6FO3Mvo1FxLNmQ\"",
    "mtime": "2023-08-28T04:48:27.038Z",
    "size": 3802,
    "path": "../public/_nuxt/redis.48ffdd95.js"
  },
  "/_nuxt/redshift.6f3b6438.js": {
    "type": "application/javascript",
    "etag": "\"2f0e-MjSTcqKp+vgUJj4sp5qzfLFynrQ\"",
    "mtime": "2023-08-28T04:48:27.049Z",
    "size": 12046,
    "path": "../public/_nuxt/redshift.6f3b6438.js"
  },
  "/_nuxt/reset-password.57439420.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2cd-ykzE3D7J8on6MCCO6QyxHOWuhuI\"",
    "mtime": "2023-08-28T04:48:26.964Z",
    "size": 717,
    "path": "../public/_nuxt/reset-password.57439420.css"
  },
  "/_nuxt/reset-password.661d5472.js": {
    "type": "application/javascript",
    "etag": "\"1576-nM75EGqM4lz2Zo+duLqy82nfCXw\"",
    "mtime": "2023-08-28T04:48:27.022Z",
    "size": 5494,
    "path": "../public/_nuxt/reset-password.661d5472.js"
  },
  "/_nuxt/restructuredtext.2b6de06c.js": {
    "type": "application/javascript",
    "etag": "\"102b-CTlB6PnVAQuYKq5qLYyYtKGFC1Q\"",
    "mtime": "2023-08-28T04:48:27.039Z",
    "size": 4139,
    "path": "../public/_nuxt/restructuredtext.2b6de06c.js"
  },
  "/_nuxt/ruby.3203ad6f.js": {
    "type": "application/javascript",
    "etag": "\"222e-fkiUrBhiTgGr/M8j4AIrthV92QM\"",
    "mtime": "2023-08-28T04:48:27.051Z",
    "size": 8750,
    "path": "../public/_nuxt/ruby.3203ad6f.js"
  },
  "/_nuxt/rust.db058ad8.js": {
    "type": "application/javascript",
    "etag": "\"1136-LpdHsXEyjV5faF0RcAkLxC2yias\"",
    "mtime": "2023-08-28T04:48:27.039Z",
    "size": 4406,
    "path": "../public/_nuxt/rust.db058ad8.js"
  },
  "/_nuxt/sb.2e6261d9.js": {
    "type": "application/javascript",
    "etag": "\"81b-XGcYzjxk79vSLOFZW1uQ/SGXAK8\"",
    "mtime": "2023-08-28T04:48:27.039Z",
    "size": 2075,
    "path": "../public/_nuxt/sb.2e6261d9.js"
  },
  "/_nuxt/scala.9479f128.js": {
    "type": "application/javascript",
    "etag": "\"1d8c-hR6MDAK67K/eQAytAT6XhHV6qSo\"",
    "mtime": "2023-08-28T04:48:27.052Z",
    "size": 7564,
    "path": "../public/_nuxt/scala.9479f128.js"
  },
  "/_nuxt/scheme.eff94c99.js": {
    "type": "application/javascript",
    "etag": "\"7dd-8+02SDAfeUC/za63UfZ/raCscGg\"",
    "mtime": "2023-08-28T04:48:27.040Z",
    "size": 2013,
    "path": "../public/_nuxt/scheme.eff94c99.js"
  },
  "/_nuxt/scroll.905f5ae3.js": {
    "type": "application/javascript",
    "etag": "\"4a6-FhbtleL4TmMka/Z9NuxQYoRu9lE\"",
    "mtime": "2023-08-28T04:48:27.022Z",
    "size": 1190,
    "path": "../public/_nuxt/scroll.905f5ae3.js"
  },
  "/_nuxt/scss.47fd4d15.js": {
    "type": "application/javascript",
    "etag": "\"19ff-fh7sYJKC27yccEC7sd/lcSOYXik\"",
    "mtime": "2023-08-28T04:48:27.044Z",
    "size": 6655,
    "path": "../public/_nuxt/scss.47fd4d15.js"
  },
  "/_nuxt/shell.6ce95083.js": {
    "type": "application/javascript",
    "etag": "\"cf7-t2GEvLTm/3f0F0Tj5g45daMC4E8\"",
    "mtime": "2023-08-28T04:48:27.050Z",
    "size": 3319,
    "path": "../public/_nuxt/shell.6ce95083.js"
  },
  "/_nuxt/signup.3666155e.js": {
    "type": "application/javascript",
    "etag": "\"1911-vpsxwiUhHc8HTCi1+oc7f9Mw8hE\"",
    "mtime": "2023-08-28T04:48:27.072Z",
    "size": 6417,
    "path": "../public/_nuxt/signup.3666155e.js"
  },
  "/_nuxt/solidity.05bce190.js": {
    "type": "application/javascript",
    "etag": "\"499b-r3w0xx446i1aaY/dFpEWSACxcK0\"",
    "mtime": "2023-08-28T04:48:27.051Z",
    "size": 18843,
    "path": "../public/_nuxt/solidity.05bce190.js"
  },
  "/_nuxt/sophia.0df3b455.js": {
    "type": "application/javascript",
    "etag": "\"bc2-Oq29aCmdRh7i6VmI5XIbat7MuGw\"",
    "mtime": "2023-08-28T04:48:27.051Z",
    "size": 3010,
    "path": "../public/_nuxt/sophia.0df3b455.js"
  },
  "/_nuxt/sparql.82e631b6.js": {
    "type": "application/javascript",
    "etag": "\"aee-pOnlWw/z2N7F1BBnM9coDxfbFTY\"",
    "mtime": "2023-08-28T04:48:27.050Z",
    "size": 2798,
    "path": "../public/_nuxt/sparql.82e631b6.js"
  },
  "/_nuxt/sql.ba093187.js": {
    "type": "application/javascript",
    "etag": "\"292f-8cTLpuuobAie8H+38RbQoZRFnqY\"",
    "mtime": "2023-08-28T04:48:27.052Z",
    "size": 10543,
    "path": "../public/_nuxt/sql.ba093187.js"
  },
  "/_nuxt/st.791b0ff5.js": {
    "type": "application/javascript",
    "etag": "\"1dd0-K0VhHrhBtj6tC9nhRnZkPikySRk\"",
    "mtime": "2023-08-28T04:48:27.051Z",
    "size": 7632,
    "path": "../public/_nuxt/st.791b0ff5.js"
  },
  "/_nuxt/swift.4e23775b.js": {
    "type": "application/javascript",
    "etag": "\"1529-qCqf7Zf8RUAdZt8YBuzn8g0/kGE\"",
    "mtime": "2023-08-28T04:48:27.052Z",
    "size": 5417,
    "path": "../public/_nuxt/swift.4e23775b.js"
  },
  "/_nuxt/systemverilog.ad58bd79.js": {
    "type": "application/javascript",
    "etag": "\"1ea9-VrxOB/Jf8fNmND4R+a5aCYwmqGo\"",
    "mtime": "2023-08-28T04:48:27.052Z",
    "size": 7849,
    "path": "../public/_nuxt/systemverilog.ad58bd79.js"
  },
  "/_nuxt/tcl.ef3a1af5.js": {
    "type": "application/javascript",
    "etag": "\"ee9-CX284QcstDQv6Xc/XFCNLI3dSC8\"",
    "mtime": "2023-08-28T04:48:27.053Z",
    "size": 3817,
    "path": "../public/_nuxt/tcl.ef3a1af5.js"
  },
  "/_nuxt/tsMode.d072b62a.js": {
    "type": "application/javascript",
    "etag": "\"5924-wSGjV7X+qruw4UnTlRkVR9z1ttA\"",
    "mtime": "2023-08-28T04:48:27.067Z",
    "size": 22820,
    "path": "../public/_nuxt/tsMode.d072b62a.js"
  },
  "/_nuxt/twig.a6c466d1.js": {
    "type": "application/javascript",
    "etag": "\"184a-3TXY1nnHEaW7VJOkHBCKs+Mt2k0\"",
    "mtime": "2023-08-28T04:48:27.052Z",
    "size": 6218,
    "path": "../public/_nuxt/twig.a6c466d1.js"
  },
  "/_nuxt/typescript.cdede34c.js": {
    "type": "application/javascript",
    "etag": "\"16ac-i9FKOUrbpsVFwxJ85UWS4ShonrY\"",
    "mtime": "2023-08-28T04:48:27.067Z",
    "size": 5804,
    "path": "../public/_nuxt/typescript.cdede34c.js"
  },
  "/_nuxt/useAdmin.f9d8e36a.js": {
    "type": "application/javascript",
    "etag": "\"131-yJ+/N3mJ5Ume4hmEXebH4zaKq2k\"",
    "mtime": "2023-08-28T04:48:26.995Z",
    "size": 305,
    "path": "../public/_nuxt/useAdmin.f9d8e36a.js"
  },
  "/_nuxt/useAuth.d8a26693.js": {
    "type": "application/javascript",
    "etag": "\"c67-sfZ4emRl+MuBeH+W9cLQQViK/ec\"",
    "mtime": "2023-08-28T04:48:27.023Z",
    "size": 3175,
    "path": "../public/_nuxt/useAuth.d8a26693.js"
  },
  "/_nuxt/useChat.cc45ea3c.js": {
    "type": "application/javascript",
    "etag": "\"36fb-DlDzKJG5yMTb8jpqTwOxTpWrBQI\"",
    "mtime": "2023-08-28T04:48:27.022Z",
    "size": 14075,
    "path": "../public/_nuxt/useChat.cc45ea3c.js"
  },
  "/_nuxt/useTitle.f037e0c7.js": {
    "type": "application/javascript",
    "etag": "\"9f-kfdlzbutVJ2uUI6FmQtpy5JdBpg\"",
    "mtime": "2023-08-28T04:48:26.990Z",
    "size": 159,
    "path": "../public/_nuxt/useTitle.f037e0c7.js"
  },
  "/_nuxt/vb.dc8b6e66.js": {
    "type": "application/javascript",
    "etag": "\"1795-xl28ovLewbe0MJtplwoZEsQ07vU\"",
    "mtime": "2023-08-28T04:48:27.053Z",
    "size": 6037,
    "path": "../public/_nuxt/vb.dc8b6e66.js"
  },
  "/_nuxt/xml.d63304d1.js": {
    "type": "application/javascript",
    "etag": "\"af7-0/bzRZAhVGsISEiGHzBmUDpKojA\"",
    "mtime": "2023-08-28T04:48:27.053Z",
    "size": 2807,
    "path": "../public/_nuxt/xml.d63304d1.js"
  },
  "/_nuxt/yaml.77956c78.js": {
    "type": "application/javascript",
    "etag": "\"112f-uaXcBEVfnaoCK6oBU3/sEkBXD6Y\"",
    "mtime": "2023-08-28T04:48:27.053Z",
    "size": 4399,
    "path": "../public/_nuxt/yaml.77956c78.js"
  },
  "/_nuxt/_conv_.3b1396c1.js": {
    "type": "application/javascript",
    "etag": "\"347-+19pz97UUNqtCwiPZOeARLCMC4M\"",
    "mtime": "2023-08-28T04:48:26.991Z",
    "size": 839,
    "path": "../public/_nuxt/_conv_.3b1396c1.js"
  },
  "/_nuxt/_Uint8Array.5f3fdee4.js": {
    "type": "application/javascript",
    "etag": "\"11d8-7KpM8qIO306TeeQQ9lQ4g/SU9UQ\"",
    "mtime": "2023-08-28T04:48:26.996Z",
    "size": 4568,
    "path": "../public/_nuxt/_Uint8Array.5f3fdee4.js"
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

const _lazy_KsvEC1 = () => import('../check.delete.mjs');
const _lazy_SWQJRn = () => import('../check.post.mjs');
const _lazy_BlaMo1 = () => import('../search-engine.get.mjs');
const _lazy_DTFyXr = () => import('../search-engine.post.mjs');
const _lazy_7PR8AX = () => import('../setting.post.mjs');
const _lazy_UScdIi = () => import('../check.post2.mjs');
const _lazy_PBkD23 = () => import('../createVerification.post.mjs');
const _lazy_XyTMnn = () => import('../login.post.mjs');
const _lazy_xfmW64 = () => import('../logout.post.mjs');
const _lazy_187dFF = () => import('../replaceUser.post.mjs');
const _lazy_Il2qtI = () => import('../resendCode.post.mjs');
const _lazy_I17oVW = () => import('../resetPassword.post.mjs');
const _lazy_xqtLlJ = () => import('../signup.post.mjs');
const _lazy_ygooOa = () => import('../transfer.mjs');
const _lazy_PaLDFn = () => import('../username.put.mjs');
const _lazy_vz2JyP = () => import('../answer.delete.mjs');
const _lazy_HX9str = () => import('../answer.post.mjs');
const _lazy_MlSQ7L = () => import('../check.post3.mjs');
const _lazy_wX8L45 = () => import('../conv.delete.mjs');
const _lazy_oaQnKo = () => import('../conv.put.mjs');
const _lazy_Zw6q4r = () => import('../express.post.mjs');
const _lazy_xyzH6i = () => import('../history.post.mjs');
const _lazy_xc7mAZ = () => import('../message.put.mjs');
const _lazy_5JTSSG = () => import('../stream.post.mjs');
const _lazy_ibkWJX = () => import('../suggestions.post.mjs');
const _lazy_36o9OA = () => import('../discord.mjs');
const _lazy_SrvWlI = () => import('../memory.mjs');
const _lazy_kSCyCm = () => import('../keys.mjs');
const _lazy_QcObDY = () => import('../messages.mjs');
const _lazy_D0mNky = () => import('../tree.mjs');
const _lazy_oRLWXu = () => import('../yt-captions.mjs');
const _lazy_MRbt0o = () => import('../feedback.post.mjs');
const _lazy_5jYbeA = () => import('../test.mjs');
const _lazy_exrXwu = () => import('../translate.mjs');
const _lazy_EcMGl8 = () => import('../user.post.mjs');
const _lazy_MNfkmp = () => import('../version.mjs');
const _lazy_G40W9i = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/check', handler: _lazy_KsvEC1, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/check', handler: _lazy_SWQJRn, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/search-engine', handler: _lazy_BlaMo1, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/search-engine', handler: _lazy_DTFyXr, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/setting', handler: _lazy_7PR8AX, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/check', handler: _lazy_UScdIi, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/createVerification', handler: _lazy_PBkD23, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_XyTMnn, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_xfmW64, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/replaceUser', handler: _lazy_187dFF, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/resendCode', handler: _lazy_Il2qtI, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/resetPassword', handler: _lazy_I17oVW, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/signup', handler: _lazy_xqtLlJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/transfer', handler: _lazy_ygooOa, lazy: true, middleware: false, method: undefined },
  { route: '/api/auth/username', handler: _lazy_PaLDFn, lazy: true, middleware: false, method: "put" },
  { route: '/api/curva/answer', handler: _lazy_vz2JyP, lazy: true, middleware: false, method: "delete" },
  { route: '/api/curva/answer', handler: _lazy_HX9str, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/check', handler: _lazy_MlSQ7L, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/conv', handler: _lazy_wX8L45, lazy: true, middleware: false, method: "delete" },
  { route: '/api/curva/conv', handler: _lazy_oaQnKo, lazy: true, middleware: false, method: "put" },
  { route: '/api/curva/express', handler: _lazy_Zw6q4r, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/history', handler: _lazy_xyzH6i, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/message', handler: _lazy_xc7mAZ, lazy: true, middleware: false, method: "put" },
  { route: '/api/curva/stream', handler: _lazy_5JTSSG, lazy: true, middleware: false, method: "post" },
  { route: '/api/curva/suggestions', handler: _lazy_ibkWJX, lazy: true, middleware: false, method: "post" },
  { route: '/api/discord', handler: _lazy_36o9OA, lazy: true, middleware: false, method: undefined },
  { route: '/api/memory', handler: _lazy_SrvWlI, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/keys', handler: _lazy_kSCyCm, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/messages', handler: _lazy_QcObDY, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/tree', handler: _lazy_D0mNky, lazy: true, middleware: false, method: undefined },
  { route: '/api/services/yt-captions', handler: _lazy_oRLWXu, lazy: true, middleware: false, method: undefined },
  { route: '/api/stats/feedback', handler: _lazy_MRbt0o, lazy: true, middleware: false, method: "post" },
  { route: '/api/test', handler: _lazy_5jYbeA, lazy: true, middleware: false, method: undefined },
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
