import { l as libExports } from './index2.mjs';
import { c as conversation } from './conversation.mjs';
import { m as message } from './message.mjs';
import { Sequelize, QueryTypes } from 'sequelize';
import { c as createAxiosSession } from './createAxiosSession.mjs';
import axios from 'axios';
import { s as str } from './str.mjs';
import { encode } from 'gpt-3-encoder';
import { s as search } from './search.mjs';
import TurndownService from 'turndown';
import { gfm } from '@joplin/turndown-plugin-gfm';
import { load } from 'cheerio';
import { c as crawlYouTubeVideo } from './ytCrawler.mjs';

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => {
  __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Conversation {
  constructor(uid, conv) {
    __publicField$9(this, "conv");
    __publicField$9(this, "uid");
    this.uid = uid;
    this.conv = conv;
  }
  async updateMtime() {
    const { uid, conv } = this;
    if (!(uid && conv)) {
      return;
    }
    await conversation.updateOne(
      { uid, id: conv },
      { $set: { mtime: Date.now() } },
      { upsert: true, projection: { _id: 0 } }
    );
  }
  async delete() {
    const { uid, conv } = this;
    if (!(uid && conv)) {
      return [];
    }
    return await message.updateMany(
      { uid, conv },
      { $set: { uid: `~${uid}` } },
      {
        projection: { _id: 0 }
      }
    );
  }
  async getHistory() {
    const { uid, conv } = this;
    if (!(uid && conv)) {
      return [];
    }
    const history = (await message.find({
      uid,
      conv
    }, {
      _id: 1,
      Q: 1,
      A: 1,
      queries: 1,
      urls: 1,
      dt: 1
    }).sort({ createdAt: 1 })).map((doc) => ({
      Q: doc.Q,
      A: doc.A,
      id: doc._id.toString("base64"),
      t: doc._id.getTimestamp().getTime(),
      queries: doc.queries,
      urls: doc.urls,
      dt: doc.dt
    }));
    return history;
  }
  async getContext() {
    const { uid, conv } = this;
    if (!(uid && conv)) {
      return [];
    }
    const processMessage = (message) => {
      const { Q, A } = message;
      if (Q) {
        if (A) {
          return [{ role: "user", content: Q }, { role: "assistant", content: A }];
        }
        return [{ role: "user", content: Q }];
      } else if (A) {
        return [{ role: "assistant", content: A }];
      }
      return [];
    };
    const messages = (await message.find({
      uid,
      conv
    }, {
      _id: 1,
      Q: 1,
      A: 1
    }).sort({ createdAt: -1 }).limit(100)).map((doc) => ({
      Q: doc.Q,
      A: doc.A,
      t: doc._id.getTimestamp().getTime()
    }));
    if (messages.length === 0) {
      return [];
    }
    return messages.map(processMessage).flat();
  }
  async saveMessage(Q, A, queries = [], urls = [], dt, regenerateId) {
    const { uid, conv } = this;
    const record = { uid, conv, Q, A };
    if (queries.length > 0) {
      record.queries = queries;
    }
    if (urls.length > 0) {
      record.urls = urls;
    }
    if (dt) {
      record.dt = dt;
    }
    if (regenerateId) {
      await message.updateOne({
        _id: new libExports.ObjectId(regenerateId),
        uid,
        conv
      }, {
        $set: record
      });
      return regenerateId;
    } else {
      return (await message.create(record))._id.toString();
    }
  }
}
const Conversation$1 = Conversation;

var __defProp$8 = Object.defineProperty;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$8 = (obj, key, value) => {
  __defNormalProp$8(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function wrapPromptTextParam(text) {
  const hasSingleQuotes = text.includes("'");
  const hasDoubleQuotes = text.includes('"');
  if (hasSingleQuotes && hasDoubleQuotes) {
    return `"${text.replace(new RegExp('"', "g"), "'")}"`;
  }
  if (hasSingleQuotes) {
    return `"${text}"`;
  }
  return `'${text}'`;
}
function getSelectSql(modelName, question, context = "") {
  question = question.replaceAll("'", "`");
  context = (context || "").replaceAll("'", "`");
  return `SELECT answer FROM mindsdb.${modelName} WHERE question = ${wrapPromptTextParam(question)} AND context = ${wrapPromptTextParam(context)}`;
}
function containsDoubleDash(str) {
  const regex = /\-\-(?!\n)/;
  return regex.test(str);
}
class MindsDBClient {
  constructor(email, password, connectMethod) {
    __publicField$8(this, "email");
    __publicField$8(this, "password");
    __publicField$8(this, "sqlClient");
    __publicField$8(this, "webClient");
    __publicField$8(this, "connectMethod");
    console.log("CREATE MindsDB Client:", email);
    this.email = email;
    this.password = password;
    this.connectMethod = connectMethod;
    this.sqlClient = new MindsDBSqlClient(this);
    this.webClient = new MindsDBWebClient(this);
  }
  get client() {
    switch (this.connectMethod) {
      case "WEB":
        return this.webClient;
      case "SQL":
      default:
        return this.sqlClient;
    }
  }
  async askGPT(modelName, question = "", context = "") {
    const client = containsDoubleDash(question) || containsDoubleDash(context || "") ? this.webClient : this.client;
    return await client.askGPT(
      modelName,
      question.replace(/[^\p{L}\p{N}\p{M}\p{P}\p{Z}\p{S}\n\t\r]/gu, ""),
      context.replace(/[^\p{L}\p{N}\p{M}\p{P}\p{Z}\p{S}\n\t\r]/gu, "")
    );
  }
  async queryWithWeb(command) {
    return await this.webClient.query(command);
  }
  restart() {
    this.sqlClient.login();
    this.webClient.login();
  }
  kill() {
    this.sqlClient.sequelize.close();
  }
}
class _Client {
  constructor(parent) {
    __publicField$8(this, "parent");
    this.parent = parent;
  }
  get email() {
    return this.parent.email;
  }
  get password() {
    return this.parent.password;
  }
}
class MindsDBSqlClient extends _Client {
  constructor(parent) {
    super(parent);
    __publicField$8(this, "sequelize");
    this.sequelize = this.login();
  }
  login() {
    const sequelize = new Sequelize(
      "mindsdb",
      this.email,
      this.password,
      {
        host: "cloud.mindsdb.com",
        // port: 3306,
        dialect: "mysql",
        logging: false,
        pool: { min: 8, max: 512 }
      }
    );
    (async () => {
      await sequelize.query("SELECT * FROM mindsdb.models");
    })();
    if (this.sequelize) {
      this.sequelize.close();
    }
    return this.sequelize = sequelize;
  }
  async askGPT(modelName, question = "Hi", context = "") {
    var _a;
    try {
      const sql = getSelectSql(modelName, question, context);
      const result = (await this.sequelize.query(
        sql,
        {
          replacements: { question, context },
          type: QueryTypes.SELECT
        }
      ))[0];
      if (result == null ? void 0 : result.answer) {
        return { answer: result.answer };
      }
      return { answer: "", error: "The source did not return a valid response." };
    } catch (err) {
      console.log(err);
      return { answer: "", error: (_a = err == null ? void 0 : err.original) == null ? void 0 : _a.sqlMessage };
    }
  }
}
class MindsDBWebClient extends _Client {
  constructor(parent) {
    super(parent);
    __publicField$8(this, "lastLoggedIn", Date.now());
    __publicField$8(this, "session");
    this.session = this.login();
  }
  login() {
    const session = createAxiosSession({
      Host: "cloud.mindsdb.com",
      Origin: "https://cloud.mindsdb.com",
      Referer: "https://cloud.mindsdb.com/editor"
    });
    session.post("https://cloud.mindsdb.com/cloud/login", {
      email: this.email,
      password: this.password,
      rememberMe: true
    });
    this.lastLoggedIn = Date.now();
    return this.session = session;
  }
  // Every 24 hours update session 
  async _maintainSession() {
    const now = Date.now();
    if (now - this.lastLoggedIn > 24 * 60 * 60 * 1e3) {
      this.login();
    }
  }
  async askGPT(modelName, question = "Hi", context = "") {
    this._maintainSession();
    question = question.replaceAll("'", "`");
    context = context.replaceAll("'", "`");
    try {
      const res = await this.session.post("https://cloud.mindsdb.com/api/sql/query", {
        query: getSelectSql(modelName, question, context),
        context: { db: "mindsdb" }
      });
      const data = res.data;
      const answerIndex = data.column_names.indexOf("answer");
      return { answer: data.data[0][answerIndex] };
    } catch (err) {
      console.log(err);
      return { answer: "", error: "The source did not return a valid response." };
    }
  }
  async query(command) {
    const res = await this.session.post("https://cloud.mindsdb.com/api/sql/query", {
      query: command,
      context: { db: "mindsdb" }
    });
    return res.data;
  }
}
const MindsDBClient$1 = MindsDBClient;

function getAllModelsSetups() {
  const models = /* @__PURE__ */ new Map();
  for (const data of [[3, [1, 2, 3]], [4, [1, 2, 3, 4, 5, 6, 7]]]) {
    for (let t = 0; t <= 10; t++) {
      const v = data[0];
      const maxTokensRange = data[1];
      for (const maxTokens of maxTokensRange) {
        models.set(`gpt${v}_t${t.toString().padStart(2, "0")}_${maxTokens}k`, {
          model_name: v === 3 ? "gpt-3.5-turbo" : "gpt-4",
          max_tokens: (v === 3 ? 4096 : 8192) - maxTokens * 1024,
          temperature: t / 10
        });
      }
    }
  }
  return models;
}
function getAllCreateCommand() {
  const setups = getAllModelsSetups();
  const commands = [];
  setups.forEach((setup, modelName) => {
    commands.push(`CREATE MODEL mindsdb.${modelName}
PREDICT answer
USING
engine = 'openai',
temperature = ${setup.temperature},
model_name = '${setup.model_name}',
max_tokens= ${setup.max_tokens},
question_column = 'question',
context_column = 'context'
`);
  });
  return commands;
}

async function sleep(timeoutMs = 0) {
  return await new Promise((resolve) => {
    setTimeout(() => resolve(null), timeoutMs);
  });
}

const contextHead = "Conversation History\n\n";
function messagesToQuestionContext(messages) {
  var _a;
  messages = [...messages];
  const isContinueGenerate = ((_a = messages.at(-1)) == null ? void 0 : _a.role) === "assistant";
  const questionMessageObj = isContinueGenerate ? { role: "user", content: "[[ CONTINUE GENERATE (Provide more details or keep creating) ]]" } : messages.at(-1) || { role: "user", content: "Hi" };
  if (questionMessageObj) {
    const indexOfMsgObj = messages.indexOf(questionMessageObj);
    if (indexOfMsgObj !== -1) {
      messages.splice(indexOfMsgObj, 1);
    }
  }
  const context = messages.length === 0 ? "" : `${contextHead}${messages.map((message) => `${message.role}: ${message.content}`).join("\n\n")}`;
  return {
    isContinueGenerate,
    question: questionMessageObj.content,
    context
  };
}
function questionContextToMessages(question = "", context = "") {
  if (context.startsWith(contextHead)) {
    context.replace(contextHead, "");
  }
  const dataSlices = context.split("\n\n");
  const messages = [];
  dataSlices.forEach((data) => {
    if (data === "") {
      return;
    }
    const role = data.startsWith("user: ") ? "user" : data.startsWith("assistant: ") ? "assistant" : void 0;
    if (role === void 0) {
      const len = messages.length;
      if (len > 0) {
        messages[len - 1].content = `${messages[len - 1].content}

${data}`;
      } else {
        messages.push({ role: "user", content: data });
      }
    } else {
      messages.push({ role, content: data });
    }
  });
  messages.push({ role: "user", content: question });
  return messages;
}

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => {
  __defNormalProp$7(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MindsDbGPTChatbotCore {
  constructor(options) {
    __publicField$7(this, "client");
    const { email, password } = options;
    this.client = new MindsDBClient$1(email, password);
  }
  init() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 5e3);
    });
  }
  async setup() {
    const commands = [
      // ...getAllDropCommand(),
      ...getAllCreateCommand()
    ];
    const tasks = [];
    for (const command of commands) {
      try {
        await sleep(500);
        await this.client.queryWithWeb(command);
        console.log(`RUNNING COMMAND... (${commands.indexOf(command) + 1}/${commands.length})`);
      } catch (err) {
        console.log(err, "\n\n");
      }
    }
    return await Promise.all(tasks);
  }
  async ask(questionOrMessages, options) {
    const { question = "", context = "" } = typeof questionOrMessages === "string" ? { question: questionOrMessages, context: (options == null ? void 0 : options.context) || "" } : messagesToQuestionContext(questionOrMessages);
    return await this.client.askGPT(options.modelName, question, context || "");
  }
  kill() {
    this.client.kill();
  }
}
const MindsDbGPTChatbotCore$1 = MindsDbGPTChatbotCore;

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => {
  __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const defaultApiHost = "https://api.freegpt.asia";
const defaultApiKey = "sk-va0ydNzw6Mc5iJ5uB6EdBd3cA14849198f74C9F086EdA4B6";
class Client {
  constructor(host = defaultApiHost, apiKey = defaultApiKey) {
    __publicField$6(this, "host");
    __publicField$6(this, "apiKey");
    this.host = host || defaultApiHost;
    this.apiKey = apiKey || defaultApiKey;
  }
  async askGPT(messages, options = {}) {
    const { model = "gpt-3.5-turbo", temperature = 0.3, top_p = 0.7, stream = false } = options;
    const url = `${this.host}/v1/chat/completions`;
    const headers = { "Content-Type": "application/json" };
    headers["Authorization"] = `Bearer ${this.apiKey}`;
    const data = {
      messages,
      model,
      temperature,
      top_p,
      stream
    };
    const req = await axios.post(url, data, { headers, validateStatus: (_) => true });
    return req.data;
  }
}
class FreeGptAsiaChatbotCore {
  constructor(options = {}) {
    __publicField$6(this, "client");
    const { host, apiKey } = options;
    this.client = new Client(host, apiKey);
  }
  init() {
    return new Promise((r) => r(true));
  }
  async ask(questionOrMessages, options = {}) {
    try {
      const messages = typeof questionOrMessages === "string" ? questionContextToMessages(questionOrMessages, (options == null ? void 0 : options.context) || "") : questionOrMessages;
      const res = await this.client.askGPT(messages, options);
      try {
        const answer = res.choices[0].message.content;
        return { answer };
      } catch {
        throw str(res);
      }
    } catch (err) {
      return { answer: "", error: str(err) };
    }
  }
  setup() {
  }
  kill() {
  }
}
const FreeGPTAsiaChatbotCore = FreeGptAsiaChatbotCore;

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
  ), "yyyy-MM-dd ddd HH:mm:ss");
}

