const device = {
  get isMobileScreen () {
    return process.client
      ? window.innerWidth < 600
      : false
  },
  get isTouchScreen () {
    return process.client
      ? ('ontouchstart' in document || navigator.maxTouchPoints > 0)
      : false
  }
}

export default function () {
  return device
}
