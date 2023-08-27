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
  "/_nuxt/castArray.ae76fbff.js": {
    "type": "application/javascript",
    "etag": "\"88-dDIkQqjwefpIcPVl9Ne+PixbRQk\"",
    "mtime": "2023-08-27T06:11:18.501Z",
    "size": 136,
    "path": "../public/_nuxt/castArray.ae76fbff.js"
  },
  "/_nuxt/chat.180c9f83.js": {
    "type": "application/javascript",
    "etag": "\"22d-NRBTqGEt3ab36EJfiPM9GV0kYuI\"",
    "mtime": "2023-08-27T06:11:18.513Z",
    "size": 557,
    "path": "../public/_nuxt/chat.180c9f83.js"
  },
  "/_nuxt/chat.3e63ad7c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"227e-BpzF/yNGCsOZT6OKRPP1g+aQsX0\"",
    "mtime": "2023-08-27T06:11:18.492Z",
    "size": 8830,
    "path": "../public/_nuxt/chat.3e63ad7c.css"
  },
  "/_nuxt/chat.ee4c2f63.js": {
    "type": "application/javascript",
    "etag": "\"6471-qpK1KYjV8WiqvQk1g5BBtk7jh9U\"",
    "mtime": "2023-08-27T06:11:18.541Z",
    "size": 25713,
    "path": "../public/_nuxt/chat.ee4c2f63.js"
  },
  "/_nuxt/client-only.bd7056b1.js": {
    "type": "application/javascript",
    "etag": "\"1d5-ddj25fi8Wgd2RXG+q+ref3DAdu8\"",
    "mtime": "2023-08-27T06:11:18.519Z",
    "size": 469,
    "path": "../public/_nuxt/client-only.bd7056b1.js"
  },
  "/_nuxt/CommonSettings.c505cd82.js": {
    "type": "application/javascript",
    "etag": "\"7c1-Kh9MMs5nBMsosAWYch3/11Hp31g\"",
    "mtime": "2023-08-27T06:11:18.522Z",
    "size": 1985,
    "path": "../public/_nuxt/CommonSettings.c505cd82.js"
  },
  "/_nuxt/ConvMain.5ae715dd.js": {
    "type": "application/javascript",
    "etag": "\"cca3-z/EGvNTby5TJoYnT7mDSL4zyZOo\"",
    "mtime": "2023-08-27T06:11:18.539Z",
    "size": 52387,
    "path": "../public/_nuxt/ConvMain.5ae715dd.js"
  },
  "/_nuxt/ConvMain.b78375b8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"172b-9u/hJT+wqfdYfZ/Wdp9dujZNLtU\"",
    "mtime": "2023-08-27T06:11:18.491Z",
    "size": 5931,
    "path": "../public/_nuxt/ConvMain.b78375b8.css"
  },
  "/_nuxt/dashboard.2bbb7b6a.js": {
    "type": "application/javascript",
    "etag": "\"7ae-uF05KhdK6lYRLOMBPgETPM1nzqg\"",
    "mtime": "2023-08-27T06:11:18.514Z",
    "size": 1966,
    "path": "../public/_nuxt/dashboard.2bbb7b6a.js"
  },
  "/_nuxt/default.39fe3d1b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9e-rI+KacqkCoZvi4kBvOhWmhC7LL0\"",
    "mtime": "2023-08-27T06:11:18.492Z",
    "size": 158,
    "path": "../public/_nuxt/default.39fe3d1b.css"
  },
  "/_nuxt/default.c85a1a31.js": {
    "type": "application/javascript",
    "etag": "\"5db-Nbt21M6Noh3Irz245EcX5EtmllI\"",
    "mtime": "2023-08-27T06:11:18.537Z",
    "size": 1499,
    "path": "../public/_nuxt/default.c85a1a31.js"
  },
  "/_nuxt/DefaultHeaderButtons.90a88d8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b78-H6nx0Vloo4Jw0cRDV8I93EfnL0U\"",
    "mtime": "2023-08-27T06:11:18.492Z",
    "size": 11128,
    "path": "../public/_nuxt/DefaultHeaderButtons.90a88d8a.css"
  },
  "/_nuxt/DefaultHeaderButtons.a2261b28.js": {
    "type": "application/javascript",
    "etag": "\"777b-EqZ0snqhFPGiQBXrfAFb60/Fqhs\"",
    "mtime": "2023-08-27T06:11:18.537Z",
    "size": 30587,
    "path": "../public/_nuxt/DefaultHeaderButtons.a2261b28.js"
  },
  "/_nuxt/dropdown.65518fa1.js": {
    "type": "application/javascript",
    "etag": "\"925-VsmRRliQcGRgE8oh/IIGyTr9FiI\"",
    "mtime": "2023-08-27T06:11:18.514Z",
    "size": 2341,
    "path": "../public/_nuxt/dropdown.65518fa1.js"
  },
  "/_nuxt/el-button.2689f638.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d33-RzIPFKzgWgJB1bVDsB1E+qI9A3Y\"",
    "mtime": "2023-08-27T06:11:18.500Z",
    "size": 15667,
    "path": "../public/_nuxt/el-button.2689f638.css"
  },
  "/_nuxt/el-button.fad26086.js": {
    "type": "application/javascript",
    "etag": "\"4a8d-baO9D4HdFB3CFntrxbX3cWpqhsU\"",
    "mtime": "2023-08-27T06:11:18.537Z",
    "size": 19085,
    "path": "../public/_nuxt/el-button.fad26086.js"
  },
  "/_nuxt/el-form.7235a9a0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f0d-qCH0MR9J+ccrp40iuwPw59h7yJI\"",
    "mtime": "2023-08-27T06:11:18.492Z",
    "size": 3853,
    "path": "../public/_nuxt/el-form.7235a9a0.css"
  },
  "/_nuxt/el-form.f1a14850.js": {
    "type": "application/javascript",
    "etag": "\"7a0b-TFcJM61sD/fwMbp/1h2Qc2HcD80\"",
    "mtime": "2023-08-27T06:11:18.541Z",
    "size": 31243,
    "path": "../public/_nuxt/el-form.f1a14850.js"
  },
  "/_nuxt/el-icon.12f2798b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e0-rUUgX55PeSysz9mOdM+T2qj0QS4\"",
    "mtime": "2023-08-27T06:11:18.499Z",
    "size": 480,
    "path": "../public/_nuxt/el-icon.12f2798b.css"
  },
  "/_nuxt/el-input.061f730f.js": {
    "type": "application/javascript",
    "etag": "\"2ebd-EJP7W/fvfjfTMYKtdohvr3bER0k\"",
    "mtime": "2023-08-27T06:11:18.548Z",
    "size": 11965,
    "path": "../public/_nuxt/el-input.061f730f.js"
  },
  "/_nuxt/el-input.3fc85dc7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"302b-3v8oiy4O6e1HBuSVz4u1Whl7kIY\"",
    "mtime": "2023-08-27T06:11:18.492Z",
    "size": 12331,
    "path": "../public/_nuxt/el-input.3fc85dc7.css"
  },
  "/_nuxt/el-link.85548223.js": {
    "type": "application/javascript",
    "etag": "\"479-zOp+1mdlxl8MGFpXplAwShT5QNg\"",
    "mtime": "2023-08-27T06:11:18.541Z",
    "size": 1145,
    "path": "../public/_nuxt/el-link.85548223.js"
  },
  "/_nuxt/el-link.d9789c6b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b4b-2nLfNoRS3IyBEXstRQu5vwaPiPg\"",
    "mtime": "2023-08-27T06:11:18.493Z",
    "size": 2891,
    "path": "../public/_nuxt/el-link.d9789c6b.css"
  },
  "/_nuxt/el-overlay.0d7054d6.js": {
    "type": "application/javascript",
    "etag": "\"380f-MNhM70gLMl6ARxJinvd90gZpGho\"",
    "mtime": "2023-08-27T06:11:18.548Z",
    "size": 14351,
    "path": "../public/_nuxt/el-overlay.0d7054d6.js"
  },
  "/_nuxt/el-overlay.adec720f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14a9-S5SbV5gD5xWhD5fPG/Pul9XX7VQ\"",
    "mtime": "2023-08-27T06:11:18.498Z",
    "size": 5289,
    "path": "../public/_nuxt/el-overlay.adec720f.css"
  },
  "/_nuxt/el-popover.42c2bc56.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"558-F1/tgAS2U8PplrTLocXW2lf10tg\"",
    "mtime": "2023-08-27T06:11:18.491Z",
    "size": 1368,
    "path": "../public/_nuxt/el-popover.42c2bc56.css"
  },
  "/_nuxt/el-popover.bf792b60.js": {
    "type": "application/javascript",
    "etag": "\"bf4-n2BqSG2ZAFfBkpBGPMg3B9e1R3s\"",
    "mtime": "2023-08-27T06:11:18.541Z",
    "size": 3060,
    "path": "../public/_nuxt/el-popover.bf792b60.js"
  },
  "/_nuxt/el-popper.010f9139.js": {
    "type": "application/javascript",
    "etag": "\"a10e-DoTARvj7UdB6qjceOarLa3G/V7w\"",
    "mtime": "2023-08-27T06:11:18.542Z",
    "size": 41230,
    "path": "../public/_nuxt/el-popper.010f9139.js"
  },
  "/_nuxt/el-popper.854ddd02.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1fd4-0uk2Uz3ZxPdGTo0NHlSCdY512co\"",
    "mtime": "2023-08-27T06:11:18.492Z",
    "size": 8148,
    "path": "../public/_nuxt/el-popper.854ddd02.css"
  },
  "/_nuxt/el-switch.f7b21545.js": {
    "type": "application/javascript",
    "etag": "\"b8d4-sOsXWH3a26m6ckyjX3npEdrc9vE\"",
    "mtime": "2023-08-27T06:11:18.548Z",
    "size": 47316,
    "path": "../public/_nuxt/el-switch.f7b21545.js"
  },
  "/_nuxt/el-switch.f8353e0a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3a4b-g55sfuJDdVY93G4WyzFEjSn965w\"",
    "mtime": "2023-08-27T06:11:18.492Z",
    "size": 14923,
    "path": "../public/_nuxt/el-switch.f8353e0a.css"
  },
  "/_nuxt/el-text.7dc6a0f8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b8-ilGyRmsxar56yv5WdPXI1YlRsU4\"",
    "mtime": "2023-08-27T06:11:18.492Z",
    "size": 952,
    "path": "../public/_nuxt/el-text.7dc6a0f8.css"
  },
  "/_nuxt/el-text.837bb81d.js": {
    "type": "application/javascript",
    "etag": "\"309-NDTAKz3f5RUX3frzuTPGw8bUhIk\"",
    "mtime": "2023-08-27T06:11:18.537Z",
    "size": 777,
    "path": "../public/_nuxt/el-text.837bb81d.js"
  },
  "/_nuxt/entrance.ccfc5f4d.js": {
    "type": "application/javascript",
    "etag": "\"490-KIhIWFR767O0LgI15MoavBYj+zs\"",
    "mtime": "2023-08-27T06:11:18.515Z",
    "size": 1168,
    "path": "../public/_nuxt/entrance.ccfc5f4d.js"
  },
  "/_nuxt/entry.7068c0e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3562-N8S/oB5JcdCkIZnNvgadH30Mww8\"",
    "mtime": "2023-08-27T06:11:18.490Z",
    "size": 13666,
    "path": "../public/_nuxt/entry.7068c0e9.css"
  },
  "/_nuxt/entry.ba7d954e.js": {
    "type": "application/javascript",
    "etag": "\"615ba-0Cb8uDCnJj+oLVgmPmMmykojK3s\"",
    "mtime": "2023-08-27T06:11:18.549Z",
    "size": 398778,
    "path": "../public/_nuxt/entry.ba7d954e.js"
  },
  "/_nuxt/error-404.339cb949.js": {
    "type": "application/javascript",
    "etag": "\"8cd-RjkNoqrjLeIY5eTTKUVcdI40ego\"",
    "mtime": "2023-08-27T06:11:18.537Z",
    "size": 2253,
    "path": "../public/_nuxt/error-404.339cb949.js"
  },
  "/_nuxt/error-404.7fc72018.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-iNt1cqPQ0WDudfCTZVQd31BeRGs\"",
    "mtime": "2023-08-27T06:11:18.473Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.7fc72018.css"
  },
  "/_nuxt/error-500.23a14cd6.js": {
    "type": "application/javascript",
    "etag": "\"756-3sHmnuAHfT8q3ak3KU/YDwxWcPk\"",
    "mtime": "2023-08-27T06:11:18.538Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.23a14cd6.js"
  },
  "/_nuxt/error-500.c5df6088.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-ByRo+49BgcevWdRjJy3CMx2IA5k\"",
    "mtime": "2023-08-27T06:11:18.490Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.c5df6088.css"
  },
  "/_nuxt/focus-trap.5c77d484.js": {
    "type": "application/javascript",
    "etag": "\"1505-qccSlQkv50/0m35YdpMVGcCoKco\"",
    "mtime": "2023-08-27T06:11:18.524Z",
    "size": 5381,
    "path": "../public/_nuxt/focus-trap.5c77d484.js"
  },
  "/_nuxt/index.579a582c.js": {
    "type": "application/javascript",
    "etag": "\"275-TpP3h+Yu1UJwFsibJ5lEVjDogas\"",
    "mtime": "2023-08-27T06:11:18.536Z",
    "size": 629,
    "path": "../public/_nuxt/index.579a582c.js"
  },
  "/_nuxt/index.df13efbd.js": {
    "type": "application/javascript",
    "etag": "\"36c-5jKAhmcZFA8Y9q8XIcOSlwHvVyc\"",
    "mtime": "2023-08-27T06:11:18.514Z",
    "size": 876,
    "path": "../public/_nuxt/index.df13efbd.js"
  },
  "/_nuxt/isEqual.126f8112.js": {
    "type": "application/javascript",
    "etag": "\"e9d-E1ZZqEni7t0/CEHMeVwlvky/aiE\"",
    "mtime": "2023-08-27T06:11:18.524Z",
    "size": 3741,
    "path": "../public/_nuxt/isEqual.126f8112.js"
  },
  "/_nuxt/login.7707bf7b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c5-RG1RUCT5lzjhK6LVE/uMACFXHrM\"",
    "mtime": "2023-08-27T06:11:18.491Z",
    "size": 709,
    "path": "../public/_nuxt/login.7707bf7b.css"
  },
  "/_nuxt/login.aa7f3b9e.js": {
    "type": "application/javascript",
    "etag": "\"c73-taTUcRc07653EzHVEcJh128KS2w\"",
    "mtime": "2023-08-27T06:11:18.540Z",
    "size": 3187,
    "path": "../public/_nuxt/login.aa7f3b9e.js"
  },
  "/_nuxt/login.be348740.js": {
    "type": "application/javascript",
    "etag": "\"4a0-0pQKThxBnyPV+b74wBMST5wsvBo\"",
    "mtime": "2023-08-27T06:11:18.515Z",
    "size": 1184,
    "path": "../public/_nuxt/login.be348740.js"
  },
  "/_nuxt/noHeadless.64b79759.js": {
    "type": "application/javascript",
    "etag": "\"208-2ACK+q+20kgb4vw0VMYbIL6OEQM\"",
    "mtime": "2023-08-27T06:11:18.536Z",
    "size": 520,
    "path": "../public/_nuxt/noHeadless.64b79759.js"
  },
  "/_nuxt/nuxt-link.d91d2a24.js": {
    "type": "application/javascript",
    "etag": "\"1107-ROVJDpFK8/Vkh1a5ngxAOCxJ/ZQ\"",
    "mtime": "2023-08-27T06:11:18.515Z",
    "size": 4359,
    "path": "../public/_nuxt/nuxt-link.d91d2a24.js"
  },
  "/_nuxt/onlyAdminAuth.005afcf7.js": {
    "type": "application/javascript",
    "etag": "\"108-SNbiUhLhMvKtWSIOxK2EH+EP8tM\"",
    "mtime": "2023-08-27T06:11:18.515Z",
    "size": 264,
    "path": "../public/_nuxt/onlyAdminAuth.005afcf7.js"
  },
  "/_nuxt/onlyAuth.0bbc925a.js": {
    "type": "application/javascript",
    "etag": "\"10a-i0I1bb7J51c6Y7T6xpepJul69o0\"",
    "mtime": "2023-08-27T06:11:18.514Z",
    "size": 266,
    "path": "../public/_nuxt/onlyAuth.0bbc925a.js"
  },
  "/_nuxt/onlyNoAuth.92799a6f.js": {
    "type": "application/javascript",
    "etag": "\"e2-6DgOTq4RHz1o91AbcchXjuxEkow\"",
    "mtime": "2023-08-27T06:11:18.515Z",
    "size": 226,
    "path": "../public/_nuxt/onlyNoAuth.92799a6f.js"
  },
  "/_nuxt/perspective.351809f3.js": {
    "type": "application/javascript",
    "etag": "\"a216-4jXYbJznymY9CQyV2NeJ470l4So\"",
    "mtime": "2023-08-27T06:11:18.548Z",
    "size": 41494,
    "path": "../public/_nuxt/perspective.351809f3.js"
  },
  "/_nuxt/perspective.4ba55fb4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2d16-8wdA7ud8cbt5UDDFIjYjOmbqVhY\"",
    "mtime": "2023-08-27T06:11:18.492Z",
    "size": 11542,
    "path": "../public/_nuxt/perspective.4ba55fb4.css"
  },
  "/_nuxt/profile.a9d22f1f.js": {
    "type": "application/javascript",
    "etag": "\"874-Wq5Nns2N8vS5ux76CjgMbjwqwr4\"",
    "mtime": "2023-08-27T06:11:18.514Z",
    "size": 2164,
    "path": "../public/_nuxt/profile.a9d22f1f.js"
  },
  "/_nuxt/reset-password.57439420.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2cd-ykzE3D7J8on6MCCO6QyxHOWuhuI\"",
    "mtime": "2023-08-27T06:11:18.491Z",
    "size": 717,
    "path": "../public/_nuxt/reset-password.57439420.css"
  },
  "/_nuxt/reset-password.d806cc53.js": {
    "type": "application/javascript",
    "etag": "\"159a-f5H0mNWLIrokj/vEyDdx0t2UA4Q\"",
    "mtime": "2023-08-27T06:11:18.540Z",
    "size": 5530,
    "path": "../public/_nuxt/reset-password.d806cc53.js"
  },
  "/_nuxt/scroll.765c600c.js": {
    "type": "application/javascript",
    "etag": "\"4a6-m1FGxZxGfu3gA3+w4IAvqdUE/Sw\"",
    "mtime": "2023-08-27T06:11:18.523Z",
    "size": 1190,
    "path": "../public/_nuxt/scroll.765c600c.js"
  },
  "/_nuxt/signup.c6957423.js": {
    "type": "application/javascript",
    "etag": "\"1937-02gJhfYJ0w1XGdR+pGr53iWZC+M\"",
    "mtime": "2023-08-27T06:11:18.537Z",
    "size": 6455,
    "path": "../public/_nuxt/signup.c6957423.js"
  },
  "/_nuxt/use-form-item.4e7a4467.js": {
    "type": "application/javascript",
    "etag": "\"587-fobrYmXimV9IKT1Z8KzT+cWsRWw\"",
    "mtime": "2023-08-27T06:11:18.536Z",
    "size": 1415,
    "path": "../public/_nuxt/use-form-item.4e7a4467.js"
  },
  "/_nuxt/useAdmin.a631a3bc.js": {
    "type": "application/javascript",
    "etag": "\"131-gqVYsSFw7sAexfHDLe3lNs1BdFs\"",
    "mtime": "2023-08-27T06:11:18.517Z",
    "size": 305,
    "path": "../public/_nuxt/useAdmin.a631a3bc.js"
  },
  "/_nuxt/useAuth.69ec0df0.js": {
    "type": "application/javascript",
    "etag": "\"c28-37Vg9rElmumvSk4VDO6S2l4keJY\"",
    "mtime": "2023-08-27T06:11:18.537Z",
    "size": 3112,
    "path": "../public/_nuxt/useAuth.69ec0df0.js"
  },
  "/_nuxt/useChat.a71d49bd.js": {
    "type": "application/javascript",
    "etag": "\"72f2-OggrFqbnAyUAa5qNYQ58HGSeUFo\"",
    "mtime": "2023-08-27T06:11:18.537Z",
    "size": 29426,
    "path": "../public/_nuxt/useChat.a71d49bd.js"
  },
  "/_nuxt/useTitle.85d9b5f6.js": {
    "type": "application/javascript",
    "etag": "\"9f-J41LxzebDmZ1eaYZgaB8lIFLkoA\"",
    "mtime": "2023-08-27T06:11:18.528Z",
    "size": 159,
    "path": "../public/_nuxt/useTitle.85d9b5f6.js"
  },
  "/_nuxt/_conv_.7c894ef9.js": {
    "type": "application/javascript",
    "etag": "\"36b-anBNcovN6A96XLgE+YrOVi5s0dU\"",
    "mtime": "2023-08-27T06:11:18.514Z",
    "size": 875,
    "path": "../public/_nuxt/_conv_.7c894ef9.js"
  },
  "/_nuxt/_Uint8Array.8669c32a.js": {
    "type": "application/javascript",
    "etag": "\"11d7-nTKj3/cL7KWA938QmM1iwNiHSDQ\"",
    "mtime": "2023-08-27T06:11:18.516Z",
    "size": 4567,
    "path": "../public/_nuxt/_Uint8Array.8669c32a.js"
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