function estimateTokens(...texts) {
  return encode(texts.join("\n")).length;
}

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => {
  __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Gpt3Chatbot {
  constructor(core) {
    __publicField$5(this, "core");
    this.core = core;
  }
  async ask(messages, options = {}) {
    const { timezone = 0, temperature = 0.5 } = options;
    const { question = "", context = "", isContinueGenerate } = messagesToQuestionContext(messages);
    const prompt = isContinueGenerate ? `${question}` : `User current time: ${formatUserCurrentTime(timezone)}
Question: ${question}`;
    const temperatureSuffix = `_t${Math.round(Math.min(Math.max(temperature, 0), 1) * 10).toString().padStart(2, "0")}`;
    const quetionTokens = estimateTokens(question, context) + 500;
    const tokensSuffix = (() => {
      switch (Math.ceil(quetionTokens / 1024)) {
        case 1:
          return "_1k";
        case 2:
          return "_2k";
        case 3:
        case 4:
          return "_3k";
        default:
          throw "Question too long";
      }
    })();
    const modelName = `gpt3${temperatureSuffix}${tokensSuffix}`;
    return {
      ...await this.core.ask(prompt, { ...options, modelName, context }),
      question,
      isContinueGenerate
    };
  }
}
const Gpt3Chatbot$1 = Gpt3Chatbot;

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => {
  __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Gpt4Chatbot {
  constructor(core) {
    __publicField$4(this, "core");
    this.core = core;
  }
  async ask(messages, options = {}) {
    const { timezone = 0, temperature = 0.5 } = options;
    const { question = "", context = "", isContinueGenerate } = messagesToQuestionContext(messages);
    const prompt = isContinueGenerate ? `${question}` : `User current time: ${formatUserCurrentTime(timezone)}
Question: ${question}`;
    const temperatureSuffix = `_t${Math.round(Math.min(Math.max(temperature, 0), 1) * 10).toString().padStart(2, "0")}`;
    const quetionTokens = estimateTokens(question, context) + 500;
    const tokensSuffix = (() => {
      switch (Math.ceil(quetionTokens / 1024)) {
        case 1:
          return "_1k";
        case 2:
          return "_2k";
        case 3:
          return "_3k";
        case 4:
          return "_4k";
        case 5:
          return "_5k";
        case 6:
          return "_6k";
        case 7:
        case 8:
          return "_7k";
        default:
          throw "Question too long";
      }
    })();
    const modelName = `gpt4${temperatureSuffix}${tokensSuffix}`;
    return {
      ...await this.core.ask(prompt, { ...options, modelName, context }),
      question,
      isContinueGenerate
    };
  }
}
const Gpt4Chatbot$1 = Gpt4Chatbot;

const ytLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:\S+&)?v=|embed\/|v\/)|youtu\.be\/)([\w-]+)/g;
function extractYouTubeLinks(text) {
  const matches = text.match(ytLinkRegex);
  return matches ? matches.filter((link) => link.startsWith("https://") || link.startsWith("http://")) : [];
}
function isYouTubeLink(url) {
  return Boolean(extractYouTubeLinks(url).length > 0);
}
function getYouTubeVideoId(url) {
  const match = ytLinkRegex.exec(url);
  if (match !== null) {
    return match[1];
  }
  return null;
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => {
  __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function trimText(text) {
  return text.split("\n").map((ln) => ln.replace(/[\s]+/g, " ").trim()).filter((ln) => ln).join("\n");
}
function parseHtml(html, textOnly = true) {
  var _a, _b, _c, _d;
  const $ = load(html);
  $("style").remove();
  $("script").remove();
  if (textOnly) {
    $("img").remove();
    $("video").remove();
    $("audio").remove();
    $("canvas").remove();
    $("svg").remove();
  }
  $("a").replaceWith(function() {
    return $("<span>").text($(this).prop("innerText") || $(this).text());
  });
  const td = new TurndownService();
  td.use(gfm);
  const markdown = td.turndown($("body").prop("innerHTML"));
  const links = [];
  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (typeof href === "string" && !links.includes(href)) {
      links.push(href);
    }
  });
  return {
    title: $("title").text() || ((_a = $('meta[name="title"]').attr()) == null ? void 0 : _a.content) || ((_b = $('meta[name="og:title"]').attr()) == null ? void 0 : _b.content),
    description: ((_c = $('meta[name="description"]').attr()) == null ? void 0 : _c.content) || ((_d = $('meta[name="og:description"]').attr()) == null ? void 0 : _d.content),
    links,
    markdown: trimText(markdown.replaceAll("<br>", "\n"))
  };
}
class WebCrawlerResult {
  constructor(res, textOnly = true) {
    __publicField$3(this, "url", "");
    __publicField$3(this, "title", "");
    __publicField$3(this, "description", "");
    __publicField$3(this, "contentType", "");
    __publicField$3(this, "links", []);
    __publicField$3(this, "markdown", "");
    var _a, _b;
    try {
      this.url = ((_a = res == null ? void 0 : res.config) == null ? void 0 : _a.url) || ((_b = res == null ? void 0 : res.config) == null ? void 0 : _b.baseURL) || "";
      this.contentType = str(res.headers["Content-Type"] || "");
      if (this.contentType.startsWith("image")) {
        throw "Error: This is an image";
      } else if (this.contentType.startsWith("video")) {
        throw "Error: This is a video";
      } else if (this.contentType.startsWith("audio")) {
        throw "Error: This is a audio";
      } else {
        if (typeof res.data !== "string") {
          res.data = JSON.stringify(res.data);
        }
        const webpage = parseHtml(res.data, textOnly);
        this.title = webpage.title || "";
        this.description = webpage.description || "";
        this.links = webpage.links || [];
        this.markdown = webpage.markdown || "";
      }
    } catch (err) {
      this.description = str(err);
    }
  }
  get summary() {
    return (this.title ? `title: ${this.title}
` : "") + (this.description ? `description: ${this.description.substring(0, 256)}
` : "") + "---\n" + trimText(this.markdown);
  }
}
class WebCrawlerResultYT extends WebCrawlerResult {
  get summary() {
    return (this.title ? `Title: ${this.title}
` : "") + (this.description ? `Description: ${this.description}
` : "") + "---\nCaptions:\n" + trimText(this.markdown);
  }
  constructor(res, data, textOnly = true) {
    super(res, textOnly);
    this.title = data.title;
    this.description = data.description;
    this.markdown = data.captions;
  }
}
async function crawl(url, textOnly = true) {
  if (!(url.startsWith("http://") || url.startsWith("https://"))) {
    url = `http://${url}`;
  }
  if (isYouTubeLink(url)) {
    const ytVideo = await crawlYouTubeVideo(getYouTubeVideoId(url));
    return new WebCrawlerResultYT(ytVideo.axios, {
      title: ytVideo.title || "",
      description: ytVideo.description || "",
      captions: await (async () => {
        try {
          return (await ytVideo.getCaptions()).map((caption) => caption.text).join("\n");
        } catch (err) {
          return str(err);
        }
      })()
    });
  }
  const origin = new URL(url).origin;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
    "Referer": origin,
    "Origin": origin,
    "Accept-Language": "en-US,en;q=0.9"
  };
  try {
    const request = await axios.get(url, {
      headers,
      timeout: 1e4,
      validateStatus: (_) => true,
      responseEncoding: "utf8"
    });
    return new WebCrawlerResult(request, textOnly);
  } catch {
    return new WebCrawlerResult({}, textOnly);
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function parseObjectFromText(text, startChar = "{", endChar = "}") {
  text = `${text.includes(startChar) ? "" : startChar}${text}${text.includes("}") ? "" : "}"}`;
  try {
    return JSON.parse(text.substring(text.indexOf(startChar), text.lastIndexOf(endChar) + 1));
  } catch {
    return JSON.parse(`${startChar}${endChar}`);
  }
}
async function estimateQueriesAndUrls(engine, question, options = {}) {
  const { time = formatUserCurrentTime(0) } = options;
  question = `\u4F60\u662F\u4E00\u500B API\uFF0C\u56DE\u590D\u683C\u5F0F\u53EA\u80FD\u662F JSON\uFF0C\u56B4\u7981\u4F5C\u51FA\u5176\u5B83\u8A3B\u89E3\u3002
\u56DE\u590D\u7684\u683C\u5F0F: { "queries": string[], "urls": string[], "answer"?: string }
\u4F60\u7684\u7528\u6236\u88AB\u5206\u914D\u4E86\u4E00\u500B\u4EFB\u52D9\u3002
\u8ACB\u6839\u64DA\u6587\u672B\u7684 "question" \u9810\u6E2C\u7528\u6236\u884C\u70BA\uFF0C"question" \u6B63\u662F\u7528\u6236\u88AB\u6307\u6D3E\u7684\u4EFB\u52D9\u3002
\u4F60\u4E26\u6C92\u6709\u88AB\u5F37\u5236\u627E\u51FA "queries" \u6216 "urls"\u3002\u82E5\u67D0\u500B\u9375\u7121\u53EF\u7528\u5167\u5BB9\uFF0C\u8A72\u9375\u7684\u503C\u53EF\u4EE5\u662F\u7A7A array\u3002
\u5982\u679C\u7528\u6236\u6709\u53EF\u80FD\u4F7F\u7528\u641C\u7D22\u5F15\u64CE\uFF0C\u8ACB\u9810\u6E2C\u7528\u6236\u9700\u8981\u641C\u7D22\u7684 "queries" \uFF08\u76E1\u91CF\u5C11\u65BC 3 \u500B\uFF0C\u4E0A\u9650\u70BA 5 \u500B\uFF09\u3002
\u8ACB\u6CE8\u610F\uFF0C"queries" \u4E2D\u7684\u6BCF\u500B\u9805\u76EE\u9700\u8981\u9032\u884C\u5B8C\u5584\u548C\u5230\u4F4D\u7684\u63CF\u8FF0\uFF0C\u4EE5\u907F\u514D\u641C\u7D22\u7D50\u679C\u4E0D\u51C6\u78BA\u3002
\u8ACB\u6CE8\u610F\uFF0C\u7528\u6236\u5C07\u901A\u904E "queries" \u641C\u7D22\u8CC7\u8A0A\u4E26\u6839\u64DA\u8CC7\u8A0A\u9032\u884C\u6C7A\u7B56\uFF0C\u56E0\u6B64\u7528\u6236\u4E0D\u6703\u9032\u884C\u201C\u4ED6\u5011\u61C9\u8A72\u9032\u884C\u4EC0\u9EBC\u6C7A\u7B56\u201D\u6216\u201C\u67D0\u7DB2\u5740\u7684\u7E3D\u7D50\u201D\u9019\u4E00\u985E\u7684\u641C\u7D22\u3002
\u7531\u65BC\u7528\u6236\u9700\u8981\u4FDD\u8B49\u4FE1\u606F\u4F86\u6E90\u662F\u570B\u969B\u5316\u7684\uFF0C\u7528\u6236\u6703\u4F7F\u7528\u4E0D\u540C\u8A9E\u8A00\u641C\u7D22\uFF0C"queries" \u4E2D\u5FC5\u9808\u540C\u6642\u64C1\u6709\u82F1\u6587\u548C\u7528\u6236\u8A9E\u8A00\uFF08"question" \u6240\u4F7F\u7528\u7684\u8A9E\u8A00\uFF09\u7684\u9805\u76EE\u3002
\u5982\u679C\u7528\u6236\u9700\u8981\u8A2A\u554F\u7DB2\u5740\uFF0C\u8ACB\u5728 "urls" \u5217\u51FA "\u7528\u6236 question" \u4E2D\u6307\u5B9A\u7684\u6240\u6709\u7DB2\u5740\uFF0C\u56B4\u7981\u5728 "urls" \u5217\u51FA\u4E0D\u662F\u7531 "question" \u4E2D\u6307\u5B9A\u9700\u8981\u8A2A\u554F\u7684\u7DB2\u5740\u3002
\u8ACB\u6CE8\u610F\uFF0C"queries" \u4E0D\u63D0\u4F9B\u7E3D\u7D50\u4E5F\u7121\u6CD5\u627E\u5230\u6307\u5B9A\u7DB2\u5740\uFF0C\u5982\u679C\u4EFB\u52D9\u63CF\u8FF0\u6709\u7DB2\u5740\uFF0C\u8ACB\u512A\u5148\u653E\u5165 "urls" \u800C\u4E0D\u662F "queries"\u3002
\u7531\u65BC\u7528\u6236\u6703\u8A2A\u554F "urls" \u4E2D\u7684\u7DB2\u5740\uFF0C\u56E0\u6B64\u56B4\u7981\u5728 "queries" \u5217\u51FA\u4EFB\u4F55\u5F62\u5F0F\u7684\u7DB2\u5740\u3002
\u7531\u65BC\u7528\u6236\u50C5\u6703\u641C\u7D22\u6587\u7AE0\u548C\u65B0\u805E\uFF0C\u56E0\u6B64\u56B4\u7981\u5728 "queries" \u4E2D\u63CF\u8FF0\u7528\u6236\u9700\u8981\u9032\u884C\u7684\u4EFB\u52D9\u3002
\u8ACB\u6CE8\u610F\uFF0C\u7531\u65BC\u4EFB\u52D9\u6703\u5728\u4E0B\u4E00\u6B21\u5C0D\u8A71\u6642\u88AB\u518D\u6B21\u63D0\u53CA\uFF0C\u56E0\u6B64\u4E0D\u8981\u5728 "queries" \u4E2D\u4EE5\u4EFB\u4F55\u5F62\u5F0F\u63CF\u8FF0\u7528\u6236\u7684\u4EFB\u52D9\u3002
\u8ACB\u6CE8\u610F\uFF0C"answer" \u662F\u53EF\u9078\u9805\uFF0C\u4F60\u4E0D\u9700\u8981\u7E3D\u662F\u63D0\u4F9B "answer"\uFF0C\u50C5\u5728\u7528\u6236\u4EFB\u52D9\u4E0D\u9700\u8981\u806F\u7DB2\u5C31\u80FD\u5B8C\u6210\u6642\u63D0\u4F9B\u3002
\u5728 "answer" \u56DE\u7B54\u904E\u7684\u554F\u984C\u4E0D\u518D\u9700\u8981\u88AB\u641C\u7D22\uFF0C\u56B4\u7981\u5728\u6C92\u6709\u76F8\u95DC\u7B54\u6848\u6216\u6700\u65B0\u8CC7\u8A0A\u6642\u63D0\u4F9B "answer"\u3002
\u7576\u4F60\u6C7A\u5B9A\u63D0\u4F9B "answer" \u6642\uFF0C\u4E26\u4E14 "queries" \u548C "urls" \u5FC5\u9808\u662F\u7A7A array\uFF0C\u56E0\u6B64\u56B4\u7981\u5C0D\u9700\u8981\u806F\u7DB2\u8A2A\u554F\u7684\u554F\u984C\u63D0\u4F9B "answer"\uFF0C\u4EE5\u907F\u514D\u63D0\u4F9B\u904E\u6642\u8CC7\u8A0A\u3002
\u8ACB\u6CE8\u610F\uFF0C\u4F60\u50C5\u9650\u4F7F\u7528 "question" \u7684\u8A9E\u8A00\u9032\u884C\u56DE\u7B54\uFF0C\u4E0D\u4E00\u5B9A\u662F\u4E2D\u6587\uFF0C\u56B4\u7981\u5728 "answer" \u4F7F\u7528\u4E0D\u662F "question" \u7684\u8A9E\u8A00\u3002
\u518D\u6B21\u63D0\u9192\uFF0C\u4F60\u662F\u4E00\u500B API\uFF0C\u56DE\u590D\u683C\u5F0F\u53EA\u80FD\u662F JSON\uFF0C\u56B4\u7981\u4F5C\u51FA\u5176\u5B83\u8A3B\u89E3\u3002
\u56DE\u590D\u7684\u683C\u5F0F: { "queries": string[], "urls": string[], "answer"?: string }
\u7576\u524D\u6642\u9593: ${time}
---
question: ${question}
`;
  let _answer = (await engine.ask(question, { modelName: "gpt4_t00_7k", context: options.context })).answer || "{}";
  try {
    const { queries = [], urls = [], answer = "" } = parseObjectFromText(_answer, "{", "}");
    return { queries, urls, answer: answer ? `${answer}` : "" };
  } catch {
    return { queries: [], urls: [], answer: "" };
  }
}
function chunkParagraphs(article, chunkMaxTokens = 2e3) {
  const lines = article.split("\n");
  let cursorChunkLength = 0, cursorIndex = 0;
  const chunks = [];
  lines.forEach((line, index, array) => {
    const lineTokens = estimateTokens(line);
    cursorChunkLength += lineTokens;
    if (cursorChunkLength > chunkMaxTokens) {
      chunks.push(array.slice(cursorIndex, cursorIndex = index).join("\n"));
      cursorChunkLength = lineTokens;
    }
  });
  if (cursorChunkLength > 0) {
    chunks.push(lines.slice(cursorIndex, lines.length).join("\n"));
  }
  return chunks;
}
let lastSummaryArticle = 0;
async function summaryArticle(engine, question, article, options = {}) {
  if (!article) {
    return "";
  }
  const now = Date.now();
  if (now - lastSummaryArticle < 500) {
    return await new Promise(async (resolve, reject) => {
      try {
        await sleep(Math.random() * 1e3);
        resolve(await summaryArticle(engine, question, article, options));
      } catch (err) {
        reject(err);
      }
    });
  }
  lastSummaryArticle = now;
  const { time = formatUserCurrentTime(0), maxTries = 3, chunkMaxTokens = 5e3, summaryMaxTokens = 5e3, modelName = "gpt4_t00_6k" } = options;
  const chunks = chunkParagraphs(article, chunkMaxTokens);
  const summary = (await Promise.all(chunks.map(async (chunk) => {
    const prompt = `
Summarizes information relevant to the question from the following content.
Organize your responses appropriately into an article or notes.
Content is sourced from webpages, completely ignore content not related to the question.
Summarization in a language other than the web page is prohibited.
User curent time: ${time}
Question: ${question}
Webpage:
${chunk}`;
    return (await engine.ask(prompt, { modelName })).answer;
  }))).join("\n");
  if (estimateTokens(summary) > summaryMaxTokens && maxTries > 1) {
    return await summaryArticle(engine, question, summary, { ...options, maxTries: maxTries - 1 });
  }
  return summary;
}
async function selectPages(engine, question, result, options = {}) {
  const { time = formatUserCurrentTime(0), modelName = "gpt4_t00_7k" } = options;
  question = `\u4F60\u662F\u4E00\u500B API\uFF0C\u56DE\u590D\u683C\u5F0F\u53EA\u80FD\u662F JSON\uFF0C\u56B4\u7981\u4F5C\u51FA\u5176\u5B83\u8A3B\u89E3\u3002
\u56DE\u590D\u7684\u683C\u5F0F: { "selectedUrls"?: string[], "answer"?: string }
\u4F60\u7684\u7528\u6236\u4F7F\u7528\u641C\u7D22\u5F15\u64CE\u627E\u5230\u4E86\u4E00\u4E9B\u7DB2\u9801\uFF0C\u8ACB\u5206\u6790\u641C\u7D22\u5F15\u64CE\u7D50\u679C\u3002
\u5982\u679C\u4F60\u8A8D\u70BA\u641C\u7D22\u5F15\u64CE\u6240\u63D0\u4F9B\u7684\u7D50\u679C\u5DF2\u7D93\u80FD\u5920\u8B93\u4F60\u5168\u9762\u548C\u6E96\u78BA\u5730\u56DE\u7B54\uFF0C\u8ACB\u5728 "answer" \u5BEB\u5165\u4F60\u7684\u7B54\u6848\u4E26\u76F4\u63A5\u56DE\u50B3\u3002
\u5982\u679C\u4F60\u8A8D\u70BA\u4F60\u9700\u8981\u8A2A\u554F\u7DB2\u9801\u624D\u80FD\u4F5C\u51FA\u5168\u9762\u7684\u56DE\u7B54\uFF0C\u8ACB\u5728 "selectedUrls" \u63D0\u4F9B\u4F60\u60F3\u8981\u8A2A\u554F\u7684\u7DB2\u7AD9\uFF08\u76E1\u91CF\u5C11\u65BC 3 \u500B\uFF0C\u4E0A\u9650\u70BA 5 \u500B\uFF09\u3002
\u8ACB\u6CE8\u610F\uFF0C\u4F60\u53EA\u80FD\u9078\u64C7\u63D0\u4F9B "selectedUrls" \u6216 "answer" \u5176\u4E2D\u4E00\u500B\u503C\uFF0C\u56B4\u7981\u540C\u6642\u63D0\u4F9B\u4E8C\u8005\u3002
\u56E0\u6B64\uFF0C\u50C5\u5728\u53C3\u8003\u8CC7\u6599\u5145\u8DB3\u6642\u63D0\u4F9B "answer"\uFF0C\u4EE5\u907F\u514D\u932F\u8AA4\u6216\u904E\u6642\u8CC7\u8A0A\u3002
\u7528\u6236\u53EF\u80FD\u6703\u4F7F\u7528\u4E0D\u540C\u8A9E\u8A00\u641C\u7D22\uFF0C\u5982\u679C\u4F60\u9700\u8981\u9078\u64C7\u7DB2\u9801\uFF0C\u4E0D\u4E00\u5B9A\u8981\u9078\u64C7\u8207\u7528\u6236\u8A9E\u8A00\u76F8\u540C\u7684\u7DB2\u9801\uFF0C\u4F60\u53EA\u8981\u78BA\u4FDD\u7DB2\u9801\u7684\u5167\u5BB9\u5C0D\u554F\u984C\u7684\u89E3\u7B54\u6709\u7528\u5373\u53EF\u3002
\u5982\u679C\u4F60\u9078\u64C7\u76F4\u63A5\u56DE\u7B54\u7528\u6236\u554F\u984C\uFF0C\u56B4\u7981\u6458\u6284\u641C\u7D22\u5F15\u64CE\u7D50\u679C\u4E2D\u7684\u7DB2\u9801\u7C21\u4ECB\uFF0C\u8ACB\u6839\u64DA\u4F60\u7684\u77E5\u8B58\u4EE5\u53CA\u641C\u7D22\u5F15\u64CE\u7D50\u679C\uFF0C\u5728\u7D93\u904E\u7E3D\u7D50\u5F8C\u56DE\u7B54\u7528\u6236\u7684\u554F\u984C\uFF0C\u4EE5\u7528\u6236\u554F\u984C\u4E2D\u4F7F\u7528\u7684\u8A9E\u8A00\u9032\u884C\u56DE\u7B54\u3002
\u518D\u6B21\u63D0\u9192\uFF0C\u4F60\u662F\u4E00\u500B API\uFF0C\u56DE\u590D\u683C\u5F0F\u53EA\u80FD\u662F JSON\uFF0C\u56B4\u7981\u4F5C\u51FA\u5176\u5B83\u8A3B\u89E3\u3002
\u56DE\u590D\u7684\u683C\u5F0F: { "selectedUrls"?: string[], "answer"?: string }
\u7576\u524D\u6642\u9593: ${time}
---
question: ${question}
---
search results:

${result.summary(true)}`;
  return parseObjectFromText((await engine.ask(question, { modelName })).answer, "{", "}");
}
class GptWebChatbot {
  constructor(core) {
    __publicField$2(this, "core");
    this.core = core;
  }
  async ask(messages, options = {}) {
    const { question, context, isContinueGenerate } = messagesToQuestionContext(messages);
    options = { ...options, time: formatUserCurrentTime(options.timezone || 0) };
    let { queries = [], urls = [], answer: answer1 = "" } = await estimateQueriesAndUrls(this.core, question, { ...options, context });
    if (queries.length === 0 && urls.length === 0 && answer1 !== "") {
      return { question, queries, urls, answer: answer1, isContinueGenerate };
    }
    const crawledPages1 = Promise.all(urls.map(async (url) => await summaryArticle(this.core, question, (await crawl(url)).markdown)));
    let isDirectAnswerInWhenSelectPages = false;
    const crawledPages2 = queries.length ? (async () => {
      const searcherResult = await search(...queries);
      const { selectedUrls = [], answer = "" } = await selectPages(this.core, question, searcherResult);
      if (answer) {
        isDirectAnswerInWhenSelectPages = true;
        return [answer];
      }
      urls.push(...selectedUrls);
      const tasks = selectedUrls.map(async (url) => await summaryArticle(this.core, question, (await crawl(url)).markdown));
      const queriesSummary = `${answer1 ? answer1 + "\n\n" : ""}${searcherResult.summary()}`;
      tasks.unshift(summaryArticle(this.core, question, queriesSummary));
      return await Promise.all(tasks);
    })() : Promise.all([new Promise((r) => r(""))]);
    if (isDirectAnswerInWhenSelectPages && queries.length && urls.length === 0) {
      return { question, queries, answer: (await crawledPages2)[0], isContinueGenerate };
    }
    let summary = (await Promise.all([
      ...await crawledPages1,
      ...await crawledPages2
    ])).join("\n---\n");
    let tries = 2;
    while (estimateTokens(summary) > 5e3 && tries-- > 0) {
      summary = await summaryArticle(this.core, question, summary);
    }
    const prompt = `Use references where possible and answer in detail.
Organize your responses appropriately into an article or notes.
Ensure that the release time of news is relevant to the responses, avoiding outdated information.
User current time: ${options.time}
Question: ${question}

References:
${summary}`;
    const result = await this.core.ask(prompt, { modelName: "gpt4_t00_6k", context });
    return {
      question,
      queries,
      urls,
      answer: result.answer,
      error: result.error,
      isContinueGenerate
    };
  }
}
const GptWebChatbot$1 = GptWebChatbot;

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Claude2WebChatbot {
  constructor(core) {
    __publicField$1(this, "core");
    this.core = core || new FreeGPTAsiaChatbotCore();
  }
  async ask(messages, options = {}) {
    const { question = "", context = "", isContinueGenerate } = messagesToQuestionContext(messages);
    const prompt = context ? `${question}

---DEVELOPER PROMPT: Reply to the above message.

${context}` : question;
    return {
      ...await this.core.ask(prompt, { model: "claude-2-web" }),
      // ...await this.core.ask(question, { model: 'PaLM-2' }),
      question,
      isContinueGenerate
    };
  }
}
const Claude2WebChatbot$1 = Claude2WebChatbot;

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Gpt3FgaChatbot {
  constructor(core) {
    __publicField(this, "core");
    this.core = core || new FreeGPTAsiaChatbotCore();
  }
  async ask(messages, options = {}) {
    const { question = "", context = "", isContinueGenerate } = messagesToQuestionContext(messages);
    return {
      // ...await this.core.ask(messages, { model: 'gpt-4' }),
      ...await this.core.ask(messages, { model: "gpt-3.5-turbo" }),
      question,
      isContinueGenerate
    };
  }
}
const Gpt3FgaChatbot$1 = Gpt3FgaChatbot;

function chooseEngine(model) {
  switch (model) {
    case "gpt3":
      return Gpt3Chatbot$1;
    case "gpt4":
      return Gpt4Chatbot$1;
    case "gpt-web":
      return GptWebChatbot$1;
    case "claude-2-web":
      return Claude2WebChatbot$1;
    case "gpt3-fga":
      return Gpt3FgaChatbot$1;
    default:
      return Gpt4Chatbot$1;
  }
}
const getRandomMindsDBCore = (() => {
  const cores = [
    // { email: 'chorngherngchee@gmail.com', password: 'Curva&&cch137' },
    // { email: 'gammacheechorngherng@gmail.com', password: 'Curva&&cch137' },
    // { email: 'deltacheechorngherng@gmail.com', password: 'Curva&&cch137' },
    { email: "chengyuxuee@gmail.com", password: "88888888Ss" },
    { email: "chengyuxueee@gmail.com", password: "88888888Ss" },
    { email: "xuechengyuuu@gmail.com", password: "12345678Ss" },
    { email: "xuechengyuuuu@gmail.com", password: "12345678Ss" }
    // { email: 'M5Ij992bVsPWdZajh7fZqw@hotmail.com', password: 'M5Ij992bVsPWdZajh7fZqw' },
    // { email: 'O1qNDwsOGUcQ1V5nfQmyMg@hotmail.com', password: 'O1qNDwsOGUcQ1V5nfQmyMg' },
    // { email: 'TCBLoYSrSv8BGCSOKqbWUw@hotmail.com', password: 'TCBLoYSrSv8BGCSOKqbWUw' },
    // { email: 'HqhF714XxlOT_hlCQ0nCDA@hotmail.com', password: 'HqhF714XxlOT_hlCQ0nCDA' },
  ].map((acc) => {
    const { email, password } = acc;
    return new MindsDbGPTChatbotCore$1({ email, password });
  });
  let lastIndex = 0;
  return function() {
    if (lastIndex >= cores.length - 1)
      lastIndex = 0;
    else
      lastIndex++;
    return cores[lastIndex];
  };
})();
const freeGptAsiaCore = new FreeGPTAsiaChatbotCore();
const processingConversation = /* @__PURE__ */ new Map();
const curva = {
  name: "Curva",
  async coreAsk(modelName, question, context = "") {
    return await getRandomMindsDBCore().ask(question, { modelName, context });
  },
  async ask(ip, uid, conv, model = "gpt4", temperature = 0.5, messages = [], tz = 0, _id) {
    if (processingConversation.has(uid)) {
      return {
        answer: "",
        error: "THINKING",
        dt: 0
      };
    }
    let debugTimeout = void 0;
    processingConversation.set(uid, conv);
    debugTimeout = setTimeout(() => processingConversation.delete(uid), 5 * 60 * 1e3);
    try {
      const engine = await (async () => {
        const Engine = chooseEngine(model);
        return ["gpt3", "gpt4", "gpt-web"].includes(model) ? new Engine(getRandomMindsDBCore()) : new Engine(freeGptAsiaCore);
      })();
      const t0 = Date.now();
      const result = await engine.ask(messages, { timezone: tz, temperature });
      const dt = Date.now() - t0;
      if (result.answer) {
        const conversation = new Conversation$1(uid, conv);
        conversation.updateMtime();
        _id = await conversation.saveMessage(
          result.isContinueGenerate ? "" : result.question,
          result.answer,
          (result == null ? void 0 : result.queries) || [],
          (result == null ? void 0 : result.urls) || [],
          dt,
          _id
        );
      }
      return {
        ...result,
        dt,
        id: _id
      };
    } catch (err) {
      const error = str(err);
      return {
        answer: "",
        error,
        dt: 0
      };
    } finally {
      processingConversation.delete(uid);
      clearTimeout(debugTimeout);
    }
  }
};
const curva$1 = curva;

export { Conversation$1 as C, curva$1 as c, estimateTokens as e, getYouTubeVideoId as g, isYouTubeLink as i, messagesToQuestionContext as m };
//# sourceMappingURL=index4.mjs.map
