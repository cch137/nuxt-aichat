import random from '~/utils/random'
import { Bard } from 'googlebard'
import type { ChatbotEngine } from '../types'

class BardChatbotEngine implements ChatbotEngine {
  client: Bard

  constructor (options: { cookies: string }) {
    this.client = new Bard(options.cookies)
  }

  init () {}

  ask (question: string, options: { conversationId: string }) {
    const { conversationId = random.base64(64) } = options
    return this.client.ask(question, conversationId)
  }

  kill () {}
}

export default BardChatbotEngine
export type { BardChatbotEngine }
