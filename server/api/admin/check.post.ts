import checkPassword from '~/server/services/admin/checkPassword'
import discordBot from '~/server/services/discord/index'

export default defineEventHandler(async function (event) {
  return await checkPassword(event) ? {
    dcBotConnected: discordBot.connected
  } : null
})
