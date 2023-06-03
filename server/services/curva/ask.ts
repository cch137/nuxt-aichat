import crawler from '~/server/services/crawler'
import saveMessage from './utils/saveMessage'
import makeRequest from './utils/makeRequest'
import makeResponse from './utils/makeResponse'
import type { MindsDBClient } from './mindsdb'
import { getQuestionMaxLength } from './mindsdb'
import { endsWithSuffix, addEndSuffix, removeEndSuffix } from './utils/endSuffix'
import useDefaultTemplate from './templates/default'
import advancedAsk from './advanced'
import extractUrls from '~/utils/extractURLs'

const _wrapSearchResult = (result: string) => {
  return result
    ? `Here are references from the internet. Use only when necessary:\n${result}`
    : ''
}

async function ask (
  client: MindsDBClient,
  user: string,
  conv: string,
  modelName = 'gpt4',
  webBrowsing: 'OFF' | 'BASIC' | 'ADVANCED' = 'BASIC',
  question: string,
  context: string = '',
  userTimeZone = 0
) {
  let answer: string | undefined
  let props = {} as any
  let complete = true
  const originalQuestion = question
  if (webBrowsing === 'ADVANCED') {
    const advResult = (await advancedAsk(client, question, context, userTimeZone))
    props = { queries: advResult.queries, urls: advResult.urls }
    answer = advResult?.answer
    if (!answer) {
      webBrowsing = 'BASIC'
      console.log('DOWNGRADE: ADVANCED => BASE')
    }
  }
  if (webBrowsing === 'BASIC' || webBrowsing === 'OFF') {
    if (webBrowsing === 'BASIC') {
      const urls = extractUrls(question)
      if (urls.length === 0) {
        question = useDefaultTemplate(question, userTimeZone, '', _wrapSearchResult(await crawler.summarize(question)))
      } else {
        const pages = await Promise.all(urls.map((url) => crawler.scrape(url)))
        for (let i = 0; i < urls.length; i++) {
          pages[i] = `${urls[i]}\n${pages[i]}`
        }
        question = useDefaultTemplate(question, userTimeZone, '', 'Here are the webpages:\n' + pages.join('\n\n---\n\n'))
      }
    } else {
      useDefaultTemplate(question, userTimeZone)
    }
    question = addEndSuffix(question)
    question = question.substring(0, getQuestionMaxLength(modelName))
    complete = endsWithSuffix(question)
    if (complete) {
      question = removeEndSuffix(question)
    }
    answer = (await makeRequest(client, modelName, question, context))?.answer
  }
  props.web = webBrowsing
  const response = await makeResponse(answer, complete, props)
  if (!((response as any).error) && answer) {
    saveMessage(user, conv, originalQuestion, answer, modelName)
  }
  return response
}

export default ask
