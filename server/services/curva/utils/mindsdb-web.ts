import type { AxiosInstance } from 'axios'
import { config } from 'dotenv'
import createAxiosSession from '~/server/services/utils/createAxiosSession'
import allowedModelNames from './allowedModelNames'
import { log as logger } from '~/server/services/mongoose/index'

config()

console.log('EMAIL:', process.env.EMAIL_ADDRESS)

const fixModelName = (modelName: string) => {
  if (allowedModelNames.has(modelName)) {
    return modelName
  }
  return 'gpt4'
}

class MindsDBWebClient {
  session: AxiosInstance | undefined
  email = ''
  password = ''
  constructor(email: string, password: string) {
    this.email = email
    this.password = password
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
    modelName = fixModelName(modelName)
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
  getQuestionMaxLength (modelName: string) {
    return fixModelName(modelName).startsWith('gpt3') ? 4096 : 8192
  }
}

export default MindsDBWebClient
