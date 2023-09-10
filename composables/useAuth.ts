import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import CustomEventTarget from '~/utils/CustomEventTarget'

const authEventTarget = new CustomEventTarget<'login'|'logout'>()

const email = ref<string>('')
const username = ref<string>('')
const authlvl = ref<number>(0)
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
    email.value = ''
    username.value = ''
    authlvl.value = 0
    setIsLoggedIn(false)
    authEventTarget.dispatchEvent('logout')
    ElMessage.success('Logged out.')
  } catch {
    ElMessage.error('Log out failed.')
  } finally {
    authIsLoading.value = false
  }
}

let lastChecked = 0
const checkIsLoggedIn = async (force = false) => {
  const now = Date.now()
  // 一分鐘內檢查過的話，就不再檢查
  if (!force && now - lastChecked < 60000) {
    return isLoggedIn.value
  }
  authIsLoading.value = true
  try {
    const { isLoggedIn: _isLoggedIn, user } = (await $fetch('/api/auth/check', {
      method: 'POST'
    }))
    lastChecked = now
    email.value = user?.email || ''
    username.value = user?.username || ''
    authlvl.value = user?.authlvl || 0
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
    try {
      Object.defineProperty(window, 'authlvl', {
        get: () => authlvl.value
      })
    } catch {}
  }
})()

const changeUsername = async (newUsername: string) => {
  try {
    const { error } = (await $fetch('/api/auth/username', {
      method: 'PUT',
      body: { username: newUsername }
    }))
    if (error) {
      throw error
    }
    await checkIsLoggedIn(true)
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

  async function login (usernameOrEmail: string, password: string) {
    const loading = ElLoading.service({ text: _t('auth.loggingIn') })
    authIsLoading.value = true
    try {
      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { usernameOrEmail, password }
      })
      const { error } = res
      if (error) {
        throw error
      }
      authEventTarget.dispatchEvent('login')
      await navigateTo('/')
      await checkIsLoggedIn(true)
      ElMessage.success('Logged in.')
    } catch (err) {
      ElMessage.error(typeof err === 'string' ? err : 'Oops! Something went wrong.')
    } finally {
      loading.close()
      authIsLoading.value = false
    }
  }

  return {
    authEventTarget,
    authIsLoading,
    isLoggedIn,
    email,
    username,
    authlvl,
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