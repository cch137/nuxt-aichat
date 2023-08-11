import MindsDBClient from './client'
import type { ChatbotEngine, OpenAIMessage } from '../types'
import { getAllCreateCommand, getAllDropCommand } from './utils'
import sleep from '~/utils/sleep'
import { messagesToQuestionContext } from '../../utils/openAiMessagesConverter'

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
        console.log(err, '\n\n')
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

// (async () => {
//   const bot1 = new MindsDbGPTChatbotCore({
//     email: 'rexic98209@weishu8.com',
//     password: '12345678sS'
//   })
//   await sleep(3000)
//   console.log('OK')
//   await bot1.init()
//   console.log('inited')
//   await bot1.setup()
//   bot1.kill()
//   console.log('killed')
// })()

export default MindsDbGPTChatbotCore
export type { MindsDbGPTChatbotCore }
