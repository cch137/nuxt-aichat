import axios from 'axios'
import { parse as parseCookie, serialize as serializeCookie } from 'cookie'

export default function (headers = {}) {
  const session = axios.create({
    withCredentials: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      ...headers
    }
  })
  const cookieJar: Record<string,string> = {}
  session.interceptors.request.use(async (config: any) => {
    let serializedCookies = ''
    for (const name in cookieJar) {
      serializedCookies += serializeCookie(name, cookieJar[name]) + '; '
    }
    config.headers.Cookie = serializedCookies
    return config
  })
  session.interceptors.response.use((response) => {
    const setCookieHeaders = response.headers['set-cookie']
    if (setCookieHeaders) {
      const cookies = setCookieHeaders.map((c) => parseCookie(c.split(';')[0]))
      for (const cookie of cookies) {
        for (const name in cookie) {
          cookieJar[name] = cookie[name]
        }
      }
    }
    return response
  })
  return session
}
