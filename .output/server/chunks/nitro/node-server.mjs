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
    "buildAssetsDir": "/_build/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_build/**": {
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
  "/_build/abap.b029dff1.js": {
    "type": "application/javascript",
    "etag": "\"3849-+AFq523M9nBhBK4d+QklBzSWtys\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 14409,
    "path": "../public/_build/abap.b029dff1.js"
  },
  "/_build/apex.3c83662c.js": {
    "type": "application/javascript",
    "etag": "\"1066-F3vzsj3ZZ5711hanoAKmDIsRcUY\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 4198,
    "path": "../public/_build/apex.3c83662c.js"
  },
  "/_build/autoRedirector.d04dda54.js": {
    "type": "application/javascript",
    "etag": "\"516-zLKyqXwjFW8viq+cfwXDvWgt9K8\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 1302,
    "path": "../public/_build/autoRedirector.d04dda54.js"
  },
  "/_build/azcli.f1f7c576.js": {
    "type": "application/javascript",
    "etag": "\"446-onwGTuS1yaGYH2pp3JjCd+Wq91A\"",
    "mtime": "2023-10-19T12:43:56.785Z",
    "size": 1094,
    "path": "../public/_build/azcli.f1f7c576.js"
  },
  "/_build/bat.86aea46a.js": {
    "type": "application/javascript",
    "etag": "\"82b-8BPMwZ1AL3t3J0SfeHIII9/Dc5k\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 2091,
    "path": "../public/_build/bat.86aea46a.js"
  },
  "/_build/bicep.75c0c4d5.js": {
    "type": "application/javascript",
    "etag": "\"ade-wf6QboOfggtOXrAdvgq8/bPEeTE\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 2782,
    "path": "../public/_build/bicep.75c0c4d5.js"
  },
  "/_build/blank.38fdef01.js": {
    "type": "application/javascript",
    "etag": "\"14e-0ZmDEv6LUIMbZ0p1WZhY5+WY1Zs\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 334,
    "path": "../public/_build/blank.38fdef01.js"
  },
  "/_build/cameligo.8043f913.js": {
    "type": "application/javascript",
    "etag": "\"97f-bzctTFi1sW3QkO+D5g1hoO58ky4\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 2431,
    "path": "../public/_build/cameligo.8043f913.js"
  },
  "/_build/castArray.2e8e2983.js": {
    "type": "application/javascript",
    "etag": "\"89-Lp7RFIwdnYNsKNSbYAZ3ALSwMqY\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 137,
    "path": "../public/_build/castArray.2e8e2983.js"
  },
  "/_build/chat.209884f3.js": {
    "type": "application/javascript",
    "etag": "\"5083-PtchXlD97PdlePOPdvXrDpJdnPI\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 20611,
    "path": "../public/_build/chat.209884f3.js"
  },
  "/_build/chat.596d6646.js": {
    "type": "application/javascript",
    "etag": "\"225-mwoINwWymI34wnohKr9dbJfr+X0\"",
    "mtime": "2023-10-19T12:43:56.845Z",
    "size": 549,
    "path": "../public/_build/chat.596d6646.js"
  },
  "/_build/chat.b1c6cf58.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13e3-D8lnnMjeFus5aDHwiEF0p+6xz9o\"",
    "mtime": "2023-10-19T12:43:56.766Z",
    "size": 5091,
    "path": "../public/_build/chat.b1c6cf58.css"
  },
  "/_build/client-only.db448d76.js": {
    "type": "application/javascript",
    "etag": "\"1d5-5Z+WGLhBncjLjJ+xiwOh5OwoU4A\"",
    "mtime": "2023-10-19T12:43:56.792Z",
    "size": 469,
    "path": "../public/_build/client-only.db448d76.js"
  },
  "/_build/clojure.73642b02.js": {
    "type": "application/javascript",
    "etag": "\"26a1-nchmBrX9ni+hlNjIgsBS1NvGufQ\"",
    "mtime": "2023-10-19T12:43:56.842Z",
    "size": 9889,
    "path": "../public/_build/clojure.73642b02.js"
  },
  "/_build/codicon.79f233d0.ttf": {
    "type": "font/ttf",
    "etag": "\"11ef8-evdcUoyWz7S4f1wCN+ixrSwdR/w\"",
    "mtime": "2023-10-19T12:43:56.755Z",
    "size": 73464,
    "path": "../public/_build/codicon.79f233d0.ttf"
  },
  "/_build/coffee.a18badcf.js": {
    "type": "application/javascript",
    "etag": "\"efc-OSbl660lS3W4S/7r19mk6NuwUXo\"",
    "mtime": "2023-10-19T12:43:56.787Z",
    "size": 3836,
    "path": "../public/_build/coffee.a18badcf.js"
  },
  "/_build/CommonSettings.37a198a4.js": {
    "type": "application/javascript",
    "etag": "\"7e6-EmCjtw9JJUmEWyVXamSpWe8e9HI\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 2022,
    "path": "../public/_build/CommonSettings.37a198a4.js"
  },
  "/_build/ConvMain.4dcfdfa4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1727-HcTPwH7w8FXEke3qaqCZLPhstdM\"",
    "mtime": "2023-10-19T12:43:56.761Z",
    "size": 5927,
    "path": "../public/_build/ConvMain.4dcfdfa4.css"
  },
  "/_build/ConvMain.907f253e.js": {
    "type": "application/javascript",
    "etag": "\"cca3-fllhDe+kSLfgmUh5M8qn2vm8CLk\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 52387,
    "path": "../public/_build/ConvMain.907f253e.js"
  },
  "/_build/cpp.4034161e.js": {
    "type": "application/javascript",
    "etag": "\"165c-gpqa68DXgmse4J4s16F/Ay+DNK0\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 5724,
    "path": "../public/_build/cpp.4034161e.js"
  },
  "/_build/csharp.49cbf0d2.js": {
    "type": "application/javascript",
    "etag": "\"12a2-HLWZlYSBz4PY/9pC8Vr3F03PMHM\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 4770,
    "path": "../public/_build/csharp.49cbf0d2.js"
  },
  "/_build/csp.d207cac4.js": {
    "type": "application/javascript",
    "etag": "\"681-vmTwGqqcswznBYWU2jvEmnfgDb0\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 1665,
    "path": "../public/_build/csp.d207cac4.js"
  },
  "/_build/css.74326df0.js": {
    "type": "application/javascript",
    "etag": "\"1294-B4regreLr8k+9ratcsOgZTEfp68\"",
    "mtime": "2023-10-19T12:43:56.785Z",
    "size": 4756,
    "path": "../public/_build/css.74326df0.js"
  },
  "/_build/cssMode.826315e5.js": {
    "type": "application/javascript",
    "etag": "\"842d-BXHtDg4rHj6AMbs7HjJTyu8YQ8E\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 33837,
    "path": "../public/_build/cssMode.826315e5.js"
  },
  "/_build/currency-converter.0c159a8d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"104-R3MO0f4fhmUcrtc74ldcEjR89Xk\"",
    "mtime": "2023-10-19T12:43:56.764Z",
    "size": 260,
    "path": "../public/_build/currency-converter.0c159a8d.css"
  },
  "/_build/currency-converter.fd4e522b.js": {
    "type": "application/javascript",
    "etag": "\"3b0b-4tM6f+AYGbsz/tWzD7MHLoFT0pY\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 15115,
    "path": "../public/_build/currency-converter.fd4e522b.js"
  },
  "/_build/cypher.49f5f839.js": {
    "type": "application/javascript",
    "etag": "\"e2f-DBrVDGPz3hy7Hvh22Nyn4zW1Uk0\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 3631,
    "path": "../public/_build/cypher.49f5f839.js"
  },
  "/_build/dart.84b7c6b4.js": {
    "type": "application/javascript",
    "etag": "\"1190-3L6x7AOHVjAAvJsiNSvWdsK8RFc\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 4496,
    "path": "../public/_build/dart.84b7c6b4.js"
  },
  "/_build/dashboard.15170cfd.js": {
    "type": "application/javascript",
    "etag": "\"7cb-1LN7AWl08G1leBO5HJR+2N7YryQ\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 1995,
    "path": "../public/_build/dashboard.15170cfd.js"
  },
  "/_build/default.39fe3d1b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9e-rI+KacqkCoZvi4kBvOhWmhC7LL0\"",
    "mtime": "2023-10-19T12:43:56.725Z",
    "size": 158,
    "path": "../public/_build/default.39fe3d1b.css"
  },
  "/_build/default.ee3a1acb.js": {
    "type": "application/javascript",
    "etag": "\"5f3-Rk8wfNE0xvIXjNdzbWOZEPWf+mE\"",
    "mtime": "2023-10-19T12:43:56.882Z",
    "size": 1523,
    "path": "../public/_build/default.ee3a1acb.js"
  },
  "/_build/DefaultHeaderButtons.45c42ed8.js": {
    "type": "application/javascript",
    "etag": "\"7a02-uOODSS5VghEm7RkaEaav0k/B48Y\"",
    "mtime": "2023-10-19T12:43:56.897Z",
    "size": 31234,
    "path": "../public/_build/DefaultHeaderButtons.45c42ed8.js"
  },
  "/_build/DefaultHeaderButtons.90a88d8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b78-H6nx0Vloo4Jw0cRDV8I93EfnL0U\"",
    "mtime": "2023-10-19T12:43:56.768Z",
    "size": 11128,
    "path": "../public/_build/DefaultHeaderButtons.90a88d8a.css"
  },
  "/_build/dockerfile.bbf114b2.js": {
    "type": "application/javascript",
    "etag": "\"843-0+TAATCh6phmIFWRYXJUJ40YrPA\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 2115,
    "path": "../public/_build/dockerfile.bbf114b2.js"
  },
  "/_build/dropdown.872bd511.js": {
    "type": "application/javascript",
    "etag": "\"925-314GLeT2bxuKKOzOgR8wUoUo42M\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 2341,
    "path": "../public/_build/dropdown.872bd511.js"
  },
  "/_build/ecl.15840f49.js": {
    "type": "application/javascript",
    "etag": "\"15d4-zUrU4ChloTmYGWn2Vx5rqRB8wY8\"",
    "mtime": "2023-10-19T12:43:56.845Z",
    "size": 5588,
    "path": "../public/_build/ecl.15840f49.js"
  },
  "/_build/el-button.2689f638.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d33-RzIPFKzgWgJB1bVDsB1E+qI9A3Y\"",
    "mtime": "2023-10-19T12:43:56.786Z",
    "size": 15667,
    "path": "../public/_build/el-button.2689f638.css"
  },
  "/_build/el-button.71994530.js": {
    "type": "application/javascript",
    "etag": "\"4aa9-8qHUZxVEr5bwlbuD3SiaOrl8FYA\"",
    "mtime": "2023-10-19T12:43:56.897Z",
    "size": 19113,
    "path": "../public/_build/el-button.71994530.js"
  },
  "/_build/el-form.46baa21c.js": {
    "type": "application/javascript",
    "etag": "\"79e4-ULpKhZcZQIb/mRJ0wNCuce/SzRw\"",
    "mtime": "2023-10-19T12:43:56.897Z",
    "size": 31204,
    "path": "../public/_build/el-form.46baa21c.js"
  },
  "/_build/el-form.7235a9a0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f0d-qCH0MR9J+ccrp40iuwPw59h7yJI\"",
    "mtime": "2023-10-19T12:43:56.764Z",
    "size": 3853,
    "path": "../public/_build/el-form.7235a9a0.css"
  },
  "/_build/el-icon.12f2798b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1e0-rUUgX55PeSysz9mOdM+T2qj0QS4\"",
    "mtime": "2023-10-19T12:43:56.783Z",
    "size": 480,
    "path": "../public/_build/el-icon.12f2798b.css"
  },
  "/_build/el-input-number.4c2bba84.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f2d-Cn1X71JF33f3gQG+CU1EGxO1xlI\"",
    "mtime": "2023-10-19T12:43:56.766Z",
    "size": 3885,
    "path": "../public/_build/el-input-number.4c2bba84.css"
  },
  "/_build/el-input-number.534b85d5.js": {
    "type": "application/javascript",
    "etag": "\"17f7-AjP9sL4gagCJ4QcJYZnv1pzR0is\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 6135,
    "path": "../public/_build/el-input-number.534b85d5.js"
  },
  "/_build/el-input.3fc85dc7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"302b-3v8oiy4O6e1HBuSVz4u1Whl7kIY\"",
    "mtime": "2023-10-19T12:43:56.785Z",
    "size": 12331,
    "path": "../public/_build/el-input.3fc85dc7.css"
  },
  "/_build/el-input.5697ae3f.js": {
    "type": "application/javascript",
    "etag": "\"3355-utPOsJbukmPj0Vzy/6AlOg8uarM\"",
    "mtime": "2023-10-19T12:43:56.882Z",
    "size": 13141,
    "path": "../public/_build/el-input.5697ae3f.js"
  },
  "/_build/el-link.c11e96a4.js": {
    "type": "application/javascript",
    "etag": "\"479-CEEdWmX+W1Qd2SroYHkNu8zSImE\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 1145,
    "path": "../public/_build/el-link.c11e96a4.js"
  },
  "/_build/el-link.d9789c6b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b4b-2nLfNoRS3IyBEXstRQu5vwaPiPg\"",
    "mtime": "2023-10-19T12:43:56.767Z",
    "size": 2891,
    "path": "../public/_build/el-link.d9789c6b.css"
  },
  "/_build/el-overlay.3dbf3adb.js": {
    "type": "application/javascript",
    "etag": "\"380f-aEEAd9lImXsWzqFS7e/0/zGzh7M\"",
    "mtime": "2023-10-19T12:43:56.882Z",
    "size": 14351,
    "path": "../public/_build/el-overlay.3dbf3adb.js"
  },
  "/_build/el-overlay.adec720f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14a9-S5SbV5gD5xWhD5fPG/Pul9XX7VQ\"",
    "mtime": "2023-10-19T12:43:56.791Z",
    "size": 5289,
    "path": "../public/_build/el-overlay.adec720f.css"
  },
  "/_build/el-popover.42c2bc56.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"558-F1/tgAS2U8PplrTLocXW2lf10tg\"",
    "mtime": "2023-10-19T12:43:56.765Z",
    "size": 1368,
    "path": "../public/_build/el-popover.42c2bc56.css"
  },
  "/_build/el-popover.472559eb.js": {
    "type": "application/javascript",
    "etag": "\"bf4-7wdMyfB/oQQT8hlF9R6mVstow6w\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 3060,
    "path": "../public/_build/el-popover.472559eb.js"
  },
  "/_build/el-popper.1b5e0aec.js": {
    "type": "application/javascript",
    "etag": "\"a0e5-GaaTtWl95RvgSdsMndOzJk97FOQ\"",
    "mtime": "2023-10-19T12:43:56.897Z",
    "size": 41189,
    "path": "../public/_build/el-popper.1b5e0aec.js"
  },
  "/_build/el-popper.854ddd02.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1fd4-0uk2Uz3ZxPdGTo0NHlSCdY512co\"",
    "mtime": "2023-10-19T12:43:56.785Z",
    "size": 8148,
    "path": "../public/_build/el-popper.854ddd02.css"
  },
  "/_build/el-select.18bcc23c.js": {
    "type": "application/javascript",
    "etag": "\"a4a1-u5YtnG7hxr8Yxr9uxvQk0MWwbfw\"",
    "mtime": "2023-10-19T12:43:56.897Z",
    "size": 42145,
    "path": "../public/_build/el-select.18bcc23c.js"
  },
  "/_build/el-select.7a020f23.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2afe-/xBmWyYeNDbXyHf940VmXlVVKWA\"",
    "mtime": "2023-10-19T12:43:56.783Z",
    "size": 11006,
    "path": "../public/_build/el-select.7a020f23.css"
  },
  "/_build/el-switch.70062bd4.js": {
    "type": "application/javascript",
    "etag": "\"15bf-C4tEZnvlk1fvpehsUMcw9yq2Vgs\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 5567,
    "path": "../public/_build/el-switch.70062bd4.js"
  },
  "/_build/el-switch.e0856ead.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f4e-7KHKfELgm39cYdoek67imGgUGjc\"",
    "mtime": "2023-10-19T12:43:56.779Z",
    "size": 3918,
    "path": "../public/_build/el-switch.e0856ead.css"
  },
  "/_build/el-text.4a878b46.js": {
    "type": "application/javascript",
    "etag": "\"2ff-zuHQtTtOu6jMpaxMy6hzvoSxaVQ\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 767,
    "path": "../public/_build/el-text.4a878b46.js"
  },
  "/_build/el-text.7dc6a0f8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b8-ilGyRmsxar56yv5WdPXI1YlRsU4\"",
    "mtime": "2023-10-19T12:43:56.783Z",
    "size": 952,
    "path": "../public/_build/el-text.7dc6a0f8.css"
  },
  "/_build/elixir.e479e18e.js": {
    "type": "application/javascript",
    "etag": "\"2907-EhkQpTz8NuOzBSdPVmmIKvaIwE8\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 10503,
    "path": "../public/_build/elixir.e479e18e.js"
  },
  "/_build/entrance.3091c552.js": {
    "type": "application/javascript",
    "etag": "\"486-lUczrVIhwSpJPdi8Y1P4KCpKOrU\"",
    "mtime": "2023-10-19T12:43:56.791Z",
    "size": 1158,
    "path": "../public/_build/entrance.3091c552.js"
  },
  "/_build/entry.0bbf14a2.js": {
    "type": "application/javascript",
    "etag": "\"66dd7-8xDBTMVRJ796LqAwwydm5xSM0wQ\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 421335,
    "path": "../public/_build/entry.0bbf14a2.js"
  },
  "/_build/entry.7068c0e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3562-N8S/oB5JcdCkIZnNvgadH30Mww8\"",
    "mtime": "2023-10-19T12:43:56.760Z",
    "size": 13666,
    "path": "../public/_build/entry.7068c0e9.css"
  },
  "/_build/error-404.7fc72018.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-iNt1cqPQ0WDudfCTZVQd31BeRGs\"",
    "mtime": "2023-10-19T12:43:56.765Z",
    "size": 3630,
    "path": "../public/_build/error-404.7fc72018.css"
  },
  "/_build/error-404.865e01d0.js": {
    "type": "application/javascript",
    "etag": "\"8cd-womrnnjdbFi/SPzEM+KHlO2Bsdw\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 2253,
    "path": "../public/_build/error-404.865e01d0.js"
  },
  "/_build/error-500.c5df6088.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-ByRo+49BgcevWdRjJy3CMx2IA5k\"",
    "mtime": "2023-10-19T12:43:56.755Z",
    "size": 1950,
    "path": "../public/_build/error-500.c5df6088.css"
  },
  "/_build/error-500.f57b455d.js": {
    "type": "application/javascript",
    "etag": "\"756-6dANADOVbXH4IXQvL1nuXF20LBo\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 1878,
    "path": "../public/_build/error-500.f57b455d.js"
  },
  "/_build/flow9.42a61225.js": {
    "type": "application/javascript",
    "etag": "\"808-Sq1uEsdOVM02CVlCexHC6AMiZfM\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 2056,
    "path": "../public/_build/flow9.42a61225.js"
  },
  "/_build/focus-trap.69a3125b.js": {
    "type": "application/javascript",
    "etag": "\"1505-M3wQAZv7OE+ciljQF4x1J+m1LYs\"",
    "mtime": "2023-10-19T12:43:56.838Z",
    "size": 5381,
    "path": "../public/_build/focus-trap.69a3125b.js"
  },
  "/_build/freemarker2.b67ff20c.js": {
    "type": "application/javascript",
    "etag": "\"406f-+CuuVLYssodHfuKdoIYWXF9TEwk\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 16495,
    "path": "../public/_build/freemarker2.b67ff20c.js"
  },
  "/_build/fsharp.8abe6da0.js": {
    "type": "application/javascript",
    "etag": "\"c9d-bfcDEOpJax6Kk+wVlQWA8NEG1gk\"",
    "mtime": "2023-10-19T12:43:56.843Z",
    "size": 3229,
    "path": "../public/_build/fsharp.8abe6da0.js"
  },
  "/_build/go.8759e9f7.js": {
    "type": "application/javascript",
    "etag": "\"b57-KdIe5gnvI+0UZjjRNmlGjBYQQjc\"",
    "mtime": "2023-10-19T12:43:56.847Z",
    "size": 2903,
    "path": "../public/_build/go.8759e9f7.js"
  },
  "/_build/graphql.387d549c.js": {
    "type": "application/javascript",
    "etag": "\"9ca-s+ejpp+B6NwKnhsAyrLq6USVBIg\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 2506,
    "path": "../public/_build/graphql.387d549c.js"
  },
  "/_build/handlebars.35a13cbf.js": {
    "type": "application/javascript",
    "etag": "\"1c05-2UKVVLh/tcTi7+FlrppjNhYxIAk\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 7173,
    "path": "../public/_build/handlebars.35a13cbf.js"
  },
  "/_build/hcl.a88f331a.js": {
    "type": "application/javascript",
    "etag": "\"efc-BzCMGnNs54LIeeuDOIBA/UXYByE\"",
    "mtime": "2023-10-19T12:43:56.804Z",
    "size": 3836,
    "path": "../public/_build/hcl.a88f331a.js"
  },
  "/_build/html.46522cf5.js": {
    "type": "application/javascript",
    "etag": "\"1525-HgIE2I9BIvlBu87CNApop+9G59E\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 5413,
    "path": "../public/_build/html.46522cf5.js"
  },
  "/_build/htmlMode.7b095fa3.js": {
    "type": "application/javascript",
    "etag": "\"8654-gX44h8RZi51u1+fme2J0HMYqpt4\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 34388,
    "path": "../public/_build/htmlMode.7b095fa3.js"
  },
  "/_build/index.075550ef.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1aa9d-ElilReAb+IAHX6F0AdmH/vc+Nr4\"",
    "mtime": "2023-10-19T12:43:56.762Z",
    "size": 109213,
    "path": "../public/_build/index.075550ef.css"
  },
  "/_build/index.0f3e1b58.js": {
    "type": "application/javascript",
    "etag": "\"29f-HR/HU76DmG8WBwVO5W2nQbctbEg\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 671,
    "path": "../public/_build/index.0f3e1b58.js"
  },
  "/_build/index.b514fb5b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"278-0pup7TF8hCneNOiJN1LMu+0R8J8\"",
    "mtime": "2023-10-19T12:43:56.764Z",
    "size": 632,
    "path": "../public/_build/index.b514fb5b.css"
  },
  "/_build/index.bf98060b.js": {
    "type": "application/javascript",
    "etag": "\"364-bmMd3IhhzwBGku8Iuu/kp4HTlyU\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 868,
    "path": "../public/_build/index.bf98060b.js"
  },
  "/_build/index.c2cc0803.js": {
    "type": "application/javascript",
    "etag": "\"2fd22e-mH3jMANn9csWmhNozmp0G/0G2yQ\"",
    "mtime": "2023-10-19T12:43:56.897Z",
    "size": 3133998,
    "path": "../public/_build/index.c2cc0803.js"
  },
  "/_build/index.d5f69dcb.js": {
    "type": "application/javascript",
    "etag": "\"ab-q7wouAfoUq7Rhi5wDoC4ioLl9lI\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 171,
    "path": "../public/_build/index.d5f69dcb.js"
  },
  "/_build/ini.18bf1153.js": {
    "type": "application/javascript",
    "etag": "\"543-dy/9UzsXT+StF+O64v2WLtuJTQE\"",
    "mtime": "2023-10-19T12:43:56.843Z",
    "size": 1347,
    "path": "../public/_build/ini.18bf1153.js"
  },
  "/_build/isEqual.9c3f0b62.js": {
    "type": "application/javascript",
    "etag": "\"e9f-/D82ZD1mVAVJXCDXjYFXzkIaVlc\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 3743,
    "path": "../public/_build/isEqual.9c3f0b62.js"
  },
  "/_build/java.000a6283.js": {
    "type": "application/javascript",
    "etag": "\"d8b-BjKmHwhUGBS84vH0LUPtwJ+KZNE\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 3467,
    "path": "../public/_build/java.000a6283.js"
  },
  "/_build/javascript.3de90e7a.js": {
    "type": "application/javascript",
    "etag": "\"51d-CNfRqmu1G/KWQVDtAkN9COrWwJs\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 1309,
    "path": "../public/_build/javascript.3de90e7a.js"
  },
  "/_build/jsonMode.ee8e4978.js": {
    "type": "application/javascript",
    "etag": "\"9bc6-U+32qJbujgcS+gIgYiocEzYUHdI\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 39878,
    "path": "../public/_build/jsonMode.ee8e4978.js"
  },
  "/_build/julia.0026391c.js": {
    "type": "application/javascript",
    "etag": "\"1ce3-s8vHkCu7EKlHCnyLHBFGhNgm1+o\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 7395,
    "path": "../public/_build/julia.0026391c.js"
  },
  "/_build/kotlin.06ee8898.js": {
    "type": "application/javascript",
    "etag": "\"e65-JM5scpeTja9IqwSnzQe51RI7ea0\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 3685,
    "path": "../public/_build/kotlin.06ee8898.js"
  },
  "/_build/less.dd86a68c.js": {
    "type": "application/javascript",
    "etag": "\"1030-Hh54fIKhKKLekWSx/Q3IxbKydGM\"",
    "mtime": "2023-10-19T12:43:56.843Z",
    "size": 4144,
    "path": "../public/_build/less.dd86a68c.js"
  },
  "/_build/lexon.8d4b0444.js": {
    "type": "application/javascript",
    "etag": "\"a7b-EL1VEtEFISjySLri5KMeLfGIpWM\"",
    "mtime": "2023-10-19T12:43:56.838Z",
    "size": 2683,
    "path": "../public/_build/lexon.8d4b0444.js"
  },
  "/_build/liquid.1a87967f.js": {
    "type": "application/javascript",
    "etag": "\"1107-amG/0+dSPwJ5tfvEy1eek1xuhco\"",
    "mtime": "2023-10-19T12:43:56.789Z",
    "size": 4359,
    "path": "../public/_build/liquid.1a87967f.js"
  },
  "/_build/login.7707bf7b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c5-RG1RUCT5lzjhK6LVE/uMACFXHrM\"",
    "mtime": "2023-10-19T12:43:56.763Z",
    "size": 709,
    "path": "../public/_build/login.7707bf7b.css"
  },
  "/_build/login.92cf64b9.js": {
    "type": "application/javascript",
    "etag": "\"c6b-PJoD5UApCA8bsMfHqjESWTtbV9g\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 3179,
    "path": "../public/_build/login.92cf64b9.js"
  },
  "/_build/login.b6a60291.js": {
    "type": "application/javascript",
    "etag": "\"498-cseoEnWNr61mmkHZB/3L0v6npRA\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 1176,
    "path": "../public/_build/login.b6a60291.js"
  },
  "/_build/ls.43bfe132.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"66-5j+qSiqeZ8XuBGTwK/vGRpvjDro\"",
    "mtime": "2023-10-19T12:43:56.766Z",
    "size": 102,
    "path": "../public/_build/ls.43bfe132.css"
  },
  "/_build/ls.601014e3.js": {
    "type": "application/javascript",
    "etag": "\"9ef-Yihe3uGhERMRV4v8UzrBO2zL50I\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 2543,
    "path": "../public/_build/ls.601014e3.js"
  },
  "/_build/lua.9adddcd9.js": {
    "type": "application/javascript",
    "etag": "\"941-b9EO5OV77TIzCdgq0Nyv/g98Xl4\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 2369,
    "path": "../public/_build/lua.9adddcd9.js"
  },
  "/_build/m3.aa2dcf72.js": {
    "type": "application/javascript",
    "etag": "\"bf7-V/GoLyiPGkpaMqr4by+pXCESbws\"",
    "mtime": "2023-10-19T12:43:56.845Z",
    "size": 3063,
    "path": "../public/_build/m3.aa2dcf72.js"
  },
  "/_build/markdown.0f073a3a.js": {
    "type": "application/javascript",
    "etag": "\"fc2-EQW9lbELsOGs4LjNGaJ3J0WOOyk\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 4034,
    "path": "../public/_build/markdown.0f073a3a.js"
  },
  "/_build/matrix-calculator.17822f5a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"66-7akkCTBgmAdgiXI9ZocFgBkQR18\"",
    "mtime": "2023-10-19T12:43:56.765Z",
    "size": 102,
    "path": "../public/_build/matrix-calculator.17822f5a.css"
  },
  "/_build/matrix-calculator.9a16b116.js": {
    "type": "application/javascript",
    "etag": "\"86b-erQGB5pTPieUIgLKdHh9u6CW/G8\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 2155,
    "path": "../public/_build/matrix-calculator.9a16b116.js"
  },
  "/_build/mdx.350c8c0f.js": {
    "type": "application/javascript",
    "etag": "\"1490-owvMxDtM2/oJ+CCGY60T9DtvYK4\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 5264,
    "path": "../public/_build/mdx.350c8c0f.js"
  },
  "/_build/mips.bdd96c5a.js": {
    "type": "application/javascript",
    "etag": "\"b09-Az9vcFfj750O5TMLFeM4+sSXO+A\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 2825,
    "path": "../public/_build/mips.bdd96c5a.js"
  },
  "/_build/msdax.1ac55115.js": {
    "type": "application/javascript",
    "etag": "\"1426-B1G9YkX/b+V1+w2AvZAmGVcjbrA\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 5158,
    "path": "../public/_build/msdax.1ac55115.js"
  },
  "/_build/mysql.b530c105.js": {
    "type": "application/javascript",
    "etag": "\"2d00-gqEyX9GjFH168PC1SlvZ4Gre3Tw\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 11520,
    "path": "../public/_build/mysql.b530c105.js"
  },
  "/_build/nuxt-link.146ad40d.js": {
    "type": "application/javascript",
    "etag": "\"1107-r1xNyHoCW9ynZYED0zgOWDN3I1M\"",
    "mtime": "2023-10-19T12:43:56.845Z",
    "size": 4359,
    "path": "../public/_build/nuxt-link.146ad40d.js"
  },
  "/_build/objective-c.951ded7b.js": {
    "type": "application/javascript",
    "etag": "\"a58-SgrmSauoN6af/E48J/VzDuB1WeI\"",
    "mtime": "2023-10-19T12:43:56.842Z",
    "size": 2648,
    "path": "../public/_build/objective-c.951ded7b.js"
  },
  "/_build/onlyAdminAuth.7b56ab58.js": {
    "type": "application/javascript",
    "etag": "\"108-8FSWVnRfmfxy3NWNHk/fMWiuH2w\"",
    "mtime": "2023-10-19T12:43:56.785Z",
    "size": 264,
    "path": "../public/_build/onlyAdminAuth.7b56ab58.js"
  },
  "/_build/onlyAuth.9dfddacc.js": {
    "type": "application/javascript",
    "etag": "\"10a-IVeza34R6fke0mZcii5A9SBF5Bw\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 266,
    "path": "../public/_build/onlyAuth.9dfddacc.js"
  },
  "/_build/onlyNoAuth.4d05921b.js": {
    "type": "application/javascript",
    "etag": "\"e2-jfsS9CuIMc2CDXqH2Lia65In+2w\"",
    "mtime": "2023-10-19T12:43:56.792Z",
    "size": 226,
    "path": "../public/_build/onlyNoAuth.4d05921b.js"
  },
  "/_build/pascal.7442fd46.js": {
    "type": "application/javascript",
    "etag": "\"ca9-zqUYmdA89CxQEDucYC3S706Ida0\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 3241,
    "path": "../public/_build/pascal.7442fd46.js"
  },
  "/_build/pascaligo.385edc0e.js": {
    "type": "application/javascript",
    "etag": "\"8c6-wWVD8PM81uF4fhSwnnPlntHFats\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 2246,
    "path": "../public/_build/pascaligo.385edc0e.js"
  },
  "/_build/perl.d5fb326c.js": {
    "type": "application/javascript",
    "etag": "\"2135-HWg+JSsSV/PdUXSNfQy4tdZVg40\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 8501,
    "path": "../public/_build/perl.d5fb326c.js"
  },
  "/_build/perspective.40b72714.js": {
    "type": "application/javascript",
    "etag": "\"a20c-CGFKsbJsMmcayLYL7xgJSh/bKZg\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 41484,
    "path": "../public/_build/perspective.40b72714.js"
  },
  "/_build/perspective.4ba55fb4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2d16-8wdA7ud8cbt5UDDFIjYjOmbqVhY\"",
    "mtime": "2023-10-19T12:43:56.761Z",
    "size": 11542,
    "path": "../public/_build/perspective.4ba55fb4.css"
  },
  "/_build/pgsql.2d7db25a.js": {
    "type": "application/javascript",
    "etag": "\"358e-MtyDB+8le8/jro7X7PKBiK2bBi4\"",
    "mtime": "2023-10-19T12:43:56.838Z",
    "size": 13710,
    "path": "../public/_build/pgsql.2d7db25a.js"
  },
  "/_build/php.1daff147.js": {
    "type": "application/javascript",
    "etag": "\"2051-3fRtsSUli2Lpwyntrl5anqeP180\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 8273,
    "path": "../public/_build/php.1daff147.js"
  },
  "/_build/pla.1b3e1614.js": {
    "type": "application/javascript",
    "etag": "\"789-8WkM2qNwt/F7Bo7HSAaQlJbl+ig\"",
    "mtime": "2023-10-19T12:43:56.841Z",
    "size": 1929,
    "path": "../public/_build/pla.1b3e1614.js"
  },
  "/_build/postiats.9db13649.js": {
    "type": "application/javascript",
    "etag": "\"1fa6-T6Iv89XNiulWCK9RbXhkzPrLEzA\"",
    "mtime": "2023-10-19T12:43:56.786Z",
    "size": 8102,
    "path": "../public/_build/postiats.9db13649.js"
  },
  "/_build/powerquery.4c428232.js": {
    "type": "application/javascript",
    "etag": "\"4321-Mq2UCsE+QcxtEreWPlZI5FTYUFs\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 17185,
    "path": "../public/_build/powerquery.4c428232.js"
  },
  "/_build/powershell.d3380668.js": {
    "type": "application/javascript",
    "etag": "\"dbb-M5TUy0RN9B6leeV2wuEJnpA4OUk\"",
    "mtime": "2023-10-19T12:43:56.838Z",
    "size": 3515,
    "path": "../public/_build/powershell.d3380668.js"
  },
  "/_build/profile.7d2a3913.js": {
    "type": "application/javascript",
    "etag": "\"9e4-vTndeThFKpTRXn3VDlBPztMu+08\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 2532,
    "path": "../public/_build/profile.7d2a3913.js"
  },
  "/_build/protobuf.941cf3e8.js": {
    "type": "application/javascript",
    "etag": "\"244c-OiMt3jkOXnOl4gXuf7v7ng2iElM\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 9292,
    "path": "../public/_build/protobuf.941cf3e8.js"
  },
  "/_build/pug.cfe384ef.js": {
    "type": "application/javascript",
    "etag": "\"13d2-2YCBv6prfbzKFntWIqfdjeuNysU\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 5074,
    "path": "../public/_build/pug.cfe384ef.js"
  },
  "/_build/python.9c13a108.js": {
    "type": "application/javascript",
    "etag": "\"fb0-FXHUyx8P9J7o+EqFjLX0Qho/b5k\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 4016,
    "path": "../public/_build/python.9c13a108.js"
  },
  "/_build/qr-code.63d6584e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ce-IgNvD7dMr9Wx5VB+p94Qub+9ciM\"",
    "mtime": "2023-10-19T12:43:56.765Z",
    "size": 206,
    "path": "../public/_build/qr-code.63d6584e.css"
  },
  "/_build/qr-code.f72fee59.js": {
    "type": "application/javascript",
    "etag": "\"6756-mV/yHSiedvXKkePugLYO9mLAFBs\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 26454,
    "path": "../public/_build/qr-code.f72fee59.js"
  },
  "/_build/qsharp.e125d03f.js": {
    "type": "application/javascript",
    "etag": "\"c6d-xzSf34J3MYK0VPYlGwN7zdSryF8\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 3181,
    "path": "../public/_build/qsharp.e125d03f.js"
  },
  "/_build/r.e0a01d4f.js": {
    "type": "application/javascript",
    "etag": "\"d31-H5xB9+xkCq7doobub70qKOItFTY\"",
    "mtime": "2023-10-19T12:43:56.804Z",
    "size": 3377,
    "path": "../public/_build/r.e0a01d4f.js"
  },
  "/_build/razor.94f1f1f3.js": {
    "type": "application/javascript",
    "etag": "\"23d9-iT2ly1pZULVQm6ZR0qxgsVfWwZU\"",
    "mtime": "2023-10-19T12:43:56.792Z",
    "size": 9177,
    "path": "../public/_build/razor.94f1f1f3.js"
  },
  "/_build/redis.d0a12fea.js": {
    "type": "application/javascript",
    "etag": "\"eda-AaC0XwoeTIJyo0a8fEzXI4ZtqLk\"",
    "mtime": "2023-10-19T12:43:56.846Z",
    "size": 3802,
    "path": "../public/_build/redis.d0a12fea.js"
  },
  "/_build/redshift.a163b94a.js": {
    "type": "application/javascript",
    "etag": "\"2f0e-cTrKFvzjH7TtQr9UI4qA/yobJnU\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 12046,
    "path": "../public/_build/redshift.a163b94a.js"
  },
  "/_build/reset-password.4d972cd5.js": {
    "type": "application/javascript",
    "etag": "\"1592-nnZ7saeC4kd6szcVx6RTBSW+Kng\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 5522,
    "path": "../public/_build/reset-password.4d972cd5.js"
  },
  "/_build/reset-password.57439420.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2cd-ykzE3D7J8on6MCCO6QyxHOWuhuI\"",
    "mtime": "2023-10-19T12:43:56.760Z",
    "size": 717,
    "path": "../public/_build/reset-password.57439420.css"
  },
  "/_build/restructuredtext.5a906e1a.js": {
    "type": "application/javascript",
    "etag": "\"102b-t62hMsr+3uAkQsSAHCu3lAyL5yY\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 4139,
    "path": "../public/_build/restructuredtext.5a906e1a.js"
  },
  "/_build/ruby.05b021bf.js": {
    "type": "application/javascript",
    "etag": "\"222e-ubRyC6000X89sIe2Tyum3HIHXbw\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 8750,
    "path": "../public/_build/ruby.05b021bf.js"
  },
  "/_build/rust.3d80982c.js": {
    "type": "application/javascript",
    "etag": "\"1136-QaNoz5j3XkFurqotQSUvMlfzf5k\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 4406,
    "path": "../public/_build/rust.3d80982c.js"
  },
  "/_build/sb.2020a5af.js": {
    "type": "application/javascript",
    "etag": "\"81b-OmhTSIvQSKLAYVXZ4B95lxFq2AQ\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 2075,
    "path": "../public/_build/sb.2020a5af.js"
  },
  "/_build/scala.54469b4b.js": {
    "type": "application/javascript",
    "etag": "\"1d8c-0V1cAbDfbIgXaOZk+WOi5xkPwiU\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 7564,
    "path": "../public/_build/scala.54469b4b.js"
  },
  "/_build/scheme.ff6e5671.js": {
    "type": "application/javascript",
    "etag": "\"7dd-M+TTFoDim/3IK6crcHGgRtyXh0k\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 2013,
    "path": "../public/_build/scheme.ff6e5671.js"
  },
  "/_build/scroll.854aa195.js": {
    "type": "application/javascript",
    "etag": "\"4a6-mPhx/wNDuMqJAoAyDnAkzRiBKsc\"",
    "mtime": "2023-10-19T12:43:56.844Z",
    "size": 1190,
    "path": "../public/_build/scroll.854aa195.js"
  },
  "/_build/scss.77902feb.js": {
    "type": "application/javascript",
    "etag": "\"19ff-eBf882Y1u/XyXUafRlHkwCiCpzM\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 6655,
    "path": "../public/_build/scss.77902feb.js"
  },
  "/_build/shell.3c06def6.js": {
    "type": "application/javascript",
    "etag": "\"cf7-D4EfbK05ppWOZBtV+fkcmfAgZnY\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 3319,
    "path": "../public/_build/shell.3c06def6.js"
  },
  "/_build/signup.da14071e.js": {
    "type": "application/javascript",
    "etag": "\"192d-7v0lKXUrRZydVPBhoiAIBTYlhiY\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 6445,
    "path": "../public/_build/signup.da14071e.js"
  },
  "/_build/solidity.3d59d6a7.js": {
    "type": "application/javascript",
    "etag": "\"499b-XOtDEkVR87tNBqI0m4A4u040ass\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 18843,
    "path": "../public/_build/solidity.3d59d6a7.js"
  },
  "/_build/sophia.12eb7ba8.js": {
    "type": "application/javascript",
    "etag": "\"bc2-cyNQUwEyEXqKLuPDbTzqPoECTR8\"",
    "mtime": "2023-10-19T12:43:56.786Z",
    "size": 3010,
    "path": "../public/_build/sophia.12eb7ba8.js"
  },
  "/_build/sparql.e42fb28a.js": {
    "type": "application/javascript",
    "etag": "\"aee-2IENVcsvtg26oL9unpghDwJwyc8\"",
    "mtime": "2023-10-19T12:43:56.838Z",
    "size": 2798,
    "path": "../public/_build/sparql.e42fb28a.js"
  },
  "/_build/sql.d30fd9fd.js": {
    "type": "application/javascript",
    "etag": "\"292f-CylEIydJpKrjoHcu9cqt5jsrtBY\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 10543,
    "path": "../public/_build/sql.d30fd9fd.js"
  },
  "/_build/st.0857f583.js": {
    "type": "application/javascript",
    "etag": "\"1ddd-hrnZzgpRR1JLYB7gaJvtYCs2HBk\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 7645,
    "path": "../public/_build/st.0857f583.js"
  },
  "/_build/swift.f0a706dd.js": {
    "type": "application/javascript",
    "etag": "\"1529-3C53rBbE8ZaeBNnqbhuGUozRNho\"",
    "mtime": "2023-10-19T12:43:56.838Z",
    "size": 5417,
    "path": "../public/_build/swift.f0a706dd.js"
  },
  "/_build/systemverilog.0cfd4211.js": {
    "type": "application/javascript",
    "etag": "\"1ea9-AgkyU7DH1OQ7qLndcPvn3QHQxv4\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 7849,
    "path": "../public/_build/systemverilog.0cfd4211.js"
  },
  "/_build/tcl.7df3c0c5.js": {
    "type": "application/javascript",
    "etag": "\"ee9-xk/4LydX85KWtgvu7kQKaFCVl/c\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 3817,
    "path": "../public/_build/tcl.7df3c0c5.js"
  },
  "/_build/tsMode.c5d1bde5.js": {
    "type": "application/javascript",
    "etag": "\"5b29-y6O3Alj0/cFE5h+7fYYzLUkya3A\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 23337,
    "path": "../public/_build/tsMode.c5d1bde5.js"
  },
  "/_build/twig.f894aab2.js": {
    "type": "application/javascript",
    "etag": "\"184b-6ehwOqblVtOqO+JcIsaGIs3PSvQ\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 6219,
    "path": "../public/_build/twig.f894aab2.js"
  },
  "/_build/typescript.b11d7ee7.js": {
    "type": "application/javascript",
    "etag": "\"16ae-gJZAwoieFaFuKiDVf6Km8iuQISQ\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 5806,
    "path": "../public/_build/typescript.b11d7ee7.js"
  },
  "/_build/useAdmin.32e13f1f.js": {
    "type": "application/javascript",
    "etag": "\"131-/Z4LGNuk34/DwI/xqtq6L4l45H0\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 305,
    "path": "../public/_build/useAdmin.32e13f1f.js"
  },
  "/_build/useAuth.4622d54b.js": {
    "type": "application/javascript",
    "etag": "\"94f-Rlusu9PnT1pFoxhm24zyGvBe1zE\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 2383,
    "path": "../public/_build/useAuth.4622d54b.js"
  },
  "/_build/useChat.bf1b979e.js": {
    "type": "application/javascript",
    "etag": "\"3811-STD+Z9q1UxVLxCv1LRI3Gi6zh0M\"",
    "mtime": "2023-10-19T12:43:56.845Z",
    "size": 14353,
    "path": "../public/_build/useChat.bf1b979e.js"
  },
  "/_build/useTitle.555755d3.js": {
    "type": "application/javascript",
    "etag": "\"9f-ZzL6rFSJ6neKXA9KP7JgczXGhTg\"",
    "mtime": "2023-10-19T12:43:56.786Z",
    "size": 159,
    "path": "../public/_build/useTitle.555755d3.js"
  },
  "/_build/vb.39a025f4.js": {
    "type": "application/javascript",
    "etag": "\"1795-/epUOwDtsmgorr6m3cma2PV9O1o\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 6037,
    "path": "../public/_build/vb.39a025f4.js"
  },
  "/_build/wgsl.afa2396f.js": {
    "type": "application/javascript",
    "etag": "\"1d97-4x8XWs+/BOE9JzY5oWJjtVNIr6M\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 7575,
    "path": "../public/_build/wgsl.afa2396f.js"
  },
  "/_build/xml.46f98888.js": {
    "type": "application/javascript",
    "etag": "\"af7-OAVEaELiu7VuNnln739jc1SruQY\"",
    "mtime": "2023-10-19T12:43:56.805Z",
    "size": 2807,
    "path": "../public/_build/xml.46f98888.js"
  },
  "/_build/yaml.ddf77c38.js": {
    "type": "application/javascript",
    "etag": "\"113e-9eXtRdJ21uBRKcMOYousn0S75+k\"",
    "mtime": "2023-10-19T12:43:56.852Z",
    "size": 4414,
    "path": "../public/_build/yaml.ddf77c38.js"
  },
  "/_build/_conv_.d20d2dab.js": {
    "type": "application/javascript",
    "etag": "\"363-Q8AhQZ5sKUbJ0hZjDhr00RjPkFE\"",
    "mtime": "2023-10-19T12:43:56.819Z",
    "size": 867,
    "path": "../public/_build/_conv_.d20d2dab.js"
  },
  "/_build/_Uint8Array.a11e697a.js": {
    "type": "application/javascript",
    "etag": "\"11d8-yJBHpYdtb9kduT2KIAbVtazsTYQ\"",
    "mtime": "2023-10-19T12:43:56.866Z",
    "size": 4568,
    "path": "../public/_build/_Uint8Array.a11e697a.js"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_build":{"maxAge":31536000}};

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
