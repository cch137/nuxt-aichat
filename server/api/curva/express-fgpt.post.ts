import { readBody } from "h3";
import curva from "~/server/services/chatbots/curva";

const trueKey =
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const question = (body?.question as string) || "Hi";
  const key = body?.key as string | undefined;
  if (key !== trueKey) {
    return { answer: "", error: "API KEY ERROR" };
  }
  console.log("curva express-fgpt", Date.now());
  const { answer, error = "" } = await curva.fgpt(question);
  return { answer, error };
});
