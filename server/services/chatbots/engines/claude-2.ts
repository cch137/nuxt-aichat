import FreeGptAsiaChatbotCore from './cores/FreeGPTAsia'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import type { OpenAIMessage } from './cores/types'
import { messagesToQuestionContext } from './utils/openAiMessagesConverter'

class Claude2WebChatbot {
  core: FreeGptAsiaChatbotCore
  constructor (core?: FreeGptAsiaChatbotCore) {
    this.core = core || new FreeGptAsiaChatbotCore()
  }
  async ask (messages: OpenAIMessage[], options: { timezone?: number, context?: string, streamId?: string } = {}) {
    const { timezone = 0, streamId } = options
    const { question = '', context = '', isContinueGenerate } = messagesToQuestionContext(messages)
    const prompt = context ? `QUESTION: ${question}\n\n---\n\nYou only need to respond to QUESTION. Below is the conversation you previously had with the user.\n\n---\n\n${context}` : question
    return {
      ...await this.core.ask(prompt, { model: 'claude-2-web', streamId }),
      // ...await this.core.ask(question, { model: 'PaLM-2' }),
      question,
      isContinueGenerate,
    }
  }
}

export default Claude2WebChatbot
