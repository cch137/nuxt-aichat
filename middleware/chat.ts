export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const { loadChat } = useChat()
    const conv = to?.params?.conv as string || null
    const isNew = to?.query?.feature === 'new'
    setTimeout(() => loadChat(conv, isNew), 0)
  }
})
