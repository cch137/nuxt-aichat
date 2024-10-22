import { d as defineEventHandler } from './nitro/node-server.mjs';
import axios from 'axios';
import { serialize } from 'cookie';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';

const transfer = defineEventHandler(async function(event) {
  const { req, res } = event.node;
  res.statusCode = 302;
  res.setHeader("Location", "/");
  try {
    const passport = (((req.url || "").split("?")[1] || "").split("&").map((i) => i.split("=").map((j) => j.trim())).find((i) => i[0] === "passport") || ["", ""])[1];
    const tokenString = (await axios.post("https://api.cch137.link/lockers", { id: passport })).data;
    res.setHeader("Set-Cookie", serialize("token", tokenString, {
      path: "/",
      httpOnly: true,
      sameSite: true,
      secure: true
    }));
    return { isLoggedIn: true };
  } catch {
    return { isLoggedIn: false };
  }
});

export { transfer as default };
//# sourceMappingURL=transfer.mjs.map
