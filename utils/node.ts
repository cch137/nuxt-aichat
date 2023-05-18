import type { H3Event } from 'h3'
import type { NuxtApp } from 'nuxt/app'
import { parse as parseQs } from 'qs'

function getNode (nuxtApp: NuxtApp) {
  return nuxtApp?.vueApp?.$nuxt?.ssrContext?.event?.node
}

function getQuery (event: H3Event) {
  const path = event?.path
  return parseQs(typeof path === 'string' ? path.split('?')[1] : '')
}

export {
  getNode,
  getQuery
}
