import crawler from '~/server/services/crawler'
import saveMessage from './utils/saveMessage'
import mindsdb from '~/server/services/mindsdb'
import { endsWithSuffix, addEndSuffix, removeEndSuffix } from './utils/endSuffix'
import useDefaultTemplate from './templates/default'
import extractUrls from '~/utils/extractURLs'
import advancedAsk from './advanced'
import client from './client'

const _wrapSearchResult = (result: string) => {
  return result
    ? `Here are references from the internet. Use only when necessary:\n${result}`
    : ''
}

async function ask (
  user: string,
  conv: string,
  modelName = 'gpt4',
  webBrowsing: 'OFF' | 'BASIC' | 'ADVANCED' = 'BASIC',
  question: string,
  context: string = '',
  userTimeZone = 0
) {
  const t0 = Date.now()
  let answer: string | undefined
  let isComplete = true
  let queries = [] as string[]
  let urls = [] as string[]
  const originalQuestion = question
  if (webBrowsing === 'ADVANCED') {
    const advResult = (await advancedAsk(question, context, userTimeZone))
    answer = advResult?.answer
    queries = advResult?.queries || queries
    urls = advResult?.urls || urls
    if (!answer) {
      queries = []
      urls = []
      webBrowsing = 'BASIC'
      console.log('DOWNGRADE: ADVANCED => BASE')
    }
  }
  if (webBrowsing === 'BASIC' || webBrowsing === 'OFF') {
    if (webBrowsing === 'BASIC') {
      const _urls = extractUrls(question).slice(0, 4)
      if (_urls.length === 0) {
        question = useDefaultTemplate(question, userTimeZone, '', _wrapSearchResult(await crawler.summarize(question)))
      } else {
        const responses = await Promise.all(_urls.map((url) => crawler.scrape(url)))
        const pages = [] as string[]
        for (let i = 0; i < _urls.length; i++) {
          if (!responses[i].error) {
            urls.push(`${responses[i].title} ${new URL(_urls[i]).href}`)
          }
          pages.push(`${_urls[i]}\n${responses[i].response}`)
        }
        question = useDefaultTemplate(question, userTimeZone, '', 'Information from webpages:\n' + pages.join('\n\n---\n\n'))
      }
    } else {
      question = useDefaultTemplate(question, userTimeZone)
    }
    question = addEndSuffix(question)
    question = question.substring(0, mindsdb.getGptQuestionMaxLength(modelName))
    isComplete = endsWithSuffix(question)
    if (isComplete) {
      question = removeEndSuffix(question)
    }
    answer = (await client.gpt(modelName, question, context))?.answer
  }
  const dt = Date.now() - t0
  const response = answer ? {
    answer,
    complete: isComplete,
    web: webBrowsing,
    queries,
    urls,
    dt 
  } : {
    error: 'Answer Not Found',
    complete: isComplete,
    web: webBrowsing,
    queries,
    urls,
    dt
  }
  if (answer) {
    saveMessage(user, conv, originalQuestion, answer, queries, urls, dt)
  }
  return response
}

export default ask
