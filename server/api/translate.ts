import { translateZh2En } from "~/server/services/sogouTranslate";
import qs from "qs";

export default defineEventHandler(async (event) => {
  const text = qs.parse(event.node.req?.url?.split("?")[1] as string)
    .text as string;
  event.node.res.setHeader("Content-Type", "text/plain; charset=utf-8");
  return (await translateZh2En(text)).text;
});
