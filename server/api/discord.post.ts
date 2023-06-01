import discordBot from '~/server/services/discord/index'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const { ADMIN_PASSWORD } = process.env
  const body = await readBody(event)
  const password = body?.passwd as string | undefined
  if (password !== ADMIN_PASSWORD) {
    return {
      connected: discordBot.connected,
      pass: false
    }
  }
  const action = body?.action as string | undefined
  if (action === 'CONN0') {
    discordBot.disconnect()
  } else if (action === 'CONN1') {
    await discordBot.connect()
  }
  return {
    connected: discordBot.connected,
    pass: true
  }
})
