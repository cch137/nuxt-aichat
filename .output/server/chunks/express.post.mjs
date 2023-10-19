import { defineEventHandler, readBody } from 'h3';

const trueKey = "bwAmMGcccc9BraUShKlJwDxfwW59zUjiQUstz7dGoX91JQr9bdsrZ7F73uDSTOic";
const express_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  (body == null ? void 0 : body.question) || "Hi";
  (body == null ? void 0 : body.context) || "";
  (body == null ? void 0 : body.modelName) || "gpt4_t05_6k";
  const key = body == null ? void 0 : body.key;
  if (key !== trueKey) {
    return { answer: "", error: "API KEY ERROR" };
  }
  console.log("curva express", Date.now());
  return { answer: "", error: "This method is deprecated." };
});

export { express_post as default };
//# sourceMappingURL=express.post.mjs.map
