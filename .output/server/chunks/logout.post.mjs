import { d as defineEventHandler } from './nitro/node-server.mjs';
import { serialize } from 'cookie';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

const logout_post = defineEventHandler(async function(event) {
  const { res } = event.node;
  res.setHeader("Set-Cookie", serialize("token", "", {
    path: "/",
    httpOnly: true,
    sameSite: true,
    secure: true
  }));
  return { status: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
