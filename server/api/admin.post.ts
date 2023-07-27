import discordBot from '~/server/services/discord/index'
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
  }
  return await new Promise<{
    dcBotConnected: boolean,
    pass: boolean,
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        dcBotConnected: discordBot.connected,
        pass: true
      })
    }, Math.max(0, (t0 - Date.now()) + 500))
  })
})
