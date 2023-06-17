export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const conv = to?.params?.conv as string || null
    const isNew = to?.query?.feature === 'new'
    const { loadChat } = useChat()
    loadChat(conv, isNew)
  }
})
