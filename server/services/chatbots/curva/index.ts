import Conversation from './conversation'
import { coreCollection, BardChatbot, Gpt3Chatbot, Gpt4Chatbot, GptWeb1Chatbot, GptWeb2Chatbot } from '../engines'
import troll from '~/utils/troll'

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

const curva = {
  async ask (user: string, conv: string, model = 'gpt4', temperature = 0.5, prompt = 'Hi', context = '', tz = 0, _id?: string) {
    const core = await coreCollection.get(troll.e({
      email: process.env.CHAT_MDB_EMAIL_ADDRESS,
      password: process.env.CHAT_MDB_PASSWORD
    }, 1, 8038918216105477), 'MindsDB')
    const Engine = chooseEngine(model)
    // @ts-ignore
    const engine = new Engine(core)
    const t0 = Date.now()
    const result = await engine.ask(prompt, { timezone: tz, temperature, context }) as { answer: string, queries?: string[], urls?: string[], error?: string }
    const dt = Date.now() - t0
    const conversation = new Conversation(user, conv)
    if (result.answer) {
      _id = await conversation.saveMessage(prompt, result.answer, result.queries, result.urls, dt, _id)
    }
    return {
      ...result,
      dt,
      id: _id
    }
  }
}

export default curva

export {
  Conversation
}

