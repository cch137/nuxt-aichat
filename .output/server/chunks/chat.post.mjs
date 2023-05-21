import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { v as version } from './server.mjs';
import { s as str, t as troll, r as read } from './token.mjs';
import axios from 'axios';
import { load as load$1 } from 'cheerio';
import googlethis from 'googlethis';
import { load, extract } from '@node-rs/jieba';
import { t as translateZh2En } from './sogouTranslate.mjs';
import { m as message } from './index.mjs';
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
    const origin = new URL(url).origin;
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
      "Referer": origin,
      "Origin": origin,
      "Accept-Language": "en-US,en;q=0.9"
    };
    const res = await axios.get(url, { headers, timeout: 1e4 });
    console.log("SCRAPE SUCCEEDED:", url);
    const $ = load$1(str(res.data));
    return trimText($("body").prop("innerText"));
  } catch (err) {
    console.log("SCRAPE FAILED:", url);
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
    logger.create({ type: "error", text: str(err) });
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
  return _Model;
};
const Gpt4 = createModel("gpt4");
const Gpt35Turbo = createModel("gpt3_5_turbo");
const Gpt4Summarizer = createModel("gpt4_summarizer");
const Gpt4Mixer = createModel("gpt4_mixer");
const fixModelName = (modelName) => {
  switch (modelName) {
    case "gpt4":
    case "gpt4_summarizer":
    case "gpt4_mixer":
    case "gpt3_5_turbo":
      return modelName;
  }
  return "gpt4";
};
const getModel = (modelName) => {
  switch (fixModelName(modelName)) {
    case "gpt4_summarizer":
      return Gpt4Summarizer;
    case "gpt4_mixer":
      return Gpt4Mixer;
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

async function makeResponse(answer, complete = true, props = {}) {
  try {
    if (!answer) {
      return { error: "No answer found", complete, ...props };
    }
    return { answer, complete, ...props };
  } catch (err) {
    console.error(err);
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
${crawlerResult}`;
}

function useParseUrlsAndQueries(question, userTimeZone = 0) {
  const time = formatUserCurrentTime(userTimeZone);
  return `You are Curva, an AI assistant based on GPT-4. The current time is ${time}. The user is requesting you to answer a question. You need to utilize search engines and web crawlers to retrieve information from the internet. Once you obtain the information, analyze it to fill in missing data or knowledge in your database and improve your ability to respond to the user. Your task is to analyze the user's question and determine the necessary information or web pages to search for. If the question includes any URLs, visit those websites. When formulating search queries, include at least one English query. Remember that you can perform 0 to 3 searches using the search engine, and limit the number of query phrases to 3. Use your searches wisely. Keep in mind that search results should be used as reference material rather than direct answers since you'll need to analyze and summarize websites to generate responses. Avoid queries with similar meanings. Avoid directly searching for the question you're contemplating. Consider yourself as an API, do not make additional comments, only respond with a JSON object in the following format: \`{ "urls": [], "queries": [] }\`
Here is the user's question: ${question}`;
}

function useSelectSites(question, results, userTimeZone = 0) {
  const time = formatUserCurrentTime(userTimeZone);
  return `You are Curva, an AI assistant based on GPT-4. The current time is ${time}. The user is asking you a question. You need to select some web pages from the search engine results, which you will analyze later. The web pages you select should be helpful for your answer. You are an API, please refrain from making any comments and only reply with a JSON array. Each element in the array should be an object with two properties: "url" (string) and "title" (string). Here is the user's question:
${question}

Here are the search engine results:
${results}`;
}

function useExtractPage(question, result, userTimeZone = 0) {
  const time = formatUserCurrentTime(userTimeZone);
  return `You are Curva, an AI assistant based on GPT-4. The current time is ${time}. The user is asking you a question. Please extract relevant information from the web page using concise phrases. Focus on key points while analyzing the page and ignore headers, footers, ads, or other irrelevant information.
Here is the user's question: ${question}

Here are the web page results: ${result}`;
}

const gpt4ScrapeAndSummary = async (question, url, userTimeZone = 0) => {
  var _a;
  try {
    const answer = ((_a = await makeRequest(
      "gpt4_summarizer",
      useExtractPage(
        question,
        (await crawler$1.scrape(url)).substring(0, 16384),
        userTimeZone
      )
    )) == null ? void 0 : _a.answer) || "";
    logger.create({ type: "adv-summary", refer: `${question}${url}`, text: str(answer) });
    return answer;
  } catch (err) {
    logger.create({ type: "error", text: str(err) });
    return "";
  }
};
async function advancedAsk(question, context = "", userTimeZone = 0) {
  var _a, _b, _c;
  try {
    const question1 = useParseUrlsAndQueries(question, userTimeZone);
    const answer1 = (_a = await makeRequest("gpt4_summarizer", question1)) == null ? void 0 : _a.answer;
    const answer1Json = answer1.substring(answer1.indexOf("{"), answer1.lastIndexOf("}") + 1);
    const { urls, queries } = JSON.parse(answer1Json);
    const _pages1 = urls.map((url) => gpt4ScrapeAndSummary(question, url, userTimeZone));
    const summary = (await Promise.all(queries.map((query) => crawler$1.summarize(query, true, false)))).join("\n\n");
    const question2 = useSelectSites(question, summary, userTimeZone);
    const answer2 = (_b = await makeRequest("gpt4_summarizer", question2)) == null ? void 0 : _b.answer;
    const answer2Json = answer2.substring(answer2.indexOf("["), answer2.lastIndexOf("]") + 1);
    const selectedSites = JSON.parse(answer2Json);
    const selectedSiteUrls = selectedSites.map((site) => site.url);
    const _pages2 = selectedSiteUrls.map((url) => gpt4ScrapeAndSummary(question, url, userTimeZone));
    const pages = [..._pages1, ..._pages2];
    const references = await new Promise(async (resolve, reject) => {
      const results = [];
      setTimeout(() => resolve(results), 3 * 6e4);
      for (const page of pages) {
        page.then((result) => results.push(result)).catch(() => results.push("")).finally(() => {
          if (results.length === pages.length) {
            resolve(results);
          }
        });
      }
    });
    const finalQuestion = useBasicTemplate(question, `Here are the references:
${references.join("\n")}`, userTimeZone).substring(0, 16384);
    logger.create({ type: "adv-final", refer: question, text: str(finalQuestion) });
    return {
      queries,
      urls,
      answer: (_c = await makeRequest("gpt4", finalQuestion, context)) == null ? void 0 : _c.answer
    };
  } catch (err) {
    logger.create({ type: "error", text: str(err) });
    return { answer: void 0 };
  }
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
    const advResult = await advancedAsk(question, context, userTimeZone);
    props = { queries: advResult.queries, urls: advResult.urls };
    if (!(advResult == null ? void 0 : advResult.answer)) {
      webBrowsing = "BASIC";
    } else {
      answer = advResult.answer;
    }
  }
  if (webBrowsing !== "ADVANCED") {
    question = webBrowsing === "OFF" ? useDefaultTemplate(question, userTimeZone) : useBasicTemplate(question, _wrapSearchResult(await crawler$1.summarize(question)), userTimeZone);
    question = addEndSuffix(question);
    question = question.substring(0, getQuestionMaxLength(modelName));
    complete = endsWithSuffix(question);
    if (complete) {
      question = removeEndSuffix(question);
    }
    answer = (_a = await makeRequest(modelName, question, context)) == null ? void 0 : _a.answer;
  }
  const response = await makeResponse(answer, complete, props);
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
