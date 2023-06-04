import discordBot from '~/server/services/discord/index'
import curva from '~/server/services/curva/index'
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
      curva.setConnectMethod('WEB')
      break
    case 'SQLCONN':
      curva.setConnectMethod('SQL')
      break
    case 'RESTART':
      await curva.restart()
      break
  }
  return await new Promise<{
    mdbConnectMethod: 'WEB' | 'SQL',
    dcBotConnected: boolean,
    pass: boolean,
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        mdbConnectMethod: curva.getConnectMethod(),
        dcBotConnected: discordBot.connected,
        pass: true
      })
    }, Math.max(0, (t0 - Date.now()) + 500))
  })
})
