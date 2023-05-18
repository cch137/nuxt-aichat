import type { LoadingOptionsResolved } from 'element-plus'
import { ElLoading } from 'element-plus'

/**
 * 用於解決 `ElLoading` 的 `lock` 未知原因的失效。
 * `.loading-lock` 這個選擇器由 `~/assets/css/default.css` 定義。
 * @returns 可實現 lock 和 unlock 頁面操作的物件。
 */
const _useLoadingLock = () => {
  const getScrollTop = () => {
    if ('pageYOffset' in window) {
      return window.pageYOffset
    }
    if ('scrollTop' in document.documentElement) {
      return document.documentElement.scrollTop
    }
    if ('scrollTop' in document.body) {
      return document.body.scrollTop
    }
    return 0
  }

  let isScrollDisable = false
  let scrollTopWhenDisable = 0

  const disableScrollListener = () => {
    document.documentElement.scrollTop = scrollTopWhenDisable
  }

  const lock = {
    lock () {
      if (isScrollDisable) {
        return
      }
      scrollTopWhenDisable = getScrollTop()
      document.addEventListener('scroll', disableScrollListener)
      isScrollDisable = true
      document.body.classList.add('loading-lock')
    },
    unlock () {
      document.removeEventListener('scroll', disableScrollListener)
      isScrollDisable = false
      document.body.classList.remove('loading-lock')
    }
  }

  return lock
}

export default function useElLoading (options: Partial<Omit<LoadingOptionsResolved, 'target' | 'parent'> & {
  target: string | HTMLElement
  body: boolean
}> | string | undefined = {}) {
  if (typeof options === 'string') {
    options = {
      text: options
    }
  }
  const isLock = (options?.lock === undefined || options?.lock === null) ? true : options.lock
  const lock = isLock ? _useLoadingLock() : null
  if (lock !== null) {
    lock.lock()
  }
  const loadingInstance = ElLoading.service(options)
  const { close: closeLoading } = loadingInstance
  loadingInstance.close = () => {
    if (lock !== null) {
      lock.unlock()
    }
    closeLoading()
  }
  return loadingInstance
}
