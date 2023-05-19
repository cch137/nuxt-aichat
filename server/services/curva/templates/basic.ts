import useDefaultTemplate from './default'

export default function (question: string, crawlerResult = '', userTimeZone = 0) {
  return `${useDefaultTemplate(question, userTimeZone)}\n${question}\n${crawlerResult}`
}
