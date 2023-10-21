import { parse } from 'cookie';

async function checkPassword(event) {
  var _a, _b, _c, _d;
  const password = (_d = parse(((_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.cookie) || "")) == null ? void 0 : _d.admin;
  return process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
}

export { checkPassword as c };
//# sourceMappingURL=checkPassword.mjs.map
