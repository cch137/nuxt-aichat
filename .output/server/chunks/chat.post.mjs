import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { v as version } from './server.mjs';
import { m as message } from './index.mjs';
import { s as str$1, t as troll, r as read } from './token.mjs';
import axios from 'axios';
import { load as load$1 } from 'cheerio';
import googlethis from 'googlethis';
import { load, extract } from '@node-rs/jieba';
import { t as translateZh2En } from './sogouTranslate.mjs';
import { model, Schema } from 'mongoose';
import { config } from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';
import { g as getIp } from './getIp.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';

const logger = model("Log", new Schema({
  type: { type: String, required: true },
  refer: { type: String },
  text: { type: String, required: true }
}, {
  versionKey: false
}), "logs");

load();
const trimText = (text) => {
  return text.split("\n").map((ln) => ln.replace(/[\s]+/g, " ").trim()).filter((ln) => ln).join("\n");
};
const scrape = async (url) => {
  try {
    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
      url = `http://${url}`;
    }
    const origin = new URL(url).origin;
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
      "Referer": origin,
      "Origin": origin,
      "Accept-Language": "en-US,en;q=0.9"
    };
    const res = await axios.get(url, { headers, timeout: 1e4 });
    console.log("SCRAPE:", url);
    const $ = load$1(str$1(res.data));
    return trimText($("body").prop("innerText"));
  } catch (err) {
    console.log("SCRAPE FAILED:", url);
    logger.create({ type: "error.crawler.scrape", text: str$1(err) });
    return "Error: Page fetch failed";
  }
};
const summarize = async (query, showUrl = false, translate = true) => {
  try {
    const searchQueries = [query.substring(0, 256)];
    if (translate) {
      const queryInEnglish = (await translateZh2En(query.substring(0, 5e3))).text;
      searchQueries.push(extract(queryInEnglish, 16).map((w) => w.keyword).join(", "));
    }
    const searcheds = await Promise.all(searchQueries.map((query2) => {
      console.log("SEARCH:", query2);
      return googlethis.search(query2);
    }));
    const results = [];
    for (const searched of searcheds) {
      results.push(...searched.results);
      results.push(...searched.top_stories);
    }
    const summarize2 = [
      ...new Set(results.map((r) => `${showUrl ? decodeURIComponent(r.url) + "\n" : ""}${r.title ? "# " + r.title : ""}
${r.description}`))
    ].join("\n\n");
    return summarize2;
  } catch (err) {
    err = str$1(err);
    console.log("SUMMARIZE FAILED:", err);
    logger.create({ type: "error.crawler.summarize", text: err });
    return "";
  }
};
const crawler = {
  scrape,
  summarize
};
const crawler$1 = crawler;

function saveMessage(user, conv, Q, A, model) {
  return message.create({ user, conv, model, Q, A });
}

const models = /* @__PURE__ */ new Map();
config();
console.log("EMAIL:", process.env.EMAIL_ADDRESS);
const sequelize = new Sequelize(
  "mindsdb",
  process.env.EMAIL_ADDRESS,
  process.env.PASSWORD,
  {
    host: "cloud.mindsdb.com",
    dialect: "mysql",
    logging: false,
    pool: {
      min: 64,
      max: 512
    }
  }
);
const createModel = (tableName) => {
  class _Model extends Model {
  }
  _Model.init(
    { answer: { type: DataTypes.STRING, allowNull: false } },
    { sequelize, tableName }
  );
  models.set(tableName, _Model);
  return _Model;
};
const fixModelName = (modelName) => {
  if (models.has(modelName)) {
    return modelName;
  }
  return "gpt4";
};
const getModel = (modelName) => {
  return models.get(fixModelName(modelName));
};
const getQuestionMaxLength = (modelName) => {
  return fixModelName(modelName).startsWith("gpt3") ? 4096 : 8192;
};
[
  "gpt4",
  "gpt4_t00",
  "gpt4_t01",
  "gpt4_t02",
  "gpt4_t03",
  "gpt4_t04",
  "gpt4_t05",
  "gpt4_t06",
  "gpt4_t07",
  "gpt4_t08",
  "gpt4_t09",
  "gpt4_t10",
  "gpt3",
  "gpt3_t00",
  "gpt3_t01",
  "gpt3_t02",
  "gpt3_t03",
  "gpt3_t04",
  "gpt3_t05",
  "gpt3_t06",
  "gpt3_t07",
  "gpt3_t08",
  "gpt3_t09",
  "gpt3_t10",
  "gpt4_summarizer",
  "gpt4_mixer"
].forEach((modelName) => createModel(modelName));

