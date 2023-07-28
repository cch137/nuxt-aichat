class URLParamsManager extends URLSearchParams {
  constructor(init?: string | URLSearchParams | string[][] | Record<string, string> | URLParamsManager) {
    super(init as URLSearchParams)
  }

  toPathname(): string {
    const s = [...this.entries()].map(i => i[0] ? encodeURI(`${i[0]}=${i[1]}`) : '')
    return `${location.pathname}${s.length ? '?' : ''}${s.join('&')}${location.hash}`
  }

  save() {
    history.replaceState(0, '', this.toPathname())
  }

  push() {
    history.pushState(0, '', this.toPathname())
  }

  clear() {
    const keys = new Set<string>()
    this.forEach((_, key) => keys.add(key))
    for (const key of keys) {
      this.delete(key)
    }
  }

  json(): { [key: string]: string } {
    const obj: { [key: string]: string } = {}
    this.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }
}

export default function () {
  return new URLParamsManager(location.search)
}
