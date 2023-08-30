import curva from '~/server/services/chatbots/curva'
import mongoose, { message, user } from '~/server/services/mongoose/index'

export default defineEventHandler(async () => {
  const [totalMessages, totalUsers, dbStats] = await Promise.all([
    message.countDocuments(),
    user.countDocuments(),
    mongoose.connection.db.stats()
  ])
  return {
    models: curva.status,
    totalMessages,
    totalUsers,
    dataSize: (dbStats?.storageSize as number) || 0
  }
})
