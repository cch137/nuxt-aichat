import { defineEventHandler, readBody } from 'h3';
import { c as checkPassword } from './checkPassword.mjs';
import { serialize } from 'cookie';
import { R as RateLimiter } from './rate-limiter.mjs';
import { g as getIp } from './getIp.mjs';

const rateLimiter = new RateLimiter(10, 1 * 60 * 1e3);
const check_post = defineEventHandler(async function(event) {
  var _a;
  if (!rateLimiter.check(getIp(event.node.req))) {
    return { error: rateLimiter.hint, isLoggedIn: false };
  }
  let isLoggedIn = await checkPassword(event);
  if (isLoggedIn) {
    return { isLoggedIn };
  }
  const passwd = (_a = await readBody(event)) == null ? void 0 : _a.passwd;
  if (!passwd) {
    return { isLoggedIn: false };
  }
  event.node.res.setHeader("Set-Cookie", serialize("admin", passwd, {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true
  }));
  return { isLoggedIn: process.env.ADMIN_PASSWORD && passwd === process.env.ADMIN_PASSWORD };
});

export { check_post as default };
//# sourceMappingURL=check.post.mjs.map
