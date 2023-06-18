import { createI18n } from 'vue-i18n'
import { useNavigatorLanguage } from '@vueuse/core'
import zhConverter from '~/utils/zhConverter'
import en from '~/layouts/en'
import zhTW from '~/locales/zh-TW'
import ru from '~/locales/ru'

const zhCN = JSON.parse(zhConverter.t2s(JSON.stringify(zhTW)))

const LOCALE_COOKIE_NAME = 'lang'
const DEFAULT_LOCALE = 'en'

class LocaleChangeTrigger {
  forceUpdatePaths = new Set<string>()
  #beforeUpdateCallbacks = new Map<string, Function>()
  #afterUpdateCallbacks = new Map<string, Function>()

  constructor () {
    if (process.client) {
      window.addEventListener('changeLocale', () => {
        const currentPathname = location.href.replace(location.origin, '')
        if (this.forceUpdatePaths.has(currentPathname)) {
          const push = (useNuxtApp().$router as any).push as (path: string) => Promise<any>
          // @ts-ignore
          const loading = useElLoading({ text: ref(i18n.t('waiting')) })
          document.body.classList.add('empty')
          if (this.#beforeUpdateCallbacks.has(currentPathname)) {
            try {
              (this.#beforeUpdateCallbacks.get(currentPathname) as Function)()
            } finally {
              this.#beforeUpdateCallbacks.delete(currentPathname)
            }
          }
          void push('/waiting').finally(() => {
            setTimeout(() => {
              void push(currentPathname).finally(() => {
                setTimeout(() => {
                  document.body.classList.remove('empty')
                  loading.close()
                  if (this.#afterUpdateCallbacks.has(currentPathname)) {
                    try {
                      (this.#afterUpdateCallbacks.get(currentPathname) as Function)()
                    } finally {
                      this.#afterUpdateCallbacks.delete(currentPathname)
                    }
                  }
                }, 250)
              })
            }, 750)
          })
        }
      })
    }
  }

  forceUpdate (beforeUpdateCallback?: Function, afterUpdateCallback?: Function) {
    const pathname = process.client ? location.href.replace(location.origin, '') : useNuxtApp()._route.path
    if (typeof beforeUpdateCallback === 'function') {
      this.#beforeUpdateCallbacks.set(pathname, beforeUpdateCallback)
    }
    if (typeof afterUpdateCallback === 'function') {
      this.#afterUpdateCallbacks.set(pathname, afterUpdateCallback)
    }
    this.forceUpdatePaths.add(pathname)
  }
}

const i18n = createI18n({
  messages: {
    en,
    'zh-TW': zhTW,
    'zh-CN': zhCN,
    ru,
  },
  fallbackLocale: {
    'zh-TW': ['zh-CN', 'en'],
    'zh-CN': ['zh-TW', 'en'],
    'ru': ['en']
  }
}).global

const checkLocale = (code: string | undefined | null) => {
  if (code === null || code === undefined) {
    return DEFAULT_LOCALE
  } else if ((i18n.availableLocales as string[]).includes(code)) {
    return code as 'en' | 'zh-TW' | 'zh-CN' | 'ru'
  } else if (code.startsWith('en-')) {
    return 'en'
  } else if (code === 'zh-Hant' || code === 'zh-hant') {
    return 'zh-TW'
  } else if (code.startsWith('zh-') || code === 'zh') {
    return 'zh-CN'
  } else {
    return DEFAULT_LOCALE
  }
}

const localeChangeTrigger = new LocaleChangeTrigger()

export default function () {
  const uniCookie = useUniCookie()

  const getLocale = () => {
    let locale = uniCookie.get(LOCALE_COOKIE_NAME)
    if (locale === undefined) {
      locale = useNavigatorLanguage().language.value
    }
    return checkLocale(locale)
  }

  const i18nProxy = new Proxy(i18n, {
    get: (target, key) => {
      if (key === 'ChangeEventTarget') {
        return localeChangeTrigger
      }
      return (target as any)[key]
    },
    set: (target, key, value) => {
      if (key === 'locale') {
        value = checkLocale(value)
        if (i18n.locale === value) {
          return true
        }
        // locale 的 Cookie 在 SSR 時不設置，只在客戶端才設置。
        if (process.client) {
          (target as any)[key] = value
          uniCookie.set(LOCALE_COOKIE_NAME, value, {
            path: '/'
          })
          window.dispatchEvent(new Event('changeLocale'))
          return true
        }
      }
      (target as any)[key] = value
      return true
    }
  })

  i18nProxy.locale = getLocale()

  return i18nProxy
}

export type {
  LocaleChangeTrigger
}
