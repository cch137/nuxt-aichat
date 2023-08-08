import FreeGptAsiaChatbotCore from './cores/FreeGPTAsia'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import type { OpenAIMessage } from './cores/types'
import { messagesToQuestionContext } from './utils/openAiMessagesConverter'

class Gpt3FgaChatbot {
  core: FreeGptAsiaChatbotCore
  constructor (core?: FreeGptAsiaChatbotCore) {
    this.core = core || new FreeGptAsiaChatbotCore()
  }
  async ask (messages: OpenAIMessage[], options: { timezone?: number, context?: string } = {}) {
    const { timezone = 0 } = options
    const { question = '', context = '', isContinueGenerate } = messagesToQuestionContext(messages)
    return {
      // ...await this.core.ask(messages, { model: 'gpt-4' }),
      ...await this.core.ask(messages, { model: 'gpt-3.5-turbo' }),
      question,
      isContinueGenerate,
    }
  }
}

export default Gpt3FgaChatbot
