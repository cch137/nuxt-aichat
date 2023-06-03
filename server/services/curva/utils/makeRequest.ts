import type { MindsDBClient } from '../mindsdb'

const sanitizeAnswer = (answer = '') => {
  return answer?.replaceAll('�', '')
}

export default async function (
  client: MindsDBClient,
  modelName: string,
  question: string,
  context = ''
) {
  const result = await client.execQuery(modelName, question, context)
  if (typeof result?.answer === 'string') {
    result.answer = sanitizeAnswer(result.answer)
  }
  return result
}
