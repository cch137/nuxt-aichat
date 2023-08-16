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
    "mtime": "2023-08-16T11:26:47.919Z",
    "size": 17304,
    "path": "../public/_nuxt/cch137.57bac52a.css"
  },
  "/_nuxt/cch137.fc1badb2.js": {
    "type": "application/javascript",
    "etag": "\"123cc-Y2oefDqZ2NsL18I+iiAcql//DpY\"",
    "mtime": "2023-08-16T11:26:47.984Z",
    "size": 74700,
    "path": "../public/_nuxt/cch137.fc1badb2.js"
  },
  "/_nuxt/chat.44a9fa9e.js": {
    "type": "application/javascript",
    "etag": "\"8ddb-Bm4bliramqZ8K0BKZPhjucm4BJ0\"",
    "mtime": "2023-08-16T11:26:48.000Z",
    "size": 36315,
    "path": "../public/_nuxt/chat.44a9fa9e.js"
  },
  "/_nuxt/chat.abac050a.js": {
    "type": "application/javascript",
    "etag": "\"1f4-RFJ8xJt4ccM1rJc6l50FMVMxTzQ\"",
    "mtime": "2023-08-16T11:26:47.952Z",
    "size": 500,
    "path": "../public/_nuxt/chat.abac050a.js"
  },
  "/_nuxt/chat.e6904fb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2364-MyzTG8baUJ3iFRn/RxnHt2dhuFg\"",
    "mtime": "2023-08-16T11:26:47.919Z",
    "size": 9060,
    "path": "../public/_nuxt/chat.e6904fb8.css"
  },
  "/_nuxt/client-only.e7cce59c.js": {
    "type": "application/javascript",
    "etag": "\"1d5-1BxXOLqPZhuuHn3Vs2rfv6s65gw\"",
    "mtime": "2023-08-16T11:26:47.936Z",
    "size": 469,
    "path": "../public/_nuxt/client-only.e7cce59c.js"
  },
  "/_nuxt/CommonSettings.d68cde7c.js": {
    "type": "application/javascript",
    "etag": "\"46c-lCQv9gmgLYBeKO6/WG9gfA5MhCA\"",
    "mtime": "2023-08-16T11:26:47.936Z",
    "size": 1132,
    "path": "../public/_nuxt/CommonSettings.d68cde7c.js"
  },
  "/_nuxt/ConvMain.3e549d46.js": {
    "type": "application/javascript",
    "etag": "\"bf20-GSx3zuudbLDB8PLGbOSUTBEltPg\"",
    "mtime": "2023-08-16T11:26:47.962Z",
    "size": 48928,
    "path": "../public/_nuxt/ConvMain.3e549d46.js"
  },
  "/_nuxt/ConvMain.ada050bd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"156a-7j7q1eN2Q8g0XwAoPzJHfEd2FZc\"",
    "mtime": "2023-08-16T11:26:47.919Z",
    "size": 5482,
    "path": "../public/_nuxt/ConvMain.ada050bd.css"
  },
  "/_nuxt/default.39fe3d1b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9e-rI+KacqkCoZvi4kBvOhWmhC7LL0\"",
    "mtime": "2023-08-16T11:26:47.920Z",
    "size": 158,
    "path": "../public/_nuxt/default.39fe3d1b.css"
  },
  "/_nuxt/default.5bad2c8b.js": {
    "type": "application/javascript",
    "etag": "\"55d-chM/VgT3LnIhD6opSecTHFhKoeU\"",
    "mtime": "2023-08-16T11:26:47.953Z",
    "size": 1373,
    "path": "../public/_nuxt/default.5bad2c8b.js"
  },
  "/_nuxt/DefaultHeaderButtons.09b4110e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b6c-vX5oQ+HiVQTFqxoawIlFVi+onTM\"",
    "mtime": "2023-08-16T11:26:47.920Z",
    "size": 11116,
    "path": "../public/_nuxt/DefaultHeaderButtons.09b4110e.css"
  },
  "/_nuxt/DefaultHeaderButtons.32aa2def.js": {
    "type": "application/javascript",
    "etag": "\"76e2-ZG0KrD0/YqBxJXQYC0GqpfkgUvc\"",
    "mtime": "2023-08-16T11:26:48.001Z",
    "size": 30434,
    "path": "../public/_nuxt/DefaultHeaderButtons.32aa2def.js"
  },
  "/_nuxt/dropdown.129c1268.js": {
    "type": "application/javascript",
    "etag": "\"925-UpYCmIZ0D/kFiUB8HIDdzG954UI\"",
    "mtime": "2023-08-16T11:26:47.937Z",
    "size": 2341,
    "path": "../public/_nuxt/dropdown.129c1268.js"
  },
  "/_nuxt/el-button.2689f638.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d33-RzIPFKzgWgJB1bVDsB1E+qI9A3Y\"",
    "mtime": "2023-08-16T11:26:47.936Z",
    "size": 15667,
    "path": "../public/_nuxt/el-button.2689f638.css"
  },
  "/_nuxt/el-button.937a3f62.js": {
    "type": "application/javascript",
    "etag": "\"4f9c-+bbDYyFm4wtL/LbcLuxhuyQifi4\"",
    "mtime": "2023-08-16T11:26:47.961Z",
    "size": 20380,
    "path": "../public/_nuxt/el-button.937a3f62.js"
  },
  "/_nuxt/el-checkbox.7a90c4f0.js": {
    "type": "application/javascript",
    "etag": "\"2a10-1WbIUx9l+cDTmQkvS6an0K8LpZM\"",
    "mtime": "2023-08-16T11:26:47.985Z",
    "size": 10768,
    "path": "../public/_nuxt/el-checkbox.7a90c4f0.js"
  },
  "/_nuxt/el-checkbox.c7ab37fe.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1937-eRN3pgE4HTBH8Vb3NAPjUpqhuvk\"",
    "mtime": "2023-08-16T11:26:47.919Z",
    "size": 6455,
    "path": "../public/_nuxt/el-checkbox.c7ab37fe.css"
  },
  "/_nuxt/el-form.7235a9a0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f0d-qCH0MR9J+ccrp40iuwPw59h7yJI\"",
    "mtime": "2023-08-16T11:26:47.920Z",
    "size": 3853,
    "path": "../public/_nuxt/el-form.7235a9a0.css"
  },
  "/_nuxt/el-form.82526620.js": {
    "type": "application/javascript",
    "etag": "\"751f-/UH4jjgRgcRbLLF70N4vUM4LCo8\"",
    "mtime": "2023-08-16T11:26:47.968Z",
    "size": 29983,
    "path": "../public/_nuxt/el-form.82526620.js"
  },
  "/_nuxt/el-icon.12f2798b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e0-rUUgX55PeSysz9mOdM+T2qj0QS4\"",
    "mtime": "2023-08-16T11:26:47.921Z",
    "size": 480,
    "path": "../public/_nuxt/el-icon.12f2798b.css"
  },
  "/_nuxt/el-input.27303907.js": {
    "type": "application/javascript",
    "etag": "\"2ed9-On7fXrHkNQyOLUz/omibQqutCD0\"",
    "mtime": "2023-08-16T11:26:47.960Z",
    "size": 11993,
    "path": "../public/_nuxt/el-input.27303907.js"
  },
  "/_nuxt/el-input.ba3ea184.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"301d-Ay2xw3MIQP/h92WIn3IPUuqU32s\"",
    "mtime": "2023-08-16T11:26:47.936Z",
    "size": 12317,
    "path": "../public/_nuxt/el-input.ba3ea184.css"
  },
  "/_nuxt/el-link.d9789c6b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b4b-2nLfNoRS3IyBEXstRQu5vwaPiPg\"",
    "mtime": "2023-08-16T11:26:47.919Z",
    "size": 2891,
    "path": "../public/_nuxt/el-link.d9789c6b.css"
  },
  "/_nuxt/el-link.f8a4c960.js": {
    "type": "application/javascript",
    "etag": "\"478-UE9Y6eWwb7qT0gcHGgL67f1ywko\"",
    "mtime": "2023-08-16T11:26:47.956Z",
    "size": 1144,
    "path": "../public/_nuxt/el-link.f8a4c960.js"
  },
  "/_nuxt/el-overlay.8234fffe.js": {
    "type": "application/javascript",
    "etag": "\"380b-185qj6lwFAypdiC1sSCbWjNs8RM\"",
    "mtime": "2023-08-16T11:26:48.000Z",
    "size": 14347,
    "path": "../public/_nuxt/el-overlay.8234fffe.js"
  },
  "/_nuxt/el-overlay.adec720f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14a9-S5SbV5gD5xWhD5fPG/Pul9XX7VQ\"",
    "mtime": "2023-08-16T11:26:47.936Z",
    "size": 5289,
    "path": "../public/_nuxt/el-overlay.adec720f.css"
  },
  "/_nuxt/el-popover.42c2bc56.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"558-F1/tgAS2U8PplrTLocXW2lf10tg\"",
    "mtime": "2023-08-16T11:26:47.920Z",
    "size": 1368,
    "path": "../public/_nuxt/el-popover.42c2bc56.css"
  },
  "/_nuxt/el-popover.a10a4766.js": {
    "type": "application/javascript",
    "etag": "\"bf2-8x8NPnjGIpaX0Klpb0jCAAk2yPk\"",
    "mtime": "2023-08-16T11:26:47.956Z",
    "size": 3058,
    "path": "../public/_nuxt/el-popover.a10a4766.js"
  },
  "/_nuxt/el-popper.78981021.js": {
    "type": "application/javascript",
    "etag": "\"9aaa-XSoA+zdKFhpffraITikBFqIrn3M\"",
    "mtime": "2023-08-16T11:26:48.000Z",
    "size": 39594,
    "path": "../public/_nuxt/el-popper.78981021.js"
  },
  "/_nuxt/el-popper.854ddd02.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1fd4-0uk2Uz3ZxPdGTo0NHlSCdY512co\"",
    "mtime": "2023-08-16T11:26:47.928Z",
    "size": 8148,
    "path": "../public/_nuxt/el-popper.854ddd02.css"
  },
  "/_nuxt/el-scrollbar.607bccfd.js": {
    "type": "application/javascript",
    "etag": "\"22a9-wIf2HkzLdk755E73L8hmNQsZBw4\"",
    "mtime": "2023-08-16T11:26:47.970Z",
    "size": 8873,
    "path": "../public/_nuxt/el-scrollbar.607bccfd.js"
  },
  "/_nuxt/el-scrollbar.633caf6b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52f-GGYkEyguhSa81PVnYeGqExThuso\"",
    "mtime": "2023-08-16T11:26:47.920Z",
    "size": 1327,
    "path": "../public/_nuxt/el-scrollbar.633caf6b.css"
  },
  "/_nuxt/el-switch.0ff98d0e.js": {
    "type": "application/javascript",
    "etag": "\"14ba-8zqMNSsR/Lq5ph2btv185i2t6WI\"",
    "mtime": "2023-08-16T11:26:47.970Z",
    "size": 5306,
    "path": "../public/_nuxt/el-switch.0ff98d0e.js"
  },
  "/_nuxt/el-switch.e0856ead.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f4e-7KHKfELgm39cYdoek67imGgUGjc\"",
    "mtime": "2023-08-16T11:26:47.920Z",
    "size": 3918,
    "path": "../public/_nuxt/el-switch.e0856ead.css"
  },
  "/_nuxt/el-text.7dc6a0f8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b8-ilGyRmsxar56yv5WdPXI1YlRsU4\"",
    "mtime": "2023-08-16T11:26:47.923Z",
    "size": 952,
    "path": "../public/_nuxt/el-text.7dc6a0f8.css"
  },
  "/_nuxt/el-text.d1e666e3.js": {
    "type": "application/javascript",
    "etag": "\"92b-84wrDcz39wORAHGjhF7ts0hsay8\"",
    "mtime": "2023-08-16T11:26:47.975Z",
    "size": 2347,
    "path": "../public/_nuxt/el-text.d1e666e3.js"
  },
  "/_nuxt/entrance.2aa910b9.js": {
    "type": "application/javascript",
    "etag": "\"4c0-qSg1ja4fcmtvItZu2ZdPKpUWevc\"",
    "mtime": "2023-08-16T11:26:47.952Z",
    "size": 1216,
    "path": "../public/_nuxt/entrance.2aa910b9.js"
  },
  "/_nuxt/entry.60a981b0.js": {
    "type": "application/javascript",
    "etag": "\"6195c-Yq9uonSDBWFdR7v9mr8OGrmpbu0\"",
    "mtime": "2023-08-16T11:26:48.001Z",
    "size": 399708,
    "path": "../public/_nuxt/entry.60a981b0.js"
  },
  "/_nuxt/entry.7068c0e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3562-N8S/oB5JcdCkIZnNvgadH30Mww8\"",
    "mtime": "2023-08-16T11:26:47.923Z",
    "size": 13666,
    "path": "../public/_nuxt/entry.7068c0e9.css"
  },
  "/_nuxt/error-404.7fc72018.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-iNt1cqPQ0WDudfCTZVQd31BeRGs\"",
    "mtime": "2023-08-16T11:26:47.927Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.7fc72018.css"
  },
  "/_nuxt/error-404.db91ce2f.js": {
    "type": "application/javascript",
    "etag": "\"8cd-DONxZtHUDUiMYhOvxoxHGKpNzro\"",
    "mtime": "2023-08-16T11:26:47.953Z",
    "size": 2253,
    "path": "../public/_nuxt/error-404.db91ce2f.js"
  },
  "/_nuxt/error-500.8e18b6ce.js": {
    "type": "application/javascript",
    "etag": "\"756-rRAK922/v51dNbC/bvx0KpZxHDY\"",
    "mtime": "2023-08-16T11:26:47.967Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.8e18b6ce.js"
  },
  "/_nuxt/error-500.c5df6088.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-ByRo+49BgcevWdRjJy3CMx2IA5k\"",
    "mtime": "2023-08-16T11:26:47.912Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.c5df6088.css"
  },
  "/_nuxt/focus-trap.45b2fae2.js": {
    "type": "application/javascript",
    "etag": "\"14fe-i27gQ6mbpVOyI0LPKzAWzTItOKU\"",
    "mtime": "2023-08-16T11:26:47.948Z",
    "size": 5374,
    "path": "../public/_nuxt/focus-trap.45b2fae2.js"
  },
  "/_nuxt/formatDate.99a4351d.js": {
    "type": "application/javascript",
    "etag": "\"58c-fU0QDhVUVrY2fMs9FqQZoFL1U8A\"",
    "mtime": "2023-08-16T11:26:47.936Z",
    "size": 1420,
    "path": "../public/_nuxt/formatDate.99a4351d.js"
  },
  "/_nuxt/index.5520f416.js": {
    "type": "application/javascript",
    "etag": "\"365-traVjfkJHElMKCF5XVwnMRVxPDE\"",
    "mtime": "2023-08-16T11:26:47.936Z",
    "size": 869,
    "path": "../public/_nuxt/index.5520f416.js"
  },
  "/_nuxt/index.cfb6358a.js": {
    "type": "application/javascript",
    "etag": "\"2a4-DvZfFErb77Bc3KJl0iRj4WwiCf4\"",
    "mtime": "2023-08-16T11:26:47.936Z",
    "size": 676,
    "path": "../public/_nuxt/index.cfb6358a.js"
  },
  "/_nuxt/isEqual.402a2aab.js": {
    "type": "application/javascript",
    "etag": "\"1ec7-ZUe3iXJFq+T29L/IbeNsNYYyyHs\"",
    "mtime": "2023-08-16T11:26:47.948Z",
    "size": 7879,
    "path": "../public/_nuxt/isEqual.402a2aab.js"
  },
  "/_nuxt/LanguageSelect.520c1fab.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"25d0-SRtmaji/bRwuqR2e5SDsGk/EcMs\"",
    "mtime": "2023-08-16T11:26:47.919Z",
    "size": 9680,
    "path": "../public/_nuxt/LanguageSelect.520c1fab.css"
  },
  "/_nuxt/LanguageSelect.afa46529.js": {
    "type": "application/javascript",
    "etag": "\"7dc5-MQBJnf8IkEG2wiHLoB85jaqOyI4\"",
    "mtime": "2023-08-16T11:26:47.968Z",
    "size": 32197,
    "path": "../public/_nuxt/LanguageSelect.afa46529.js"
  },
  "/_nuxt/login.7707bf7b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c5-RG1RUCT5lzjhK6LVE/uMACFXHrM\"",
    "mtime": "2023-08-16T11:26:47.920Z",
    "size": 709,
    "path": "../public/_nuxt/login.7707bf7b.css"
  },
  "/_nuxt/login.88f858e0.js": {
    "type": "application/javascript",
    "etag": "\"e3e-F59E3Tel5ifkeln1OooZUmqrmKM\"",
    "mtime": "2023-08-16T11:26:47.984Z",
    "size": 3646,
    "path": "../public/_nuxt/login.88f858e0.js"
  },
  "/_nuxt/nuxt-link.69d8bf5d.js": {
    "type": "application/javascript",
    "etag": "\"1107-DnUM1Qe27qtFdbwJZY1GTlKfbds\"",
    "mtime": "2023-08-16T11:26:47.952Z",
    "size": 4359,
    "path": "../public/_nuxt/nuxt-link.69d8bf5d.js"
  },
  "/_nuxt/onlyAuth.69cc7572.js": {
    "type": "application/javascript",
    "etag": "\"200-oc3G+0he9nTBbbV3aZi/3HIJULQ\"",
    "mtime": "2023-08-16T11:26:47.937Z",
    "size": 512,
    "path": "../public/_nuxt/onlyAuth.69cc7572.js"
  },
  "/_nuxt/onlyNoAuth.00ce116a.js": {
    "type": "application/javascript",
    "etag": "\"1d7-ryOR6HaTLoVAi8e+th+Af2ReqK4\"",
    "mtime": "2023-08-16T11:26:47.936Z",
    "size": 471,
    "path": "../public/_nuxt/onlyNoAuth.00ce116a.js"
  },
  "/_nuxt/perspective.8eb35e35.js": {
    "type": "application/javascript",
    "etag": "\"7a1c-2wEc1QmhYKuQk17vsQylfszIhWY\"",
    "mtime": "2023-08-16T11:26:47.985Z",
    "size": 31260,
    "path": "../public/_nuxt/perspective.8eb35e35.js"
  },
  "/_nuxt/perspective.e70c8c90.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13ce-44y0CASktcvstD9IcTj4vNB5HRk\"",
    "mtime": "2023-08-16T11:26:47.919Z",
    "size": 5070,
    "path": "../public/_nuxt/perspective.e70c8c90.css"
  },
  "/_nuxt/profile.90c18f38.js": {
    "type": "application/javascript",
    "etag": "\"7ce-VWrDtMC5Gf7B1QDm6Fwd0n52+Iw\"",
    "mtime": "2023-08-16T11:26:47.946Z",
    "size": 1998,
    "path": "../public/_nuxt/profile.90c18f38.js"
  },
  "/_nuxt/reset-password.57439420.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2cd-ykzE3D7J8on6MCCO6QyxHOWuhuI\"",
    "mtime": "2023-08-16T11:26:47.919Z",
    "size": 717,
    "path": "../public/_nuxt/reset-password.57439420.css"
  },
  "/_nuxt/reset-password.742a6631.js": {
    "type": "application/javascript",
    "etag": "\"16cd-3UnooTaOhf4COXwpRsIyvjOmBbs\"",
    "mtime": "2023-08-16T11:26:47.971Z",
    "size": 5837,
    "path": "../public/_nuxt/reset-password.742a6631.js"
  },
  "/_nuxt/scroll.22698584.js": {
    "type": "application/javascript",
    "etag": "\"4a5-4kTNopb5dTGWH8saANGaKoa7Rpc\"",
    "mtime": "2023-08-16T11:26:47.952Z",
    "size": 1189,
    "path": "../public/_nuxt/scroll.22698584.js"
  },
  "/_nuxt/signup.4e0856fa.js": {
    "type": "application/javascript",
    "etag": "\"1a95-IQlEfMsFf9kG9oDO9hP6HxZ+WsY\"",
    "mtime": "2023-08-16T11:26:47.957Z",
    "size": 6805,
    "path": "../public/_nuxt/signup.4e0856fa.js"
  },
  "/_nuxt/str.d457f5f4.js": {
    "type": "application/javascript",
    "etag": "\"dc-8EAb+mXl+/uDsZS/kUISV95ruFk\"",
    "mtime": "2023-08-16T11:26:47.936Z",
    "size": 220,
    "path": "../public/_nuxt/str.d457f5f4.js"
  },
  "/_nuxt/useAdmin.5498df3c.js": {
    "type": "application/javascript",
    "etag": "\"3bb-UxmaT9V7M91z7YfjDn742lB/nQ0\"",
    "mtime": "2023-08-16T11:26:47.945Z",
    "size": 955,
    "path": "../public/_nuxt/useAdmin.5498df3c.js"
  },
  "/_nuxt/useAuth.4554ef87.js": {
    "type": "application/javascript",
    "etag": "\"653-9HesKYXaGhwBcuMo2I1QmHs2nwg\"",
    "mtime": "2023-08-16T11:26:47.942Z",
    "size": 1619,
    "path": "../public/_nuxt/useAuth.4554ef87.js"
  },
  "/_nuxt/useChat.fb420c67.js": {
    "type": "application/javascript",
    "etag": "\"67cf-V84Qd1CJA6Pyk99zzWj6M/FJdbA\"",
    "mtime": "2023-08-16T11:26:47.952Z",
    "size": 26575,
    "path": "../public/_nuxt/useChat.fb420c67.js"
  },
  "/_nuxt/useTitle.5a79fd11.js": {
    "type": "application/javascript",
    "etag": "\"9f-SGrYYiB+/dZvWUcFJc3xvzxPoHk\"",
    "mtime": "2023-08-16T11:26:47.937Z",
    "size": 159,
    "path": "../public/_nuxt/useTitle.5a79fd11.js"
  },
  "/_nuxt/_conv_.5e910501.js": {
    "type": "application/javascript",
    "etag": "\"364-1RwWtDhLgqBV6ZKIyRNQkZV/L8Y\"",
    "mtime": "2023-08-16T11:26:47.940Z",
    "size": 868,
    "path": "../public/_nuxt/_conv_.5e910501.js"
  },
  "/_nuxt/_initCloneObject.f5ee12ff.js": {
    "type": "application/javascript",
    "etag": "\"5ce-IlgFKTjabQJ3FfNssQllF616oqo\"",
    "mtime": "2023-08-16T11:26:47.950Z",
    "size": 1486,
    "path": "../public/_nuxt/_initCloneObject.f5ee12ff.js"
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
const _lazy_I17oVW = () => import('../resetPassword.post.mjs');
const _lazy_xqtLlJ = () => import('../signup.post.mjs');
const _lazy_PaLDFn = () => import('../username.put.mjs');
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
const _lazy_5jYbeA = () => import('../test.mjs');
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
  { route: '/api/auth/resetPassword', handler: _lazy_I17oVW, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/signup', handler: _lazy_xqtLlJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/username', handler: _lazy_PaLDFn, lazy: true, middleware: false, method: "put" },
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
  { route: '/api/test', handler: _lazy_5jYbeA, lazy: true, middleware: false, method: undefined },
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
