const str = (obj) => {
  if ((obj == null ? void 0 : obj.toString) === void 0) {
    return "";
  } else {
    return obj.toString();
  }
};
const lower = (o) => {
  return str(o).toLowerCase();
};
const str$1 = str;

export { lower as l, str$1 as s };
//# sourceMappingURL=str.mjs.map
