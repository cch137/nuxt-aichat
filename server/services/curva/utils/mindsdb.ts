import type { AxiosInstance } from 'axios'
import { config } from 'dotenv'
import createAxiosSession from '~/server/services/utils/createAxiosSession'
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

const allowedModelNames = new Set([
  'gpt4',
  'gpt4_t00',
  'gpt4_t01',
  'gpt4_t02',
  'gpt4_t03',
  'gpt4_t04',
  'gpt4_t05',
  'gpt4_t06',
  'gpt4_t07',
  'gpt4_t08',
  'gpt4_t09',
  'gpt4_t10',
  'gpt3',
  'gpt3_t00',
  'gpt3_t01',
  'gpt3_t02',
  'gpt3_t03',
  'gpt3_t04',
  'gpt3_t05',
  'gpt3_t06',
  'gpt3_t07',
  'gpt3_t08',
  'gpt3_t09',
  'gpt3_t10',
  'gpt4_summarizer',
  'gpt4_mixer'
])

let session: AxiosInstance

const login = () => {
  session = createAxiosSession({
    'Referer': 'https://cloud.mindsdb.com'
  })
  session.post('https://cloud.mindsdb.com/cloud/login', {
    email: '137emailservice@gmail.com',
    password: 'Curva&&cch137',
    rememberMe: true
  })
}

login()
// Every 7 Days Login
setInterval(() => {
  login()
}, 7 * 24 * 60 * 60 * 1000)
