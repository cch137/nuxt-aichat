import { getSettings } from '~/server/services/admin/settings'
import checkPassword from '~/server/services/admin/checkPassword'
import discordBot from '~/server/services/discord/index'
import { readBody } from 'h3'

export default defineEventHandler(async function (event) {
  if (!await checkPassword(event)) {
    return null
  }
  const body = await readBody(event)
  const name = body.name as string
  const value = body.value as string
  switch (name) {
    case 'dcBot':
      if (value) {
        await discordBot.connect()
      } else {
        discordBot.disconnect()
      }
      break
  }
  return getSettings()
})
