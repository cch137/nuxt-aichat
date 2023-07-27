import MindsDBClient from './client'
import type { ChatbotEngine } from '../types'
import { getAllCreateCommand, getAllDropCommand } from './utils'
import sleep from '~/utils/sleep'

class MindsDbGPTChatbotCore implements ChatbotEngine {
  client: MindsDBClient

  constructor (options: { email: string, password: string }) {
    const { email, password } = options
    this.client = new MindsDBClient(email, password)
  }

  init (): Promise<true> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000)
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

  async ask (question: string, options: { modelName: string, context?: string}) {
    return await this.client.askGPT(options.modelName, question, options.context)
  }

  kill () {
    this.client.kill()
  }
}

// (async () => {
//   const bot1 = new MindsDbGPTChatbotCore({
//     email: 'chorngherngchee@gmail.com',
//     password: 'Curva&&cch137'
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
