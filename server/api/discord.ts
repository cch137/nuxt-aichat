import discordBot from '~/server/services/discord/index'

export default defineEventHandler(async () => {
  const { connected } = discordBot
  return { connected }
})
