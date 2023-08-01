import troll from '~/utils/troll'
import MindsDbGPTChatbotCore from './MindsdbGPT'
import FreeGptAsiaChatbotCore from './FreeGPTAsia'

const coreCollection = {
  record: new Map<string, (Promise<MindsDbGPTChatbotCore | FreeGptAsiaChatbotCore>)>(),
  async get (token: string) {
    return await this.record.get(token) || await (async () => {
      const tokenObj = troll.d(token, 1, 8038918216105477, true)
      const engineName = tokenObj?.type || 'MindsDB'
      const promise = new Promise<(MindsDbGPTChatbotCore | FreeGptAsiaChatbotCore)>(async (resolve) => {
        const EngineConstructor = engineName === 'MindsDB'
          ? MindsDbGPTChatbotCore
          : engineName === 'FreeGPTAsia'
            ? FreeGptAsiaChatbotCore
            : MindsDbGPTChatbotCore
        const engine = new EngineConstructor(tokenObj)
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
//   const bot = new FreeGptAsiaChatbotCore()
//   // console.log('OK', bot)
//   const answer = await bot.ask('Hi', {})
//   console.log(answer)
// })()

export default coreCollection
