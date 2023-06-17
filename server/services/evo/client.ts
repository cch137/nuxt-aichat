import mindsdb from '~/server/services/mindsdb'

const chatModelNames = new Set([
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

export default mindsdb.createClient(
  process.env.CHAT_MDB_EMAIL_ADDRESS as string,
  process.env.CHAT_MDB_PASSWORD as string,
  chatModelNames
)
