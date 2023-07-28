import type { MindsDbGPTChatbotCore } from './cores/MindsdbGPT'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import estimateTokens from "./utils/estimateTokens"

class Gpt3Chatbot {
  core: MindsDbGPTChatbotCore
  constructor (core: MindsDbGPTChatbotCore) {
    this.core= core
  }
  async ask (question: string, options: { timezone?: number, temperature?: number, context?: string } = {}) {
    const { timezone = 0, temperature = 0.5 } = options
    question = `User current time: ${formatUserCurrentTime(timezone)}\nQuestion: ${question}`
    const temperatureSuffix = `_t${Math.round(Math.min(Math.max(temperature, 0), 1) * 10).toString().padStart(2, '0')}`
    const quetionTokens = estimateTokens(question, options.context || '') + 500
    const tokensSuffix = (() => {
      switch (Math.ceil(quetionTokens / 1000)) {
        case 1:
          return '_1k'
        case 2:
          return '_2k'
        case 3:
        case 4:
          return '_3k'
        default:
          throw 'Question too long'
      }
    })()
    const modelName = `gpt3${temperatureSuffix}${tokensSuffix}`
    return await this.core.ask(question, { ...options, modelName })
  }
}

export default Gpt3Chatbot
