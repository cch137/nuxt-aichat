import type { AxiosResponse } from 'axios'
import axios from 'axios'
import TurndownService from 'turndown'
// @ts-ignore
import { gfm } from '@joplin/turndown-plugin-gfm'
import { AnyNode, load as cheerioLoad } from 'cheerio'
import str from '~/utils/str'
import { isYouTubeLink, getYouTubeVideoId } from '~/utils/ytLinks'
import { crawlYouTubeVideo } from './ytCrawler'

function trimText (text: string): string {
  return text.split('\n')
    .map((ln) => ln.replace(/[\s]+/g, ' ').trim())
    .filter((ln) => ln)
    .join('\n')
}

function parseHtml (html: string | AnyNode | AnyNode[] | Buffer, textOnly = true) {
  const $ = cheerioLoad(html)
  $('style').remove()
  $('script').remove()
  if (textOnly) {
    $('img').remove()
    $('video').remove()
    $('audio').remove()
    $('canvas').remove()
    $('svg').remove()
  }
  $('a').replaceWith(function () {
    return $('<span>').text($(this).prop('innerText') || $(this).text())
  })
  const td = new TurndownService()
  td.use(gfm)
  const markdown = td.turndown($('body').prop('innerHTML') as string)
  const links = [] as string[]
  $('a').each((_, el) => {
    const href = $(el).attr('href')
    if (typeof href === 'string' && !links.includes(href)) {
      links.push(href)
    }
  })
  return {
    title: $('title').text() || $('meta[name="title"]').attr()?.content || $('meta[name="og:title"]').attr()?.content,
    description: $('meta[name="description"]').attr()?.content || $('meta[name="og:description"]').attr()?.content,
    links,
    markdown: trimText(markdown.replaceAll('<br>', '\n')),
  }
}

class WebCrawlerResult {
  url: string = ''
  title: string = ''
  description: string = ''
  contentType: string = ''
  links: string[] = []
  markdown: string = ''

  get summary (): string {
    return (this.title ? `title: ${this.title}\n` : '') +
      (this.description ? `description: ${this.description.substring(0, 256)}\n` : '') +
      '---\n' + trimText(this.markdown)
  }

  constructor (res: AxiosResponse, textOnly = true) {
    try {
      this.url = res?.config?.url || res?.config?.baseURL || ''
      this.contentType = str(res.headers['Content-Type'] || '')
      if (this.contentType.startsWith('image')) {
        throw 'Error: This is an image'
      } else if (this.contentType.startsWith('video')) {
        throw 'Error: This is a video'
      } else if (this.contentType.startsWith('audio')) {
        throw 'Error: This is a audio'
      } else {
        if (typeof res.data !== 'string') {
          res.data = JSON.stringify(res.data)
        }
        const webpage = parseHtml(res.data, textOnly)
        this.title = webpage.title || ''
        this.description = webpage.description || ''
        this.links = webpage.links || []
        this.markdown = webpage.markdown || ''
      }
    } catch (err) {
      this.description = str(err)
    }
  }
}

class WebCrawlerResultYT extends WebCrawlerResult {
  get summary (): string {
    return (this.title ? `Title: ${this.title}\n` : '') +
      (this.description ? `Description: ${this.description}\n` : '') +
      '---\nCaptions:\n' + trimText(this.markdown)
  }

  constructor (res: AxiosResponse, data: { title: string, description: string, captions: string }, textOnly = true) {
    super(res, textOnly)
    this.title = data.title
    this.description = data.description
    this.markdown = data.captions
  }
}

async function crawl (url: string, textOnly = true) {
  if (!(url.startsWith('http://') || url.startsWith('https://'))) {
    url = `http://${url}`
  }
  if (isYouTubeLink(url)) {
    const ytVideo = await crawlYouTubeVideo(getYouTubeVideoId(url) as string)
    return new WebCrawlerResultYT(ytVideo.axios, {
      title: ytVideo.title || '',
      description: ytVideo.description || '',
      captions: (await ytVideo.getCaptions()).map((caption) => caption.text).join('\n')
    })
  }
  const origin = new URL(url).origin
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50',
    'Referer': origin,
    'Origin': origin,
    'Accept-Language': 'en-US,en;q=0.9',
  }
  try {
    const request = await axios.get(url, {
      headers,
      timeout: 10000,
      validateStatus: (_) => true
    })
    return new WebCrawlerResult(request, textOnly)
  } catch {
    return new WebCrawlerResult({} as AxiosResponse, textOnly)
  }
}

export default crawl
export type { WebCrawlerResult }
