import Conversation from './conversation'
import { Gpt3Chatbot, Gpt4Chatbot, GptWebChatbot, Claude2Chatbot, Claude2WebChatbot, Gpt3FgaChatbot, Gpt4FgaChatbot } from '../engines'
import { MindsDbGPTChatbotCore, FreeGPTAsiaChatbotCore } from '../engines'
import str from '~/utils/str'
import type { OpenAIMessage } from '../engines/cores/types'
import type { CurvaStandardResponse } from './types'

function chooseEngine (model: string) {
  // 記得也要更新 ./convConfig.ts
  switch (model) {
    case 'gpt3':
      return Gpt3Chatbot
    case 'gpt4':
      return Gpt4Chatbot
    case 'gpt-web':
      return GptWebChatbot
    case 'claude-2':
      return Claude2Chatbot
    case 'claude-2-web':
      return Claude2WebChatbot
    case 'gpt3-fga':
      return Gpt3FgaChatbot
    case 'gpt4-fga':
      return Gpt4FgaChatbot
    default:
      return Gpt3Chatbot
  }
}

const statusAnalysis = new Map<string, number>()
function getModelStatus(modelName: string, defaultIsSuccess?: boolean) {
  return statusAnalysis.get(modelName) || (() => {
    const status = defaultIsSuccess ? 1 : 0
    statusAnalysis.set(modelName, status)
    return status
  })()
}
function recordModelStatus(modelName: string, isSuccess: boolean) {
  statusAnalysis.set(modelName, getModelStatus(modelName, isSuccess) * 0.8 + (isSuccess ? 0.2 : 0))
}

const getRandomMindsDBCore = (() => {
  const cores = ([
    // { email: 'chorngherngchee@gmail.com', password: 'Curva&&cch137' },
    { email: 'gammacheechorngherng@gmail.com', password: 'Curva&&cch137' },
    { email: 'deltacheechorngherng@gmail.com', password: 'Curva&&cch137' },
    { email: 'chengyuxuee@gmail.com', password: '88888888Ss' },
    { email: 'chengyuxueee@gmail.com', password: '88888888Ss' },
    { email: 'xuechengyuuu@gmail.com', password: '12345678Ss' },
    { email: 'xuechengyuuuu@gmail.com', password: '12345678Ss' },
    // { email: 'M5Ij992bVsPWdZajh7fZqw@hotmail.com', password: 'M5Ij992bVsPWdZajh7fZqw' },
    // { email: 'O1qNDwsOGUcQ1V5nfQmyMg@hotmail.com', password: 'O1qNDwsOGUcQ1V5nfQmyMg' },
    // { email: 'TCBLoYSrSv8BGCSOKqbWUw@hotmail.com', password: 'TCBLoYSrSv8BGCSOKqbWUw' },
    // { email: 'HqhF714XxlOT_hlCQ0nCDA@hotmail.com', password: 'HqhF714XxlOT_hlCQ0nCDA' },
  ]).map((acc) => {
    const { email, password } = acc
    return new MindsDbGPTChatbotCore({ email, password })
  })
  let lastIndex = 0
  return async function () {
    if (lastIndex >= cores.length - 1) lastIndex = 0;
    else lastIndex++;
    return await (async () => cores[lastIndex])()
  }
})()
const freeGptAsiaCore = new FreeGPTAsiaChatbotCore()

const processingConversation = new Map<string, string>()

const curva = {
  name: 'Curva',
  get status() {
    return [...statusAnalysis.keys()].sort()
      .map(model => [model, statusAnalysis.get(model) as number] as [string,number])
  },
  async coreAsk (modelName: string, question: string, context = '') {
    return await (await getRandomMindsDBCore()).ask(question, { modelName, context })
  },
  async ask (ip: string, uid: string, conv: string, model = 'gpt4', temperature = 0.5, messages: OpenAIMessage[] = [], tz = 0, _id?: string, streamId?: string): Promise<CurvaStandardResponse> {
    if (processingConversation.has(uid)) {
      return {
        answer: '',
        error: 'THINKING',
        dt: 0
      }
    }
    let debugTimeout: NodeJS.Timeout | undefined = undefined
    processingConversation.set(uid, conv)
    debugTimeout = setTimeout(() => processingConversation.delete(uid), 5 * 60 * 1000)
    try {
      // @ts-ignore
      const engine = await (async () => {
        const Engine = chooseEngine(model)
        return ['gpt3', 'gpt4', 'gpt-web'].includes(model)
          // @ts-ignore
          ? new Engine(await getRandomMindsDBCore())
          // @ts-ignore
          : new Engine(freeGptAsiaCore)
      })()
      const t0 = Date.now()
      const result = await engine.ask(messages, { timezone: tz, temperature, streamId }) as {
        question: string,
        answer: string,
        isContinueGenerate: boolean,
        queries?: string[],
        urls?: string[],
        error?: string
      }
      const dt = Date.now() - t0
      if (result.answer) {
        const conversation = new Conversation(uid, conv)
        conversation.updateMtime()
        _id = await conversation.saveMessage(
          result.isContinueGenerate ? '' : result.question,
          result.answer,
          result?.queries || [],
          result?.urls || [],
          dt,
          _id
        )
      }
      recordModelStatus(model, true)
      return {
        ...result,
        dt,
        id: _id
      }
    } catch (err) {
      recordModelStatus(model, false)
      const error = str(err)
      return {
        answer: '',
        error,
        dt: 0
      }
    } finally {
      processingConversation.delete(uid)
      clearTimeout(debugTimeout)
    }
  }
}

export default curva

export {
  Conversation
}

