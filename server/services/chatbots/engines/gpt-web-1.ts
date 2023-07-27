import type { MindsDbGPTChatbotCore } from './cores/MindsdbGPT'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import search from '../../webBrowsing/search'
import crawl from '../../webBrowsing/crawl'
import estimateTokens from './utils/estimateTokens'
import extractUrls from '~/utils/extractURLs'
import { summaryArticle } from './gpt-web-2'

class GptWeb1Chatbot {
  core: MindsDbGPTChatbotCore
  constructor (core: MindsDbGPTChatbotCore) {
    this.core= core
  }
  async ask (question: string, options: { timezone?: number, time?: string } = {}) {
    options = { ...options, time: formatUserCurrentTime(options.timezone || 0) }
    const queries = [question.replace(/\s+/g, ' ').trim()]
    const urls = extractUrls(question)
    const crawledPages1 = Promise.all(urls.map((url) => crawl(url)))
    const references = [
      (await search(...queries)).summary(),
      ...(await crawledPages1).map((page) => page.markdown)
    ].join('\n---\n')
    const prompt = `
Use references where possible and answer in detail.
Ensure the overall coherence and consistency of the responses.
Ensure that the release time of news is relevant to the responses, avoiding outdated information.
User current time: ${options.time}
Question: ${question}

References:
${estimateTokens(references) > 5700 ? await summaryArticle(this.core, question, references) : references}`
    const result = await this.core.ask(prompt, { modelName: 'gpt4_t00_6k' })
    return {
      queries,
      urls,
      answer: result.answer,
      error: result.error
    }
  }
}

export default GptWeb1Chatbot
