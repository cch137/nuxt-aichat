import MindsDbGPTChatbotEngine from './engines/MindsdbGPT'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import search from '../webBrowsing/search'
import crawl from '../webBrowsing/crawl'
import type { WebCrawlerResult } from '../webBrowsing/crawl'

async function estimateQueriesAndUrls (engine: MindsDbGPTChatbotEngine, question: string, options: {timezone?: number } = {}) {
  const { timezone = 0 } = options
  const prompt = `User curent time: ${formatUserCurrentTime(timezone)}
Your user need to know: ${question}
Please list a few phrases (up to 8) that you need to use the search engine to query. Keep number of phases as small as possible (about 3). If the user input is not in English, make sure those phrases cover both languages.
Also, provide the URLs that appear in the user prompt (if any).
Think of yourself as an API, do not make other descriptions, just reply a JSON: { queries: string[], urls: string[] }`
  const answer = (await engine.ask(prompt, { modelName: 'gpt3_t00_3072', context: '' })).answer || '{}'
  try {
    return JSON.parse(answer.substring(answer.indexOf('{'), answer.lastIndexOf('}') + 1)) as { queries: string[], urls: string[] }
  } catch {
    return { queries: [], urls: [] }
  }
}

function calculateAlphanumericLength(text: string) {
  const regex = /[\p{L}\p{N}]/gu
  const matches = text.match(regex)
  const length = matches ? matches.length : 0
  return length
}

function chunkParagraphs (article: string, chunkMaxLength = 2000) {
  const lines = article.split('\n')
  let temp = 0
  const chunks: string [] = []
  for (const line of lines) {
    if (temp + )
  }
}

async function summaryPage (engine: MindsDbGPTChatbotEngine, question: string, result: WebCrawlerResult, options: {timezone?: number } = {}) {
  const { timezone = 0 } = options
  const prompt = `User curent time: ${formatUserCurrentTime(timezone)}
Your user need to know: ${question}
There is no need to answer the question, you just need to summarize useful information from the following content to the question.
Ensure overall coherence and consistency of the responses, and provide clear conclusions.
Content is sourced from webpages, and only summarize the articles, disregarding potential navigation bars, advertisements, and other non-relevant information.
Use the language of the webpage for summarization.
Here is the webpage:
${result.markdown}`
  engine.ask(prompt, { modelName: 'gpt3_t00_3072' })
}

class GptWeb2Chatbot {
  engine: MindsDbGPTChatbotEngine
  constructor (options: { email: string, password: string }) {
    this.engine = new MindsDbGPTChatbotEngine(options)
  }
  async ask (question: string, options: { timezone?: number } = {}) {
    const { queries, urls } = await estimateQueriesAndUrls(this.engine, question, options)
    const queriesSummary = (await search(...queries)).summary()
    const pages1 = urls.map(async (url) => summaryPage(this.engine, crawl(url)))
  }
}
