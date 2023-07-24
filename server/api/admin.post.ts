import discordBot from '~/server/services/discord/index'
import mindsdb from '~/server/services/mindsdbGPT'
import { readBody } from 'h3'

export default defineEventHandler(async function (event) {
  const body = await readBody(event)
  const password = body?.passwd as string | undefined
  if (password !== process.env.ADMIN_PASSWORD) {
    return null
  }
  const t0 = Date.now()
  const action = body?.action as string | undefined
  switch (action) {
    case 'DC0':
      discordBot.disconnect()
      break
    case 'DC1':
      await discordBot.connect()
      break
    case 'WEBCONN':
      mindsdb.defaultConnectMethod = 'WEB'
      break
    case 'SQLCONN':
      mindsdb.defaultConnectMethod = 'SQL'
      break
    case 'RESTART':
      await mindsdb.restart()
      break
  }
  return await new Promise<{
    mdbConnectMethod: 'WEB' | 'SQL',
    dcBotConnected: boolean,
    pass: boolean,
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        mdbConnectMethod: mindsdb.defaultConnectMethod,
        dcBotConnected: discordBot.connected,
        pass: true
      })
    }, Math.max(0, (t0 - Date.now()) + 500))
  })
})
