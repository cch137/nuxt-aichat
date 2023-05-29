import { execQuery } from './mindsdb'

export default async function (modelName: string, question: string, context = '') {
  try {
    // @ts-ignore
    const result = await execQuery(modelName, question, context)
    if (result === null) {
      throw Error('No Answer Found')
    }
    return { answer: result.answer as string }
  } catch (err) {
    return { answer: undefined }
  }
}
