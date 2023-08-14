import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

const username = ref<string>('')
const authIsLoading = ref(false)
const isLoggedIn = ref(false)

function setIsLoggedIn (value: boolean) {
  isLoggedIn.value = value
}

const logout = async () => {
  authIsLoading.value = true
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    })
    username.value = ''
    setIsLoggedIn(false)
    ElMessage.success('Logged out.')
    useChat().clear()
  } catch {
    ElMessage.error('Log out failed.')
  } finally {
    authIsLoading.value = false
  }
}

let lastChecked = 0
const checkIsLoggedIn = async () => {
  const now = Date.now()
  // 一分鐘內檢查過的話，就不再檢查
  if (now - lastChecked < 60000) {
    return isLoggedIn.value
  }
  authIsLoading.value = true
  try {
    const { isLoggedIn: _isLoggedIn, user } = (await $fetch('/api/auth/check', {
      method: 'POST'
    }))
    lastChecked = now
    username.value = user?.username || ''
    authIsLoading.value = false
    // isLoggedIn 一定要最後才賦值，為了避免 user 讀取不了
    setTimeout(() => setIsLoggedIn(_isLoggedIn), 0)
    return _isLoggedIn
  } catch {
    authIsLoading.value = false
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

const changeUsername = async (newUsername: string) => {
  try {
    const { error, username: _username } = (await $fetch('/api/auth/username', {
      method: 'PUT',
      body: { username: newUsername }
    }))
    if (error) {
      throw error
    }
    if (_username) {
      username.value = _username
    }
    ElMessage.success('The username has been changed.')
    return true
  } catch (err) {
    ElMessage.error(typeof err === 'string' ? err : 'Oops! Something went wrong.')
    return false
  }
}

export default function () {
  // @ts-ignore
  const _t = useLocale().t

  const login = async (usernameOrEmail: string, password: string) => {
    const loading = ElLoading.service({ text: _t('auth.loggingIn') })
    authIsLoading.value = true
    try {
      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { usernameOrEmail, password }
      })
      const { error, isLoggedIn: _isLoggedIn = false, user } = res
      if (error) {
        throw error
      }
      ElMessage.success('Logged in.')
      navigateTo('/c/')
      username.value = user?.username || ''
      // isLoggedIn 一定要最後才賦值，為了避免 user 讀取不了
      setTimeout(() => setIsLoggedIn(_isLoggedIn), 0)
    } catch (err) {
      ElMessage.error(typeof err === 'string' ? err : 'Oops! Something went wrong.')
    } finally {
      loading.close()
      authIsLoading.value = false
    }
  }

  return {
    authIsLoading,
    isLoggedIn,
    username,
    login,
    logout,
    checkIsLoggedIn,
    setIsLoggedIn,
    changeUsername,
    goToHome () {
      useNuxtApp().$router.replace('/')
    },
    goToNewChat () {
      useNuxtApp().$router.replace('/c/')
    }
  }
}