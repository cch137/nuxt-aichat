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
    const { question = '', context = '', isContinueGenerate } = messagesToQuestionContext(messages)
    const prompt = question + context ? `\n\n---DEVELOPER PROMPT: Reply to the above message.\n\n${context}` : ''
    return {
      ...await this.core.ask(prompt, { model: 'claude-2-web' }),
      // ...await this.core.ask(question, { model: 'PaLM-2' }),
      question,
      isContinueGenerate,
    }
  }
}

export default Claude2WebChatbot
