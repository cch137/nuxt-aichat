const str = (obj) => {
  try {
    if ((obj == null ? void 0 : obj.toString) === void 0) {
      return `${obj}`;
    } else {
      const _str = obj.toString();
      return _str.startsWith("[object ") && _str.endsWith("]") ? JSON.stringify(obj) : _str;
    }
  } catch {
    return "";
  }
};
const lower = (o) => {
  return str(o).toLowerCase();
};
const str$1 = str;

export { lower as l, str$1 as s };
//# sourceMappingURL=str.mjs.map
