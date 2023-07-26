import type { BardChatbotCore } from './cores/Bard'

class BardChatbot {
  engine: BardChatbotCore
  constructor (engine: BardChatbotCore) {
    this.engine = engine
  }
  async ask (question: string, options: { conversationId?: string } = {}) {
    return await this.engine.ask(question, options)
  }  
}

export default BardChatbot
