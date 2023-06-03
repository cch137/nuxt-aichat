import type { AxiosInstance } from 'axios'
import { config } from 'dotenv'
import { Sequelize, Model, DataTypes } from 'sequelize'
import createAxiosSession from '~/server/services/utils/createAxiosSession'
import { log as logger } from '~/server/services/mongoose/index'

let defaultConnectMethod: 'SQL' | 'WEB' = 'SQL'

config()

const getQuestionMaxLength = (modelName: string) => {
  return modelName.startsWith('gpt3') ? 4096 : 8192
}

class MindsDBClient {
  email
  password
  allowedModelNames
  sqlClient: MindsDBSqlClient
  webClient: MindsDBWebClient
  connectMethod: 'SQL' | 'WEB' | undefined
  constructor (
    email: string,
    password: string,
    allowedModelNames: string[] | Set<string> = [],
    connectMethod?: 'SQL' | 'WEB'
  ) {
    console.log('EMAIL(MDB):', email)
    this.email = email
    this.password = password
    this.allowedModelNames = new Set([...allowedModelNames])
    this.connectMethod = connectMethod
    this.sqlClient = new MindsDBSqlClient(this)
    this.webClient = new MindsDBWebClient(this)
  }
  async execQuery (modelName: string, question = 'Hi', context = '') {
    const connMethod = this.connectMethod || defaultConnectMethod
    if (connMethod === 'WEB') {
      return await this.webClient.execQuery(modelName, question, context)
    } else {
      return await this.sqlClient.execQuery(modelName, question, context)
    }
  }
}

class MindsDBSubClient {
  parent
  get email () { return this.parent.email }
  get password () { return this.parent.password }
  constructor(parent: MindsDBClient) {
    this.parent = parent
  }
  get allowedModelNames () { return this.parent.allowedModelNames }
}

class MindsDBSqlClient extends MindsDBSubClient {
  sequelize: Sequelize
  models = new Map<string, typeof Model>()

  constructor(parent: MindsDBClient) {
    super(parent)
    this.sequelize = this.login()
    this.allowedModelNames.forEach((modelName) => this.createModel(modelName))
  }

  login () {
    return new Sequelize(
      'mindsdb',
      this.email,
      this.password,
      {
        host: 'cloud.mindsdb.com',
        dialect: 'mysql',
        logging: false,
        pool: { min: 8, max: 512 }
      }
    )
  }

  createModel (tableName: string) {
    class _Model extends Model { public answer!: string }
    _Model.init(
      { answer: { type: DataTypes.STRING, allowNull: false } },
      { sequelize: this.sequelize, tableName }
    )
    this.models.set(tableName, _Model)
    return _Model
  }

  async execQuery (modelName: string, question = 'Hi', context = '') {
    try {
      const model = this.models.get(modelName) as typeof Model
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
      return { answer: result.answer }
    } catch (err) {
      const sqlMessage = (err as any)?.original?.sqlMessage as string | undefined
      return { answer: undefined, sqlMessage }
    }
  }
}

class MindsDBWebClient extends MindsDBSubClient {
  session: AxiosInstance | undefined
  constructor(parent: MindsDBClient) {
    super(parent)
    this.login()
    // Every 7 Days Login
    setInterval(() => {
      this.login()
    }, 7 * 24 * 60 * 60 * 1000)
  }

  async login () {
    this.session = createAxiosSession({
      'Referer': 'https://cloud.mindsdb.com/editor'
    })
    return await this.session.post('https://cloud.mindsdb.com/cloud/login', {
      email: this.email,
      password:  this.password,
      rememberMe: true
    })
  }

  async execQuery (modelName: string, question = 'Hi', context = '') {
    question = question.replaceAll('\'', '`')
    context = context.replaceAll('\'', '`')
    try {
      if (this.session === undefined) {
        throw 'DB Not Connected'
      }
      const res = await this.session.post('https://cloud.mindsdb.com/api/sql/query', {
        query: `SELECT answer FROM mindsdb.${modelName}\r\nWHERE question = '${question}' AND context = '${context}'`,
        context: { db: 'mindsdb' }
      })
      const data = res.data as { column_names: string[], data: string[][] }
      const answerIndex = data.column_names.indexOf('answer')
      return { answer: data.data[0][answerIndex] }
    } catch (err) {
      logger.create({ type: 'error.mindsdb.query', text: str(err) })
      return null
    }
  }
}

const getConnectMethod = () => {
  return defaultConnectMethod
}

const setConnectMethod = (method: 'SQL' | 'WEB') => {
  console.log('SET MDB CONNECT METHOD:', method)
  defaultConnectMethod = method
}

export {
  getConnectMethod,
  setConnectMethod,
  MindsDBClient,
  getQuestionMaxLength,
}
