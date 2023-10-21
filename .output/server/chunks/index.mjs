import './index2.mjs';
import mongoose from 'mongoose';

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
var _value, _callOnchange;
class AdminConfig {
  constructor(name, defaultValue, onchange) {
    __publicField(this, "name");
    __privateAdd(this, _value, void 0);
    __publicField(this, "onchange");
    __privateAdd(this, _callOnchange, (value) => this.onchange ? this.onchange(value) : void 0);
    this.name = name;
    __privateSet(this, _value, defaultValue);
    this.onchange = onchange;
  }
  get value() {
    return __privateGet(this, _value);
  }
  set value(value) {
    __privateSet(this, _value, value);
    this.save();
    __privateGet(this, _callOnchange).call(this, value);
  }
  async init() {
    const item = await mongoose.connection.collection("admin").findOne({ name: this.name });
    if (item === null) {
      this.save();
    } else {
      __privateSet(this, _value, (item == null ? void 0 : item.value) || __privateGet(this, _value));
      __privateGet(this, _callOnchange).call(this, __privateGet(this, _value));
    }
    return this;
  }
  async save() {
    mongoose.connection.collection("admin").updateOne(
      { name: this.name },
      { $set: { name: this.name, value: __privateGet(this, _value) } },
      { upsert: true }
    );
  }
}
_value = new WeakMap();
_callOnchange = new WeakMap();
const searchEngineConfig = new AdminConfig("search-engine", "google", (v) => {
});
searchEngineConfig.init();
const admin = {
  searchEngineConfig
};
const admin$1 = admin;

export { admin$1 as a };
//# sourceMappingURL=index.mjs.map
