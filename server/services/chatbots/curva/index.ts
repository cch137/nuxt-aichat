import Conversation from './conversation'
import { coreCollection, Gpt3Chatbot, Gpt4Chatbot, GptWebChatbot, Claude2WebChatbot, Gpt3FgaChatbot } from '../engines'
import type { MindsDbGPTChatbotCore, FreeGPTAsiaChatbotCore } from '../engines'
import troll from '~/utils/troll'
import str from '~/utils/str'
import type { OpenAIMessage } from '../engines/cores/types'

function chooseEngine (model: string) {
  switch (model) {
    case 'gpt3':
      return Gpt3Chatbot
    case 'gpt4':
      return Gpt4Chatbot
    case 'gpt-web':
      return GptWebChatbot
    case 'claude-2-web':
      return Claude2WebChatbot
    case 'gpt3-fga':
      return Gpt3FgaChatbot
    default:
      return Gpt4Chatbot
  }
}

const getRandomToken = (() => {
  const tokens: string[] = (() => {
    const accounts: ({ type: 'MindsDB', email: string, password: string })[] = [
      {
        type: 'MindsDB',
        email: 'betacheechorngherng@gmail.com',
        password: 'Curva&&cch137',
      },
      {
        type: 'MindsDB',
        email: 'mingkuanhiew3@gmail.com',
        password: '12345678Hi',
      },
      // {
      //   type: 'MindsDB',
      //   email: 'M5Ij992bVsPWdZajh7fZqw@hotmail.com',
      //   password: 'M5Ij992bVsPWdZajh7fZqw',
      // },
      // {
      //   type: 'MindsDB',
      //   email: 'O1qNDwsOGUcQ1V5nfQmyMg@hotmail.com',
      //   password: 'O1qNDwsOGUcQ1V5nfQmyMg',
      // },
      // {
      //   type: 'MindsDB',
      //   email: 'TCBLoYSrSv8BGCSOKqbWUw@hotmail.com',
      //   password: 'TCBLoYSrSv8BGCSOKqbWUw',
      // },
      // {
      //   type: 'MindsDB',
      //   email: 'HqhF714XxlOT_hlCQ0nCDA@hotmail.com',
      //   password: 'HqhF714XxlOT_hlCQ0nCDA',
      // },
    ]
    return accounts.map((acc) => troll.e(acc, 1, 8038918216105477))
  })()
  tokens.forEach((token) => coreCollection.get(token))
  let lastIndex = 0
  return function () {
    if (lastIndex >= tokens.length - 1) {
      lastIndex = 0
    } else {
      lastIndex++
    }
    return tokens[lastIndex]
  }
})()

const unlimitedUserList = new Set<string>(['Sy2RIxoAA0zpSO8r'])
const processingConversation = new Map<string, string>()
const freeGptAsiaToken = troll.e({
  type: 'FreeGPTAsia'
}, 1, 8038918216105477)

const curva = {
  async ask (user: string, conv: string, model = 'gpt4', temperature = 0.5, messages: OpenAIMessage[] = [], tz = 0, _id?: string) {
    if (processingConversation.has(user)) {
      return {
        answer: '',
        error: 'THINKING',
        dt: 0
      }
    }
    if (!unlimitedUserList.has(user)) {
      processingConversation.set(user, conv)
    }
    try {
      // @ts-ignore
      const engine = await (async () => {
        const Engine = chooseEngine(model)
        return ['gpt3', 'gpt4', 'gpt-web'].includes(model)
          // @ts-ignore
          ? new Engine(await coreCollection.get(getRandomToken()) as MindsDbGPTChatbotCore)
          // @ts-ignore
          : new Engine(await coreCollection.get(freeGptAsiaToken) as FreeGPTAsiaChatbotCore)
      })()
      const t0 = Date.now()
      const result = await engine.ask(messages, { timezone: tz, temperature }) as {
        question: string, answer: string, queries?: string[], urls?: string[], error?: string
      }
      const dt = Date.now() - t0
      if (result.answer) {
        const conversation = new Conversation(user, conv)
        _id = await conversation.saveMessage(result.question, result.answer, result?.queries || [], result?.urls || [], dt, _id)
      }
      return {
        ...result,
        dt,
        id: _id
      }
    } catch (err) {
      return {
        answer: '',
        error: str(err),
        dt: 0
      }
    } finally {
      processingConversation.delete(user)
    }
  }
}

export default curva

export {
  Conversation
}

