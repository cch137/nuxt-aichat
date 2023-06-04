import { MindsDBClient, getConnectMethod, setConnectMethod } from './mindsdb'
import chatModelNames from './chatModelNames'
import ask from './ask'

const chatMdbClient = new MindsDBClient(
  process.env.CHAT_MDB_EMAIL_ADDRESS as string,
  process.env.CHAT_MDB_PASSWORD as string,
  chatModelNames
)

const dcBotMdbClient = new MindsDBClient(
  process.env.DC_BOT_MDB_EMAIL_ADDRESS as string,
  process.env.DC_BOT_MDB_PASSWORD as string,
  ['gpt4_dc_bot']
)

const restart = async () => {
  console.log('RESTART MINDSDB CLIENTS')
  return await Promise.all([
    chatMdbClient.restart(),
    dcBotMdbClient.restart()
  ])
}

export {
  MindsDBClient,
  chatMdbClient,
  dcBotMdbClient,
}

export default {
  chatMdbClient,
  dcBotMdbClient,
  getConnectMethod,
  setConnectMethod,
  ask,
  restart,
}
