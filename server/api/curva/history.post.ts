import { readBody } from "h3";
import { getUidByToken } from "~/server/services/token";
import { Conversation } from "~/server/services/chatbots/curva";

export default defineEventHandler(async (event) => {
  const conv = (await readBody(event))?.id as string;
  const uid = getUidByToken(event);
  if (!uid) {
    return { error: 1 };
  }
  try {
    return await new Conversation(uid, conv).getHistory();
  } catch {
    return { error: 2 };
  }
});
