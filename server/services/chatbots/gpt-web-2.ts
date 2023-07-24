import type { MindsDbGPTChatbotEngine } from './engines/MindsdbGPT'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import search from '../webBrowsing/search'
import crawl from '../webBrowsing/crawl'
import type { WebCrawlerResult } from '../webBrowsing/crawl'
import estimateTokens from './utils/estimateTokens'

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

function chunkParagraphs (article: string, chunkMaxTokens = 2000) {
  const lines = article.split('\n')
  let cursorChunkLength = 0, cursorIndex = 0
  const chunks: string [] = []
  lines.forEach((line, index, array) => {
    const lineTokens = estimateTokens(line)
    cursorChunkLength += lineTokens
    if (cursorChunkLength > chunkMaxTokens) {
      chunks.push(array.slice(cursorIndex, cursorIndex = index).join('\n'))
      cursorChunkLength = lineTokens
    }
  })
  if (cursorChunkLength > 0) {
    chunks.push(lines.slice(cursorIndex, lines.length).join('\n'))
  }
  return chunks
}

async function summaryArticle (engine: MindsDbGPTChatbotEngine, question: string, article: string, options: {timezone?: number, maxTries?: number } = {}): Promise<string> {
  const { timezone = 0, maxTries = 8 } = options
  const chunks = chunkParagraphs(article, 2500)
  const summary = (await Promise.all(chunks.map(async (chunk) => {
    const prompt = `User curent time: ${formatUserCurrentTime(timezone)}
Your user need to know: ${question}
There is no need to answer the question, you just need to summarize useful information from the following content to the question.
Ensure overall coherence and consistency of the responses, and provide clear conclusions.
Content is sourced from webpages, and only summarize the articles, disregarding potential navigation bars, advertisements, and other non-relevant information.
Use the language of the webpage for summarization.
Here is the webpage:
${chunk}`
    return await engine.ask(prompt, { modelName: 'gpt3_t00_3072' })
  }))).join('\n')
  if (estimateTokens(summary) > 6000) {
    return await summaryArticle(engine, question, summary, options)
  }
  return summary
}

class GptWeb2Chatbot {
  engine: MindsDbGPTChatbotEngine
  constructor (engine: MindsDbGPTChatbotEngine) {
    this.engine = engine
  }
  async ask (question: string, options: { timezone?: number } = {}) {
    const { queries, urls } = await estimateQueriesAndUrls(this.engine, question, options)
    const queriesSummary = (await search(...queries)).summary()
    const pages1 = urls.map(async (url) => summaryArticle(this.engine, crawl(url)))
  }
}
