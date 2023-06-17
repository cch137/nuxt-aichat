import formatUserCurrentTime from '~/server/services/evo/utils/formatUserCurrentTime'

export default function (question: string, userTimeZone = 0, additionRules = '', addAfter = '') {
  const time = formatUserCurrentTime(userTimeZone)
  return `User current time: ${time}
${additionRules ? `Strictly adhere to the following rules:\n${additionRules}\n` : ''}
User question:
${question}

${addAfter}`
}
