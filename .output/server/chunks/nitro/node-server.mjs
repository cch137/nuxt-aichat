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
  "/_nuxt/cch137.a24073c4.js": {
    "type": "application/javascript",
    "etag": "\"919-GQD4l3RSFqZte7h6kaHF0Tkee+Y\"",
    "mtime": "2023-07-27T13:29:11.146Z",
    "size": 2329,
    "path": "../public/_nuxt/cch137.a24073c4.js"
  },
  "/_nuxt/chat.01de9944.js": {
    "type": "application/javascript",
    "etag": "\"1b9-H5NPIgAru+gO3BQMqq1HyAV6S4k\"",
    "mtime": "2023-07-27T13:29:11.153Z",
    "size": 441,
    "path": "../public/_nuxt/chat.01de9944.js"
  },
  "/_nuxt/chat.485d02d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d32-KHParXe3cWc34Z5Hw2v1s062P1g\"",
    "mtime": "2023-07-27T13:29:11.128Z",
    "size": 15666,
    "path": "../public/_nuxt/chat.485d02d3.css"
  },
  "/_nuxt/chat.e8430552.js": {
    "type": "application/javascript",
    "etag": "\"c74d-E9AONaldOgV5lD/yag1c9U/7Hic\"",
    "mtime": "2023-07-27T13:29:11.175Z",
    "size": 51021,
    "path": "../public/_nuxt/chat.e8430552.js"
  },
  "/_nuxt/ChatCore.5475b719.js": {
    "type": "application/javascript",
    "etag": "\"c397-No0UKQkwWrNU7nlJ6djjTmt/G6A\"",
    "mtime": "2023-07-27T13:29:11.182Z",
    "size": 50071,
    "path": "../public/_nuxt/ChatCore.5475b719.js"
  },
  "/_nuxt/ChatCore.bdaff30b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"141e-PdCNS4NwXIIeGluVN2HMOQHePvw\"",
    "mtime": "2023-07-27T13:29:11.128Z",
    "size": 5150,
    "path": "../public/_nuxt/ChatCore.bdaff30b.css"
  },
  "/_nuxt/client-only.4ee4f9e0.js": {
    "type": "application/javascript",
    "etag": "\"1d5-WYUUhSxRHKwNW04MvKk2J87+oIY\"",
    "mtime": "2023-07-27T13:29:11.148Z",
    "size": 469,
    "path": "../public/_nuxt/client-only.4ee4f9e0.js"
  },
  "/_nuxt/default.1bec8e66.js": {
    "type": "application/javascript",
    "etag": "\"506-XXEXmYDBWl3wlR4Z9NaPHMEIgyM\"",
    "mtime": "2023-07-27T13:29:11.177Z",
    "size": 1286,
    "path": "../public/_nuxt/default.1bec8e66.js"
  },
  "/_nuxt/default.d7a2342f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11f-0FIGIyc6NoHUcrNA96+d1T3SmJQ\"",
    "mtime": "2023-07-27T13:29:11.128Z",
    "size": 287,
    "path": "../public/_nuxt/default.d7a2342f.css"
  },
  "/_nuxt/DiscordIconSvg.7f557191.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"56-Xwz3l7IsU3LtYDVi5faRHKcUcZo\"",
    "mtime": "2023-07-27T13:29:11.130Z",
    "size": 86,
    "path": "../public/_nuxt/DiscordIconSvg.7f557191.css"
  },
  "/_nuxt/DiscordIconSvg.93568233.js": {
    "type": "application/javascript",
    "etag": "\"13fb-e9zzzWGTZPQS4Eq/66dGfJrizCI\"",
    "mtime": "2023-07-27T13:29:11.175Z",
    "size": 5115,
    "path": "../public/_nuxt/DiscordIconSvg.93568233.js"
  },
  "/_nuxt/el-button.2689f638.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d33-RzIPFKzgWgJB1bVDsB1E+qI9A3Y\"",
    "mtime": "2023-07-27T13:29:11.131Z",
    "size": 15667,
    "path": "../public/_nuxt/el-button.2689f638.css"
  },
  "/_nuxt/el-button.47c3f4b5.js": {
    "type": "application/javascript",
    "etag": "\"4f9a-rLQ7Uec3veExFaUPW9BMOKkZoUE\"",
    "mtime": "2023-07-27T13:29:11.172Z",
    "size": 20378,
    "path": "../public/_nuxt/el-button.47c3f4b5.js"
  },
  "/_nuxt/el-form.470d7f10.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ee8-i1iIp3kmwiTBLovIVj0WchnrDkE\"",
    "mtime": "2023-07-27T13:29:11.170Z",
    "size": 3816,
    "path": "../public/_nuxt/el-form.470d7f10.css"
  },
  "/_nuxt/el-form.7b3e6438.js": {
    "type": "application/javascript",
    "etag": "\"7d9e-ya+ynkVOEPHHjZTuX6p4LAS/RBg\"",
    "mtime": "2023-07-27T13:29:11.176Z",
    "size": 32158,
    "path": "../public/_nuxt/el-form.7b3e6438.js"
  },
  "/_nuxt/el-icon.12f2798b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e0-rUUgX55PeSysz9mOdM+T2qj0QS4\"",
    "mtime": "2023-07-27T13:29:11.128Z",
    "size": 480,
    "path": "../public/_nuxt/el-icon.12f2798b.css"
  },
  "/_nuxt/el-input.175a61bb.js": {
    "type": "application/javascript",
    "etag": "\"2c5a-QdWqv/98IkcaZO0tI1tTW7KhUug\"",
    "mtime": "2023-07-27T13:29:11.158Z",
    "size": 11354,
    "path": "../public/_nuxt/el-input.175a61bb.js"
  },
  "/_nuxt/el-input.399a025a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2fd4-GAWfCyEPNGCc+ABEB7VtuPpOCo4\"",
    "mtime": "2023-07-27T13:29:11.130Z",
    "size": 12244,
    "path": "../public/_nuxt/el-input.399a025a.css"
  },
  "/_nuxt/el-link.6d5ed28f.js": {
    "type": "application/javascript",
    "etag": "\"477-WL1aZl5MJhRqmJnOGA2sTlLSi5Y\"",
    "mtime": "2023-07-27T13:29:11.170Z",
    "size": 1143,
    "path": "../public/_nuxt/el-link.6d5ed28f.js"
  },
  "/_nuxt/el-link.d9789c6b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b4b-2nLfNoRS3IyBEXstRQu5vwaPiPg\"",
    "mtime": "2023-07-27T13:29:11.128Z",
    "size": 2891,
    "path": "../public/_nuxt/el-link.d9789c6b.css"
  },
  "/_nuxt/el-popover.40d7c6d4.js": {
    "type": "application/javascript",
    "etag": "\"1480-lnboSe3sT1ln7mIEpcoF0cK93qQ\"",
    "mtime": "2023-07-27T13:29:11.172Z",
    "size": 5248,
    "path": "../public/_nuxt/el-popover.40d7c6d4.js"
  },
  "/_nuxt/el-popover.42c2bc56.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"558-F1/tgAS2U8PplrTLocXW2lf10tg\"",
    "mtime": "2023-07-27T13:29:11.169Z",
    "size": 1368,
    "path": "../public/_nuxt/el-popover.42c2bc56.css"
  },
  "/_nuxt/el-popper.9c4fdb76.js": {
    "type": "application/javascript",
    "etag": "\"a0e1-3iiVXI5Y82f0yOwBBsg4MBFdHbw\"",
    "mtime": "2023-07-27T13:29:11.172Z",
    "size": 41185,
    "path": "../public/_nuxt/el-popper.9c4fdb76.js"
  },
  "/_nuxt/el-popper.dad3b842.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1fbe-qp0MxgA77YRDjluWnovK6RmlVuo\"",
    "mtime": "2023-07-27T13:29:11.134Z",
    "size": 8126,
    "path": "../public/_nuxt/el-popper.dad3b842.css"
  },
  "/_nuxt/el-select.6bb28600.js": {
    "type": "application/javascript",
    "etag": "\"9b3c-FGuUBBFN38/h2VJFoEL3FebYYK0\"",
    "mtime": "2023-07-27T13:29:11.178Z",
    "size": 39740,
    "path": "../public/_nuxt/el-select.6bb28600.js"
  },
  "/_nuxt/el-select.7a020f23.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2afe-/xBmWyYeNDbXyHf940VmXlVVKWA\"",
    "mtime": "2023-07-27T13:29:11.128Z",
    "size": 11006,
    "path": "../public/_nuxt/el-select.7a020f23.css"
  },
  "/_nuxt/el-switch.30282592.js": {
    "type": "application/javascript",
    "etag": "\"13a8-XBZL6xHEqZSbafichOxHGNolMxg\"",
    "mtime": "2023-07-27T13:29:11.172Z",
    "size": 5032,
    "path": "../public/_nuxt/el-switch.30282592.js"
  },
  "/_nuxt/el-switch.e0856ead.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f4e-7KHKfELgm39cYdoek67imGgUGjc\"",
    "mtime": "2023-07-27T13:29:11.128Z",
    "size": 3918,
    "path": "../public/_nuxt/el-switch.e0856ead.css"
  },
  "/_nuxt/el-text.19af0ef5.js": {
    "type": "application/javascript",
    "etag": "\"303-feSp3kNRGdpLtWbPfDfgj5o83Ds\"",
    "mtime": "2023-07-27T13:29:11.177Z",
    "size": 771,
    "path": "../public/_nuxt/el-text.19af0ef5.js"
  },
  "/_nuxt/el-text.7dc6a0f8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b8-ilGyRmsxar56yv5WdPXI1YlRsU4\"",
    "mtime": "2023-07-27T13:29:11.134Z",
    "size": 952,
    "path": "../public/_nuxt/el-text.7dc6a0f8.css"
  },
  "/_nuxt/entrance.8d2ed71b.js": {
    "type": "application/javascript",
    "etag": "\"4ba-M7+pZfhaglcI3zCpF4FD0m2E61Y\"",
    "mtime": "2023-07-27T13:29:11.165Z",
    "size": 1210,
    "path": "../public/_nuxt/entrance.8d2ed71b.js"
  },
  "/_nuxt/entry.61a62f8e.js": {
    "type": "application/javascript",
    "etag": "\"58b98-JD0VJnw4adQoiDjiYM2bRz/7VvA\"",
    "mtime": "2023-07-27T13:29:11.155Z",
    "size": 363416,
    "path": "../public/_nuxt/entry.61a62f8e.js"
  },
  "/_nuxt/entry.93f706ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4f993-92TxeLc3GE4cmF9kB1JHtajaXSo\"",
    "mtime": "2023-07-27T13:29:11.117Z",
    "size": 326035,
    "path": "../public/_nuxt/entry.93f706ce.css"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-07-27T13:29:11.133Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.40995d07.js": {
    "type": "application/javascript",
    "etag": "\"8d1-vEsOxQfzalePoTe4CwqtTmxumB0\"",
    "mtime": "2023-07-27T13:29:11.172Z",
    "size": 2257,
    "path": "../public/_nuxt/error-404.40995d07.js"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-07-27T13:29:11.137Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.d753897d.js": {
    "type": "application/javascript",
    "etag": "\"75a-YihYYOmyDLcvt239xFxtnyQyjo0\"",
    "mtime": "2023-07-27T13:29:11.173Z",
    "size": 1882,
    "path": "../public/_nuxt/error-500.d753897d.js"
  },
  "/_nuxt/error-component.aa172923.js": {
    "type": "application/javascript",
    "etag": "\"478-GybH5RuS7dhGVhDP3x1PMfu/sTE\"",
    "mtime": "2023-07-27T13:29:11.148Z",
    "size": 1144,
    "path": "../public/_nuxt/error-component.aa172923.js"
  },
  "/_nuxt/focus-trap.80819230.js": {
    "type": "application/javascript",
    "etag": "\"1505-YPh3jyqcQT6D7L3VjBmZWM46img\"",
    "mtime": "2023-07-27T13:29:11.148Z",
    "size": 5381,
    "path": "../public/_nuxt/focus-trap.80819230.js"
  },
  "/_nuxt/index.03fea966.js": {
    "type": "application/javascript",
    "etag": "\"2ce-zW6MQg+zm8CpGFNdToUAogISrzo\"",
    "mtime": "2023-07-27T13:29:11.148Z",
    "size": 718,
    "path": "../public/_nuxt/index.03fea966.js"
  },
  "/_nuxt/index.9fdd92dc.js": {
    "type": "application/javascript",
    "etag": "\"27b-2L6g09ZqhEbL/K0/oZTIbOIteNk\"",
    "mtime": "2023-07-27T13:29:11.154Z",
    "size": 635,
    "path": "../public/_nuxt/index.9fdd92dc.js"
  },
  "/_nuxt/isEqual.52a1ec36.js": {
    "type": "application/javascript",
    "etag": "\"1eba-8ci1yvzNsyH9gl27ojIZCVpyowg\"",
    "mtime": "2023-07-27T13:29:11.148Z",
    "size": 7866,
    "path": "../public/_nuxt/isEqual.52a1ec36.js"
  },
  "/_nuxt/login.2009a013.js": {
    "type": "application/javascript",
    "etag": "\"cb2-4dAdEyo5VOpt2Qz5L7/COyYJ+ZU\"",
    "mtime": "2023-07-27T13:29:11.172Z",
    "size": 3250,
    "path": "../public/_nuxt/login.2009a013.js"
  },
  "/_nuxt/login.7707bf7b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c5-RG1RUCT5lzjhK6LVE/uMACFXHrM\"",
    "mtime": "2023-07-27T13:29:11.128Z",
    "size": 709,
    "path": "../public/_nuxt/login.7707bf7b.css"
  },
  "/_nuxt/nuxt-link.75047665.js": {
    "type": "application/javascript",
    "etag": "\"10ed-jRww0XgFyNYwLFeQuF8T3KijP6E\"",
    "mtime": "2023-07-27T13:29:11.148Z",
    "size": 4333,
    "path": "../public/_nuxt/nuxt-link.75047665.js"
  },
  "/_nuxt/onlyNoAuth.21c2fff8.js": {
    "type": "application/javascript",
    "etag": "\"19c-5TcV/w3wK5vtKCp+LlKHGducIUU\"",
    "mtime": "2023-07-27T13:29:11.146Z",
    "size": 412,
    "path": "../public/_nuxt/onlyNoAuth.21c2fff8.js"
  },
  "/_nuxt/perspective.2a33310e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c58-K9HPWUhhXJZSxJWKkz1nlIL+lkQ\"",
    "mtime": "2023-07-27T13:29:11.128Z",
    "size": 11352,
    "path": "../public/_nuxt/perspective.2a33310e.css"
  },
  "/_nuxt/perspective.9df34dd1.js": {
    "type": "application/javascript",
    "etag": "\"a24c-e+oA7eYgf0Saqj2VzDKB8QOyO3k\"",
    "mtime": "2023-07-27T13:29:11.177Z",
    "size": 41548,
    "path": "../public/_nuxt/perspective.9df34dd1.js"
  },
  "/_nuxt/scroll.c326ab84.js": {
    "type": "application/javascript",
    "etag": "\"4a6-iMx4lYx74jwxHo7jHQtWjMq/WXA\"",
    "mtime": "2023-07-27T13:29:11.147Z",
    "size": 1190,
    "path": "../public/_nuxt/scroll.c326ab84.js"
  },
  "/_nuxt/signup.57439420.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2cd-ykzE3D7J8on6MCCO6QyxHOWuhuI\"",
    "mtime": "2023-07-27T13:29:11.128Z",
    "size": 717,
    "path": "../public/_nuxt/signup.57439420.css"
  },
  "/_nuxt/signup.ea95ee0a.js": {
    "type": "application/javascript",
    "etag": "\"1a0a-yHG+KUPpWRpsQkOywXdR3sLLveo\"",
    "mtime": "2023-07-27T13:29:11.172Z",
    "size": 6666,
    "path": "../public/_nuxt/signup.ea95ee0a.js"
  },
  "/_nuxt/useAdmin.0de966ba.js": {
    "type": "application/javascript",
    "etag": "\"1f0-gB6BJggi5rfP+HQblqZyVOuRv9M\"",
    "mtime": "2023-07-27T13:29:11.152Z",
    "size": 496,
    "path": "../public/_nuxt/useAdmin.0de966ba.js"
  },
  "/_nuxt/useAuth.0b3f4ba8.js": {
    "type": "application/javascript",
    "etag": "\"484-nSxcB17wgR3g1HpnCdF0LvVMvco\"",
    "mtime": "2023-07-27T13:29:11.152Z",
    "size": 1156,
    "path": "../public/_nuxt/useAuth.0b3f4ba8.js"
  },
  "/_nuxt/useChat.991920c1.js": {
    "type": "application/javascript",
    "etag": "\"9518-yYZFKAMRVEVfHJ2NmEMaNOXZZZo\"",
    "mtime": "2023-07-27T13:29:11.174Z",
    "size": 38168,
    "path": "../public/_nuxt/useChat.991920c1.js"
  },
  "/_nuxt/useChat.adec720f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14a9-S5SbV5gD5xWhD5fPG/Pul9XX7VQ\"",
    "mtime": "2023-07-27T13:29:11.129Z",
    "size": 5289,
    "path": "../public/_nuxt/useChat.adec720f.css"
  },
  "/_nuxt/useTitle.769c3c51.js": {
    "type": "application/javascript",
    "etag": "\"a0-aChbei+Uszoz7kY5mmzMwfoOJMg\"",
    "mtime": "2023-07-27T13:29:11.147Z",
    "size": 160,
    "path": "../public/_nuxt/useTitle.769c3c51.js"
  },
  "/_nuxt/_conv_.ebadf2b4.js": {
    "type": "application/javascript",
    "etag": "\"2cb-c6gcVaP66yX3plgcD7Pl9HdI/3k\"",
    "mtime": "2023-07-27T13:29:11.148Z",
    "size": 715,
    "path": "../public/_nuxt/_conv_.ebadf2b4.js"
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
const _lazy_187dFF = () => import('../replaceUser.post.mjs');
const _lazy_Il2qtI = () => import('../resendCode.post.mjs');
const _lazy_xqtLlJ = () => import('../signup.post.mjs');
const _lazy_vz2JyP = () => import('../answer.delete.mjs');
const _lazy_HX9str = () => import('../answer.post.mjs');
const _lazy_MlSQ7L = () => import('../check.post2.mjs');
const _lazy_wX8L45 = () => import('../conv.delete.mjs');
const _lazy_oaQnKo = () => import('../conv.put.mjs');
const _lazy_xyzH6i = () => import('../history.post.mjs');
const _lazy_ibkWJX = () => import('../suggestions.post.mjs');
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
