import { m as message, l as libExports } from './index2.mjs';
import { t as troll } from './token.mjs';
import { r as random } from './random.mjs';
import { Bard } from 'googlebard';
import { s as str } from './str.mjs';
import { Sequelize, QueryTypes } from 'sequelize';
import { c as createAxiosSession } from './createAxiosSession.mjs';
import googlethis from 'googlethis';
import axios from 'axios';
import TurndownService from 'turndown';
import { gfm } from '@joplin/turndown-plugin-gfm';
import { load } from 'cheerio';
import { i as isYouTubeLink, g as getYouTubeVideoId } from './ytLinks.mjs';
import { c as crawlYouTubeVideo } from './ytCrawler.mjs';

var __defProp$a = Object.defineProperty;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$a = (obj, key, value) => {
  __defNormalProp$a(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Conversation {
  constructor(user, conv) {
    __publicField$a(this, "conv");
    __publicField$a(this, "user");
    this.user = user;
    this.conv = conv;
  }
  async delete() {
    const { user, conv } = this;
    if (!(user && conv)) {
      return [];
    }
    return await message.updateMany({
      user,
      conv
    }, {
      $set: {
        user: `~${user}`
      }
    }, {
      projection: { _id: 0 }
    }).exec();
  }
  async getHistory() {
    const { user, conv } = this;
    if (!(user && conv)) {
      return [];
    }
    const history = (await message.find({
      user,
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
    const { user, conv } = this;
    if (!(user && conv)) {
      return "";
    }
    const getJoinedMessages = (messages2) => {
      return messages2.map((message) => {
        return (message.Q ? `Question:
${message.Q}` : "") + (message.Q && message.A ? "\n\n" : "") + (message.A ? `Answer:
${message.A}` : "");
      }).filter((m) => m).join("\n---\n");
    };
    const messages = (await message.find({
      user,
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
      return "";
    }
    let joinedMessages = getJoinedMessages(messages);
    while (joinedMessages.length > 8192) {
      messages.shift();
      joinedMessages = getJoinedMessages(messages);
    }
    return `Conversation History
===
${joinedMessages}`;
  }
  async saveMessage(Q, A, queries = [], urls = [], dt, regenerateId) {
    const { user, conv } = this;
    const record = { user, conv, Q, A };
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
        user,
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

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => {
  __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class BardChatbotCore {
  constructor(options) {
    __publicField$9(this, "client");
    this.client = new Bard(options.cookies);
  }
  init() {
    return new Promise((resolve) => resolve(true));
  }
  async ask(question, options) {
    try {
      const { conversationId = random.base64(64) } = options;
      return { answer: await this.client.ask(question, conversationId) };
    } catch (err) {
      return { answer: "", error: str(err) };
    }
  }
  setup() {
  }
  kill() {
  }
}
const BardChatbotCore$1 = BardChatbotCore;

var __defProp$8 = Object.defineProperty;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$8 = (obj, key, value) => {
  __defNormalProp$8(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function wrapPromptTextParam(text) {
  const hasSingleQuotes = text.includes("'");
  const hasDoubleQuotes = text.includes('"');
  if (hasSingleQuotes) {
    if (hasDoubleQuotes) {
      return `'${text.replaceAll("'", "`")}'`;
    } else {
      return `"${text}"`;
    }
  } else {
    return `'${text}'`;
  }
}
function getSelectSql(modelName, question, context = "") {
  question = question.replaceAll("'", "`");
  context = (context || "").replaceAll("'", "`");
  return `SELECT answer FROM mindsdb.${modelName} WHERE question = ${wrapPromptTextParam(question)}\r
AND context = ${wrapPromptTextParam(context)}`;
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
    this.email = "mingkuanhiew3@gmail.com";
    this.password = "12345678Hi";
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
  async askGPT(modelName, question, context) {
    const client = containsDoubleDash(question) || containsDoubleDash(context || "") ? this.webClient : this.client;
    return await client.askGPT(modelName, question, context);
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
      return { answer: "", error: "MindsDB did not return a valid response." };
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
      return { answer: "", error: "MindsDB did not return a valid response." };
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
  async ask(question, options) {
    return await this.client.askGPT(options.modelName, question, options.context);
  }
  kill() {
    this.client.kill();
  }
}
const MindsDbGPTChatbotCore$1 = MindsDbGPTChatbotCore;

const coreCollection = {
  record: /* @__PURE__ */ new Map(),
  async get(token, engineName) {
    const EngineConstructor = engineName === "Bard" ? BardChatbotCore$1 : MindsDbGPTChatbotCore$1;
    return this.record.get(token) || await (async () => {
      const engine = new EngineConstructor(troll.d(token, 1, 8038918216105477, true));
      await engine.init();
      this.record.set(token, engine);
      return engine;
    })();
  },
  delete(token) {
    const engine = this.record.get(token);
    if (engine !== void 0) {
      engine.kill();
      this.record.delete(token);
    }
  }
};
const coreCollection$1 = coreCollection;

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => {
  __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class BardChatbot {
  constructor(core) {
    __publicField$6(this, "core");
    this.core = core;
  }
  async ask(question, options = {}) {
    return await this.core.ask(question, options);
  }
}
const BardChatbot$1 = BardChatbot;

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

function calculateAlphanumericLength(text) {
  const regex = /[\p{L}\p{N}]/gu;
  const matches = text.match(regex);
  const length = matches ? matches.length : 0;
  return length;
}

function detectLanguageDistribution(text, sampleMinSize = 100, sampleProportion = 0.1) {
  const cleanedText = text.replace(/\s/g, "");
  let sampleSize;
  if (cleanedText.length < sampleMinSize) {
    sampleSize = cleanedText.length;
  } else if (cleanedText.length < sampleMinSize / sampleProportion) {
    sampleSize = sampleMinSize;
  } else {
    sampleSize = Math.floor(cleanedText.length * sampleProportion);
  }
  let selectedIndices = [];
  if (sampleSize < cleanedText.length) {
    selectedIndices = getRandomIndices(sampleSize, cleanedText.length);
  }
  function getRandomIndices(count, max) {
    const indices = /* @__PURE__ */ new Set();
    while (indices.size < count) {
      const randomIndex = Math.floor(Math.random() * max);
      indices.add(randomIndex);
    }
    return Array.from(indices);
  }
  if (selectedIndices.length === 0) {
    for (let i = 0; i < cleanedText.length; i++) {
      selectedIndices.push(i);
    }
  }
  const languageCodeRanges = {
    en: [[0, 127]],
    // Basic Latin (ASCII)
    zh: [[19968, 40959], [13312, 19903], [131072, 173791], [173824, 177983], [177984, 178207]],
    // Chinese
    ja: [[12352, 12447], [12448, 12543], [12784, 12799], [110592, 110847], [127488, 127743]],
    // Japanese
    ko: [[44032, 55215]]
    // Korean
    // Add more languages and their corresponding Unicode ranges as needed
  };
  const characterCounts = {};
  selectedIndices.forEach((index) => {
    const character = cleanedText[index];
    if (!characterCounts[character]) {
      characterCounts[character] = 0;
    }
    characterCounts[character]++;
  });
  const languageDistribution = {};
  for (const character in characterCounts) {
    let detectedLanguageCode = "other";
    for (const languageCode in languageCodeRanges) {
      let isCharacterInRange = false;
      languageCodeRanges[languageCode].forEach((range) => {
        if (character.charCodeAt(0) >= range[0] && character.charCodeAt(0) <= range[1]) {
          isCharacterInRange = true;
        }
      });
      if (isCharacterInRange) {
        detectedLanguageCode = languageCode;
        break;
      }
    }
    if (!languageDistribution[detectedLanguageCode]) {
      languageDistribution[detectedLanguageCode] = 0;
    }
    languageDistribution[detectedLanguageCode] += characterCounts[character];
  }
  const totalCharacters = selectedIndices.length;
  for (const languageCode in languageDistribution) {
    languageDistribution[languageCode] /= totalCharacters;
  }
  return languageDistribution;
}

function estimateTokens(...texts) {
  const text = texts.join("");
  const length = calculateAlphanumericLength(text);
  const languageDistribution = detectLanguageDistribution(text);
  let tokens = 0;
  for (const languageCode in languageDistribution) {
    switch (languageCode) {
      case "en":
        tokens += languageDistribution[languageCode] * length / 4;
        break;
      case "zh":
      case "ja":
      case "ko":
        tokens += languageDistribution[languageCode] * length / 0.5;
        break;
      default:
        tokens += languageDistribution[languageCode] * length / 0.75;
    }
  }
  return tokens;
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
  async ask(question, options = {}) {
    const { timezone = 0, temperature = 0.5 } = options;
    question = `User current time: ${formatUserCurrentTime(timezone)}
Question: ${question}`;
    const temperatureSuffix = `_t${Math.round(Math.min(Math.max(temperature, 0), 1) * 10).toString().padStart(2, "0")}`;
    const quetionTokens = estimateTokens(question, options.context || "") + 500;
    const tokensSuffix = (() => {
      switch (Math.ceil(quetionTokens / 1e3)) {
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
    return await this.core.ask(question, { ...options, modelName });
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
  async ask(question, options = {}) {
    const { timezone = 0, temperature = 0.5 } = options;
    question = `User current time: ${formatUserCurrentTime(timezone)}
Question: ${question}`;
    const temperatureSuffix = `_t${Math.round(Math.min(Math.max(temperature, 0), 1) * 10).toString().padStart(2, "0")}`;
    const quetionTokens = estimateTokens(question, options.context || "") + 500;
    const tokensSuffix = (() => {
      switch (Math.ceil(quetionTokens / 1e3)) {
        case 1:
          return "_1k";
        case 2:
          return "_2k";
        case 3:
          return "_3k";
        case 4:
          return "_3k";
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
    return await this.core.ask(question, { ...options, modelName });
  }
}
const Gpt4Chatbot$1 = Gpt4Chatbot;

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => {
  __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const googleSearch = async (...queries) => {
  return (await Promise.all(queries.map(async (query) => {
    try {
      const searching = await googlethis.search(query);
      return [...searching.results, ...searching.top_stories];
    } catch {
      return [];
    }
  }))).flat();
};
class WebSearcherResult {
  constructor(items) {
    __publicField$3(this, "items");
    const pages = /* @__PURE__ */ new Map();
    items.forEach((value) => pages.set(value.url, value));
    this.items = [...pages.values()];
  }
  summary(showUrl = true) {
    return [
      ...new Set(this.items.map((r) => `${showUrl ? r.url : ""}
${r.title ? r.title : ""}
${r.description}`))
    ].join("\n\n");
  }
}
async function search(...queries) {
  return new WebSearcherResult(await googleSearch(...queries));
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
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
    __publicField$2(this, "url", "");
    __publicField$2(this, "title", "");
    __publicField$2(this, "description", "");
    __publicField$2(this, "contentType", "");
    __publicField$2(this, "links", []);
    __publicField$2(this, "markdown", "");
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

function extractUrls(text, noRepeat = true) {
  const urlRegex = /((?:https?:\/\/)(?:www\.)?[a-zA-Z0-9\u4e00-\u9fa5-]+(?:\.[a-zA-Z0-9\u4e00-\u9fa5-]+)+(?:\/[^\s]*)?)/g;
  const matches = text.match(urlRegex);
  if (matches) {
    const urls = matches.map((url) => {
      if (/^https?:\/\//i.test(url)) {
        return url;
      }
      return `http://${url}`;
    });
    return noRepeat ? [...new Set(urls)] : urls;
  } else {
    return [];
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function parseObjectFromText(text, startChar = "{", endChar = "}") {
  try {
    return JSON.parse(text.substring(text.indexOf(startChar), text.lastIndexOf(endChar) + 1));
  } catch {
    return JSON.parse(`${startChar}${endChar}`);
  }
}
async function estimateQueriesAndUrls(engine, question, options = {}) {
  const { time = formatUserCurrentTime(0) } = options;
  const prompt = `\u4F60\u662F\u4E00\u500B API\uFF0C\u56DE\u590D\u683C\u5F0F\u53EA\u80FD\u662F JSON\uFF0C\u56B4\u7981\u4F5C\u51FA\u5176\u5B83\u8A3B\u89E3\u3002
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
\u7576\u4F60\u6C7A\u5B9A\u63D0\u4F9B "answer" \u6642\uFF0C"queries" \u548C "urls" \u5FC5\u9808\u662F\u7A7A array\uFF0C\u56E0\u6B64\u56B4\u7981\u5C0D\u9700\u8981\u806F\u7DB2\u8A2A\u554F\u7684\u554F\u984C\u63D0\u4F9B "answer"\uFF0C\u4EE5\u907F\u514D\u63D0\u4F9B\u904E\u6642\u8CC7\u8A0A\u3002
\u518D\u6B21\u63D0\u9192\uFF0C\u4F60\u662F\u4E00\u500B API\uFF0C\u56DE\u590D\u683C\u5F0F\u53EA\u80FD\u662F JSON\uFF0C\u56B4\u7981\u4F5C\u51FA\u5176\u5B83\u8A3B\u89E3\u3002
\u56DE\u590D\u7684\u683C\u5F0F: { "queries": string[], "urls": string[], "answer"?: string }
\u7576\u524D\u6642\u9593: ${time}
---
question: ${question}
`;
  let _answer = (await engine.ask(prompt, { modelName: "gpt4_t00_7k", context: "" })).answer || "{}";
  _answer = `${_answer.includes("{") ? "" : "{"}${_answer}${_answer.includes("}") ? "" : "}"}`;
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
Ensure overall coherence and consistency of the responses, and provide clear conclusions.
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
  const prompt = `
Please select some pages (up to 8) from the search engine results that can help you answer your question.
Keep number of pages as small as possible (about 3).
If it is impossible to determine from the description of website whether it contains useful information, do not choose that website.
Pay attention to the release time and avoid outdated information.
Language is not limited.
Think of yourself as an API, do not make other descriptions, just reply a JSON array.
Each element in the array should be an object with two properties: "url" (string) and "title" (string).
User current time: ${time}
Question: ${question}
Search engine results:
${result.summary(true)}`;
  return parseObjectFromText((await engine.ask(prompt, { modelName })).answer, "[", "]");
}
class GptWeb2Chatbot {
  constructor(core) {
    __publicField$1(this, "core");
    this.core = core;
  }
  async ask(question, options = {}) {
    options = { ...options, time: formatUserCurrentTime(options.timezone || 0) };
    let { queries = [], urls = [], answer: answer1 = "" } = await estimateQueriesAndUrls(this.core, question, options);
    if (queries.length === 0 && urls.length === 0 && answer1 !== "") {
      return { queries, urls, answer: answer1 };
    }
    const crawledPages1 = Promise.all(urls.map(async (url) => await summaryArticle(this.core, question, (await crawl(url)).markdown)));
    const crawledPages2 = queries.length ? (async () => {
      const searcherResult = await search(...queries);
      const selectedPages = await selectPages(this.core, question, searcherResult);
      urls.push(...selectedPages.map((page) => page.url));
      const tasks = selectedPages.map(async (page) => await summaryArticle(this.core, question, (await crawl(page.url)).markdown));
      const queriesSummary = `${answer1 ? answer1 + "\n\n" : ""}${searcherResult.summary()}`;
      tasks.unshift(summaryArticle(this.core, question, queriesSummary));
      return await Promise.all(tasks);
    })() : Promise.all([new Promise((r) => r(""))]);
    let summary = (await Promise.all([
      ...await crawledPages1,
      ...await crawledPages2
    ])).join("\n---\n");
    let tries = 3;
    while (estimateTokens(summary) > 5e3 && tries-- > 0) {
      summary = await summaryArticle(this.core, question, summary);
    }
    const prompt = `
Use references where possible and answer in detail.
Ensure the overall coherence and consistency of the responses.
Ensure that the release time of news is relevant to the responses, avoiding outdated information.
User current time: ${options.time}
Question: ${question}

References:
${summary}`;
    const result = await this.core.ask(prompt, { modelName: "gpt4_t00_6k" });
    return {
      queries,
      urls,
      answer: result.answer,
      error: result.error
    };
  }
}
const GptWeb2Chatbot$1 = GptWeb2Chatbot;

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class GptWeb1Chatbot {
  constructor(core) {
    __publicField(this, "core");
    this.core = core;
  }
  async ask(question, options = {}) {
    options = { ...options, time: formatUserCurrentTime(options.timezone || 0) };
    const urls = extractUrls(question);
    const crawledPages1 = Promise.all(urls.map((url) => crawl(url)));
    const references = [
      (await search(question.replace(/\s+/g, " ").trim())).summary(),
      ...(await crawledPages1).map((page) => page.markdown)
    ].join("\n---\n");
    const prompt = `
Use references where possible and answer in detail.
Ensure the overall coherence and consistency of the responses.
Ensure that the release time of news is relevant to the responses, avoiding outdated information.
User current time: ${options.time}
Question: ${question}

References:
${estimateTokens(references) > 5700 ? await summaryArticle(this.core, question, references) : references}`;
    const result = await this.core.ask(prompt, { modelName: "gpt4_t00_6k" });
    return {
      urls,
      answer: result.answer,
      error: result.error
    };
  }
}
const GptWeb1Chatbot$1 = GptWeb1Chatbot;

function chooseEngine(model) {
  switch (model) {
    case "gpt3":
      return Gpt3Chatbot$1;
    case "gpt4":
      return Gpt4Chatbot$1;
    case "gpt-web-1":
      return GptWeb1Chatbot$1;
    case "gpt-web-2":
      return GptWeb2Chatbot$1;
    case "bard":
      return BardChatbot$1;
    default:
      return Gpt4Chatbot$1;
  }
}
const getRandomToken = (() => {
  const tokens = (() => {
    const accounts = [
      // {
      //   email: 'betacheechorngherng@gmail.com',
      //   password: 'Curva&&cch137',
      // },
      // {
      //   email: 'mingkuanhiew3@gmail.com',
      //   password: '12345678Hi',
      // },
      {
        email: "M5Ij992bVsPWdZajh7fZqw@hotmail.com",
        password: "M5Ij992bVsPWdZajh7fZqw"
      },
      {
        email: "O1qNDwsOGUcQ1V5nfQmyMg@hotmail.com",
        password: "O1qNDwsOGUcQ1V5nfQmyMg"
      },
      {
        email: "TCBLoYSrSv8BGCSOKqbWUw@hotmail.com",
        password: "TCBLoYSrSv8BGCSOKqbWUw"
      },
      {
        email: "HqhF714XxlOT_hlCQ0nCDA@hotmail.com",
        password: "HqhF714XxlOT_hlCQ0nCDA"
      }
    ];
    return accounts.map((acc) => troll.e(acc, 1, 8038918216105477));
  })();
  let lastIndex = 0;
  return function() {
    if (lastIndex >= tokens.length - 1) {
      lastIndex = 0;
    } else {
      lastIndex++;
    }
    return tokens[lastIndex];
  };
})();
const unlimitedUserList = /* @__PURE__ */ new Set(["Sy2RIxoAA0zpSO8r"]);
const processingConversation = /* @__PURE__ */ new Map();
const curva = {
  async ask(user, conv, model = "gpt4", temperature = 0.5, prompt = "Hi", context = "", tz = 0, _id) {
    if (processingConversation.has(user)) {
      return {
        answer: "",
        error: "THINKING",
        dt: 0
      };
    }
    if (!unlimitedUserList.has(user)) {
      processingConversation.set(user, conv);
    }
    try {
      const core = await coreCollection$1.get(getRandomToken(), "MindsDB");
      const Engine = chooseEngine(model);
      const engine = new Engine(core);
      const t0 = Date.now();
      const result = await engine.ask(prompt, { timezone: tz, temperature, context });
      const dt = Date.now() - t0;
      if (result.answer) {
        const conversation = new Conversation$1(user, conv);
        _id = await conversation.saveMessage(prompt, result.answer, result.queries, result.urls, dt, _id);
      }
      return {
        ...result,
        dt,
        id: _id
      };
    } catch (err) {
      return {
        answer: "",
        error: str(err),
        dt: 0
      };
    } finally {
      processingConversation.delete(user);
    }
  }
};
const curva$1 = curva;

export { Conversation$1 as C, curva$1 as c };
//# sourceMappingURL=index3.mjs.map
