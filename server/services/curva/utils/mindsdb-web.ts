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

const getQuestionMaxLength = (modelName: string) => {
  return fixModelName(modelName).startsWith('gpt3') ? 4096 : 8192
}

const execQuery = async (modelName: string, question = 'Hi', context = '') => {
  modelName = fixModelName(modelName)
  question = question.replaceAll('\'', '`')
  context = context.replaceAll('\'', '`')
  try {
    const res = await session.post('https://cloud.mindsdb.com/api/sql/query', {
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

export {
  execQuery,
  getQuestionMaxLength,
}

let session: AxiosInstance

const login = async () => {
  session = createAxiosSession({
    'Referer': 'https://cloud.mindsdb.com/editor'
  })
  return await session.post('https://cloud.mindsdb.com/cloud/login', {
    email: process.env.EMAIL_ADDRESS as string,
    password:  process.env.PASSWORD as string,
    rememberMe: true
  })
}

login()
// Every 7 Days Login
setInterval(() => {
  login()
}, 7 * 24 * 60 * 60 * 1000)
