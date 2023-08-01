import FreeGptAsiaChatbotCore from './cores/FreeGPTAsia'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import type { OpenAIMessage } from './cores/types'
import { messagesToQuestionContext } from './utils/openAiMessagesConverter'

class Claude2WebChatbot {
  core: FreeGptAsiaChatbotCore
  constructor (core?: FreeGptAsiaChatbotCore) {
    this.core = core || new FreeGptAsiaChatbotCore()
  }
  async ask (messages: OpenAIMessage[], options: { timezone?: number, context?: string } = {}) {
    const { timezone = 0 } = options
    const { question = '', context = '' } = messagesToQuestionContext(messages)
    const prompt = `${question}\n\n---\nSYSTEM PROMPT: Please continue to reply to the user according to the following conversation history.\n\n${context}`
    return {
      ...await this.core.ask(prompt, { model: 'claude-2-web' }),
      question
    }
  }
}

export default Claude2WebChatbot
