import crawler from '~/server/services/crawler'
import saveMessage from './utils/saveMessage'
import makeRequest from './utils/makeRequest'
import makeResponse from './utils/makeResponse'
import { getQuestionMaxLength } from './utils/models'
import { endsWithSuffix, addEndSuffix, removeEndSuffix } from './utils/endSuffix'
import useDefaultTemplate from './templates/default'
import useBasicTemplate from './templates/basic'
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
  }
  if (webBrowsing !== 'ADVANCED') {
    const searchResult = _wrapSearchResult(await crawler.summarize(question))
    question = webBrowsing === 'OFF'
      ? useDefaultTemplate(question, userTimeZone)
      : useBasicTemplate(question, searchResult, userTimeZone)
    question = addEndSuffix(question)
    question = question.substring(0, getQuestionMaxLength(modelName))
    complete = endsWithSuffix(question)
    if (complete) {
      question = removeEndSuffix(question)
    }
    answer = (await makeRequest(modelName, question, context))?.answer
  }
  const response = await makeResponse(answer, complete, props)
  if (!((response as any).error) && answer && webBrowsing !== 'ADVANCED') {
    saveMessage(user, conv, originalQuestion, answer, modelName)
  }
  return response
}

export default ask
