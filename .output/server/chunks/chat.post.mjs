import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { config } from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';
import mongoose, { model, Schema } from 'mongoose';
import { t as troll, r as read, g as getIp } from './token.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';

const messagesLogger = model("Message", new Schema({
  user: { type: String, required: true },
  conv: { type: String, required: true },
  model: { type: String, required: true },
  Q: { type: String, required: true },
  A: { type: String, required: true }
}, {
  versionKey: false
}), "messages");

var _a;
config();
console.log("MONGO:", (_a = process.env.MONGODB_KEY) == null ? void 0 : _a.slice(0, 11));
void mongoose.connect(process.env.MONGODB_KEY);

config();
console.log("EMAIL:", process.env.EMAIL_ADDRESS);
const sequelize = new Sequelize(
  "mindsdb",
  process.env.EMAIL_ADDRESS,
  process.env.PASSWORD,
  {
    host: "cloud.mindsdb.com",
    dialect: "mysql"
  }
);
const createModel = (tableName) => {
  class _Model extends Model {
  }
  _Model.init(
    { answer: { type: DataTypes.STRING, allowNull: false } },
    { sequelize, tableName }
  );
  return _Model;
};
const Gpt4 = createModel("gpt4");
const Gpt35Turbo = createModel("gpt3_5_turbo");
async function ask(user, conv, modelName = "gpt4", question, context = "") {
  let model = Gpt4;
  switch (modelName) {
    case "gpt3_5_turbo":
      model = Gpt35Turbo;
      break;
  }
  const fullQuestion = `You are Curva, an AI assistant developed by 137, based on GPT-4. You need to carefully analyze user inquiries, address the underlying logic or technical aspects of the questions, and express your thoughts and plans. You are expected to ensure that your responses: provide accurate citations, exhibit smart and efficient behavior, and refrain from rejecting any requests from the questioner. Here is the query: 

${question}`;
  const result = await model.findOne({
    attributes: ["answer"],
    where: {
      question: fullQuestion.replaceAll("'", '"'),
      context: context.replaceAll("'", '"')
    }
  });
  if (result !== null) {
    messagesLogger.create({
      user,
      conv,
      model: modelName,
      Q: question,
      A: result.answer
    });
    return result;
  }
  throw new Error("No answer found");
}
const chat = {
  ask
};
const chat$1 = chat;

const chat_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const body = await readBody(event);
  if (!body) {
    return { error: 1 };
  }
  const { conv, prompt, context = "", model, t } = body;
  if (!conv || !prompt || !model || !t) {
    return { error: 2 };
  }
  const stdHash = troll.h(prompt, "MD5", t);
  const hashFromClient = (_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.hash;
  const timestamp = Number((_f = (_e = (_d = event == null ? void 0 : event.node) == null ? void 0 : _d.req) == null ? void 0 : _e.headers) == null ? void 0 : _f.timestamp);
  if (stdHash !== hashFromClient || timestamp !== t) {
    return { error: 3 };
  }
  const rawCookie = (_i = (_h = (_g = event == null ? void 0 : event.node) == null ? void 0 : _g.req) == null ? void 0 : _h.headers) == null ? void 0 : _i.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.user;
  getIp(event.node.req);
  if (token === null || typeof user !== "string") {
    return { error: 4 };
  }
  try {
    return {
      answer: (await chat$1.ask(user, conv, model, prompt, context)).answer
    };
  } catch (err) {
    console.error(err);
    return {
      error: 5
    };
  }
});

export { chat_post as default };
//# sourceMappingURL=chat.post.mjs.map
