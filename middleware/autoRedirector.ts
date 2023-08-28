import { ElMessageBox } from 'element-plus'

interface ShadowAvoidanceResponse {
  wd: boolean;
  pg: boolean;
  lg: boolean;
  pf: boolean;
  cr: boolean;
}

const initializeShadowAvoidance = (() => {
  const _simplePlatform = (platform = '') => {
    return platform.startsWith('Win')
      ? 'Win'
      : platform.startsWith('Linux')
        ? 'Linux'
        : platform.startsWith('Mac')
          ? 'Mac'
          : platform
  }
  const isWebdriver = (webdriver: boolean | undefined) => {
    webdriver = Boolean(webdriver)
    if (webdriver) {
      return true
    }
    // 偵測 webdriver 是否有被重新定義，當被重新定義時是不正常請求
    const isRedefinedWebdriver = Object.keys(
      Object.getOwnPropertyDescriptors(navigator)
    ).includes('webdriver')
    return isRedefinedWebdriver
  }
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
  return (): ShadowAvoidanceResponse => {
    if (process.server) {
      return {
        wd: false, pg: false, lg: false, pf: false, cr: false,
      }
    }
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
    const pg = isPluginsErr(plugins, it)
    /** language(s) 不存在（只有較舊的無頭請求才被抓到） */
    const lg = isLanguageErr(language, languages as string[])
    /** navigator.platform 和 userAgent 中的 platform 不符合 */
    const pf = isPlatformNotSame(userAgent, platform)
    /** Chromium 瀏覽器的沒有 window.chrome 屬性 */ // @ts-ignore
    const cr = isChromeErr(userAgent, window?.chrome)
    return { wd, pg, lg, pf, cr }
  }
})()

let mtRes: ShadowAvoidanceResponse

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    // 判斷式部署 WebDriver 驅動（無頭瀏覽器
    if (mtRes === undefined) {
      mtRes = initializeShadowAvoidance()
    }
    if (mtRes.cr || mtRes.lg || mtRes.pf || mtRes.pg || mtRes.wd) {
      ElMessageBox.alert('Your browser does not support this page. Please use another browser.')
      return navigateTo('/')
    }
  }
})
