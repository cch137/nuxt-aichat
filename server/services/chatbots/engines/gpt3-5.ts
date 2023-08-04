import type { MindsDbGPTChatbotCore } from './cores/MindsdbGPT'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import estimateTokens from "./utils/estimateTokens"
import type { OpenAIMessage } from './cores/types'
import { messagesToQuestionContext } from './utils/openAiMessagesConverter'

class Gpt3Chatbot {
  core: MindsDbGPTChatbotCore
  constructor (core: MindsDbGPTChatbotCore) {
    this.core = core
  }
  async ask (messages: OpenAIMessage[], options: { timezone?: number, temperature?: number, context?: string } = {}) {
    const { timezone = 0, temperature = 0.5 } = options
    const { question = '', context = '' } = messagesToQuestionContext(messages)
    const prompt = `User current time: ${formatUserCurrentTime(timezone)}\nQuestion: ${question}`
    const temperatureSuffix = `_t${Math.round(Math.min(Math.max(temperature, 0), 1) * 10).toString().padStart(2, '0')}`
    const quetionTokens = estimateTokens(question, context) + 500
    const tokensSuffix = (() => {
      switch (Math.ceil(quetionTokens / 1024)) {
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
    return {
      ...await this.core.ask(prompt, { ...options, modelName, context }),
      question
    }
  }
}

export default Gpt3Chatbot
