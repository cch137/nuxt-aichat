import { config } from 'dotenv'
import { Sequelize, Model, DataTypes } from 'sequelize'

const models = new Map<string, typeof Model>()

config()

console.log('EMAIL:', process.env.EMAIL_ADDRESS)

const sequelize = new Sequelize(
  'mindsdb',
  process.env.EMAIL_ADDRESS as string,
  process.env.PASSWORD as string,
  {
    host: 'cloud.mindsdb.com',
    dialect: 'mysql',
    logging: false,
    pool: {
      min: 64,
      max: 512
    }
  }
)

const createModel = (tableName: string) => {
  class _Model extends Model { public answer!: string }
  _Model.init(
    { answer: { type: DataTypes.STRING, allowNull: false } },
    { sequelize, tableName }
  )
  models.set(tableName, _Model)
  return _Model
}

const fixModelName = (modelName: string) => {
  if (models.has(modelName)) {
    return modelName
  }
  return 'gpt4'
}

const getModel = (modelName: string): typeof Model => {
  return models.get(fixModelName(modelName)) as typeof Model
}

const getQuestionMaxLength = (modelName: string) => {
  return fixModelName(modelName).startsWith('gpt3') ? 4096 : 8192
}

export {
  getModel,
  getQuestionMaxLength,
  Model
}

[
  'gpt4',
  'gpt4_t00',
  'gpt4_t01',
  'gpt4_t02',
  'gpt4_t03',
  'gpt4_t04',
  'gpt4_t05',
  'gpt4_t06',
  'gpt4_t07',
  'gpt4_t08',
  'gpt4_t09',
  'gpt4_t10',
  'gpt3',
  'gpt3_t00',
  'gpt3_t01',
  'gpt3_t02',
  'gpt3_t03',
  'gpt3_t04',
  'gpt3_t05',
  'gpt3_t06',
  'gpt3_t07',
  'gpt3_t08',
  'gpt3_t09',
  'gpt3_t10',
  'gpt4_summarizer',
  'gpt4_mixer'
].forEach((modelName) => createModel(modelName))
