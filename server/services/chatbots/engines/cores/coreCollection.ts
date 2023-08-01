import troll from '~/utils/troll'
import BardChatbotCore from './Bard'
import MindsDbGPTChatbotCore from './MindsdbGPT'
import OpenAiGPTChatbotCore from './OpenAiGPT'

const coreCollection = {
  record: new Map<string, Promise<(BardChatbotCore | MindsDbGPTChatbotCore)>>(),
  async get (token: string, engineName: 'Bard' | 'MindsDB') {
    return await this.record.get(token) || await (async () => {
      const promise = new Promise<(BardChatbotCore | MindsDbGPTChatbotCore)>(async (resolve) => {
        const EngineConstructor = engineName === 'Bard' ? BardChatbotCore : MindsDbGPTChatbotCore
        const engine = new EngineConstructor(troll.d(token, 1, 8038918216105477, true))
        await engine.init()
        resolve(engine)
      })
      this.record.set(token, promise)
      return await promise
    })()
  },
  async delete (token: string) {
    const engine = await this.record.get(token)
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
