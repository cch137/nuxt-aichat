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

const plugins = [
  
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
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
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
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(await res.text());
});

const assets = {
  "/curva_favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"7d26-V6y7wATsXG8KebK8Ckq/ON41mn4\"",
    "mtime": "2023-06-04T04:27:44.484Z",
    "size": 32038,
    "path": "../public/curva_favicon.ico"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"7d26-UhUNCz6v/vGTOfHEATYsYktF31E\"",
    "mtime": "2023-06-16T12:55:46.365Z",
    "size": 32038,
    "path": "../public/favicon.ico"
  },
  "/_favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"7d26-msK/5wOlQI+ENfzUn8FM3lri6b8\"",
    "mtime": "2023-05-16T04:27:07.194Z",
    "size": 32038,
    "path": "../public/_favicon.ico"
  },
  "/_nuxt/cch137.be1fe102.js": {
    "type": "application/javascript",
    "etag": "\"1d57-a++Zjhqoc/X2wWCzN19N9RM99Wk\"",
    "mtime": "2023-06-18T08:38:10.679Z",
    "size": 7511,
    "path": "../public/_nuxt/cch137.be1fe102.js"
  },
  "/_nuxt/cch137.e0856ead.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f4e-7KHKfELgm39cYdoek67imGgUGjc\"",
    "mtime": "2023-06-18T08:38:10.567Z",
    "size": 3918,
    "path": "../public/_nuxt/cch137.e0856ead.css"
  },
  "/_nuxt/chat.035c5705.js": {
    "type": "application/javascript",
    "etag": "\"cfba-c/6I+pBx9Uz1GAXIlPNqntNFDFg\"",
    "mtime": "2023-06-18T08:38:10.740Z",
    "size": 53178,
    "path": "../public/_nuxt/chat.035c5705.js"
  },
  "/_nuxt/chat.68cc121c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3ff3-C8YH7KllNrnbzoAhDxintYM9/U0\"",
    "mtime": "2023-06-18T08:38:10.570Z",
    "size": 16371,
    "path": "../public/_nuxt/chat.68cc121c.css"
  },
  "/_nuxt/chat.7591f631.js": {
    "type": "application/javascript",
    "etag": "\"19c-nSmOAOTC25m16dUqz/bK7a0Cu4E\"",
    "mtime": "2023-06-18T08:38:10.672Z",
    "size": 412,
    "path": "../public/_nuxt/chat.7591f631.js"
  },
  "/_nuxt/ChatCore.ab45c950.js": {
    "type": "application/javascript",
    "etag": "\"c3a2-f4UY4CnlwCSQL7aDSbI1IE3N03c\"",
    "mtime": "2023-06-18T08:38:10.786Z",
    "size": 50082,
    "path": "../public/_nuxt/ChatCore.ab45c950.js"
  },
  "/_nuxt/ChatCore.bdaff30b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"141e-PdCNS4NwXIIeGluVN2HMOQHePvw\"",
    "mtime": "2023-06-18T08:38:10.570Z",
    "size": 5150,
    "path": "../public/_nuxt/ChatCore.bdaff30b.css"
  },
  "/_nuxt/client-only.f487ec80.js": {
    "type": "application/javascript",
    "etag": "\"1d4-SxlZjKl9aUczNt1Y2PChicp9mX8\"",
    "mtime": "2023-06-18T08:38:10.673Z",
    "size": 468,
    "path": "../public/_nuxt/client-only.f487ec80.js"
  },
  "/_nuxt/default.7bb7b882.js": {
    "type": "application/javascript",
    "etag": "\"4e9-CLHLlGmpPoSx3bFrXpjsvyfacfw\"",
    "mtime": "2023-06-18T08:38:10.673Z",
    "size": 1257,
    "path": "../public/_nuxt/default.7bb7b882.js"
  },
  "/_nuxt/default.d7a2342f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11f-0FIGIyc6NoHUcrNA96+d1T3SmJQ\"",
    "mtime": "2023-06-18T08:38:10.572Z",
    "size": 287,
    "path": "../public/_nuxt/default.d7a2342f.css"
  },
  "/_nuxt/DiscordIconSvg.4299ddc0.js": {
    "type": "application/javascript",
    "etag": "\"13f6-gy+MNkk1JQVkDJxW/9PA6kB07gI\"",
    "mtime": "2023-06-18T08:38:10.739Z",
    "size": 5110,
    "path": "../public/_nuxt/DiscordIconSvg.4299ddc0.js"
  },
  "/_nuxt/DiscordIconSvg.7f557191.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"56-Xwz3l7IsU3LtYDVi5faRHKcUcZo\"",
    "mtime": "2023-06-18T08:38:10.580Z",
    "size": 86,
    "path": "../public/_nuxt/DiscordIconSvg.7f557191.css"
  },
  "/_nuxt/el-button.2689f638.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d33-RzIPFKzgWgJB1bVDsB1E+qI9A3Y\"",
    "mtime": "2023-06-18T08:38:10.572Z",
    "size": 15667,
    "path": "../public/_nuxt/el-button.2689f638.css"
  },
  "/_nuxt/el-button.b6a7aac3.js": {
    "type": "application/javascript",
    "etag": "\"4f8d-6nZi1OizpKxZI6cgSiZU8wfRPxo\"",
    "mtime": "2023-06-18T08:38:10.686Z",
    "size": 20365,
    "path": "../public/_nuxt/el-button.b6a7aac3.js"
  },
  "/_nuxt/el-form.470d7f10.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ee8-i1iIp3kmwiTBLovIVj0WchnrDkE\"",
    "mtime": "2023-06-18T08:38:10.571Z",
    "size": 3816,
    "path": "../public/_nuxt/el-form.470d7f10.css"
  },
  "/_nuxt/el-form.c026d687.js": {
    "type": "application/javascript",
    "etag": "\"7d99-KGPony7mjETqqyzU27asY3Tb65o\"",
    "mtime": "2023-06-18T08:38:10.698Z",
    "size": 32153,
    "path": "../public/_nuxt/el-form.c026d687.js"
  },
  "/_nuxt/el-icon.12f2798b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e0-rUUgX55PeSysz9mOdM+T2qj0QS4\"",
    "mtime": "2023-06-18T08:38:10.571Z",
    "size": 480,
    "path": "../public/_nuxt/el-icon.12f2798b.css"
  },
  "/_nuxt/el-input.399a025a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2fd4-GAWfCyEPNGCc+ABEB7VtuPpOCo4\"",
    "mtime": "2023-06-18T08:38:10.572Z",
    "size": 12244,
    "path": "../public/_nuxt/el-input.399a025a.css"
  },
  "/_nuxt/el-input.c6bfcfd5.js": {
    "type": "application/javascript",
    "etag": "\"30d4-EXhEw5Pj4lPB++UvZC6tJMAqpJA\"",
    "mtime": "2023-06-18T08:38:10.685Z",
    "size": 12500,
    "path": "../public/_nuxt/el-input.c6bfcfd5.js"
  },
  "/_nuxt/el-link.250e5da2.js": {
    "type": "application/javascript",
    "etag": "\"472-9mPLjhztUgMdDMbZRrgsjrq0c9I\"",
    "mtime": "2023-06-18T08:38:10.698Z",
    "size": 1138,
    "path": "../public/_nuxt/el-link.250e5da2.js"
  },
  "/_nuxt/el-link.d9789c6b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b4b-2nLfNoRS3IyBEXstRQu5vwaPiPg\"",
    "mtime": "2023-06-18T08:38:10.613Z",
    "size": 2891,
    "path": "../public/_nuxt/el-link.d9789c6b.css"
  },
  "/_nuxt/el-popover.42c2bc56.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"558-F1/tgAS2U8PplrTLocXW2lf10tg\"",
    "mtime": "2023-06-18T08:38:10.570Z",
    "size": 1368,
    "path": "../public/_nuxt/el-popover.42c2bc56.css"
  },
  "/_nuxt/el-popover.a6668741.js": {
    "type": "application/javascript",
    "etag": "\"1484-YEA7s/EPCYx7GF/AJeRe8a/ny9o\"",
    "mtime": "2023-06-18T08:38:10.698Z",
    "size": 5252,
    "path": "../public/_nuxt/el-popover.a6668741.js"
  },
  "/_nuxt/el-popper.d9f8bb24.js": {
    "type": "application/javascript",
    "etag": "\"a0d7-NfwPtJ9FXDAxes5IZ1xoIH2yUgg\"",
    "mtime": "2023-06-18T08:38:10.698Z",
    "size": 41175,
    "path": "../public/_nuxt/el-popper.d9f8bb24.js"
  },
  "/_nuxt/el-popper.dad3b842.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1fbe-qp0MxgA77YRDjluWnovK6RmlVuo\"",
    "mtime": "2023-06-18T08:38:10.572Z",
    "size": 8126,
    "path": "../public/_nuxt/el-popper.dad3b842.css"
  },
  "/_nuxt/el-select.7a020f23.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2afe-/xBmWyYeNDbXyHf940VmXlVVKWA\"",
    "mtime": "2023-06-18T08:38:10.571Z",
    "size": 11006,
    "path": "../public/_nuxt/el-select.7a020f23.css"
  },
  "/_nuxt/el-select.a8036333.js": {
    "type": "application/javascript",
    "etag": "\"9b0f-OKq8pv5SFkVAh0pvYb6B07Qjwvo\"",
    "mtime": "2023-06-18T08:38:10.698Z",
    "size": 39695,
    "path": "../public/_nuxt/el-select.a8036333.js"
  },
  "/_nuxt/el-text.775813df.js": {
    "type": "application/javascript",
    "etag": "\"2ff-c4v/BGsEBxYdgjKmM+gKs1NlFxA\"",
    "mtime": "2023-06-18T08:38:10.698Z",
    "size": 767,
    "path": "../public/_nuxt/el-text.775813df.js"
  },
  "/_nuxt/el-text.7dc6a0f8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b8-ilGyRmsxar56yv5WdPXI1YlRsU4\"",
    "mtime": "2023-06-18T08:38:10.572Z",
    "size": 952,
    "path": "../public/_nuxt/el-text.7dc6a0f8.css"
  },
  "/_nuxt/entry.6021dbec.js": {
    "type": "application/javascript",
    "etag": "\"5863e-KSeHRPu2VgHaYD7fe8SZDSxkz/s\"",
    "mtime": "2023-06-18T08:38:10.699Z",
    "size": 362046,
    "path": "../public/_nuxt/entry.6021dbec.js"
  },
  "/_nuxt/entry.93f706ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f993-92TxeLc3GE4cmF9kB1JHtajaXSo\"",
    "mtime": "2023-06-18T08:38:10.588Z",
    "size": 326035,
    "path": "../public/_nuxt/entry.93f706ce.css"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-06-18T08:38:10.581Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.d597cb1b.js": {
    "type": "application/javascript",
    "etag": "\"8d6-b2qybic10Ox+PKBspwzawdRTViA\"",
    "mtime": "2023-06-18T08:38:10.678Z",
    "size": 2262,
    "path": "../public/_nuxt/error-404.d597cb1b.js"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-06-18T08:38:10.672Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.e33bbd3b.js": {
    "type": "application/javascript",
    "etag": "\"75a-4DIta7iMLVuIzJ7JzBSUhKRzzQM\"",
    "mtime": "2023-06-18T08:38:10.674Z",
    "size": 1882,
    "path": "../public/_nuxt/error-500.e33bbd3b.js"
  },
  "/_nuxt/error-component.37fb8599.js": {
    "type": "application/javascript",
    "etag": "\"478-QGi60SNiWCaq5EC2SWYdM1xw59U\"",
    "mtime": "2023-06-18T08:38:10.672Z",
    "size": 1144,
    "path": "../public/_nuxt/error-component.37fb8599.js"
  },
  "/_nuxt/focus-trap.a7143051.js": {
    "type": "application/javascript",
    "etag": "\"1501-sb7RktzaFOgIA4/BZjUBMDtKj8Y\"",
    "mtime": "2023-06-18T08:38:10.672Z",
    "size": 5377,
    "path": "../public/_nuxt/focus-trap.a7143051.js"
  },
  "/_nuxt/index.492f7154.js": {
    "type": "application/javascript",
    "etag": "\"27b-USdZf8OXj8P/fGR96wBgKmaMb+U\"",
    "mtime": "2023-06-18T08:38:10.673Z",
    "size": 635,
    "path": "../public/_nuxt/index.492f7154.js"
  },
  "/_nuxt/index.4cfb1958.js": {
    "type": "application/javascript",
    "etag": "\"277-RhnrPf3E1P7ISaksUlVaPE1B6gw\"",
    "mtime": "2023-06-18T08:38:10.673Z",
    "size": 631,
    "path": "../public/_nuxt/index.4cfb1958.js"
  },
  "/_nuxt/isEqual.ba7a6dc3.js": {
    "type": "application/javascript",
    "etag": "\"1ebd-wBh9gRiGlbS+CE2TVF4L/qLIgAg\"",
    "mtime": "2023-06-18T08:38:10.673Z",
    "size": 7869,
    "path": "../public/_nuxt/isEqual.ba7a6dc3.js"
  },
  "/_nuxt/login.7707bf7b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c5-RG1RUCT5lzjhK6LVE/uMACFXHrM\"",
    "mtime": "2023-06-18T08:38:10.570Z",
    "size": 709,
    "path": "../public/_nuxt/login.7707bf7b.css"
  },
  "/_nuxt/login.aae03491.js": {
    "type": "application/javascript",
    "etag": "\"bd7-B/XkA6hc+mhlW9XfJmGUWfSplno\"",
    "mtime": "2023-06-18T08:38:10.698Z",
    "size": 3031,
    "path": "../public/_nuxt/login.aae03491.js"
  },
  "/_nuxt/nuxt-link.0cca69d3.js": {
    "type": "application/javascript",
    "etag": "\"10ec-VioFXVSQmxOAdrgfdT1Fr/HnMBU\"",
    "mtime": "2023-06-18T08:38:10.672Z",
    "size": 4332,
    "path": "../public/_nuxt/nuxt-link.0cca69d3.js"
  },
  "/_nuxt/onlyNoAuth.99525d78.js": {
    "type": "application/javascript",
    "etag": "\"17f-mX7fUa4GThmREPXKEJrBlwTf7+Q\"",
    "mtime": "2023-06-18T08:38:10.673Z",
    "size": 383,
    "path": "../public/_nuxt/onlyNoAuth.99525d78.js"
  },
  "/_nuxt/perspective.2a33310e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c58-K9HPWUhhXJZSxJWKkz1nlIL+lkQ\"",
    "mtime": "2023-06-18T08:38:10.571Z",
    "size": 11352,
    "path": "../public/_nuxt/perspective.2a33310e.css"
  },
  "/_nuxt/perspective.c260f18e.js": {
    "type": "application/javascript",
    "etag": "\"a228-iSKF85JO+uiZz7lGVHFDn2uiHRk\"",
    "mtime": "2023-06-18T08:38:10.699Z",
    "size": 41512,
    "path": "../public/_nuxt/perspective.c260f18e.js"
  },
  "/_nuxt/signup.28e02183.js": {
    "type": "application/javascript",
    "etag": "\"192a-kxSaNJ4iwczjUKlFXF8IR3zJJz0\"",
    "mtime": "2023-06-18T08:38:10.697Z",
    "size": 6442,
    "path": "../public/_nuxt/signup.28e02183.js"
  },
  "/_nuxt/signup.57439420.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2cd-ykzE3D7J8on6MCCO6QyxHOWuhuI\"",
    "mtime": "2023-06-18T08:38:10.613Z",
    "size": 717,
    "path": "../public/_nuxt/signup.57439420.css"
  },
  "/_nuxt/useAuth.6f87f240.js": {
    "type": "application/javascript",
    "etag": "\"48a-V0GLEUfXNOnxa7BQtN7sx9qaWok\"",
    "mtime": "2023-06-18T08:38:10.673Z",
    "size": 1162,
    "path": "../public/_nuxt/useAuth.6f87f240.js"
  },
  "/_nuxt/useChat.34e10ef1.js": {
    "type": "application/javascript",
    "etag": "\"9537-nwSaKtoARCOYVjiU6fhcbafZ4yE\"",
    "mtime": "2023-06-18T08:38:10.697Z",
    "size": 38199,
    "path": "../public/_nuxt/useChat.34e10ef1.js"
  },
  "/_nuxt/useChat.adec720f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14a9-S5SbV5gD5xWhD5fPG/Pul9XX7VQ\"",
    "mtime": "2023-06-18T08:38:10.572Z",
    "size": 5289,
    "path": "../public/_nuxt/useChat.adec720f.css"
  },
  "/_nuxt/useTitle.a08f3ffa.js": {
    "type": "application/javascript",
    "etag": "\"a0-ilBsEARsgzP0HpkSjXh+CP3tu4U\"",
    "mtime": "2023-06-18T08:38:10.672Z",
    "size": 160,
    "path": "../public/_nuxt/useTitle.a08f3ffa.js"
  },
  "/_nuxt/_conv_.15b5fd5e.js": {
    "type": "application/javascript",
    "etag": "\"274-0ygjbxBHdB+1eZ7tXyydkmScefM\"",
    "mtime": "2023-06-18T08:38:10.673Z",
    "size": 628,
    "path": "../public/_nuxt/_conv_.15b5fd5e.js"
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
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.node.res.statusCode = 304;
    event.node.res.end();
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

const _lazy_15AZZ1 = () => import('../admin.post.mjs');
const _lazy_UScdIi = () => import('../check.post.mjs');
const _lazy_PBkD23 = () => import('../createVerification.post.mjs');
const _lazy_XyTMnn = () => import('../login.post.mjs');
const _lazy_xfmW64 = () => import('../logout.post.mjs');
const _lazy_Il2qtI = () => import('../resendCode.post.mjs');
const _lazy_xqtLlJ = () => import('../signup.post.mjs');
const _lazy_hmNSIc = () => import('../answer.delete.mjs');
const _lazy_nbR6EH = () => import('../answer.post.mjs');
const _lazy_iIjLLL = () => import('../check.post2.mjs');
const _lazy_WQhk2h = () => import('../conv.delete.mjs');
const _lazy_n1prk2 = () => import('../conv.put.mjs');
const _lazy_zCNp2k = () => import('../history.post.mjs');
const _lazy_DdAGHJ = () => import('../suggestions.post.mjs');
const _lazy_lDI6X5 = () => import('../scrape.mjs');
const _lazy_aw3WVN = () => import('../summarize.mjs');
const _lazy_36o9OA = () => import('../discord.mjs');
const _lazy_SrvWlI = () => import('../memory.mjs');
const _lazy_kSCyCm = () => import('../keys.mjs');
const _lazy_QcObDY = () => import('../messages.mjs');
const _lazy_D0mNky = () => import('../tree.mjs');
const _lazy_DkND8F = () => import('../check.post3.mjs');
const _lazy_exrXwu = () => import('../translate.mjs');
const _lazy_EcMGl8 = () => import('../user.post.mjs');
const _lazy_MNfkmp = () => import('../version.mjs');
const _lazy_G40W9i = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin', handler: _lazy_15AZZ1, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/check', handler: _lazy_UScdIi, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/createVerification', handler: _lazy_PBkD23, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_XyTMnn, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_xfmW64, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/resendCode', handler: _lazy_Il2qtI, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/signup', handler: _lazy_xqtLlJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/answer', handler: _lazy_hmNSIc, lazy: true, middleware: false, method: "delete" },
  { route: '/api/chat/answer', handler: _lazy_nbR6EH, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/check', handler: _lazy_iIjLLL, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/conv', handler: _lazy_WQhk2h, lazy: true, middleware: false, method: "delete" },
  { route: '/api/chat/conv', handler: _lazy_n1prk2, lazy: true, middleware: false, method: "put" },
  { route: '/api/chat/history', handler: _lazy_zCNp2k, lazy: true, middleware: false, method: "post" },
  { route: '/api/chat/suggestions', handler: _lazy_DdAGHJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/crawler/scrape', handler: _lazy_lDI6X5, lazy: true, middleware: false, method: undefined },
  { route: '/api/crawler/summarize', handler: _lazy_aw3WVN, lazy: true, middleware: false, method: undefined },
  { route: '/api/discord', handler: _lazy_36o9OA, lazy: true, middleware: false, method: undefined },
  { route: '/api/memory', handler: _lazy_SrvWlI, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/keys', handler: _lazy_kSCyCm, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/messages', handler: _lazy_QcObDY, lazy: true, middleware: false, method: undefined },
  { route: '/api/perspective/tree', handler: _lazy_D0mNky, lazy: true, middleware: false, method: undefined },
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
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: $fetch });
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
  h3App.use(config.app.baseURL, router);
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

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
