import axios from 'axios'
import TurndownService from 'turndown'
// @ts-ignore
import { gfm } from '@joplin/turndown-plugin-gfm'
import { load as cheerioLoad } from 'cheerio'
import googlethis from 'googlethis'
import { translate as translateToEnglish } from '~/server/services/sogouTranslate'
import { log as logger } from '~/server/services/mongoose/index'
import str from '~/utils/str'

const trimText = (text: string) => {
  return text.split('\n')
    .map((ln) => ln.replace(/[\s]+/g, ' ').trim())
    .filter((ln) => ln)
    .join('\n')
}

const scrape = async (url: string) => {
  if (!(url.startsWith('http://') || url.startsWith('https://'))) {
    url = `http://${url}`
  }
  try {
    const origin = new URL(url).origin
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50',
      'Referer': origin,
      'Origin': origin,
      'Accept-Language': 'en-US,en;q=0.9',
    }
    const res = await axios.get(url, { headers, timeout: 10000 })
    const resContentType = str(res.headers['Content-Type'] || '')
    if (resContentType.startsWith('image')) {
      throw 'This is an image'
    } else if (resContentType.startsWith('video')) {
      throw 'This is a video'
    } else if (resContentType.startsWith('audio')) {
      throw 'This is a audio'
    }
    if (typeof res.data !== 'string') {
      res.data = JSON.stringify(res.data)
    }
    const $ = cheerioLoad(res.data)
    $('style').remove()
    $('script').remove()
    $('a').replaceWith(function () {
      return $('<span>').text($(this).prop('innerText') || $(this).text())
    })
    const td = new TurndownService()
    td.use(gfm)
    const markdown = td.turndown($('body').prop('innerHTML') as string).replaceAll('<br>', ' ')
    const title = $('title').text()
      || $('meta[name="title"]').attr()?.content
      || $('meta[name="og:title"]').attr()?.content
    const description = $('meta[name="description"]').attr()?.content
      || $('meta[name="og:description"]').attr()?.content
    return {
      title: title || url,
      url,
      response: (title ? `title: ${title}\n` : '') +
      (description ? `description: ${description.substring(0, 256)}\n` : '') +
      '---\n' + trimText(markdown)
    }
  } catch (err) {
    let message = ''
    if (err instanceof Error) {
      message = `${err.name}: ${err.message}`
    } else if (typeof err !== 'string') {
      message = 'Error: Unkonwn Error'
    }
    console.log(`SCRAPE FAILED (${message}): ${url}`)
    logger.create({ type: 'error.crawler.scrape', refer: url, text: message })
    return {
      title: url,
      url,
      error: err || {},
      response: message,
    }
  }
}

const search = async (query: string, translate = true) => {
  try {
    query = query.replace(/[\s]+/g, ' ').trim()
    const searchQueries = new Set([query.substring(0, 256)])
    if (translate) {
      const translateResult = await translateToEnglish(query.substring(0, 5000))
      // @ts-ignore
      if (translateResult?.lang !== '英语') {
        const queryInEnglish = translateResult.text
        searchQueries.add(queryInEnglish)
      }
    }
    const searcheds = (await Promise.all([...searchQueries].map((query) => {
      console.log('SEARCH:', query)
      return googlethis.search(query)
    })))
    const results: Array<{url: string, title?: string, description: string}> = []
    for (const searched of searcheds) {
      results.push(...searched.results)
      results.push(...searched.top_stories)
    }
    return results
  } catch (err) {
    err = str(err)
    console.log('SUMMARIZE FAILED:', err)
    logger.create({ type: 'error.crawler.summarize', text: err })
    return []
  }
}

const _outputSummarize = (results: Array<{ url: string, title?: string, description: string }>, showUrl = false) => {
  return [...new Set(results
    .map((r) => `${showUrl ? r.url : ''}\n${r.title ? r.title : ''}\n${r.description}`))
  ].join('\n\n')
}

const summarize = async (query: string, showUrl = false, translate = true) => {
  return _outputSummarize(await search(query, translate), showUrl)
}

const crawler = {
  scrape,
  search,
  summarize,
  _outputSummarize
}

export default crawler
