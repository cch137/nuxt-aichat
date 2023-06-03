// import MindsDBWebClient from './mindsdb-web'
import { getModel, defaultSequelize } from './mindsdb-sql'

const sanitizeAnswer = (answer = '') => {
  return answer?.replaceAll('�', '')
}

const getAnswerBySql = async (modelName: string, question: string, context = '', sequelize = defaultSequelize) => {
  try {
    const model = getModel(modelName, sequelize)
    // @ts-ignore
    const result = await model.findOne({
      attributes: ['answer'],
      where: {
        question: question.replaceAll('\'', '`'),
        context: context.replaceAll('\'', '`')
      }
    }) as { answer: string }
    if (result === null) {
      throw Error('No Answer Found')
    }
    return { answer: sanitizeAnswer(result.answer) }
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

export default async function (modelName: string, question: string, context = '', sequelize = defaultSequelize) {
  return await getAnswerBySql(modelName, question, context, sequelize)
  // return await getAnswerByWeb(modelName, question, context)
}
