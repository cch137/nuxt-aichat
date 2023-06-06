const device = {
  get isMobileScreen () {
    return window.innerWidth < 600
  },
  get isTouchScreen () {
    if (process.client) {
      if ('ontouchstart' in document || navigator.maxTouchPoints > 0) {
        return true
      }
    }
    return false
  }
}

export default function () {
  return device
}
