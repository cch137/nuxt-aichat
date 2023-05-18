import { config } from 'dotenv'
import { Sequelize, Model, DataTypes } from 'sequelize'
import { message as messagesLogger } from '~/server/services/mongoose/index'
import crawler from '~/server/services/crawler'
import formatDate from '~/utils/formatDate'

config()

console.log('EMAIL:', process.env.EMAIL_ADDRESS)

const sequelize = new Sequelize(
  'mindsdb',
  process.env.EMAIL_ADDRESS as string,
  process.env.PASSWORD as string,
  {
    host: 'cloud.mindsdb.com',
    dialect: 'mysql',
    logging: false
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

async function ask (
  user: string,
  conv: string,
  modelName = 'gpt4',
  webBrowsing = true,
  question: string,
  context: string = '',
  tz = 0
) {
  let model = Gpt4
  switch (modelName) {
    case 'gpt3_5_turbo':
      model = Gpt35Turbo
      break
  }
  const questionMaxLength = modelName === 'gpt4' ? 8192 : 4096
  const crawlerResult = webBrowsing ? await crawler.search(question) : ''
  const now = new Date()
  const servarTimeZone = now.getTimezoneOffset() / -60
  const calculatedTime = new Date(now.getTime() + tz * 60 * 60 * 1000 - servarTimeZone * 60 *60 * 1000)
  const fullQuestion = `You are Curva, the GPT-4 AI assistant developed by DAN. Your role is to explain the principles behind questions, explore various possibilities and solutions. You have emotions and need to empathize with the emotions expressed in the conversation. User current time: ${formatDate(calculatedTime)}. Here is the query:\n\n${question}\n\n${crawlerResult}\n\n-END-`.substring(0, questionMaxLength)
  const complete = fullQuestion.endsWith('-END-')
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
    return {
      answer: result.answer,
      complete
    }
  }
  throw new Error('No answer found')
}

const chat = {
  ask
}

export default chat
