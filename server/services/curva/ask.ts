import crawler from '~/server/services/crawler'
import saveMessage from './utils/saveMessage'
import makeRequest from './utils/makeRequest'
import makeResponse from './utils/makeResponse'
import { getQuestionMaxLength } from './utils/mindsdb'
import { endsWithSuffix, addEndSuffix, removeEndSuffix } from './utils/endSuffix'
import useDefaultTemplate from './templates/default'
import advancedAsk from './advanced'

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
  let answer: string | undefined, props = {}, complete = true
  const originalQuestion = question
  if (webBrowsing === 'ADVANCED') {
    const advResult = (await advancedAsk(question, context, userTimeZone))
    props = { queries: advResult.queries, urls: advResult.urls }
    if (!advResult?.answer) {
      webBrowsing = 'BASIC'
    } else {
      answer = advResult.answer
    }
    webBrowsing = 'BASIC'
  }
  if (webBrowsing === 'BASIC' || webBrowsing === 'OFF') {
    if (webBrowsing === 'BASIC') {
      question = useDefaultTemplate(question, userTimeZone, '', _wrapSearchResult(await crawler.summarize(question)))
    } else {
      useDefaultTemplate(question, userTimeZone)
    }
    question = addEndSuffix(question)
    question = question.substring(0, getQuestionMaxLength(modelName))
    complete = endsWithSuffix(question)
    if (complete) {
      question = removeEndSuffix(question)
    }
    answer = (await makeRequest(modelName, question, context))?.answer
  }
  const response = await makeResponse(answer, complete, props)
  if (!((response as any).error) && answer) {
    saveMessage(user, conv, originalQuestion, answer, modelName)
  }
  return response
}

export default ask
