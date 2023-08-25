export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const { mousetrap } = useAuth()
    const { loadChat } = useChat()
    // 判斷式部署 WebDriver 驅動（無頭瀏覽器）
    const res = mousetrap()
    if (res.ch || res.lg || res.pf || res.pg || res.wd) {
      setTimeout(() => useNuxtApp().$router.replace('/'), 0)
      return
    }
    const conv = to?.params?.conv as string || null
    const isNew = to?.query?.feature === 'new'
    setTimeout(() => loadChat(conv, isNew), 0)
  }
})
