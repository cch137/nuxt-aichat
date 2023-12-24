import { l as libExports } from './index2.mjs';
import { c as conversation } from './conversation.mjs';
import { m as message } from './message.mjs';
import axios from 'axios';
import { s as str } from './random.mjs';
import { s as streamManager } from './streamManager.mjs';
import { s as search } from './search.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => {
  __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Conversation {
  constructor(uid, conv) {
    __publicField$6(this, "conv");
    __publicField$6(this, "uid");
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
      try {
        await message.updateOne({
          _id: new libExports.ObjectId(regenerateId),
          uid,
          conv
        }, {
          $set: record
        });
        return regenerateId;
      } catch {
      }
    }
    return (await message.create(record))._id.toString();
  }
}
const Conversation$1 = Conversation;

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

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => {
  __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
async function createStreamRequest(streaming, url, data, headers) {
  return await new Promise(async (resolve, reject) => {
    let error = void 0;
    try {
      const res = await axios.post(url, data, {
        headers,
        validateStatus: (_) => true,
        responseType: "stream"
      });
      res.data.on("data", (buf) => {
        var _a, _b;
        const chunksString = buf.toString("utf8").split("data:").map((c) => c.trim()).filter((c) => c);
        for (const chunkString of chunksString) {
          try {
            const chunk = JSON.parse(chunkString);
            const content = (_b = (_a = chunk.choices[0]) == null ? void 0 : _a.delta) == null ? void 0 : _b.content;
            if (content === void 0)
              continue;
            streaming.write(content);
          } catch {
          }
        }
      });
      res.data.on("error", (e) => {
        error = e;
        streaming.error(e);
      });
      res.data.on("end", () => {
        const answer = streaming.read();
        if (answer) {
          streaming.end();
          resolve({ answer });
        } else {
          reject(`${error || "Oops! Something went wrong."}`);
        }
      });
    } catch (err) {
      reject(`${error || "Oops! Something went wrong."}`);
    }
  });
}
const fgaApiHost = "https://api.freegpt.asia";
const fgaApiKey = "sk-g7kBtcXIBI6ihoin7223Df33910b4aF38631204e03FdF1B1";
const mikuApiHost = "https://chat.mikumikumi.tk";
const mikuApiKey = "sk-iqYB0vYbeIDfRZcQFb595cDd6b9a479a8735120a7b87D987";
const defaultApiHost = mikuApiHost;
const defaultApiKey = mikuApiKey;
class Client {
  constructor(host = defaultApiHost, apiKey = defaultApiKey) {
    __publicField$5(this, "host");
    __publicField$5(this, "apiKey");
    this.host = host || defaultApiHost;
    this.apiKey = apiKey || defaultApiKey;
  }
  async askGPT(messages, options = {}) {
    const { model = "", temperature = 0.3, top_p = 0.7, stream = true, streamId, maxTries = 1 } = options;
    const url = `${this.host}/v1/chat/completions`;
    const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${this.apiKey}` };
    const _data = {
      messages,
      model,
      temperature,
      top_p,
      stream
    };
    if (!stream) {
      try {
        const data = (await axios.post(url, _data, { headers, validateStatus: (_) => true })).data;
        const answer = data.choices[0].message.content;
        return { answer };
      } catch (err) {
        return { error: `${err}`, answer: "" };
      }
    }
    const streaming = (streamId ? streamManager.get(streamId) : 0) || streamManager.create();
    let retries = 0;
    while (true) {
      try {
        return await createStreamRequest(streaming, url, _data, headers);
      } catch (err) {
        if (retries++ < maxTries) {
          console.log("GPT stream retry.", err);
          continue;
        } else {
          return { error: `${err}`, answer: "" };
        }
      }
    }
  }
}
class FreeGptAsiaChatbotCore {
  constructor(options = {}) {
    __publicField$5(this, "client");
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
        return res;
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

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => {
  __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
let Claude2WebChatbot$2 = class Claude2WebChatbot {
  constructor(core) {
    __publicField$4(this, "core");
    this.core = core || new FreeGPTAsiaChatbotCore({ host: fgaApiHost, apiKey: fgaApiKey });
  }
  async ask(messages, options = {}) {
    const { timezone = 0, temperature = 0.5, streamId } = options;
    const { question = "", context = "", isContinueGenerate } = messagesToQuestionContext(messages);
    return {
      ...await this.core.ask(messages, { model: "claude-2", temperature, streamId }),
      // ...await this.core.ask(question, { model: 'PaLM-2' }),
      question,
      isContinueGenerate
    };
  }
};
const Claude2Chatbot = Claude2WebChatbot$2;

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => {
  __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Claude2WebChatbot {
  constructor(core) {
    __publicField$3(this, "core");
    this.core = core || new FreeGPTAsiaChatbotCore({ host: fgaApiHost, apiKey: fgaApiKey });
  }
  async ask(messages, options = {}) {
    const { timezone = 0, temperature = 0.5, streamId } = options;
    const { question = "", context = "", isContinueGenerate } = messagesToQuestionContext(messages);
    messages.at(-1).content = `${question}

---

The following is information from the web, please use it only when necessary.

${(await search(question)).summary(false)}`;
    return {
      ...await this.core.ask(messages, { model: "claude-2", temperature, streamId }),
      // ...await this.core.ask(question, { model: 'PaLM-2' }),
      question,
      isContinueGenerate
    };
  }
}
const Claude2WebChatbot$1 = Claude2WebChatbot;

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Gpt3FgaChatbot {
  constructor(core) {
    __publicField$2(this, "core");
    this.core = core || new FreeGPTAsiaChatbotCore();
  }
  async ask(messages, options = {}) {
    const { timezone = 0, streamId, temperature } = options;
    const { question = "", context = "", isContinueGenerate } = messagesToQuestionContext(messages);
    return {
      ...await this.core.ask(messages, { model: "gpt-3.5-turbo", streamId, temperature }),
      question,
      isContinueGenerate
    };
  }
}
const Gpt3FgaChatbot$1 = Gpt3FgaChatbot;

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Gpt4FgaChatbot {
  constructor(core) {
    __publicField$1(this, "core");
    this.core = core || new FreeGPTAsiaChatbotCore();
  }
  async ask(messages, options = {}) {
    const { timezone = 0, streamId, temperature } = options;
    const { question = "", context = "", isContinueGenerate } = messagesToQuestionContext(messages);
    return {
      ...await this.core.ask(messages, { model: "gpt-4", streamId, temperature }),
      question,
      isContinueGenerate
    };
  }
}
const Gpt4FgaChatbot$1 = Gpt4FgaChatbot;

const convertPartsToText = (parts) => {
  if (typeof parts === "string")
    return parts;
  const texts = [];
  for (const part of parts) {
    if (typeof part === "string")
      texts.push(part);
    else
      texts.push((part == null ? void 0 : part.text) || "");
  }
  return texts.join("");
};
const geminiPro = (() => {
  const apiKey = "AIzaSyDfGoWenCyM53XsN-AB6dci5dpNxFR-WXg";
  const genAI = new GoogleGenerativeAI(apiKey);
  const ask = async (newMessage = "Hi", _history = [], streamId) => {
    const stream = (streamId === void 0 ? null : streamManager.get(streamId)) || streamManager.create();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const history = [];
    _history = _history.map((msg) => ({ role: msg.role, parts: convertPartsToText(msg.parts) }));
    let lastIsUser = false;
    for (let i = 0; i < _history.length; i++) {
      if (lastIsUser && _history[i].role === "user")
        history.push({ role: "model", parts: "" });
      if (!lastIsUser && _history[i].role === "model")
        history.push({ role: "user", parts: "" });
      history.push(_history[i]);
      lastIsUser = _history[i].role === "user";
    }
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 8e3
      }
    });
    let globalError = void 0;
    const req = await chat.sendMessageStream(newMessage);
    try {
      while (true) {
        const chunk = await req.stream.next();
        if (chunk.done)
          break;
        const { candidates, promptFeedback } = chunk.value;
        if (promptFeedback == null ? void 0 : promptFeedback.blockReason) {
          globalError = new Error(`Model refused to respond. (Ratings: ${promptFeedback.safetyRatings.map((r) => `${r.probability} ${r.category}`).join(", ")})`);
          throw globalError;
        }
        if (candidates === void 0)
          continue;
        for (const candidate of candidates) {
          for (const part of candidate.content.parts) {
            stream.write((part == null ? void 0 : part.text) || "");
          }
        }
      }
    } catch (e) {
      stream.error();
    } finally {
      stream.end();
    }
    if (globalError)
      throw globalError;
    return stream;
  };
  return {
    ask
  };
})();
class HackedGeminiProChatbot {
  constructor() {
  }
  async ask(messages, options = {}) {
    var _a;
    const { timezone = 0, streamId, temperature } = options;
    const { question = "", context = "", isContinueGenerate } = messagesToQuestionContext(messages);
    if (((_a = messages.at(-1)) == null ? void 0 : _a.content) === question)
      messages.pop();
    try {
      const stream = await geminiPro.ask(question, messages.map((m) => ({ parts: m.content, role: m.role === "user" ? "user" : "model" })), streamId);
      const answer = await new Promise((resolve, reject) => {
        stream.addEventListener("end", () => resolve(stream.read()));
        stream.addEventListener("error", () => reject());
        if (stream.isError)
          reject();
        else if (stream.isEnd)
          resolve(stream.read());
      });
      return {
        answer,
        question,
        isContinueGenerate
      };
    } catch (error) {
      return {
        answer: "",
        error: error instanceof Error ? error.message : error,
        question,
        isContinueGenerate
      };
    }
  }
}
const HackedGeminiProChatbot$1 = HackedGeminiProChatbot;

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function chooseEngine(model) {
  switch (model) {
    case "gpt3":
    case "gpt3-fga":
      return Gpt3FgaChatbot$1;
    case "gpt4":
    case "gpt4-fga":
    case "gpt-web":
      return Gpt4FgaChatbot$1;
    case "claude-2":
    case "claude-2-web":
      return Claude2Chatbot;
    case "hunyuan":
    case "gemini-pro":
      return HackedGeminiProChatbot$1;
    default:
      return Gpt3FgaChatbot$1;
  }
}
class StatusRecord {
  constructor(isSuccess) {
    __publicField(this, "isSuccess");
    __publicField(this, "created");
    this.isSuccess = isSuccess;
    this.created = Date.now();
  }
}
const statusAnalysis = {
  items: [],
  get(recordName) {
    return statusAnalysis.items.find((r) => r.name === recordName) || new StatusRecords(recordName);
  },
  add(records) {
    statusAnalysis.items = [...statusAnalysis.items, records];
  },
  delete(records) {
    const i = statusAnalysis.items.indexOf(records);
    if (i !== -1)
      statusAnalysis.items.splice(i, 1);
  },
  get table() {
    return statusAnalysis.items.map((r) => [r.name, r.status]);
  },
  record(recordName, isSuccess) {
    return statusAnalysis.get(recordName).record(isSuccess);
  }
};
class StatusRecords {
  constructor(name) {
    __publicField(this, "name");
    __publicField(this, "items");
    __publicField(this, "lastUpdated");
    this.name = name;
    this.items = [];
    this.lastUpdated = Date.now();
    statusAnalysis.add(this);
  }
  get size() {
    return this.items.length;
  }
  get updateNeeded() {
    return this.lastUpdated + 6e4 < Date.now();
  }
  get status() {
    return this.items.filter((s) => s.isSuccess).length / this.size;
  }
  record(isSuccess) {
    const items = this.items;
    items.push(new StatusRecord(isSuccess));
    if (!this.updateNeeded)
      return;
    const now = Date.now();
    let removeIndex = this.size - 1;
    for (; removeIndex < this.size; removeIndex++) {
      if (now - items[removeIndex].created > 9e5) {
        break;
      }
    }
    if (removeIndex !== 0)
      this.items = items.slice(removeIndex);
    this.lastUpdated = now;
    if (this.size === 0)
      statusAnalysis.delete(this);
  }
}
const freeGptAsiaCore = new FreeGPTAsiaChatbotCore();
const processingConversation = /* @__PURE__ */ new Map();
const curva = {
  name: "Curva",
  get status() {
    return statusAnalysis.table;
  },
  async fgpt(question) {
    return await new Gpt4FgaChatbot$1(freeGptAsiaCore).ask([{ role: "user", content: question }]);
  },
  // async coreAsk (modelName: string, question: string, context = '') {
  //   return await (await getRandomMindsDBCore(true)).ask(question, { modelName, context })
  // },
  async ask(ip, uid, conv, model = "gpt4", temperature = 0.5, messages = [], tz = 0, _id, streamId) {
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
        return [Claude2Chatbot, Claude2WebChatbot$1].includes(Engine) ? new Engine() : new Engine(freeGptAsiaCore);
      })();
      const t0 = Date.now();
      const result = await engine.ask(messages, { timezone: tz, temperature, streamId });
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
      statusAnalysis.record(model, result.error ? false : true);
      return {
        ...result,
        dt,
        id: _id
      };
    } catch (err) {
      statusAnalysis.record(model, false);
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

export { Conversation$1 as C, curva$1 as c };
//# sourceMappingURL=index4.mjs.map
