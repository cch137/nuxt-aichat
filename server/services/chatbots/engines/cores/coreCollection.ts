import troll from '~/utils/troll'
import BardChatbotCore from './Bard'
import MindsDbGPTChatbotCore from './MindsdbGPT'
import OpenAiGPTChatbotCore from './OpenAiGPT'

const coreCollection = {
  record: new Map<string, (BardChatbotCore | MindsDbGPTChatbotCore)>(),
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
};

// (async () => {
//   console.log('TESTING 1 STRAT')
//   const bot = new OpenAiGPTChatbotCore()
//   // console.log('OK', bot)
//   const answer = await bot.ask('Hi', {})
//   console.log(answer)
// })()

export default coreCollection
