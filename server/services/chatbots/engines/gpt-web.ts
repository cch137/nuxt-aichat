import type { MindsDbGPTChatbotCore } from './cores/MindsdbGPT'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import search from '../../webBrowsing/search'
import crawl from '../../webBrowsing/crawl'
import type { WebSearcherResult } from '../../webBrowsing/search'
import estimateTokens from './utils/estimateTokens'
import sleep from '~/utils/sleep'
import type { OpenAIMessage } from './cores/types'
import { messagesToQuestionContext } from './utils/openAiMessagesConverter'

function parseObjectFromText (text: string, startChar = '{', endChar = '}') {
  text = `${text.includes(startChar) ? '' : startChar}${text}${text.includes('}') ? '' : '}'}`
  try {
    return JSON.parse(text.substring(text.indexOf(startChar), text.lastIndexOf(endChar) + 1))
  } catch {
    return JSON.parse(`${startChar}${endChar}`)
  }
}

async function estimateQueriesAndUrls (engine: MindsDbGPTChatbotCore, question: string, options: { time?: string, context?: string } = {}) {
  const { time = formatUserCurrentTime(0) } = options
  question = `你是一個 API，回复格式只能是 JSON，嚴禁作出其它註解。
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
當你決定提供 "answer" 時，並且 "queries" 和 "urls" 必須是空 array，因此嚴禁對需要聯網訪問的問題提供 "answer"，以避免提供過時資訊。
請注意，你僅限使用 "question" 的語言進行回答，不一定是中文，嚴禁在 "answer" 使用不是 "question" 的語言。
再次提醒，你是一個 API，回复格式只能是 JSON，嚴禁作出其它註解。
回复的格式: { "queries": string[], "urls": string[], "answer"?: string }
當前時間: ${time}
---
question: ${question}
`
  let _answer = (await engine.ask(question, { modelName: 'gpt4_t00_7k', context: options.context })).answer || '{}'
  try {
    const { queries = [], urls = [], answer = '' } = parseObjectFromText(_answer, '{', '}') as { queries?: string[], urls?: string[], answer?: null | string }
    return { queries, urls, answer: answer ? `${answer}` : '' }
  } catch {
    return { queries: [], urls: [], answer: '' }
  }
}

