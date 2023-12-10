import FreeGptAsiaChatbotCore from './cores/FreeGPTAsia'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import type { OpenAIMessage } from './cores/types'
import { messagesToQuestionContext } from './utils/openAiMessagesConverter'

function parseObjectFromText(text: string, startChar = '{', endChar = '}') {
  text = `${text.includes(startChar) ? '' : startChar}${text}${text.includes('}') ? '' : '}'}`
  try {
    return JSON.parse(text.substring(text.indexOf(startChar), text.lastIndexOf(endChar) + 1))
  } catch {
    return JSON.parse(`${startChar}${endChar}`)
  }
}

function getSearchPhrasesPrompt(question: string, context: string): OpenAIMessage[] {
  return [
    {
      role: "system",
      content: context
    },
    {
      role: 'user',
      content: `Please generate 0 to 3 search phrases related to the following query.
      We will use these search phrases to search for information in search engines and databases to provide the user with an answer.
      The search phrases must be independent of each other and meaningful for the answer.
      If no search is needed for the query, please return an empty array.
      Please reply only in JSON format ({"queries": str[]}):
      
      "${question}"
      `
    },
  ]
}

class Gpt4FgaWebChatbot {
  core: FreeGptAsiaChatbotCore
  constructor (core?: FreeGptAsiaChatbotCore) {
    this.core = core || new FreeGptAsiaChatbotCore()
  }
  async ask (messages: OpenAIMessage[], options: { timezone?: number, context?: string, streamId?: string, temperature?: number } = {}) {
    const { timezone = 0, streamId, temperature } = options
    const { question = '', context = '', isContinueGenerate } = messagesToQuestionContext(messages)
    const searchPhrasesRes = await this.core.ask(getSearchPhrasesPrompt(question, context), { model: 'gpt-3.5-turbo', temperature: 0 })
    const queries: string[] = parseObjectFromText(searchPhrasesRes?.answer || '{}')?.queries || []
    return {
      ...await this.core.ask(messages, { model: 'gpt-4', streamId, temperature }),
      question,
      isContinueGenerate,
    }
  }
}

export default Gpt4FgaWebChatbot
