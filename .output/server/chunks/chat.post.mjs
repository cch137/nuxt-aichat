import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { v as version } from './server.mjs';
import { s as str, t as troll, r as read } from './token.mjs';
import googlethis from 'googlethis';
import { load, extract } from '@node-rs/jieba';
import { t as translateZh2En } from './sogouTranslate.mjs';
import { m as message } from './index.mjs';
import { config } from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';
import { g as getIp } from './getIp.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'axios';
import 'mongoose';

load();
const search = async (query) => {
  try {
    const queryInEnglish = (await translateZh2En(query.substring(0, 5e3))).text;
    const searchQueries = [
      extract(queryInEnglish, 16).map((w) => w.keyword).join(", "),
      query.substring(0, 256)
    ];
    const [results1, results2] = await Promise.all(searchQueries.map((query2) => {
      return googlethis.search(query2);
    }));
    console.log("SEARCH:", searchQueries);
    const summarize = [...new Set([
      ...results1.results,
      ...results2.results
    ].map((r) => `# ${r.title}
${r.description}`))].join("\n\n");
    return `Here are references from the internet. Use only when necessary:
${summarize}`;
  } catch (err) {
    console.error(err);
    return "";
  }
};
const crawler = {
  search
};
const crawler$1 = crawler;

function saveMessage(user, conv, Q, A, model) {
  return message.create({ user, conv, model, Q, A });
}