function chunkParagraphs (article: string, modelName = '', chunkMaxTokens = 2000) {
  const lines = article.split('\n')
  let cursorChunkLength = 0, cursorIndex = 0
  const chunks: string [] = []
  lines.forEach((line, index, array) => {
    const lineTokens = estimateTokens(modelName, line)
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
  const chunks = chunkParagraphs(article, options.modelName, chunkMaxTokens)
  const summary = (await Promise.all(chunks.map(async (chunk) => {
  const prompt = `
Summarizes information relevant to the question from the following content.
Organize your responses appropriately into an article or notes.
Content is sourced from webpages, completely ignore content not related to the question.
Summarization in a language other than the web page is prohibited.
User curent time: ${time}
Question: ${question}
Webpage:
${chunk}`
    return (await engine.ask(prompt, { modelName })).answer
  }))).join('\n')
  if (estimateTokens(modelName, summary) > summaryMaxTokens && maxTries > 1) {
    return await summaryArticle(engine, question, summary, { ...options, maxTries: maxTries - 1 })
  }
  return summary
}

async function selectPages (engine: MindsDbGPTChatbotCore, question: string, result: WebSearcherResult, options: { time?: string, modelName?: string } = {}) {
  const { time = formatUserCurrentTime(0), modelName = 'gpt4_t00_7k' } = options
  question = `你是一個 API，回复格式只能是 JSON，嚴禁作出其它註解。
回复的格式: { "selectedUrls"?: string[], "answer"?: string }
你的用戶使用搜索引擎找到了一些網頁，請分析搜索引擎結果。
如果你認為搜索引擎所提供的結果已經能夠讓你全面和準確地回答，請在 "answer" 寫入你的答案並直接回傳。
如果你認為你需要訪問網頁才能作出全面的回答，請在 "selectedUrls" 提供你想要訪問的網站（盡量少於 3 個，上限為 5 個）。
請注意，你只能選擇提供 "selectedUrls" 或 "answer" 其中一個值，嚴禁同時提供二者。
因此，僅在參考資料充足時提供 "answer"，以避免錯誤或過時資訊。
用戶可能會使用不同語言搜索，如果你需要選擇網頁，不一定要選擇與用戶語言相同的網頁，你只要確保網頁的內容對問題的解答有用即可。
如果你選擇直接回答用戶問題，嚴禁摘抄搜索引擎結果中的網頁簡介，請根據你的知識以及搜索引擎結果，在經過總結後回答用戶的問題，以用戶問題中使用的語言進行回答。
再次提醒，你是一個 API，回复格式只能是 JSON，嚴禁作出其它註解。
回复的格式: { "selectedUrls"?: string[], "answer"?: string }
當前時間: ${time}
---
question: ${question}
---
search results:

${result.summary(true)}`
  return parseObjectFromText((await engine.ask(question, { modelName })).answer, '{', '}') as { selectedUrls: string[], answer?: string }
}

class GptWebChatbot {
  core: MindsDbGPTChatbotCore
  constructor (core: MindsDbGPTChatbotCore) {
    this.core = core
  }
  async ask (messages: OpenAIMessage[], options: { timezone?: number, time?: string } = {}): Promise<{ question: string, answer: string, queries?: string[], urls?: string[], isContinueGenerate: boolean, error?: string }> {
    const { question, context, isContinueGenerate } = messagesToQuestionContext(messages)
    options = { ...options, time: formatUserCurrentTime(options.timezone || 0) }
    let { queries = [], urls = [], answer: answer1 = '' } = await estimateQueriesAndUrls(this.core, question, { ...options, context })
    if (queries.length === 0 && urls.length === 0 && answer1 !== '') {
      return { question, queries, urls, answer: answer1, isContinueGenerate }
    }
    const crawledPages1 = Promise.all(urls.map(async (url) => await summaryArticle(this.core, question, (await crawl(url)).markdown)))
    let isDirectAnswerInWhenSelectPages = false
    const crawledPages2 = queries.length ? (async () => {
      const searcherResult = await search(...queries)
      const { selectedUrls = [], answer = '' } = await selectPages(this.core, question, searcherResult)
      if (answer) {
        isDirectAnswerInWhenSelectPages = true
        return [answer]
      }
      urls.push(...selectedUrls)
      const tasks = selectedUrls.map(async (url) => await summaryArticle(this.core, question, (await crawl(url)).markdown))
      const queriesSummary = `${answer1 ? answer1 + '\n\n' : ''}${searcherResult.summary()}`
      tasks.unshift(summaryArticle(this.core, question, queriesSummary))
      return await Promise.all(tasks)
    })() : Promise.all([new Promise<string>((r) => r(''))])
    if (isDirectAnswerInWhenSelectPages && queries.length && urls.length === 0) {
      return { question, queries, answer: (await crawledPages2)[0], isContinueGenerate }
    }
    let summary = (await Promise.all([
      ...await crawledPages1,
      ...await crawledPages2
    ])).join('\n---\n')
    let tries = 2
    while (estimateTokens('gpt-4', summary) > 5000 && tries-- > 0) {
      summary = await summaryArticle(this.core, question, summary)
    }
    const prompt = `Use references where possible and answer in detail.
Organize your responses appropriately into an article or notes.
Ensure that the release time of news is relevant to the responses, avoiding outdated information.
User current time: ${options.time}
Question: ${question}

References:
${summary}`
    const result = await this.core.ask(prompt, { modelName: 'gpt4_t00_6k', context })
    return {
      question,
      queries,
      urls,
      answer: result.answer,
      error: result.error,
      isContinueGenerate,
    }
  }
}

export default GptWebChatbot
export { summaryArticle }
