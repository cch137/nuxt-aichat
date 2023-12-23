import { r as random } from './random.mjs';

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
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _index, _ondata, _isEnd, _timeoutId, _extendTimeout, extendTimeout_fn;
class StreamManager extends Map {
  constructor() {
    super();
  }
  create() {
    return new Stream();
  }
}
const streamManager = new StreamManager();
function generateStreamId() {
  let id = "";
  while (!id || streamManager.has(id)) {
    id = random.base64(16);
  }
  return id;
}
function callHandler(handler, value) {
  if (handler) {
    try {
      handler(value);
    } catch {
    }
  }
}
class StreamPipe {
  constructor(stream, handlers = {}) {
    __publicField(this, "stream");
    __privateAdd(this, _index, 0);
    __privateAdd(this, _ondata, void 0);
    this.stream = stream;
    __privateSet(this, _ondata, handlers.data);
    this.read();
    stream.addEventListener("data", () => this.read());
    stream.addEventListener("error", () => callHandler(handlers.error));
    stream.addEventListener("end", () => callHandler(handlers.end));
    if (stream.isEnd) {
      callHandler(handlers.end);
    }
  }
  read() {
    const content = this.stream.readArray(__privateGet(this, _index));
    callHandler(__privateGet(this, _ondata), content.join(""));
    __privateSet(this, _index, __privateGet(this, _index) + content.length);
  }
}
_index = new WeakMap();
_ondata = new WeakMap();
class Stream extends EventTarget {
  constructor(timeoutMs = 1 * 60 * 1e3) {
    super();
    __privateAdd(this, _extendTimeout);
    __publicField(this, "id");
    __publicField(this, "data", []);
    __publicField(this, "isError", false);
    __privateAdd(this, _isEnd, false);
    __privateAdd(this, _timeoutId, void 0);
    __publicField(this, "timeoutMs");
    this.timeoutMs = timeoutMs;
    this.id = generateStreamId();
    streamManager.set(this.id, this);
    __privateMethod(this, _extendTimeout, extendTimeout_fn).call(this);
  }
  get isEnd() {
    return __privateGet(this, _isEnd);
  }
  get length() {
    return this.data.length;
  }
  pipe(handlers = {}) {
    return new StreamPipe(this, handlers);
  }
  write(value) {
    this.data.push(value);
    this.dispatchEvent(new Event("data"));
    __privateMethod(this, _extendTimeout, extendTimeout_fn).call(this);
  }
  readArray(startIndex = 0, endIndex = this.data.length) {
    return this.data.slice(startIndex, endIndex);
  }
  read(startIndex = 0, endIndex = this.data.length) {
    return this.readArray(startIndex, endIndex).join("");
  }
  end() {
    __privateSet(this, _isEnd, true);
    this.dispatchEvent(new Event("data"));
    this.dispatchEvent(new Event("end"));
  }
  destroy() {
    streamManager.delete(this.id);
  }
  error(e) {
    this.isError = true;
    this.dispatchEvent(new Event("error", e));
  }
}
_isEnd = new WeakMap();
_timeoutId = new WeakMap();
_extendTimeout = new WeakSet();
extendTimeout_fn = function() {
  clearTimeout(__privateGet(this, _timeoutId));
  return __privateSet(this, _timeoutId, setTimeout(() => {
    if (!__privateGet(this, _isEnd)) {
      this.error();
      this.end();
    }
    this.destroy();
  }, this.timeoutMs));
};
const streamManager$1 = streamManager;

export { streamManager$1 as s };
//# sourceMappingURL=streamManager.mjs.map
