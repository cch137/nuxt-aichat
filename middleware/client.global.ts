import { appName } from '~/config/app'

export default defineNuxtRouteMiddleware(() => {
  useState('appName', () => appName)
  if (process.client) {
    (document.querySelector('html') as HTMLHtmlElement).classList.add('dark')
    document.body.classList.add('grid-pattern-bg')
  }
})
