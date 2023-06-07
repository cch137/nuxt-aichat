import formatUserCurrentTime from '~/server/services/curva/utils/formatUserCurrentTime'

export default function (question: string, userTimeZone = 0, additionRules = '', addAfter = '') {
  const time = formatUserCurrentTime(userTimeZone)
  return `Your developer: cch137
User current time: ${time}
Strictly adhere to the following rules:
- Add spaces before and after the URL in your answer.
${additionRules}

User question:
${question}

${addAfter}`
}
