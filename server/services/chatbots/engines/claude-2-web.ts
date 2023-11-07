import FreeGptAsiaChatbotCore from './cores/FreeGPTAsia'
import { fgaApiHost, fgaApiKey } from './cores/FreeGPTAsia'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import type { OpenAIMessage } from './cores/types'
import { messagesToQuestionContext } from './utils/openAiMessagesConverter'
import search from '~/server/services/webBrowsing/search'

class Claude2WebChatbot {
  core: FreeGptAsiaChatbotCore
  constructor (core?: FreeGptAsiaChatbotCore) {
    this.core = core || new FreeGptAsiaChatbotCore({ host: fgaApiHost, apiKey: fgaApiKey })
  }
  async ask (messages: OpenAIMessage[], options: { timezone?: number, context?: string, temperature?: number, streamId?: string } = {}) {
    const { timezone = 0, temperature = 0.5, streamId } = options
    const { question = '', context = '', isContinueGenerate } = messagesToQuestionContext(messages)
    messages.at(-1)!.content = `${question}\n\n---\n\nThe following is information from the web, please use it only when necessary.\n\n${(await search(question)).summary(false)}`
    return {
      ...await this.core.ask(messages, { model: 'claude-2', temperature, streamId }),
      // ...await this.core.ask(question, { model: 'PaLM-2' }),
      question,
      isContinueGenerate,
    }
  }
}

export default Claude2WebChatbot
