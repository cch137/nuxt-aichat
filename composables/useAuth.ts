import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { e } from '~/utils/troll'

const email = ref<string>('')
const username = ref<string>('')
const authIsLoading = ref(false)
const isLoggedIn = ref(false)

function mousetrap () {
  const _simplePlatform = (platform = '') => {
    return platform.startsWith('Win')
    ? 'Win'
    : platform.startsWith('Linux')
      ? 'Linux'
      : platform.startsWith('Mac')
        ? 'Mac'
        : platform
  }
  const isWebdriver = (webdriver: any) => Boolean(webdriver)
  const isPlatformNotSame = (userAgent = '', platform = '') => {
    return !userAgent.includes(_simplePlatform(platform))
  }
  const isPluginsErr = (plugins: PluginArray | any[], isTouchScreen = false) => {
    // 如果是觸屏的話就不檢測了
    if (isTouchScreen) {
      return false
    }
    // 如果 plugins 不存在或是沒有 plugins，是爬蟲
    if (!plugins || plugins.length === 0) {
      return true
    }
    const pluginList = Object.values(Object.getOwnPropertyDescriptors(plugins)).map(p => p.value)
    // 以下這個情況就是沒有 namedItem 的情況，不正常，是爬蟲
    if (pluginList.length === plugins.length) {
      return true
    }
    // 如果 plugins 裡面的東西不是 Plugin 這個類，是爬蟲
    const pluginsConstructorsTesting = pluginList.map(p => p.constructor === Plugin)
    if (pluginsConstructorsTesting.filter(p => p).length !== pluginsConstructorsTesting.length) {
      return true
    }
    return false
  }
  const isLanguageErr = (language = '', languages: string[] = []) => {
    return !language || !languages || languages.length === 0
  }
  const isChromeErr = (userAgent = '', chrome: any) => {
    return userAgent.includes('Chrome') ? !chrome : false
  }
  const isTouchScreen = () => ('ontouchstart' in document || navigator.maxTouchPoints > 0);
  interface MouseTrapResponse {
    ic: boolean;
    it: boolean;
    wd: boolean;
    pg: boolean;
    lg: boolean;
    pf: boolean;
    ch: boolean;
  }
  return (): MouseTrapResponse => {
    if (process.server) {
      return {
        ic: false, it: false, wd: false, pg: false, lg: false, pf: false, ch: false,
      }
    }
    const ic = true
    const {
      userAgent = '',
      platform = '',
      plugins = [],
      webdriver = false,
      language = '',
      languages = [],
    } = navigator
    /** 是否觸屏 */
    const it = isTouchScreen()
    /** webdriver 存在（通常無頭瀏覽器 webdriver 都是 true） */
    const wd = isWebdriver(webdriver)
    /** Plugins 異常（無頭瀏覽器沒有 Plugins，例如一些瀏覽器的插件，包括 PDF 查看器） */
    const pg = isPluginsErr(plugins)
    /** language(s) 不存在（只有較舊的無頭請求才被抓到） */
    const lg = isLanguageErr(language, languages as string[])
    /** navigator.platform 和 userAgent 中的 platform 不符合 */
    const pf = isPlatformNotSame(userAgent, platform)
    /** Chromium 瀏覽器的沒有 window.chrome 屬性 */ // @ts-ignore
    const ch = isChromeErr(userAgent, window?.chrome)
    return { ic, it, wd, pg, lg, pf, ch }
  }
}

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

  const login = async (usernameOrEmail: string, password: string) => {
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
      navigateTo('/c/')
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
    authIsLoading,
    isLoggedIn,
    email,
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