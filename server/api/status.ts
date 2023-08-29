import curva from '~/server/services/chatbots/curva'

export default defineEventHandler(async (event) => {
  return curva.status
})
