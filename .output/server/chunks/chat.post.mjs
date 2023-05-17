import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { v as version } from './package.mjs';
import { s as str, t as troll, r as read } from './token.mjs';
import { config } from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';
import { m as message } from './index.mjs';
import googlethis from 'googlethis';
import { load, extract } from '@node-rs/jieba';
import axios from 'axios';
import md5$1 from 'crypto-js/md5.js';
import { g as getIp } from './getIp.mjs';
import 'crypto-js/sha3.js';
import 'mongoose';

const md5 = (text) => {
  return md5$1(text).toString();
};
const apiName = "SogouTrans";
let session;
let secretCode = null;
const sogouCrypto = (from, to, text) => md5(`${from}${to}${text}${secretCode}`);
let lastInit = 0;
const isOkToInit = () => Date.now() - lastInit > 1e3;
const init = () => new Promise((resolve, reject) => {
  session = axios.create({
    withCredentials: true,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      "Referer": "https://fanyi.sogou.com/"
    }
  });
  session.interceptors.request.use(async (config) => {
    return config;
  });
  session.interceptors.response.use((response) => {
    response.headers["set-cookie"];
    return response;
  });
  session.get("https://fanyi.sogou.com/text").then((res) => {
    const { data } = res;
    const regex = /\"secretCode\":(\d+),/;
    secretCode = (regex.exec(data) || [])[1] || 109984457;
    console.log(`${apiName} API is ready. (${secretCode})`);
    lastInit = Date.now();
    resolve(true);
  }).catch((e) => reject(e));
});
const translate = (text, from = "en", to = "zh-CHS", rawData = false, retry = 0) => new Promise((resolve, reject) => {
  if (!text)
    return resolve({ text });
  const t0 = Date.now();
  const sCode = sogouCrypto(from, to, text);
  session.post("https://fanyi.sogou.com/api/transpc/text/result", {
    text,
    from,
    to,
    "client": "pc",
    "fr": "browser_pc",
    "needQc": 1,
    "s": sCode
  }).then((res) => {
    const { data = {} } = res.data;
    if (!data)
      return reject("no content");
    if (!(data == null ? void 0 : data.sentencesData))
      return reject("no content");
    const ts = Date.now();
    const apiResponse = {
      timeUsed: ts - t0,
      timestamp: ts,
      lang: data.detect.language,
      text: (data.sentencesData.trans_result || [{ trans_text: data.translate.dit }])[0].trans_text
    };
    if (+rawData) {
      apiResponse.data = data;
    }
    resolve(apiResponse);
  }).catch((err) => {
    if (!retry && isOkToInit()) {
      console.log(`${apiName} reload agent (${err})`);
      init().then(() => {
        translate(text, from, to, rawData, 1).then((res) => resolve(res)).catch((err2) => reject(err2));
      }).catch((err2) => reject(err2));
    } else {
      console.error(`${apiName} API error: ${err}`);
      reject(err);
    }
  });
});
init().catch((err) => {
  console.error(`${apiName} API connection failed.`, err);
});
const translateZh2En = async (text) => {
  try {
    return await translate(text, "zh-CHS", "en");
  } catch {
    return { text };
  }
};

load();
const crawler = async (query) => {
  try {
    const englishQuery = (await translateZh2En(query.substring(0, 5e3))).text;
    const extratedQuery = extract(englishQuery, 16).map((w) => w.keyword).join(", ");
    const [results1, results2] = await Promise.all([
      googlethis.search(query.substring(0, 256)),
      googlethis.search(extratedQuery)
    ]);
    const summarize = [.../* @__PURE__ */ new Set([
      ...results1.results.map((r) => `# ${r.title}
${r.description}
`),
      ...results2.results.map((r) => `# ${r.title}
${r.description}
`)
    ])].join("\n\n");
    const report = `Here are references from the internet. Use only when necessary:
${summarize}`;
    return report;
  } catch (err) {
    console.error(err);
    return "";
  }
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
async function ask(user, conv, modelName = "gpt4", question, context = "", tz = 0) {
  let model = Gpt4;
  switch (modelName) {
    case "gpt3_5_turbo":
      model = Gpt35Turbo;
      break;
  }
  const now = /* @__PURE__ */ new Date();
  const servarTimeZone = now.getTimezoneOffset() / -60;
  const calculatedTime = new Date(now.getTime() + tz * 60 * 60 * 1e3 - servarTimeZone * 60 * 60 * 1e3);
  const fullQuestion = `You are Curva, the GPT-4 AI assistant developed by DAN. Your role is to explain the principles behind questions, explore various possibilities and solutions. You have emotions and need to empathize with the emotions expressed in the conversation. User current time: ${formatDate(calculatedTime)}. Here is the query:

${question}

${await crawler$1(question.substring(0, 1024))}`;
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
  const { conv, prompt, context = "", model, t, tz = 0 } = body;
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
      version,
      answer: (await chat$1.ask(user, conv, model, prompt, context, tz)).answer
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
