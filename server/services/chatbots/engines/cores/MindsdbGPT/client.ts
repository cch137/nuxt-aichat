import type { AxiosInstance } from 'axios'
import { config } from 'dotenv'
import { Sequelize, Model, DataTypes } from 'sequelize'
import createAxiosSession from '~/server/services/utils/createAxiosSession'

config()

class MindsDBClient {
  email
  password
  sqlClient
  webClient
  connectMethod?: 'SQL' | 'WEB'

  constructor (
    email: string,
    password: string,
    connectMethod?: 'SQL' | 'WEB'
  ) {
    this.email = email
    this.password = password
    this.connectMethod = connectMethod
    this.sqlClient = new MindsDBSqlClient(this)
    this.webClient = new MindsDBWebClient(this)
  }

  get client () {
    switch (this.connectMethod) {
      case 'WEB':
        return this.webClient
      case 'SQL':
      default:
        return this.sqlClient
    }
  }

  async askGPT (modelName: string, question: string, context?: string) {
    return await this.client.askGPT(modelName, question, context) as { answer: string, error?: string }
  }

  restart () {
    this.sqlClient.login()
    this.webClient.login()
  }

  kill () {
    this.sqlClient.sequelize.close()
  }
}

class _Client {
  parent: MindsDBClient
  get email () { return this.parent.email }
  get password () { return this.parent.password }
  constructor(parent: MindsDBClient) {
    this.parent = parent
  }
}

class MindsDBSqlClient extends _Client {
  sequelize: Sequelize

  constructor(parent: MindsDBClient) {
    super(parent)
    this.sequelize = this.login()
  }

  login () {
    const sequelize = new Sequelize(
      'mindsdb',
      this.email,
      this.password,
      {
        host: 'cloud.mindsdb.com',
        // port: 3306,
        dialect: 'mysql',
        logging: false,
        pool: { min: 8, max: 512 }
      }
    )
    if (this.sequelize) {
      this.sequelize.close()
    }
    return this.sequelize = sequelize
  }

  async _getModel (modelName: string): Promise<typeof Model> {
    class _Model extends Model { public answer!: string }
    _Model.init(
      { answer: { type: DataTypes.STRING, allowNull: false } },
      { sequelize: this.sequelize, tableName: modelName }
    )
    return _Model
  }

  async askGPT (modelName: string, question = 'Hi', context = '') {
    try {
      const model = this._getModel(modelName)
      // @ts-ignore
      const result = await model.findOne({
        attributes: ['answer'],
        where: {
          question: question.replaceAll('\'', '`'),
          context: context.replaceAll('\'', '`')
        }
      })
      if (result?.answer) {
        return { answer: result.answer }
      }
      return { answer: '', error: 'MindsDB did not return a valid response.' }
    } catch (err) {
      return { answer: '', error: (err as any)?.original?.sqlMessage as string }
    }
  }
}

function wrapPromptTextParam (text: string) {
  const hasSingleQuotes = text.includes("'")
  const hasDoubleQuotes = text.includes('"')
  if (hasSingleQuotes) {
    if (hasDoubleQuotes) {
      return `'${text.replaceAll('\'', '`')}'`
    } else {
      return `"${text}"`
    }
  } else {
    return `'${text}'`
  }
}

class MindsDBWebClient extends _Client {
  lastLoggedIn = Date.now()
  session: AxiosInstance

  constructor(parent: MindsDBClient) {
    super(parent)
    this.session = this.login()
  }

  login () {
    const session = createAxiosSession({
      'Referer': 'https://cloud.mindsdb.com/editor'
    })
    session.post('https://cloud.mindsdb.com/cloud/login', {
      email: this.email,
      password: this.password,
      rememberMe: true
    })
    this.lastLoggedIn = Date.now()
    return session
  }

  // Every 24 hours update session 
  async _maintainSession () {
    const now = Date.now()
    if (now - this.lastLoggedIn > 24 * 60 * 60 * 1000) {
      this.login()
    }
  }

  async askGPT (modelName: string, question = 'Hi', context = '') {
    this._maintainSession()
    question = question.replaceAll('\'', '`')
    context = context.replaceAll('\'', '`')
    try {
      const res = await this.session.post('https://cloud.mindsdb.com/api/sql/query', {
        query: `SELECT answer FROM mindsdb.${modelName}\r\nWHERE question = ${wrapPromptTextParam(question)} AND context = ${wrapPromptTextParam(context)}`,
        context: { db: 'mindsdb' }
      })
      const data = res.data as { column_names: string[], data: string[][] }
      const answerIndex = data.column_names.indexOf('answer')
      return { answer: data.data[0][answerIndex] }
    } catch {
      return { answer: '', error: 'MindsDB did not return a valid response.' }
    }
  }
}

export default MindsDBClient
