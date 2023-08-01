import type { OpenAIMessage } from '../cores/types'

const contextHead = 'Conversation History\n\n'

function messagesToQuestionContext (messages: OpenAIMessage[]) {
  let questionMessageObj = messages.filter((value) => value.role === 'user').at(-1)
  if (questionMessageObj) {
    messages.splice(messages.indexOf(questionMessageObj), 1)
  } else {
    questionMessageObj = { role: 'user', content: '' }
  }
  const context = `${contextHead}${messages.map((message) => `${message.role}: ${message.content}`).join('\n\n')}`
  return {
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
