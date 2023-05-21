import crawler from '~/server/services/crawler'
import useParseUrlsAndQueries from './templates/parseUrlsAndQueries'
import useSelectSites from './templates/selectSites'
import useExtractPage from './templates/extractPage'
import useBasic from './templates/basic'
import makeRequest from './utils/makeRequest'
import { log as logger } from '~/server/services/mongoose/index'
import str from '~/utils/str'

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
        logger.create({ type: 'adv-summary', refer: `${question}${url}`, text: str(answer) })
        resolve(answer)
      }, delay)
    })
  } catch (err) {
    logger.create({ type: 'error', text: str(err) })
    return ''
  }
}

export default async function (question: string, context = '', userTimeZone = 0) {
  try {
    let i = 0
    const question1 = useParseUrlsAndQueries(question, userTimeZone)
    const answer1 = (await makeRequest('gpt4_summarizer', question1))?.answer as string
    const answer1Json = answer1.substring(answer1.indexOf('{'), answer1.lastIndexOf('}') + 1)
    const { urls, queries } = JSON.parse(answer1Json) as { urls: string[], queries: string[] }
    const _pages1 = urls.map((url) => gpt4ScrapeAndSummary(question, url, userTimeZone, i += 1000))
    const summary = (await Promise.all(queries.map((query) => crawler.summarize(query, true, false)))).join('\n\n')
    const question2 = useSelectSites(question, summary, userTimeZone)
    const answer2 = (await makeRequest('gpt4_summarizer', question2))?.answer as string
    const answer2Json = answer2.substring(answer2.indexOf('['), answer2.lastIndexOf(']') + 1)
    const selectedSites = JSON.parse(answer2Json) as Array<{ url: string, title:string }>
    const selectedSiteUrls = selectedSites.map((site) => site.url)
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
    const finalQuestion = useBasic(question, `Here are the references:\n${references.join('\n')}`, userTimeZone).substring(0, 16384)
    logger.create({ type: 'adv-final', refer: question, text: str(finalQuestion) })
    return {
      queries,
      urls,
      answer: (await makeRequest('gpt4', finalQuestion, context))?.answer
    }
  } catch (err) {
    logger.create({ type: 'error', text: str(err) })
    return { answer: undefined }
  }
}
