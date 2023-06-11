import crawler from '~/server/services/crawler'
import useParseUrlsAndQueries from './templates/parseUrlsAndQueries'
import useSelectSites from './templates/selectSites'
import useExtractPage from './templates/extractPage'
import useDefaultTemplate from './templates/default'
import { log as logger } from '~/server/services/mongoose/index'
import str from '~/utils/str'
import client from './client'

const makeSureUrlsStartsWithHttp = (urls: string[]) => {
  return urls.map((url) => (url.startsWith('http://') || url.startsWith('https://')) ? url : `http://${url}`)
}

const extractInfomation = async (question: string, result: string, userTimeZone = 0) => {
  return (await client.gpt(
    'gpt4_summarizer',
    useExtractPage(
      question,
      result,
      userTimeZone
    )
  ))?.answer || ''
}

const scrapeAndSummary = async (question: string, url: string, userTimeZone = 0, delay = 0) => {
  return await new Promise<{ source: string, result: string, error?: unknown}>(async (resolve) => {
    setTimeout(async () => {
      const page = await crawler.scrape(url)
      const source = `${page.title} ${new URL(page.url).href}`
      if (page.error) {
        return page
      }
      try {
        const answer = await extractInfomation(question, page.response.substring(0, 16384), userTimeZone)
        resolve({ source, result: answer })
      } catch (err) {
        logger.create({ type: 'error.advanced.summary', refer: `${question} ${url}`, text: str(err) })
        return resolve({ source, result: page.response, error: err || {} })
      }
    }, delay)
  })
}

const addtionalRules = `- Use references where possible and answer in detail.
- Ensure the overall coherence and consistency of the responses.
- Ensure that the release time of news is relevant to the responses, avoiding outdated information.`

export default async function (question: string, context = '', userTimeZone = 0) {
  try {
    let i = 0
    const question1 = useParseUrlsAndQueries(question, userTimeZone)
    const answer1 = (await client.gpt('gpt4_summarizer', question1))?.answer as string
    const answer1Json = answer1.substring(answer1.indexOf('{'), answer1.lastIndexOf('}') + 1)
    const { urls: _urls, queries } = JSON.parse(answer1Json) as { urls: string[], queries: string[] }
    const urls = [] as string[]
    const results: string[] = []
    const _pages1 = makeSureUrlsStartsWithHttp(_urls).map((url) => scrapeAndSummary(question, url, userTimeZone, i += 1000))
    const searchings = await Promise.all(queries.map((query) => crawler._search(query, false)))
    const summaryShowUrl = searchings.map((searched) => searched.pipe(true)).join('\n\n')
    const summaryXShowUrl = searchings.map((searched) => searched.pipe(false)).join('\n\n')
    extractInfomation(question, summaryXShowUrl, userTimeZone)
      .then((result) => results.unshift(result))
      .catch(() => {})
    const question2 = useSelectSites(question, summaryShowUrl, userTimeZone)
    const answer2 = (await client.gpt('gpt4_summarizer', question2))?.answer as string
    const answer2Json = answer2.substring(answer2.indexOf('['), answer2.lastIndexOf(']') + 1)
    const selectedSites = JSON.parse(answer2Json) as Array<{ url: string, title:string }>
    const selectedSiteUrls = makeSureUrlsStartsWithHttp(selectedSites.map((site) => site.url))
    const _pages2 = selectedSiteUrls.map((url) => scrapeAndSummary(question, url, userTimeZone, i += 1000))
    const pages = [..._pages1, ..._pages2]
    const references = await new Promise<string[]>(async (resolve) => {
      setTimeout(() => resolve(results), 300 * 1000)
      for (const page of pages) {
        page
          .then((result) => {
            if (!result.error) {
              urls.push(result.source)
            }
            results.push(result.result)
          })
          .catch(() => results.push(''))
          .finally(() => {
            if (results.length === pages.length) {
              resolve(results)
            }
          })
      }
    })
    const _references = `Here are references from the internet:\n${references.join('\n')}`
    const finalQuestion = useDefaultTemplate(question, userTimeZone, addtionalRules, _references).substring(0, 16384)
    return { queries, urls, ...(await client.gpt('gpt4', finalQuestion, context)) }
  } catch (err) {
    logger.create({ type: 'error.advanced', text: str(err) })
    return { queries: [], urls: [], answer: undefined }
  }
}
