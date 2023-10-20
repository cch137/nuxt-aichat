import { d as defineEventHandler } from './nitro/node-server.mjs';
import { serialize } from 'cookie';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

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
