import { config } from 'dotenv'
import { Sequelize, Model, DataTypes } from 'sequelize'

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

const getModel = (modelName: string) => {
  switch (modelName) {
    case 'gpt3_5_turbo':
      return Gpt35Turbo
  }
  return Gpt4
}

export {
  Gpt4,
  Gpt35Turbo,
  getModel
}
