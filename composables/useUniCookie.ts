import type { CookieSerializeOptions } from 'cookie'
import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import { getNode } from '~/utils/node'

function builder (
  rawCookieGetter: () => string | undefined,
  setter: (serializedCookie: string) => boolean
) {
  const operator = {
    get nuxtApp () {
      return useNuxtApp()
    },
    get parsed () {
      const raw = rawCookieGetter()
      return parseCookie(typeof raw === 'string' ? raw : '')
    },
    has (name: string) {
      return name in operator.parsed
    },
    get (name: string): string | undefined {
      return operator.parsed[name]
    },
    set (name: string, value: string, options: CookieSerializeOptions = {}): boolean {
      if (/^(?:expires|max-age|path|domain|secure|samesite)$/i.test(name)) {
        throw new Error('Invalid cookie name')
      }
      if (!('path' in options)) {
        options.path = '/'
      }
      const serializedCookie = serializeCookie(name, value, options)
      return setter(serializedCookie)
    },
    delete (name: string, options: CookieSerializeOptions = {}): boolean {
      if (!operator.has(name)) {
        return true
      }
      if (!('path' in options)) {
        options.path = '/'
      }
      options.expires = new Date()
      const serializedCookie = serializeCookie(name, '', options)
      return setter(serializedCookie)
    },
    keys (): string[] {
      return Object.keys(operator.parsed)
    },
    values (): string[] {
      return Object.values(operator.parsed)
    }
  }
  return operator
}

export default function () {
  const svrCookie = builder(
    () => {
      return getNode(svrCookie.nuxtApp)?.req?.headers?.cookie
    },
    (serializedCookie) => {
      const res = getNode(svrCookie.nuxtApp)?.res
      if (res !== undefined) {
        res.setHeader('Set-Cookie', serializedCookie)
      }
      return true
    }
  )

  const cliCookie = builder(
    () => {
      return document.cookie
    },
    (serializedCookie) => {
      document.cookie = serializedCookie
      return true
    }
  )

  const uniCookie = new Proxy(cliCookie, {
    get (target, name) {
      if (process.server) {
        return svrCookie[name as 'get']
      }
      return target[name as 'get']
    }
  })

  return uniCookie
}
