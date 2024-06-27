import type { H3Event } from "h3";
import { parse } from "cookie";

export default async function (event: H3Event) {
  const password = parse(event?.node?.req?.headers?.cookie || "")?.admin as
    | string
    | undefined;
  return process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
}
