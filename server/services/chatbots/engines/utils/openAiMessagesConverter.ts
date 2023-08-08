import type { OpenAIMessage } from '../cores/types'

const contextHead = 'Conversation History\n\n'

function messagesToQuestionContext (messages: OpenAIMessage[]) {
  messages = [...messages]
  const isContinueGenerate = messages.at(-1)?.role === 'assistant'
  const questionMessageObj: OpenAIMessage = isContinueGenerate
    ? { role: 'user', content: '[[ CONTINUE GENERATE (Provide more details or keep creating) ]]'}
    : messages.at(-1) || { role: 'user', content: 'Hi' }
  if (questionMessageObj) {
    const indexOfMsgObj = messages.indexOf(questionMessageObj)
    if (indexOfMsgObj !== -1) {
      messages.splice(indexOfMsgObj, 1)
    }
  }
  const context: string = `${contextHead}${messages.map((message) => `${message.role}: ${message.content}`).join('\n\n')}`
  return {
    isContinueGenerate,
    question: questionMessageObj.content,
    context
  }
}

function questionContextToMessages (question = '', context = '') {
  if (context.startsWith(contextHead)) {
    context.replace(contextHead, '')
  }
  const dataSlices = context.split('\n\n')
  const messages: OpenAIMessage[] = []
  dataSlices.forEach((data) => {
    const role = data.startsWith('user: ')
      ? 'user'
      : data.startsWith('assistant: ')
        ? 'assistant'
        : undefined
    if (role === undefined) {
      const len = messages.length
      if (len > 0) {
        messages[len - 1].content = `${messages[len - 1].content}\n\n${data}`
      } else {
        messages.push({ role: 'user', content: data })
      }
    } else {
      messages.push({ role, content: data })
    }
  })
  messages.push({ role: 'user', content: question })
  return messages
}

export {
  questionContextToMessages,
  messagesToQuestionContext
}
