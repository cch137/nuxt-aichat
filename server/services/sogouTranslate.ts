import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { parse as parseCookie, serialize as serializeCookie } from 'cookie'
import _md5 from 'crypto-js/md5.js'

const md5 = (text: string) => {
  return _md5(text).toString()
}

const apiName = 'SogouTrans'

let session: AxiosInstance
let secretCode: any = null

const sogouCrypto = (from: string, to: string, text: string) => md5(`${from}${to}${text}${secretCode}`)

let lastInit = 0

// 距離上一次初始化 1 秒內不再初始化
const isOkToInit = () => Date.now() - lastInit > 1000

const init = () => new Promise((resolve, reject) => {
  session = axios.create({
    withCredentials: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      'Referer': 'https://fanyi.sogou.com/'
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
  session.get('https://fanyi.sogou.com/text')
  .then(res => {
    const { data } = res
    const regex = /\"secretCode\":(\d+),/
    secretCode = (regex.exec(data) || [])[1] || 109984457
    console.log(`${apiName} API is ready. (${secretCode})`)
    lastInit =  Date.now()
    resolve(true)
  }).catch(e => reject(e))
})

const translate = (text: string, from='en', to='zh-CHS', rawData=false, retry=0): Promise<{
  timeUsed: number,
  timestamp: number,
  lang: string,
  text: string,
  data?: any
}> =>
new Promise((resolve, reject) => {
  // @ts-ignore
  if (!text) return resolve({ text } as null)
  const t0 = Date.now()
  const sCode = sogouCrypto(from, to, text)
  session.post('https://fanyi.sogou.com/api/transpc/text/result', {
    text,
    from,
    to,
    'client': 'pc',
    'fr': 'browser_pc',
    'needQc': 1,
    's': sCode
  }).then(res => {
    const { data={} } = res.data
    if (!data) return reject('no content')
    if (!data?.sentencesData) return reject('no content')
    const ts = Date.now()
    const apiResponse: any = {
      timeUsed: ts - t0,
      timestamp: ts,
      lang: data.detect.language,
      text: (data.sentencesData.trans_result || [{trans_text:data.translate.dit}])[0].trans_text
    }
    if (+rawData) {
      apiResponse.data = data
    }
    resolve(apiResponse)
  }).catch(err => {
    if (!retry && isOkToInit()) {
      console.log(`${apiName} reload agent (${err})`)
      init()
      .then(() => {
        translate(text, from, to, rawData, 1)
        .then(res => resolve(res))
        .catch(err => reject(err))
      }).catch(err => reject(err))
    } else {
      console.error(`${apiName} API error: ${err}`)
      reject(err)
    }
  })
})

init().catch(err => {
  console.error(`${apiName} API connection failed.`, err)
})

const translateZh2En = async (text: string) => {
  try {
    return await translate(text, 'zh-CHS', 'en')
  } catch {
    return { text }
  }
}

export {
  init,
  translate,
  translateZh2En
}
