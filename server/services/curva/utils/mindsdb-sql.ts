import { config } from 'dotenv'
import { Sequelize, Model, DataTypes } from 'sequelize'
import allowedModelNames from './allowedModelNames'

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

allowedModelNames.forEach((modelName) => createModel(modelName))
