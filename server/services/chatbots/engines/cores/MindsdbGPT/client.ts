import type { AxiosInstance } from 'axios'
import { Sequelize, QueryTypes, DataTypes } from 'sequelize'
import createAxiosSession from '~/utils/createAxiosSession'

function wrapPromptTextParam (text: string) {
  const hasSingleQuotes = text.includes("'")
  const hasDoubleQuotes = text.includes('"')
  if (hasSingleQuotes && hasDoubleQuotes) {
    return `"${text.replace(new RegExp('"', 'g'), '\'')}"`
  }
  if (hasSingleQuotes) {
    return `"${text}"`
  }
  return `'${text}'`
}

function getSelectSql (modelName: string, question: string, context = '') {
  question = question.replaceAll('\'', '`')
  context = (context || '').replaceAll('\'', '`')
  return `SELECT answer FROM mindsdb.${modelName} WHERE question = ${wrapPromptTextParam(question)} AND context = ${wrapPromptTextParam(context)}`
}

function containsDoubleDash(str: string) {
  const regex = /\-\-(?!\n)/
  return regex.test(str)
}

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
    console.log('CREATE MindsDB Client:', email)
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

  async askGPT (modelName: string, question = '', context = '') {
    const client = (containsDoubleDash(question) || containsDoubleDash(context || ''))
      ? this.webClient
      : this.client
    return await client.askGPT(
      modelName,
      question.replace(/[^\p{L}\p{N}\p{M}\p{P}\p{Z}\p{S}\n\t\r]/gu, ''),
      context.replace(/[^\p{L}\p{N}\p{M}\p{P}\p{Z}\p{S}\n\t\r]/gu, '')
    ) as { question: string, answer: string, error?: string }
  }

  async queryWithWeb (command: string) {
    return await this.webClient.query(command)
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
    ;(async () => {
      // 預熱 SQL 連接
      await sequelize.query('SELECT * FROM mindsdb.models')
    })();
    if (this.sequelize) {
      this.sequelize.close()
    }
    return this.sequelize = sequelize
  }

  async askGPT (modelName: string, question = 'Hi', context = '') {
    try {
      const sql = getSelectSql(modelName, question, context)
      // @ts-ignore
      const result = (await this.sequelize.query(
        sql,
        {
          replacements: { question, context },
          type: QueryTypes.SELECT
        }
      ))[0]
      // @ts-ignore
      if (result?.answer) {
        // @ts-ignore
        return { answer: result.answer }
      }
      return { answer: '', error: 'The source did not return a valid response.' }
    } catch (err) {
      console.log(err)
      return { answer: '', error: (err as any)?.original?.sqlMessage as string }
    }
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
      Host: 'cloud.mindsdb.com',
      Origin: 'https://cloud.mindsdb.com',
      Referer: 'https://cloud.mindsdb.com/editor',
    })
    session.post('https://cloud.mindsdb.com/cloud/login', {
      email: this.email,
      password: this.password,
      rememberMe: true
    })
    this.lastLoggedIn = Date.now()
    return this.session = session
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
        query: getSelectSql(modelName, question, context),
        context: { db: 'mindsdb' }
      })
      const data = res.data as { column_names: string[], data: string[][] }
      const answerIndex = data.column_names.indexOf('answer')
      return { answer: data.data[0][answerIndex] }
    } catch (err) {
      console.log(err)
      return { answer: '', error: 'The source did not return a valid response.' }
    }
  }

  async query (command: string) {
    const res = await this.session.post('https://cloud.mindsdb.com/api/sql/query', {
      query: command,
      context: { db: 'mindsdb' }
    })
    return res.data
  } 
}

export default MindsDBClient
