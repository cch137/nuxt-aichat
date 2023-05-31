import discordBot from '~/server/services/discord/index'

export default defineEventHandler(async (event) => {
  return discordBot
})
