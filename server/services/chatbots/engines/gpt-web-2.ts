import type { MindsDbGPTChatbotCore } from './cores/MindsdbGPT'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import search from '../../webBrowsing/search'
import crawl from '../../webBrowsing/crawl'
import type { WebSearcherResult } from '../../webBrowsing/search'
import estimateTokens from './utils/estimateTokens'

function parseObjectFromText (text: string, startChar = '{', endChar = '}') {
  try {
    return JSON.parse(text.substring(text.indexOf(startChar), text.lastIndexOf(endChar) + 1))
  } catch {
    return JSON.parse(`${startChar}${endChar}`)
  }
}

async function estimateQueriesAndUrls (engine: MindsDbGPTChatbotCore, question: string, options: { time?: string } = {}) {
  const { time = formatUserCurrentTime(0) } = options
  const prompt = `User curent time: ${time}
Your user need to know: ${question}
Please list a few phrases (up to 5) that you need to use the search engine to query.
Keep number of phases as small as possible (about 3).
If the user input is not in English, make sure those phrases cover both languages.
Also, provide the URLs that appear in the user prompt (if any).
Think of yourself as an API, do not make other descriptions, just reply a JSON: { queries: string[], urls: string[] }`
  const answer = (await engine.ask(prompt, { modelName: 'gpt3_t00_3k', context: '' })).answer || '{}'
  try {
    return parseObjectFromText(answer, '{', '}') as { queries: string[], urls: string[] }
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

async function summaryArticle (engine: MindsDbGPTChatbotCore, question: string, article: string, options: { time?: string, maxTries?: number, chunkMaxTokens?: number, summaryMaxTokens?: number, modelName?: string } = {}): Promise<string> {
  const { time = formatUserCurrentTime(0), maxTries = 3, chunkMaxTokens = 2500, summaryMaxTokens = 5700, modelName = 'gpt3_t00_3k' } = options
  const chunks = chunkParagraphs(article, chunkMaxTokens)
  const summary = (await Promise.all(chunks.map(async (chunk) => {
    const prompt = `
Summarizes information relevant to the question from the following content.
Ensure overall coherence and consistency of the responses, and provide clear conclusions.
Content is sourced from webpages, completely ignore content not related to the question.
Summarization in a language other than the web page is prohibited.
User curent time: ${time}
Question: ${question}
Webpage:
${chunk}`
    return await engine.ask(prompt, { modelName })
  }))).join('\n')
  if (estimateTokens(summary) > summaryMaxTokens && maxTries > 1) {
    return await summaryArticle(engine, question, summary, { ...options, maxTries: maxTries - 1 })
  }
  return summary
}

async function selectPages (engine: MindsDbGPTChatbotCore, question: string, result: WebSearcherResult, options: { time?: string, modelName?: string } = {}) {
  const { time = formatUserCurrentTime(0), modelName = 'gpt4_t00_7k' } = options
  const prompt = `
Please select some pages (up to 8) from the search engine results that can help you answer your question.
Keep number of pages as small as possible (about 3).
If it is impossible to determine from the description of website whether it contains useful information, do not choose that website.
Pay attention to the release time and avoid outdated information.
Language is not limited.
Think of yourself as an API, do not make other descriptions, just reply a JSON array.
Each element in the array should be an object with two properties: "url" (string) and "title" (string).
User current time: ${time}
Question: ${question}
Search engine results:
${result.summary(true)}`
  return parseObjectFromText((await engine.ask(prompt, { modelName })).answer, '[', ']') as { url: string, title: string }[]
}

class GptWeb2Chatbot {
  engine: MindsDbGPTChatbotCore
  constructor (engine: MindsDbGPTChatbotCore) {
    this.engine = engine
  }
  async ask (question: string, options: { timezone?: number, time?: string } = {}) {
    options = { ...options, time: formatUserCurrentTime(options.timezone || 0) }
    let { queries = [], urls = [] } = await estimateQueriesAndUrls(this.engine, question, options)
    const crawledPages1 = Promise.all(urls.map((url) => crawl(url)))
    const searcherResult = await search(...queries)
    const selectedPages = await selectPages(this.engine, question, searcherResult)
    urls.push(...selectedPages.map((page) => page.url))
    const crawledPages2 = Promise.all(selectedPages.map((page) => crawl(page.url)))
    const queriesSummary = searcherResult.summary()
    const summary = await summaryArticle(this.engine, question, [
      queriesSummary,
      ...(await crawledPages1).map((page) => page.markdown),
      ...(await crawledPages2).map((page) => page.markdown)
    ].join('\n---\n'))
    const prompt = `
Use references where possible and answer in detail.
Ensure the overall coherence and consistency of the responses.
Ensure that the release time of news is relevant to the responses, avoiding outdated information.
User current time: ${options.time}
Question: ${question}

References:
${summary}`
    return {
      queries,
      urls,
      ...this.engine.ask(prompt, { modelName: 'gpt4_t00_6k' }),
    }
  }
}

export default GptWeb2Chatbot
export { summaryArticle }
