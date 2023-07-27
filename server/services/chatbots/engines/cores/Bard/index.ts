import random from '~/utils/random'
import { Bard } from 'googlebard'
import type { ChatbotEngine } from '../types'
import str from '~/utils/str'

class BardChatbotCore implements ChatbotEngine {
  client: Bard

  constructor (options: { cookies: string }) {
    this.client = new Bard(options.cookies)
  }

  init (): Promise<true> {
    return new Promise((resolve) => resolve(true))
  }

  async ask (question: string, options: { conversationId?: string }) {
    try {
      const { conversationId = random.base64(64) } = options
      return { answer: await this.client.ask(question, conversationId) }
    } catch (err) {
      return { answer: '', error: str(err) }
    }
  }

  setup () {}

  kill () {}
}

export default BardChatbotCore
export type { BardChatbotCore }
