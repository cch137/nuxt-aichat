import MindsDBClient from './client'
import type { ChatbotEngine, OpenAIMessage } from '../types'
import { getAllCreateCommand, getAllDropCommand } from './utils'
import sleep from '~/utils/sleep'
import { messagesToQuestionContext } from '../../utils/openAiMessagesConverter'
import MindsDB from 'mindsdb-js-sdk'

class MindsDbGPTChatbotCore implements ChatbotEngine {
  client: MindsDBClient

  constructor (options: { email: string, password: string }) {
    const { email, password } = options
    this.client = new MindsDBClient(email, password)
  }

  init (): Promise<true> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 5000)
    })
  }

  async setup () {
    const commands = [
      // ...getAllDropCommand(),
      ...getAllCreateCommand(),
    ]
    const tasks: Promise<any>[] = []
    for (const command of commands) {
      try {
        await sleep(500)
        await this.client.queryWithWeb(command)
        console.log(`RUNNING COMMAND... (${commands.indexOf(command) + 1}/${commands.length})`)
      } catch (err) {
        console.error(err, '\n\n')
      }
    }
    return await Promise.all(tasks)
  }

  async ask (questionOrMessages: string | OpenAIMessage[], options: { modelName: string, context?: string }) {
    const { question = '', context = '' } = (typeof questionOrMessages === 'string')
      ? ({ question: questionOrMessages, context: options?.context || '' })
      : messagesToQuestionContext(questionOrMessages)
    return await this.client.askGPT(options.modelName, question, context || '')
  }

  kill () {
    this.client.kill()
  }
}

(async () => {
  // try {
  //   await MindsDB.default.connect({
  //     user: 'chengyuxueee@gmail.com',
  //     password: '88888888Ss',
  //   })
  //   const model = await MindsDB.default.Models.getModel('gpt4_t05_4k', 'mindsdb')
  //   if (model === undefined) return;
  //   const t0 = Date.now()
  //   console.log((await model.query({
  //     where: [`question = '--\n-- \n-- Hi\n--Hi\na'`, `context = ''`]
  //   })).data.question)
  //   console.log(Date.now() - t0)
  // } catch(error) {
  //   console.log('MDB connect error:', error)
  // }
  // const bot = new MindsDbGPTChatbotCore({
  //   email: 'chengyuxueee@gmail.com',
  //   password: '88888888Ss',
  // })
  // await bot.init()
  // const t0 = Date.now()
  // console.log(await bot.ask('Hi', { modelName: 'gpt4_t05_4k' }))
  // console.log(Date.now() - t0)
})()

// ;(async () => {
//   const bot1 = new MindsDbGPTChatbotCore({
//     email: 'oaktesla@gmail.com',
//     password: 'Oaktesla&&cch137&&mdb'
//   })
//   await sleep(3000)
//   console.log('OK')
//   await bot1.init()
//   console.log('inited')
//   await bot1.setup()
//   bot1.kill()
//   console.log('killed')
// })();

export default MindsDbGPTChatbotCore
export type { MindsDbGPTChatbotCore }
