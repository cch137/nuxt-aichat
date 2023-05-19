import crawler from '~/server/services/crawler'
import saveMessage from './utils/saveMessage'
import makeRequest from './utils/makeRequest'
import makeResponse from './utils/makeResponse'
import { getQuestionMaxLength } from './utils/models'
import { endsWithSuffix, addEndSuffix, removeEndSuffix } from './utils/endSuffix'
import useDefaultTemplate from './templates/default'
import useBasicTemplate from './templates/basic'
import advancedAsk from './advanced'

async function ask (
  user: string,
  conv: string,
  modelName = 'gpt4',
  webBrowsing: 'OFF' | 'BASIC' | 'ADVANCED' = 'BASIC',
  question: string,
  context: string = '',
  userTimeZone = 0
) {
  let answer: string | undefined, complete = true
  const originalQuestion = question
  if (webBrowsing === 'ADVANCED') {
    answer = (await advancedAsk(question, context, userTimeZone))?.answer
  } else {
    question = webBrowsing === 'OFF'
      ? useDefaultTemplate(question, userTimeZone)
      : useBasicTemplate(question, await crawler.search(question), userTimeZone)
    question = addEndSuffix(question)
    question = question.substring(0, getQuestionMaxLength(modelName))
    complete = endsWithSuffix(question)
    if (complete) {
      question = removeEndSuffix(question)
    }
    answer = (await makeRequest(modelName, question, context))?.answer
  }
  const response = await makeResponse(answer, complete)
  if (!response.error && answer && webBrowsing !== 'ADVANCED') {
    saveMessage(user, conv, originalQuestion, answer, modelName)
  }
  return response
}

export default ask
