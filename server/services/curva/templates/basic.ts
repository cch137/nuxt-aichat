import useDefaultTemplate from './default'

export default function (question: string, references = '', userTimeZone = 0) {
  return useDefaultTemplate(question, userTimeZone, '', references)
}
