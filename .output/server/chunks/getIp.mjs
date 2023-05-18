const getIp = (req) => {
  return (req == null ? void 0 : req.headers["x-forwarded-for"]) || (req == null ? void 0 : req.headers["x-real-ip"]) || (req == null ? void 0 : req.ip) || "";
};
const getIp$1 = getIp;

export { getIp$1 as g };
//# sourceMappingURL=getIp.mjs.map
