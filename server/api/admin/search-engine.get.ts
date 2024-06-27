import checkPassword from "~/server/services/admin/checkPassword";
import admin from "~/server/services/admin";

export default defineEventHandler(async function (event) {
  let isLoggedIn = await checkPassword(event);
  if (!isLoggedIn) {
    return { error: "Not Logged In" };
  }
  return { value: admin.searchEngineConfig.value };
});
