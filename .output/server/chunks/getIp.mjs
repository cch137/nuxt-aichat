function getIp(req) {
  const ips = (req == null ? void 0 : req.headers["x-forwarded-for"]) || (req == null ? void 0 : req.headers["x-real-ip"]) || (req == null ? void 0 : req.ip) || "";
  return ips.split(",").map((i) => i.trim())[0];
}

export { getIp as g };
//# sourceMappingURL=getIp.mjs.map
