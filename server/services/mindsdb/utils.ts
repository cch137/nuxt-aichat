import type MindsDBClient from './clientConstructor'

let method = 'SQL' as 'SQL' | 'WEB'

const defaultConnectMethod = {
  get () {
    return method
  },
  set (value: 'SQL' | 'WEB') {
    method = value
    console.log('SET MDB CONNECT METHOD:', method)
  }
}

const clientSet = new Set<MindsDBClient>()

export {
  clientSet,
  defaultConnectMethod
}
