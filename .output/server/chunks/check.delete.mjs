import { defineEventHandler } from 'h3';
import { serialize } from 'cookie';

const check_delete = defineEventHandler(async function(event) {
  event.node.res.setHeader("Set-Cookie", serialize("admin", "", {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true
  }));
  return { isLoggedIn: false };
});

export { check_delete as default };
//# sourceMappingURL=check.delete.mjs.map
