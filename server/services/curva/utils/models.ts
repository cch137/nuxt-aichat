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
  return _Model
}

const Gpt4 = createModel('gpt4')
const Gpt35Turbo = createModel('gpt3_5_turbo')

const Gpt4Summarizer = createModel('gpt4_summarizer')
const Gpt4Mixer = createModel('gpt4_mixer')

const fixModelName = (modelName: string) => {
  switch (modelName) {
    case 'gpt4':
    case 'gpt4_summarizer':
    case 'gpt4_mixer':
    case 'gpt3_5_turbo':
      return modelName
  }
  return 'gpt4'
}

const getModel = (modelName: string) => {
  switch (fixModelName(modelName)) {
    case 'gpt4_summarizer':
      return Gpt4Summarizer
    case 'gpt4_mixer':
      return Gpt4Mixer
    case 'gpt3_5_turbo':
      return Gpt35Turbo
  }
  return Gpt4
}

const getQuestionMaxLength = (modelName: string) => {
  switch (fixModelName(modelName)) {
    case 'gpt3_5_turbo':
      return 4096
  }
  return 8192
}

export {
  Gpt4,
  Gpt35Turbo,
  Gpt4Summarizer,
  Gpt4Mixer,
  getModel,
  getQuestionMaxLength
}
