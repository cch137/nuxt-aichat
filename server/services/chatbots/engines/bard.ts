import type { BardChatbotCore } from './cores/Bard'

class BardChatbot {
  core: BardChatbotCore
  constructor (core: BardChatbotCore) {
    this.core = core
  }
  async ask (question: string, options: { conversationId?: string } = {}) {
    return await this.core.ask(question, options)
  }  
}

export default BardChatbot
