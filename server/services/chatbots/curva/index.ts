import Conversation from "./conversation";
import {
  Claude2Chatbot,
  Claude2WebChatbot,
  Gpt3FgaChatbot,
  Gpt4FgaChatbot,
  HackedGeminiProChatbot,
} from "../engines";
import { MindsDbGPTChatbotCore, FreeGPTAsiaChatbotCore } from "../engines";
import str from "~/utils/str";
import type { OpenAIMessage } from "../engines/cores/types";
import type { CurvaStandardResponse } from "./types";

function chooseEngine(model: string) {
  // 記得也要更新 ./convConfig.ts
  switch (model) {
    case "gpt3":
    case "gpt3-fga":
      return Gpt3FgaChatbot;
    case "gpt4":
    case "gpt4-fga":
    case "gpt-web":
      return Gpt4FgaChatbot;
    case "claude-2":
    case "claude-2-web":
      return Claude2Chatbot;
    case "hunyuan":
    case "gemini-pro":
      return HackedGeminiProChatbot;
    default:
      return Gpt3FgaChatbot;
  }
}

class StatusRecord {
  isSuccess: boolean;
  created: number;
  constructor(isSuccess: boolean) {
    this.isSuccess = isSuccess;
    this.created = Date.now();
  }
}

const statusAnalysis = {
  items: [] as StatusRecords[],
  get(recordName: string) {
    return (
      statusAnalysis.items.find((r) => r.name === recordName) ||
      new StatusRecords(recordName)
    );
  },
  add(records: StatusRecords) {
    statusAnalysis.items = [...statusAnalysis.items, records];
  },
  delete(records: StatusRecords) {
    const i = statusAnalysis.items.indexOf(records);
    if (i !== -1) statusAnalysis.items.splice(i, 1);
  },
  get table() {
    return statusAnalysis.items.map(
      (r) => [r.name, r.status] as [string, number]
    );
  },
  record(recordName: string, isSuccess: boolean) {
    return statusAnalysis.get(recordName).record(isSuccess);
  },
};

class StatusRecords {
  name: string;
  items: StatusRecord[];
  lastUpdated: number;
  constructor(name: string) {
    this.name = name;
    this.items = [];
    this.lastUpdated = Date.now();
    statusAnalysis.add(this);
  }
  get size() {
    return this.items.length;
  }
  get updateNeeded(): boolean {
    return this.lastUpdated + 60000 < Date.now();
  }
  get status(): number {
    return this.items.filter((s) => s.isSuccess).length / this.size;
  }
  record(isSuccess: boolean) {
    const items = this.items;
    items.push(new StatusRecord(isSuccess));
    if (!this.updateNeeded) return;
    const now = Date.now();
    if (items.length) {
      while (now - items[0].created > 900000) items.shift();
      this.lastUpdated = now;
    } else statusAnalysis.delete(this);
  }
}

// const getRandomMindsDBCore = (() => {
//   const cores = ([
//     { email: 'cheechorngherng@gmail.com', password: 'HHH2O&h2o' },
//     { email: 'chorngherngchee@gmail.com', password: 'Curva&&cch137' },
//     { email: 'oaktesla@gmail.com', password: 'Oaktesla&&cch137&&mdb' },
//     // { email: 'epsiloncheechorngherng@gmail.com', password: 'Curva&&cch137' },
//     // { email: 'zetacheechorngherng@gmail.com', password: 'Curva&&cch137' },
//   ]).map((acc) => {
//     const { email, password } = acc
//     return new MindsDbGPTChatbotCore({ email, password })
//   })
//   let lastIndex = 0
//   return async function (isCoreAsk = false) {
//     // if (!isCoreAsk) throw 'STAY TUNED'
//     if (lastIndex >= cores.length - 1) lastIndex = 0;
//     else lastIndex++;
//     return await (async () => cores[lastIndex])()
//   }
// })()
const freeGptAsiaCore = new FreeGPTAsiaChatbotCore();

const processingConversation = new Map<string, string>();

const curva = {
  name: "Curva",
  get status() {
    return statusAnalysis.table;
  },
  async fgpt(question: string) {
    return await new Gpt4FgaChatbot(freeGptAsiaCore).ask([
      { role: "user", content: question },
    ]);
  },
  // async coreAsk (modelName: string, question: string, context = '') {
  //   return await (await getRandomMindsDBCore(true)).ask(question, { modelName, context })
  // },
  async ask(
    ip: string,
    uid: string,
    conv: string,
    model = "gpt4",
    temperature = 0.5,
    messages: OpenAIMessage[] = [],
    tz = 0,
    _id?: string,
    streamId?: string
  ): Promise<CurvaStandardResponse> {
    if (processingConversation.has(uid)) {
      return {
        answer: "",
        error: "THINKING",
        dt: 0,
      };
    }
    let debugTimeout: NodeJS.Timeout | undefined = undefined;
    processingConversation.set(uid, conv);
    debugTimeout = setTimeout(
      () => processingConversation.delete(uid),
      5 * 60 * 1000
    );
    try {
      // @ts-ignore
      const engine = await (async () => {
        const Engine = chooseEngine(model) as typeof Gpt4FgaChatbot;
        return [Claude2Chatbot, Claude2WebChatbot].includes(Engine)
          ? new Engine()
          : new Engine(freeGptAsiaCore);
        // return ['gpt3', 'gpt4', 'gpt-web'].includes(model)
        //   // @ts-ignore
        //   ? new Engine(await getRandomMindsDBCore())
        //   // @ts-ignore
        //   : new Engine(freeGptAsiaCore)
      })();
      const t0 = Date.now();
      const result = (await engine.ask(messages, {
        timezone: tz,
        temperature,
        streamId,
      })) as {
        question: string;
        answer: string;
        isContinueGenerate: boolean;
        queries?: string[];
        urls?: string[];
        error?: string;
      };
      const dt = Date.now() - t0;
      if (result.answer) {
        const conversation = new Conversation(uid, conv);
        conversation.updateMtime();
        _id = await conversation.saveMessage(
          result.isContinueGenerate ? "" : result.question,
          result.answer,
          result?.queries || [],
          result?.urls || [],
          dt,
          _id
        );
      }
      statusAnalysis.record(model, result.error ? false : true);
      return {
        ...result,
        dt,
        id: _id,
      };
    } catch (err) {
      statusAnalysis.record(model, false);
      const error = str(err);
      return {
        answer: "",
        error,
        dt: 0,
      };
    } finally {
      processingConversation.delete(uid);
      clearTimeout(debugTimeout);
    }
  },
};

export default curva;

export { Conversation };
