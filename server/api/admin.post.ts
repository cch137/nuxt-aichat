import discordBot from '~/server/services/discord/index'
import { getConnectMethod, setConnectMethod } from '~/server/services/curva/utils/mindsdbClient'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const { ADMIN_PASSWORD } = process.env
  const body = await readBody(event)
  const password = body?.passwd as string | undefined
  if (password !== ADMIN_PASSWORD) {
    return null
  }
  const action = body?.action as string | undefined
  switch (action) {
    case 'DC0':
      discordBot.disconnect()
      break
    case 'DC1':
      await discordBot.connect()
      break
    case 'WEBCONN':
      setConnectMethod('WEB')
      break
    case 'SQLCONN':
      setConnectMethod('SQL')
      break
  }
  return {
    mdbConnectMethod: getConnectMethod(),
    dcBotConnected: discordBot.connected,
    pass: true
  }
})
