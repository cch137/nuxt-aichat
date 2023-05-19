import { getModel } from './models'

export default async function (modelName: string, question: string, context = '') {
  try {
    return await getModel(modelName).findOne({
      attributes: ['answer'],
      where: {
        question: question.replaceAll('\'', '`'),
        context: context.replaceAll('\'', '`')
      }
    })
  } catch (err) {
    console.error(err)
    return {
      answer: undefined
    }
  }
}
