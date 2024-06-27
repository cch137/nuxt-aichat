import { version } from "~/config/server";

export default defineEventHandler(async () => {
  return { version };
});
