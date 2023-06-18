import { defineEventHandler } from 'h3';
import { serialize } from 'cookie';

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
