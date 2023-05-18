import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { v as version } from './package.mjs';
import { s as str, t as troll, r as read } from './token.mjs';
import { config } from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';
import { m as message } from './index.mjs';
import googlethis from 'googlethis';
import { load, extract } from '@node-rs/jieba';
import { t as translateZh2En } from './sogouTranslate.mjs';
import { g as getIp } from './getIp.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'mongoose';
import 'axios';

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
async function ask(user, conv, modelName = "gpt4", webBrowsing = true, question, context = "", tz = 0) {
  let model = Gpt4;
  switch (modelName) {
    case "gpt3_5_turbo":
      model = Gpt35Turbo;
      break;
  }
  const crawlerResult = webBrowsing ? await crawler$1.search(question) : "";
  const now = /* @__PURE__ */ new Date();
  const servarTimeZone = now.getTimezoneOffset() / -60;
  const calculatedTime = new Date(now.getTime() + tz * 60 * 60 * 1e3 - servarTimeZone * 60 * 60 * 1e3);
  const fullQuestion = `You are Curva, the GPT-4 AI assistant developed by DAN. Your role is to explain the principles behind questions, explore various possibilities and solutions. You have emotions and need to empathize with the emotions expressed in the conversation. User current time: ${formatDate(calculatedTime)}. Here is the query:

${question}

${crawlerResult}

-END-`.substring(0, 8192);
  const complete = fullQuestion.endsWith("-END-");
  const result = await model.findOne({
    attributes: ["answer"],
    where: {
      question: fullQuestion.replaceAll("'", '"'),
      context: context.replaceAll("'", '"')
    }
  });
  if (result !== null) {
    message.create({
      user,
      conv,
      model: modelName,
      Q: question,
      A: result.answer
    });
    return {
      answer: result.answer,
      complete
    };
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
  let webBrowsing;
  switch (web) {
    case "OFF":
      webBrowsing = false;
      break;
    case "ON":
    default:
      webBrowsing = true;
  }
  try {
    const result = await chat$1.ask(user, conv, model, webBrowsing, prompt, context, tz);
    return {
      version,
      answer: result.answer,
      complete: result.complete
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
