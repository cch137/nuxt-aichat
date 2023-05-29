import { execQuery } from './mindsdb'

export default async function (modelName: string, question: string, context = '') {
  try {
    // @ts-ignore
    const result = await execQuery(modelName, question, context)
    return { answer: result?.answer }
  } catch (err) {
    return { answer: undefined }
  }
}
