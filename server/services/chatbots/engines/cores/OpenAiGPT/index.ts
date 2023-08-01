import axios from 'axios'
import { ChatbotEngine } from '../types'
import str from '~/utils/str'

const defaultApiHost = 'https://api.spaxe.top'
const defaultApiKey = 'sk-rPU7CXVoZYYhvnh3r3JnbxKJAEh9ZXVerv52icrPvUFoQCOe'

class Client {
  host: string
  apiKey: string

  constructor (host = defaultApiHost, apiKey = defaultApiKey) {
    this.host = host || defaultApiHost
    this.apiKey = apiKey || defaultApiKey
  }

  async askGPT (messages: ({ role: 'user' | 'assistant', content: string })[], model = 'gpt-3.5-turbo', temperature = 0.3, top_p = 0.7, stream = false) {
    const url = `${this.host}/v1/chat/completions`
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    headers['Authorization'] = `Bearer ${this.apiKey}`
    const data = {
      messages,
      model,
      temperature,
      top_p,
      stream
    }
    // created unit: seconds
    return (await axios.post(url, data, { headers, validateStatus: (_) => true })).data as {
      id: string,
      object: string,
      created: number,
      model: string,
      choices:[{ index: number, message: { role: "user" | "assistant", content: string }, finish_reason: string | "stop"}],
      usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number}
    }
  }
}

class OpenAiGPTChatbotCore implements ChatbotEngine {
  client: Client
  constructor (host?: string, apiKey?: string) {
    this.client = new Client(host, apiKey)
  }
  init() {
    return new Promise<true>((r) =>r(true))
  }
  async ask (question: string, options: Record<string, any>) {
    try {
      const res = (await this.client.askGPT([{ role: 'user', content: question }]))
      const answer = res.choices[0].message.content
      return { answer }
    } catch (err) {
      return { answer: '', error: str(err) }
    }
  }
  setup () {}
  kill () {}
}

export default OpenAiGPTChatbotCore
