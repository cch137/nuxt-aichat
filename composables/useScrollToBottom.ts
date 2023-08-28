import { getScrollTop } from '~/utils/client'

type Behavior = 'auto' | 'instant' | 'smooth'

function isAtBottom(tolerance = 160) {
  if (process.client) {
    return getScrollTop() >= document.body.clientHeight - tolerance
  }
  return false
}

let isRecentScrollUpTimeout: NodeJS.Timeout
let isRecentScrollUp = false
;(async () => {
  if (process.client) {
    let prevScrollTop = getScrollTop()
    document.addEventListener('scroll', (e) => {
      const currScrollTop = getScrollTop()
      if (currScrollTop === prevScrollTop) return;
      if (currScrollTop < prevScrollTop) {
        // Scroll UP
        isRecentScrollUp = true
        clearTimeout(isRecentScrollUpTimeout)
        isRecentScrollUpTimeout = setTimeout(() => {
          isRecentScrollUp = false
        }, 3000)
      } else {
        // Scroll DOWN
      }
      prevScrollTop = currScrollTop
    })
  }
})();

async function useScrollToBottom(delayMs = 0, behavior: Behavior = 'smooth') {
  return await new Promise((resolve, reject) => {
    if (process.client) {
      setTimeout(() => {
        try {
          window.scrollTo({
            behavior,
            left: 0,
            top: document.body.scrollHeight
          })
          resolve(null)
        } catch (err) {
          reject(err)
        }
      }, +delayMs || 0)
    } else {
      resolve(null)
    }
  })
}

async function keepAtBottom(delayMs = 0, behavior: Behavior = 'instant', tolerance = 50) {
  if (process.client && !isRecentScrollUp) {
    const isAtBottom = getScrollTop() >= document.body.clientHeight - tolerance
    if (isAtBottom) {
      return await useScrollToBottom(delayMs, behavior)
    }
  }
  return null
}

useScrollToBottom.isAtBottom = isAtBottom
useScrollToBottom.keepAtBottom = keepAtBottom

export default useScrollToBottom
