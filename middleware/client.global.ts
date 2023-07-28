import { appName } from '~/config/app'

export default defineNuxtRouteMiddleware(() => {
  useState('appName', () => appName)
  if (process.client) {
    (document.querySelector('html') as HTMLHtmlElement).classList.add('dark')
    setTimeout(() => {
      const urlParams = useURLParams()
      if (urlParams.has('fbclid')) {
        urlParams.delete('fbclid')
        urlParams.save()
      }
    }, 1000)
  }
})
