import crawler from '~/server/services/crawler'
import useParseUrlsAndQueries from './templates/parseUrlsAndQueries'
import useSelectSites from './templates/selectSites'
import useExtractPage from './templates/extractPage'
import useDefaultTemplate from './templates/default'
import makeRequest from './utils/makeRequest'
import { log as logger } from '~/server/services/mongoose/index'
import str from '~/utils/str'

const makeSureUrlsStartsWithHttp = (urls: string[]) => {
  return urls.map((url) => (url.startsWith('http://') || url.startsWith('https://')) ? url : `http://${url}`)
}

const gpt4ScrapeAndSummary = async (question: string, url: string, userTimeZone = 0, delay = 0) => {
  try {
    return await new Promise<string>(async (resolve, reject) => {
      setTimeout(async () => {
        const answer = (await makeRequest(
          'gpt4_summarizer',
          useExtractPage(
            question,
            (await (crawler.scrape(url))).substring(0, 16384),
            userTimeZone
          )
        ))?.answer || ''
        logger.create({ type: 'advanced.summary', refer: `${question} ${url}`, text: str(answer) })
        resolve(answer)
      }, delay)
    })
  } catch (err) {
    logger.create({ type: 'error.advanced.summary', refer: `${question} ${url}`, text: str(err) })
    return ''
  }
}

export default async function (question: string, context = '', userTimeZone = 0) {
  try {
    let i = 0
    const question1 = useParseUrlsAndQueries(question, userTimeZone)
    const answer1 = (await makeRequest('gpt4_summarizer', question1))?.answer as string
    const answer1Json = answer1.substring(answer1.indexOf('{'), answer1.lastIndexOf('}') + 1)
    const { urls: _urls, queries } = JSON.parse(answer1Json) as { urls: string[], queries: string[] }
    const urls = makeSureUrlsStartsWithHttp(_urls)
    const _pages1 = urls.map((url) => gpt4ScrapeAndSummary(question, url, userTimeZone, i += 1000))
    const summary = (await Promise.all(queries.map((query) => crawler.summarize(query, true, false)))).join('\n\n')
    const question2 = useSelectSites(question, summary, userTimeZone)
    const answer2 = (await makeRequest('gpt4_summarizer', question2))?.answer as string
    const answer2Json = answer2.substring(answer2.indexOf('['), answer2.lastIndexOf(']') + 1)
    const selectedSites = JSON.parse(answer2Json) as Array<{ url: string, title:string }>
    const selectedSiteUrls = makeSureUrlsStartsWithHttp(selectedSites.map((site) => site.url))
    const _pages2 = selectedSiteUrls.map((url) => gpt4ScrapeAndSummary(question, url, userTimeZone, i += 1000))
    const pages = [..._pages1, ..._pages2]
    const references = await new Promise<string[]>(async (resolve, reject) => {
      const results: string[] = []
      setTimeout(() => resolve(results), 3 * 60000)
      for (const page of pages) {
        page
          .then((result) => results.push(result))
          .catch(() => results.push(''))
          .finally(() => {
            if (results.length === pages.length) {
              resolve(results)
            }
          })
      }
    })
    const _role = 'Please use references whenever possible to provide users with valuable answers. Please answer with as much detail as possible. You must organize your language to ensure the coherence and logic of your responses. '
    const _references = `Here are references from the internet:\n${references.join('\n')}`
    const finalQuestion = useDefaultTemplate(question, userTimeZone, _role, _references).substring(0, 16384)
    logger.create({ type: 'advanced.final', refer: question, text: str(finalQuestion) })
    return { queries, urls, ...(await makeRequest('gpt4', finalQuestion, context)) }
  } catch (err) {
    logger.create({ type: 'error.advanced', text: str(err) })
    return { queries: [], urls: [], answer: undefined }
  }
}
