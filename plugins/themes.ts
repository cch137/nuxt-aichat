export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()
  const isDark = ref(false)
  const isLight = ref(!(isDark.value))

  watch(isDark, (newVal) => {
    if (isLight.value === newVal) {
      isLight.value = !newVal
    }
    if (newVal) {
      colorMode.preference = 'dark'
    } else {
      colorMode.preference = 'light'
    }
  })

  watch(isLight, (newVal) => {
    if (isDark.value === newVal) {
      isDark.value = !newVal
    }
  })

  const init = () => {
    if (colorMode.preference === 'system') {
      // 這裡設置默認為 dark
      // 假如以後想要改成跟系統主題，就是 colorMode.value
      colorMode.preference = 'dark'
    }
    const _isDark = colorMode.preference === 'dark'
    if (isDark.value !== _isDark) {
      isDark.value = _isDark
    }
  }

  init()

  return {
    provide: {
      themes: {
        get isDark () {
          init()
          return isDark
        },
        get isLight () {
          init()
          return isLight
        }
      }
    }
  }
})
