import FreeGptAsiaChatbotCore from './cores/FreeGPTAsia'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import type { OpenAIMessage } from './cores/types'
import { messagesToQuestionContext } from './utils/openAiMessagesConverter'
import search from '~/server/services/webBrowsing/search'

class Claude2WebChatbot {
  core: FreeGptAsiaChatbotCore
  constructor (core?: FreeGptAsiaChatbotCore) {
    this.core = core || new FreeGptAsiaChatbotCore()
  }
  async ask (messages: OpenAIMessage[], options: { timezone?: number, context?: string, streamId?: string } = {}) {
    const { timezone = 0, streamId } = options
    const { question = '', context = '', isContinueGenerate } = messagesToQuestionContext(messages)
    const prompt = (context ? `You only need to respond to QUESTION. After that, there is the conversation between you and the user, and no response is needed.\n\n---\n\nQUESTION: ${question}\n\n---\n\n${context}` : question)
      + `\n\n---\n\nThe following is information from the web, please use it only when necessary.\n\n${(await search(question)).summary(false)}`
    return {
      ...await this.core.ask(prompt, { model: 'claude-2-web', streamId }),
      // ...await this.core.ask(question, { model: 'PaLM-2' }),
      question,
      isContinueGenerate,
    }
  }
}

export default Claude2WebChatbot
