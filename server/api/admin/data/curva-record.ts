import checkPassword from '~/server/services/admin/checkPassword'
import curva from '~/server/services/chatbots/curva'

export default defineEventHandler(async (event) => {
  if (!checkPassword(event)) {
    return null
  }
  return curva.record.getItems()
})
