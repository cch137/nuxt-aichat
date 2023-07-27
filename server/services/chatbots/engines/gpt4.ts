import type { MindsDbGPTChatbotCore } from './cores/MindsdbGPT'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import estimateTokens from "./utils/estimateTokens"

class Gpt4Chatbot {
  core: MindsDbGPTChatbotCore
  constructor (core: MindsDbGPTChatbotCore) {
    this.core= core
  }
  async ask (question: string, options: { timezone?: number, temperature?: number, maxTokens?: number } = {}) {
    const { timezone = 0, temperature = 0.5 } = options
    question = `User current time: ${formatUserCurrentTime(timezone)}\nQuestion: ${question}`
    const temperatureSuffix = `_t${Math.round(Math.min(Math.max(temperature, 0), 1) * 10).toString().padStart(2, '0')}`
    const quetionTokens = estimateTokens(question) + 500
    const tokensSuffix = (() => {
      switch (Math.ceil(quetionTokens / 1000)) {
        case 1:
          return '_1k'
        case 2:
          return '_2k'
        case 3:
          return '_3k'
        case 4:
          return '_3k'
        case 5:
          return '_5k'
        case 6:
          return '_6k'
        case 7:
        case 8:
          return '_7k'
        default:
          throw 'Question too long'
      }
    })()
    const modelName = `gpt4${temperatureSuffix}${tokensSuffix}`
    return await this.core.ask(question, { ...options, modelName })
  }
}

export default Gpt4Chatbot
