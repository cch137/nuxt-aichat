import { appName } from '~/config/app'

export default defineNuxtRouteMiddleware(() => {
  useState('appName', () => appName)
  const { $themes } = useNuxtApp()
  if (process.client) {
    setTimeout(() => {
      const urlParams = useURLParams()
      if (urlParams.has('fbclid')) {
        urlParams.delete('fbclid')
        urlParams.save()
      }
      return $themes
    }, 1000)
  }
})
