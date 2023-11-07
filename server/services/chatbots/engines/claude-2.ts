import FreeGptAsiaChatbotCore from './cores/FreeGPTAsia'
import { fgaApiHost, fgaApiKey } from './cores/FreeGPTAsia'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import type { OpenAIMessage } from './cores/types'
import { messagesToQuestionContext } from './utils/openAiMessagesConverter'

class Claude2WebChatbot {
  core: FreeGptAsiaChatbotCore
  constructor (core?: FreeGptAsiaChatbotCore) {
    this.core = core || new FreeGptAsiaChatbotCore({ host: fgaApiHost, apiKey: fgaApiKey })
  }
  async ask (messages: OpenAIMessage[], options: { timezone?: number, context?: string, temperature?: number, streamId?: string } = {}) {
    const { timezone = 0, temperature = 0.5, streamId } = options
    const { question = '', context = '', isContinueGenerate } = messagesToQuestionContext(messages)
    return {
      ...await this.core.ask(messages, { model: 'claude-2', temperature, streamId }),
      // ...await this.core.ask(question, { model: 'PaLM-2' }),
      question,
      isContinueGenerate,
    }
  }
}

export default Claude2WebChatbot
