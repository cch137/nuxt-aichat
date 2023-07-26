import random from '~/utils/random'
import { Bard } from 'googlebard'
import type { ChatbotEngine } from '../types'

class BardChatbotCore implements ChatbotEngine {
  client: Bard

  constructor (options: { cookies: string }) {
    this.client = new Bard(options.cookies)
  }

  init (): Promise<true> {
    return new Promise((resolve) => resolve(true))
  }

  ask (question: string, options: { conversationId?: string }) {
    const { conversationId = random.base64(64) } = options
    return this.client.ask(question, conversationId)
  }

  kill () {}
}

export default BardChatbotCore
export type { BardChatbotCore }
