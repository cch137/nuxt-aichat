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
    // 默認主題為 dark，即便系統默認主題為 light，網頁的默認主題仍未 dark
    // 若要取得系統主題可以使用 colorMode.value
    isDark.value = colorMode.preference !== 'light'
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
