import type { AxiosInstance } from 'axios'
import { config } from 'dotenv'
import { Sequelize, Model, DataTypes } from 'sequelize'
import createAxiosSession from '~/server/services/utils/createAxiosSession'
import { log as logger } from '~/server/services/mongoose/index'
import str from '~/utils/str'
import { clientSet, defaultConnectMethod } from './utils'

config()

const sanitizeAnswer = (answer = '') => {
  return answer?.replaceAll('�', '')
}

class MindsDBClient {
  email
  password
  allowedModelNames
  sqlClient
  webClient
  connectMethod: 'SQL' | 'WEB' | undefined

  constructor (
    email: string,
    password: string,
    allowedModelNames: string[] | Set<string> = [],
    connectMethod?: 'SQL' | 'WEB'
  ) {
    console.log(`MindsDB logged in with ${email}`)
    this.email = email
    this.password = password
    this.allowedModelNames = new Set([...allowedModelNames])
    this.connectMethod = connectMethod
    this.sqlClient = new MindsDBSqlClient(this)
    this.webClient = new MindsDBWebClient(this)
    clientSet.add(this)
  }

  get client () {
    switch (this.connectMethod || defaultConnectMethod.get()) {
      case 'WEB':
        return this.webClient
      case 'SQL':
      default:
        return this.sqlClient
    }
  }

  async gpt (modelName: string, question = 'Hi', context = '') {
    const result = await this.client.select(modelName, question, context)
    if (typeof result?.answer === 'string') {
      result.answer = sanitizeAnswer(result.answer)
    }
    return result
  }

  async restart () {
    return await new Promise(async (resolve, reject) => {
      try {
        await this.sqlClient.login()
        await this.webClient.login()
        resolve(null)
      } catch (err) {
        reject(err)
      }
    })
  }

  async kill () {
    try {
      await this.sqlClient.sequelize?.close()
    } catch (err) {
      clientSet.delete(this)
    }
  }
}

class _Client {
  parent
  get email () { return this.parent.email }
  get password () { return this.parent.password }
  get allowedModelNames () { return this.parent.allowedModelNames }
  constructor(parent: MindsDBClient) {
    this.parent = parent
  }
}

class MindsDBSqlClient extends _Client {
  sequelize: Sequelize | undefined
  models = new Map<string, typeof Model>()

  constructor(parent: MindsDBClient) {
    super(parent)
    this.login()
  }

  async login () {
    const sequelize = new Sequelize(
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
    if (this.sequelize) {
      try {
        await this.sequelize.close()
      } catch (err) {
        console.error(err)
      }
    }
    this.sequelize = sequelize
    this.models.clear()
    // Create models
    this.allowedModelNames.forEach((tableName) => {
      class _Model extends Model { public answer!: string }
      _Model.init(
        { answer: { type: DataTypes.STRING, allowNull: false } },
        { sequelize, tableName }
      )
      this.models.set(tableName, _Model)
    })
  }

  async select (modelName: string, question = 'Hi', context = '') {
    try {
      const model = this.models.get(modelName)
      if (!model) {
        throw 'Model Not Found'
      }
      // @ts-ignore
      const result = await model.findOne({
        attributes: ['answer'],
        where: {
          question: question.replaceAll('\'', '`'),
          context: context.replaceAll('\'', '`')
        }
      }) as { answer: string }
      if (result === null) {
        throw Error('Answer Not Found')
      }
      return { answer: result.answer }
    } catch (err) {
      const sqlMessage = (err as any)?.original?.sqlMessage as string | undefined
      return { answer: undefined, sqlMessage }
    }
  }
}

class MindsDBWebClient extends _Client {
  session: AxiosInstance | undefined

  constructor(parent: MindsDBClient) {
    super(parent)
    this.login()
    // Every 24 hours Login
    setInterval(() => {
      this.login()
    }, 24 * 60 * 60 * 1000)
  }

  async login () {
    const session = createAxiosSession({
      'Referer': 'https://cloud.mindsdb.com/editor'
    })
    await session.post('https://cloud.mindsdb.com/cloud/login', {
      email: this.email,
      password:  this.password,
      rememberMe: true
    })
    this.session = session
  }

  async select (modelName: string, question = 'Hi', context = '') {
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

export default MindsDBClient
