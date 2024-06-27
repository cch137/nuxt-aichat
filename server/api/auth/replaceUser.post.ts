import { readBody } from "h3";
import { parse as parseCookie, serialize as serializeCookie } from "cookie";
import {
  read as tokenReader,
  pack as tokenPacker,
} from "~/server/services/token";
import type { TokenObject } from "~/server/services/token";

export default defineEventHandler(async function (event) {
  const { req, res } = event.node;
  const body = await readBody(event);
  // @ts-ignore
  if (!body) {
    return { error: "No form" };
  }
  const { id, password } = body;
  // @ts-ignore
  if (!id || !password) {
    return { error: "Form incomplete" };
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Password incorrect" };
  }
  const rawCookie = req?.headers?.cookie;
  const token =
    tokenReader(
      parseCookie(typeof rawCookie === "string" ? rawCookie : "").token
    ) || ({} as TokenObject);
  token.uid = id;
  res.setHeader(
    "Set-Cookie",
    serializeCookie("token", tokenPacker(token), {
      path: "/",
      httpOnly: true,
      sameSite: true,
      secure: true,
    })
  );
  return { error: false };
});
