import Conversation from './conversation'
import { coreCollection, BardChatbot, Gpt3Chatbot, Gpt4Chatbot, GptWeb1Chatbot, GptWeb2Chatbot } from '../engines'
import troll from '~/utils/troll'
import str from '~/utils/str'

function chooseEngine (model: string) {
  switch (model) {
    case 'gpt3':
      return Gpt3Chatbot
    case 'gpt4':
      return Gpt4Chatbot
    case 'gpt-web-1':
      return GptWeb1Chatbot
    case 'gpt-web-2':
      return GptWeb2Chatbot
    case 'bard':
      return BardChatbot
    default:
      return Gpt4Chatbot
  }
}

const getRandomToken = (() => {
  const tokens: string[] = (() => {
    const accounts: ({ email: string, password: string })[] = [
      // {
      //   email: 'betacheechorngherng@gmail.com',
      //   password: 'Curva&&cch137',
      // },
      // {
      //   email: 'mingkuanhiew3@gmail.com',
      //   password: '12345678Hi',
      // },
      {
        email: 'M5Ij992bVsPWdZajh7fZqw@hotmail.com',
        password: 'M5Ij992bVsPWdZajh7fZqw',
      },
      {
        email: 'O1qNDwsOGUcQ1V5nfQmyMg@hotmail.com',
        password: 'O1qNDwsOGUcQ1V5nfQmyMg',
      },
      {
        email: 'TCBLoYSrSv8BGCSOKqbWUw@hotmail.com',
        password: 'TCBLoYSrSv8BGCSOKqbWUw',
      },
      {
        email: 'HqhF714XxlOT_hlCQ0nCDA@hotmail.com',
        password: 'HqhF714XxlOT_hlCQ0nCDA',
      },
    ]
    return accounts.map((acc) => troll.e(acc, 1, 8038918216105477))
  })()
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

const curva = {
  async ask (user: string, conv: string, model = 'gpt4', temperature = 0.5, prompt = 'Hi', context = '', tz = 0, _id?: string) {
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
      const core = await coreCollection.get(getRandomToken(), 'MindsDB')
      const Engine = chooseEngine(model)
      // @ts-ignore
      const engine = new Engine(core)
      const t0 = Date.now()
      const result = await engine.ask(prompt, { timezone: tz, temperature, context }) as { answer: string, queries?: string[], urls?: string[], error?: string }
      const dt = Date.now() - t0
      if (result.answer) {
        const conversation = new Conversation(user, conv)
        _id = await conversation.saveMessage(prompt, result.answer, result.queries, result.urls, dt, _id)
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

