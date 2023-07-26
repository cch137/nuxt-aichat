import type { ChatbotEngine } from './types'
import troll from '~/utils/troll'
import BardChatbotCore from './Bard'
import MindsDbGPTChatbotCore from './MindsdbGPT'

const coreCollection = {
  record: new Map<string, ChatbotEngine>(),
  async get (token: string, engineName: 'Bard' | 'MindsDB') {
    const EngineConstructor = engineName === 'Bard' ? BardChatbotCore : MindsDbGPTChatbotCore
    return this.record.get(token) || await (async () => {
      const engine = new EngineConstructor(troll.d(token, 1, 8038918216105477, true))
      await engine.init()
      this.record.set(token, engine)
      return engine
    })()
  },
  delete (token: string) {
    const engine = this.record.get(token)
    if (engine !== undefined) {
      engine.kill()
      this.record.delete(token)
    }
  }
}

export default coreCollection
