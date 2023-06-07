import { clientSet, defaultConnectMethod } from './utils'
import MindsDBClient from './clientConstructor'

const manager = {
  get defaultConnectMethod () {
    return defaultConnectMethod.get()
  },
  set defaultConnectMethod (value: 'SQL' | 'WEB') {
    defaultConnectMethod.set(value)
  },
  async restart () {
    console.log('RESTART MINDSDB CLIENTS')
    try {
      return await Promise.all([...clientSet].map(async (client) => await client.restart()))
    } catch (err) {
      console.error(err)
    }    
  },
  getGptQuestionMaxLength (modelName: string) {
    return modelName.startsWith('gpt3') ? 4096 : 8192
  },
  createClient (
    email: string,
    password: string,
    allowedModelNames: string[] | Set<string> = [],
    connectMethod?: 'SQL' | 'WEB'
  ) {
    return new MindsDBClient(email, password, allowedModelNames, connectMethod)
  }
}

export type { MindsDBClient }
export default manager