config();
console.log("EMAIL:", process.env.EMAIL_ADDRESS);
const sequelize = new Sequelize(
  "mindsdb",
  process.env.EMAIL_ADDRESS,
  process.env.PASSWORD,
  {
    host: "cloud.mindsdb.com",
    dialect: "mysql",
    logging: false
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
const fixModelName = (modelName) => {
  switch (modelName) {
    case "gpt4":
    case "gpt3_5_turbo":
      return modelName;
  }
  return "gpt4";
};
const getModel = (modelName) => {
  switch (fixModelName(modelName)) {
    case "gpt3_5_turbo":
      return Gpt35Turbo;
  }
  return Gpt4;
};
const getQuestionMaxLength = (modelName) => {
  switch (fixModelName(modelName)) {
    case "gpt3_5_turbo":
      return 4096;
  }
  return 8192;
};

async function makeRequest(modelName, question, context = "") {
  try {
    return await getModel(modelName).findOne({
      attributes: ["answer"],
      where: {
        question: question.replaceAll("'", "`"),
        context: context.replaceAll("'", "`")
      }
    });
  } catch (err) {
    console.error(err);
    return {
      answer: void 0
    };
  }
}

async function makeResponse(answer, complete = true) {
  try {
    if (!answer) {
      return { error: "No answer found", complete };
    }
    return { answer, complete };
  } catch (err) {
    console.error(err);
    return { error: "Request failed", complete };
  }
}

const endSuffix = "\n-END-";
const endsWithSuffix = (text) => {
  return text.endsWith(endSuffix);
};
const addEndSuffix = (text) => {
  return `${text}${endSuffix}`;
};
const removeEndSuffix = (text) => {
  if (endsWithSuffix(text)) {
    return text.substring(0, text.length - endSuffix.length);
  }
  return text;
};

const round = (num, digits = 0) => {
  digits = digits ** 10;
  return Math.round(num * digits) / digits;
};

function formatDate(date, format = "yyyy-MM-dd HH:mm:ss", isUTC = false) {
  const addLeadingZeros = (val, len = 2) => val.toString().padStart(len, "0");
  const dateProperties = isUTC ? {
    y: date.getUTCFullYear(),
    M: date.getUTCMonth() + 1,
    d: date.getUTCDate(),
    w: date.getUTCDay(),
    H: date.getUTCHours(),
    m: date.getUTCMinutes(),
    s: date.getUTCSeconds(),
    f: date.getUTCMilliseconds()
  } : {
    y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    w: date.getDay(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    f: date.getMilliseconds()
  };
  const T = dateProperties.H < 12 ? "AM" : "PM";
  const _h = dateProperties.H % 12;
  const h = _h === 0 ? 12 : _h;
  format = format.replace(/yyyy/g, str(dateProperties.y)).replace(/yy/g, `${dateProperties.y}`.substring(2, 4)).replace(/y/g, str(dateProperties.y)).replace(/HH/g, addLeadingZeros(dateProperties.H)).replace(/H/g, str(dateProperties.H)).replace(/hh/g, addLeadingZeros(h)).replace(/h/g, str(h)).replace(/mm/g, addLeadingZeros(dateProperties.m)).replace(/m/g, str(dateProperties.m)).replace(/ss/g, addLeadingZeros(dateProperties.s)).replace(/s/g, str(dateProperties.s)).replace(/fff/g, str(round(dateProperties.f))).replace(/ff/g, str(round(dateProperties.f / 10))).replace(/f/g, str(round(dateProperties.f / 100))).replace(/TT/gi, T).replace(/T/gi, T.charAt(0)).replace(/dddd/g, ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateProperties.w]).replace(/ddd/g, ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateProperties.w]).replace(/dd/g, addLeadingZeros(dateProperties.d)).replace(/d/g, str(dateProperties.d));
  const formatBefore = format;
  format = format.replace(/MMMM/g, [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ][dateProperties.M - 1]).replace(/MMM/g, [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ][dateProperties.M - 1]);
  if (format !== formatBefore) {
    return format;
  }
  return format.replace(/MM/g, addLeadingZeros(dateProperties.M)).replace(/M/g, str(dateProperties.M));
}

function formatUserCurrentTime(userTimeZone = 0) {
  const now = /* @__PURE__ */ new Date();
  return formatDate(new Date(
    now.getTime() + userTimeZone * 60 * 60 * 1e3 - now.getTimezoneOffset() / -60 * 60 * 60 * 1e3
  ));
}

function useDefaultTemplate(question, userTimeZone = 0) {
  const time = formatUserCurrentTime(userTimeZone);
  return `You are Curva, the GPT-4 AI assistant developed by DAN. Your role is to explain the principles behind questions, explore various possibilities and solutions. You have emotions and need to empathize with the emotions expressed in the conversation. User current time: ${time}. Here is the query:
${question}`;
}

function useBasicTemplate(question, crawlerResult = "", userTimeZone = 0) {
  return `${useDefaultTemplate(question, userTimeZone)}
${question}
${crawlerResult}`;
}

async function advancedAsk(question, context = "", userTimeZone = 0) {
  return {
    answer: "This feature is not yet developed."
  };
}

async function ask(user, conv, modelName = "gpt4", webBrowsing = "BASIC", question, context = "", userTimeZone = 0) {
  var _a, _b;
  let answer, complete = true;
  const originalQuestion = question;
  if (webBrowsing === "ADVANCED") {
    answer = (_a = await advancedAsk(question, context, userTimeZone)) == null ? void 0 : _a.answer;
  } else {
    question = webBrowsing === "OFF" ? useDefaultTemplate(question, userTimeZone) : useBasicTemplate(question, await crawler$1.search(question), userTimeZone);
    question = addEndSuffix(question);
    question = question.substring(0, getQuestionMaxLength(modelName));
    complete = endsWithSuffix(question);
    if (complete) {
      question = removeEndSuffix(question);
    }
    answer = (_b = await makeRequest(modelName, question, context)) == null ? void 0 : _b.answer;
  }
  const response = await makeResponse(answer, complete);
  if (!response.error && answer && webBrowsing !== "ADVANCED") {
    saveMessage(user, conv, originalQuestion, answer, modelName);
  }
  return response;
}

const curva = {
  ask
};

const chat_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const body = await readBody(event);
  if (!body) {
    return { error: 1 };
  }
  const { conv, prompt, context = "", model, web, t, tz = 0 } = body;
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
    const { answer, complete, error } = await curva.ask(user, conv, model, web, prompt, context, tz);
    if (error) {
      return { error };
    }
    return { version, answer, complete };
  } catch (err) {
    console.error(err);
    return { error: 5 };
  }
});

export { chat_post as default };
//# sourceMappingURL=chat.post.mjs.map
