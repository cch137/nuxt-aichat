import { config } from 'dotenv'
import { Sequelize, Model, DataTypes } from 'sequelize'
import allowedModelNames from './allowedModelNames'

const models = new Map<Sequelize,Map<string, typeof Model>>()

config()

console.log('EMAIL(DB):', process.env.EMAIL_ADDRESS)

const createClient = (email: string, password: string) => {
  return new Sequelize(
    'mindsdb',
    email,
    password,
    {
      host: 'cloud.mindsdb.com',
      dialect: 'mysql',
      logging: false,
      pool: {
        min: 2,
        max: 512
      }
    }
  )
}

const defaultSequelize = createClient(
  process.env.EMAIL_ADDRESS as string,
  process.env.PASSWORD as string
)

const createModel = (tableName: string, sequelize = defaultSequelize) => {
  class _Model extends Model { public answer!: string }
  _Model.init(
    { answer: { type: DataTypes.STRING, allowNull: false } },
    { sequelize, tableName }
  )
  if (!models.has(sequelize)) {
    models.set(sequelize, new Map())
  }
  models.get(sequelize)?.set(tableName, _Model)
  return _Model
}

const getModel = (modelName: string, sequelize = defaultSequelize): typeof Model => {
  return models.get(sequelize)?.get(modelName) as typeof Model
}

const getQuestionMaxLength = (modelName: string) => {
  return modelName.startsWith('gpt3') ? 4096 : 8192
}

export {
  defaultSequelize,
  createClient,
  createModel,
  getModel,
  getQuestionMaxLength,
  Model
}

allowedModelNames.forEach((modelName) => createModel(modelName))
