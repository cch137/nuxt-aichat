import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

const isLoading = ref(false)
const isLoggedIn = ref(false)

const logout = async () => {
  isLoading.value = true
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    })
    isLoggedIn.value = false
    ElMessage.success('Logged out.')
    useChat().clear()
  } catch {
    ElMessage.error('Log out failed.')
  } finally {
    isLoading.value = false
  }
}

let lastChecked = 0
const checkIsLoggedIn = async () => {
  const now = Date.now()
  // 一分鐘內檢查過的話，就不再檢查
  if (now - lastChecked < 60000) {
    return isLoggedIn.value
  }
  isLoading.value = true
  try {
    const _isLoggedIn = (await $fetch('/api/auth/check', {
      method: 'POST'
    })).isLoggedIn
    lastChecked = now
    isLoggedIn.value = _isLoggedIn
    isLoading.value = false
    return _isLoggedIn
  } catch {
    isLoading.value = false
  }
}

(async () => {
  if (process.client) {
    try {
      await checkIsLoggedIn()
    } catch (err) {
      console.error(err)
    } finally {}
  }
})()

export default function () {
  // @ts-ignore
  const _t = useLocale().t

  const login = (usernameOrEmail: string, password: string) => {
    const loading = ElLoading.service({
      text: _t('auth.loggingIn')
    })
    isLoading.value = true
    $fetch('/api/auth/login', {
      method: 'POST',
      body: { usernameOrEmail, password }
    })
      .then((_res) => {
        const res = _res as any
        if (res?.error) {
          ElMessage.error(res?.error)
        } else {
          ElMessage.success('Logged in.')
          navigateTo('/c/')
          isLoggedIn.value = true
        }
      })
      .catch(() => {
        ElMessage.error('Oops! Something went wrong.')
      })
      .finally(() => {
        loading.close()
        isLoading.value = false
      })
  }

  return {
    isLoading,
    isLoggedIn,
    login,
    logout,
    checkIsLoggedIn,
    setIsLoggedIn (value: boolean) {
      isLoggedIn.value = value
    },
    goToHome () {
      useNuxtApp().$router.replace('/')
    },
    goToNewChat () {
      useNuxtApp().$router.replace('/c/')
    }
  }
}