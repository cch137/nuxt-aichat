import formatUserCurrentTime from '~/server/services/curva/utils/formatUserCurrentTime'

export default function (question: string, userTimeZone = 0, additionRules = '', addAfter = '') {
  const time = formatUserCurrentTime(userTimeZone)
  return `User current time: ${time}
${additionRules ? `Strictly adhere to the following rules:\n${additionRules}\n` : ''}
User question:
${question}

${addAfter}`
}
