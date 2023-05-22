import axios from 'axios'
import { load as cheerioLoad } from 'cheerio'
import googlethis from 'googlethis'
import { load, extract } from '@node-rs/jieba'
import { translateZh2En } from '~/server/services/sogouTranslate'
import { log as logger } from '~/server/services/mongoose/index'
import str from '~/utils/str'

load()

const trimText = (text: string) => {
  return text.split('\n')
    .map((ln) => ln.replace(/[\s]+/g, ' ').trim())
    .filter((ln) => ln)
    .join('\n')
}

const scrape = async (url: string) => {
  try {
    if (!(url.startsWith('http://') || url.startsWith('https://'))) {
      url = `http://${url}`
    }
    const origin = new URL(url).origin
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50',
      'Referer': origin,
      'Origin': origin,
      'Accept-Language': 'en-US,en;q=0.9',
    }
    const res = await axios.get(url, { headers, timeout: 10000 })
    console.log('SCRAPE:', url)
    const $ = cheerioLoad(str(res.data))
    return trimText($('body').prop('innerText') as string)
  } catch (err) {
    console.log('SCRAPE FAILED:', url)
    logger.create({ type: 'error.crawler.scrape', text: str(err) })
    return 'Error: Page fetch failed'
  }
}

const summarize = async (query: string, showUrl = false, translate = true) => {
  try {
    const searchQueries = [query.substring(0, 256)]
    if (translate) {
      const queryInEnglish = (await translateZh2En(query.substring(0, 5000))).text
      searchQueries.push(extract(queryInEnglish, 16).map(w => w.keyword).join(', '))
    }
    const searcheds = (await Promise.all(searchQueries.map((query) => {
      console.log('SEARCH:', query)
      return googlethis.search(query)
    })))
    const results: Array<{url: string, title?: string, description: string}> = []
    for (const searched of searcheds) {
      results.push(...searched.results)
      results.push(...searched.top_stories)
    }
    const summarize = [...new Set(results
      .map((r) => `${showUrl ? decodeURIComponent(r.url) + '\n' : ''}${r.title ? '# ' + r.title : ''}\n${r.description}`))
    ].join('\n\n')
    return summarize
  } catch (err) {
    err = str(err)
    console.log('SUMMARIZE FAILED:', err)
    logger.create({ type: 'error.crawler.summarize', text: err })
    return ''
  }
}

const crawler = {
  scrape,
  summarize
}

export default crawler
