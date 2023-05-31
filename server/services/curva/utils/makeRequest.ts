// import { execQuery } from './mindsdb-web'
import { getModel } from './mindsdb-sql'

const getAnswerBySql = async (modelName: string, question: string, context = '') => {
  try {
    // @ts-ignore
    const result = await getModel(modelName).findOne({
      attributes: ['answer'],
      where: {
        question: question.replaceAll('\'', '`'),
        context: context.replaceAll('\'', '`')
      }
    }) as { answer: string }
    if (result === null) {
      throw Error('No Answer Found')
    }
    return { answer: result.answer as string }
  } catch (err) {
    const sqlMessage = (err as any)?.original?.sqlMessage as string | undefined
    return { answer: undefined, sqlMessage }
  }
}

// const getAnswerByWeb = async (modelName: string, question: string, context = '') => {
//   try {
//     // @ts-ignore
//     const result = await execQuery(modelName, question, context)
//     return { answer: result?.answer }
//   } catch (err) {
//     return { answer: undefined }
//   }
// }

export default async function (modelName: string, question: string, context = '') {
  return await getAnswerBySql(modelName, question, context)
  // return await getAnswerByWeb(modelName, question, context)
}
