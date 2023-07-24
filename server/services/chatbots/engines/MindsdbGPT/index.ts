import MindsDBClient from './client'
import type { ChatbotEngine } from '../types'

class MindsDbGPTChatbotEngine implements ChatbotEngine {
  client: MindsDBClient

  constructor (options: { email: string, password: string }) {
    const { email, password } = options
    this.client = new MindsDBClient(email, password)
  }

  init () {}

  async ask (question: string, options: { modelName: string, context?: string}) {
    return await this.client.askGPT(options.modelName, question, options.context)
  }

  kill () {
    this.client.kill()
  }
}

export default MindsDbGPTChatbotEngine
export type { MindsDbGPTChatbotEngine }
