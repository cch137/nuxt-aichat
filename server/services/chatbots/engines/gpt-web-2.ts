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
  const prompt = `你是一個 API，回复格式只能是 JSON，嚴禁作出其它註解。
回复的格式: { "queries": string[], "urls": string[], "answer"?: string }
你的用戶被分配了一個任務。
請根據文末的 "question" 預測用戶行為，"question" 正是用戶被指派的任務。
你並沒有被強制找出 "queries" 或 "urls"。若某個鍵無可用內容，該鍵的值可以是空 array。
如果用戶有可能使用搜索引擎，請預測用戶需要搜索的 "queries" （盡量少於 3 個，上限為 5 個）。
請注意，"queries" 中的每個項目需要進行完善和到位的描述，以避免搜索結果不准確。
請注意，用戶將通過 "queries" 搜索資訊並根據資訊進行決策，因此用戶不會進行“他們應該進行什麼決策”或“某網址的總結”這一類的搜索。
由於用戶需要保證信息來源是國際化的，用戶會使用不同語言搜索，"queries" 中必須同時擁有英文和用戶語言（"question" 所使用的語言）的項目。
如果用戶需要訪問網址，請在 "urls" 列出 "用戶 question" 中指定的所有網址，嚴禁在 "urls" 列出不是由 "question" 中指定需要訪問的網址。
請注意，"queries" 不提供總結也無法找到指定網址，如果任務描述有網址，請優先放入 "urls" 而不是 "queries"。
由於用戶會訪問 "urls" 中的網址，因此嚴禁在 "queries" 列出任何形式的網址。
由於用戶僅會搜索文章和新聞，因此嚴禁在 "queries" 中描述用戶需要進行的任務。
請注意，由於任務會在下一次對話時被再次提及，因此不要在 "queries" 中以任何形式描述用戶的任務。
請注意，"answer" 是可選項，你不需要總是提供 "answer"，僅在用戶任務不需要聯網就能完成時提供。
在 "answer" 回答過的問題不再需要被搜索，嚴禁在沒有相關答案或最新資訊時提供 "answer"。
當你決定提供 "answer" 時，"queries" 和 "urls" 必須是空 array，因此嚴禁對需要聯網訪問的問題提供 "answer"，以避免提供過時資訊。
再次提醒，你是一個 API，回复格式只能是 JSON，嚴禁作出其它註解。
回复的格式: { "queries": string[], "urls": string[], "answer"?: string }
當前時間: ${time}
---
question: ${question}
`
  let _answer = (await engine.ask(prompt, { modelName: 'gpt4_t00_7k', context: '' })).answer || '{}'
  _answer = `${_answer.includes('{') ? '' : '{'}${_answer}${_answer.includes('}') ? '' : '}'}`
  try {
    const { queries = [], urls = [], answer = '' } = parseObjectFromText(_answer, '{', '}') as { queries?: string[], urls?: string[], answer?: null | string }
    return { queries, urls, answer: answer ? `${answer}` : '' }
  } catch {
    return { queries: [], urls: [], answer: '' }
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
  if (!article) {
    return ''
  }
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
  lastSummaryArticle = now
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
    let { queries = [], urls = [], answer: answer1 = '' } = await estimateQueriesAndUrls(this.core, question, options)
    if (queries.length === 0 && urls.length === 0 && answer1 !== '') {
      return { queries, urls, answer: answer1 }
    }
    const crawledPages1 = Promise.all(urls.map(async (url) => await summaryArticle(this.core, question, (await crawl(url)).markdown)))
    const crawledPages2 = queries.length ? (async () => {
      const searcherResult = await search(...queries)
      const selectedPages = await selectPages(this.core, question, searcherResult)
      urls.push(...selectedPages.map((page) => page.url))
      const tasks = selectedPages.map(async (page) => await summaryArticle(this.core, question, (await crawl(page.url)).markdown))
      const queriesSummary = `${answer1 ? answer1 + '\n\n' : ''}${searcherResult.summary()}`
      tasks.unshift(summaryArticle(this.core, question, queriesSummary))
      return await Promise.all(tasks)
    })() : Promise.all([new Promise<string>((r) => r(''))])
    let summary = (await Promise.all([
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
