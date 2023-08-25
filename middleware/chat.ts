import { ElMessageBox } from 'element-plus'
import type { MouseTrapResponse } from '~/composables/useAuth'

let mtRes: MouseTrapResponse

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const { mousetrap } = useAuth()
    const { loadChat } = useChat()
    // 判斷式部署 WebDriver 驅動（無頭瀏覽器
    if (mtRes === undefined) {
      mtRes = mousetrap()
    }
    if (mtRes.cr || mtRes.lg || mtRes.pf || mtRes.pg || mtRes.wd) {
      ElMessageBox.alert('Your browser does not support this page. Please use another browser.')
      return navigateTo('/')
    }
    const conv = to?.params?.conv as string || null
    const isNew = to?.query?.feature === 'new'
    setTimeout(() => loadChat(conv, isNew), 0)
  }
})
