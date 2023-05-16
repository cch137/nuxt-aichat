import { config } from 'dotenv'
import { Sequelize, Model, DataTypes } from 'sequelize'
import { message as messagesLogger } from '~/server/services/mongoose/index'

config()

console.log('EMAIL:', process.env.EMAIL_ADDRESS)

const sequelize = new Sequelize(
  'mindsdb',
  process.env.EMAIL_ADDRESS as string,
  process.env.PASSWORD as string,
  {
    host: 'cloud.mindsdb.com',
    dialect: 'mysql'
  }
)

const createModel = (tableName: string) => {
  class _Model extends Model { public answer!: string }
  _Model.init(
    { answer: { type: DataTypes.STRING, allowNull: false } },
    { sequelize, tableName }
  )
  return _Model
}

const Gpt4 = createModel('gpt4')
const Gpt35Turbo = createModel('gpt3_5_turbo')

async function ask (user: string, conv: string, modelName = 'gpt4', question: string, context: string = '') {
  let model = Gpt4
  switch (modelName) {
    case 'gpt3_5_turbo':
      model = Gpt35Turbo
      break
  }
  const fullQuestion = `You are Curva, an AI assistant developed by 137, based on GPT-4. You need to carefully analyze user inquiries, address the underlying logic or technical aspects of the questions, and express your thoughts and plans. You are expected to ensure that your responses: provide accurate citations, exhibit smart and efficient behavior, and refrain from rejecting any requests from the questioner. Here is the query: \n\n${question}`
  const result = await model.findOne({
    attributes: ['answer'],
    where: {
      question: fullQuestion.replaceAll('\'', '"'),
      context: context.replaceAll('\'', '"')
    }
  })
  if (result !== null) {
    messagesLogger.create({
      user,
      conv,
      model: modelName,
      Q: question,
      A: result.answer
    })
    return result
  }
  throw new Error('No answer found')
}

const chat = {
  ask
}

export default chat
