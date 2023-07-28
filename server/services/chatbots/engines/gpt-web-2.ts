import type { MindsDbGPTChatbotCore } from './cores/MindsdbGPT'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import search from '../../webBrowsing/search'
import crawl from '../../webBrowsing/crawl'
import type { WebSearcherResult } from '../../webBrowsing/search'
import estimateTokens from './utils/estimateTokens'
import sleep from '~/utils/sleep'

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
User prompt: ${question}
Think of yourself as an API, do not make other descriptions, just reply a JSON: { queries: string[], urls: string[] }
"queries" must be phrases. "urls" must be URLs.
You will search for "queries" in the search engine and visit the web pages in the "urls."
List a few phrases that you need to use the search engine to query.
Keep number of phases as small as possible (about 3, up to 5).
If the user input is not in English, make sure those phrases cover both languages.
The search engine will provide more optional URLs instead of serving as a source of available information.
Thus, searching for tasks you have been assigned, such as "Summarize http://example.com" or "Provide the weather for today", is prohibited.
Note also that only provide the URLs that appear in the user prompt.
`
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

let lastSummaryArticle = 0

async function summaryArticle (engine: MindsDbGPTChatbotCore, question: string, article: string, options: { time?: string, maxTries?: number, chunkMaxTokens?: number, summaryMaxTokens?: number, modelName?: string } = {}): Promise<string> {
  const now = Date.now()
  if (now - lastSummaryArticle < 500) {
    return await new Promise(async (resolve, reject) => {
      try {
        await sleep(Math.random() * 1000)
        resolve(await summaryArticle(engine, question, article, options))
      } catch (err) {
        reject(err)
      }
    })
  }
  const { time = formatUserCurrentTime(0), maxTries = 3, chunkMaxTokens = 5000, summaryMaxTokens = 5000, modelName = 'gpt4_t00_6k' } = options
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
    return (await engine.ask(prompt, { modelName })).answer
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
  core: MindsDbGPTChatbotCore
  constructor (core: MindsDbGPTChatbotCore) {
    this.core = core
  }
  async ask (question: string, options: { timezone?: number, time?: string } = {}) {
    options = { ...options, time: formatUserCurrentTime(options.timezone || 0) }
    let { queries = [], urls = [] } = await estimateQueriesAndUrls(this.core, question, options)
    const crawledPages1 = Promise.all(urls.map(async (url) => await summaryArticle(this.core, question, (await crawl(url)).markdown)))
    const searcherResult = await search(...queries)
    const selectedPages = await selectPages(this.core, question, searcherResult)
    urls.push(...selectedPages.map((page) => page.url))
    const crawledPages2 = Promise.all(selectedPages.map(async (page) => await summaryArticle(this.core, question, (await crawl(page.url)).markdown)))
    const queriesSummary = searcherResult.summary()
    let summary = (await Promise.all([
      summaryArticle(this.core, question, queriesSummary),
      ...await crawledPages1,
      ...await crawledPages2
    ])).join('\n---\n')
    let tries = 3
    while (estimateTokens(summary) > 5000 && tries-- > 0) {
      summary = await summaryArticle(this.core, question, summary)
    }
    const prompt = `
Use references where possible and answer in detail.
Ensure the overall coherence and consistency of the responses.
Ensure that the release time of news is relevant to the responses, avoiding outdated information.
User current time: ${options.time}
Question: ${question}

References:
${summary}`
    const result = await this.core.ask(prompt, { modelName: 'gpt4_t00_6k' })
    return {
      queries,
      urls,
      answer: result.answer,
      error: result.error
    }
  }
}

export default GptWeb2Chatbot
export { summaryArticle }