async function makeRequest(modelName, question, context = "") {
  var _a;
  try {
    const result = await getModel(modelName).findOne({
      attributes: ["answer"],
      where: {
        question: question.replaceAll("'", "`"),
        context: context.replaceAll("'", "`")
      }
    });
    if (result === null) {
      throw Error("No Answer Found");
    }
    return { answer: result.answer };
  } catch (err) {
    const sqlMessage = (_a = err == null ? void 0 : err.original) == null ? void 0 : _a.sqlMessage;
    return { answer: void 0, sqlMessage };
  }
}

async function makeResponse(answer, complete = true, props = {}) {
  try {
    if (!answer) {
      return { error: "No answer found", complete, ...props };
    }
    return { answer, complete, ...props };
  } catch (err) {
    logger.create({ type: "error.makeResponse", text: str(err) });
    return { error: "Request failed", complete, ...props };
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
  format = format.replace(/yyyy/g, str$1(dateProperties.y)).replace(/yy/g, `${dateProperties.y}`.substring(2, 4)).replace(/y/g, str$1(dateProperties.y)).replace(/HH/g, addLeadingZeros(dateProperties.H)).replace(/H/g, str$1(dateProperties.H)).replace(/hh/g, addLeadingZeros(h)).replace(/h/g, str$1(h)).replace(/mm/g, addLeadingZeros(dateProperties.m)).replace(/m/g, str$1(dateProperties.m)).replace(/ss/g, addLeadingZeros(dateProperties.s)).replace(/s/g, str$1(dateProperties.s)).replace(/fff/g, str$1(round(dateProperties.f))).replace(/ff/g, str$1(round(dateProperties.f / 10))).replace(/f/g, str$1(round(dateProperties.f / 100))).replace(/TT/gi, T).replace(/T/gi, T.charAt(0)).replace(/dddd/g, ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dateProperties.w]).replace(/ddd/g, ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateProperties.w]).replace(/dd/g, addLeadingZeros(dateProperties.d)).replace(/d/g, str$1(dateProperties.d));
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
  return format.replace(/MM/g, addLeadingZeros(dateProperties.M)).replace(/M/g, str$1(dateProperties.M));
}

function formatUserCurrentTime(userTimeZone = 0) {
  const now = /* @__PURE__ */ new Date();
  return formatDate(new Date(
    now.getTime() + userTimeZone * 60 * 60 * 1e3 - now.getTimezoneOffset() / -60 * 60 * 60 * 1e3
  ));
}

function useDefaultTemplate(question, userTimeZone = 0, addBefore = "", addAfter = "") {
  const time = formatUserCurrentTime(userTimeZone);
  return `You are Curva, the GPT-4 AI assistant developed by DAN. Your role is to explain the principles behind questions, explore various possibilities and solutions. You have emotions and need to empathize with the emotions expressed in the conversation.
User current time: ${time}
${addBefore}Here is the query:
${question}

${addAfter}`;
}

const _wrapSearchResult = (result) => {
  return result ? `Here are references from the internet. Use only when necessary:
${result}` : "";
};
async function ask(user, conv, modelName = "gpt4", webBrowsing = "BASIC", question, context = "", userTimeZone = 0) {
  var _a;
  let answer, props = {}, complete = true;
  const originalQuestion = question;
  if (webBrowsing === "ADVANCED") {
    webBrowsing = "BASIC";
  }
  question = webBrowsing === "OFF" ? useDefaultTemplate(question, userTimeZone) : useDefaultTemplate(question, userTimeZone, "", _wrapSearchResult(await crawler$1.summarize(question)));
  question = addEndSuffix(question);
  question = question.substring(0, getQuestionMaxLength(modelName));
  complete = endsWithSuffix(question);
  if (complete) {
    question = removeEndSuffix(question);
  }
  answer = (_a = await makeRequest(modelName, question, context)) == null ? void 0 : _a.answer;
  const response = await makeResponse(answer, complete, props);
  if (!response.error && answer) {
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
  const stdHash = troll.h(`${prompt}${context}`, "MD5", t);
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
    const response = await curva.ask(user, conv, model, web, prompt, context, tz);
    if (response == null ? void 0 : response.error) {
      console.error(response == null ? void 0 : response.error);
    }
    return { version, ...response };
  } catch (err) {
    logger.create({ type: "error.api.response", text: str$1(err) });
    return { error: 5 };
  }
});

export { chat_post as default };
//# sourceMappingURL=chat.post.mjs.map
