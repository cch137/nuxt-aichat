import { defineEventHandler, readBody } from 'h3';
import { d as discordBot } from './index.mjs';
import 'discord.js';

const admin_post = defineEventHandler(async function(event) {
  const body = await readBody(event);
  const password = body == null ? void 0 : body.passwd;
  if (password !== process.env.ADMIN_PASSWORD) {
    return null;
  }
  const t0 = Date.now();
  const action = body == null ? void 0 : body.action;
  switch (action) {
    case "DC0":
      discordBot.disconnect();
      break;
    case "DC1":
      await discordBot.connect();
      break;
  }
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        dcBotConnected: discordBot.connected,
        pass: true
      });
    }, Math.max(0, t0 - Date.now() + 500));
  });
});

export { admin_post as default };
//# sourceMappingURL=admin.post.mjs.map
