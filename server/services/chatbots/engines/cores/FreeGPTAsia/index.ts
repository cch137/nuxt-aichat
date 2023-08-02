import axios from 'axios'
import type { ChatbotEngine, OpenAIMessage } from '../types'
import str from '~/utils/str'
import { questionContextToMessages } from '../../utils/openAiMessagesConverter'

// const defaultApiHost = 'https://api.spaxe.top'
// const defaultApiKey = 'sk-rPU7CXVoZYYhvnh3r3JnbxKJAEh9ZXVerv52icrPvUFoQCOe'
// const defaultApiHost = 'https://apx.spaxe.top'
// const defaultApiKey = 'sk-nWpqLgtXfIJRPav42146Bf4374A64c359aB77e810847CcBa'
const defaultApiHost = 'https://api.freegpt.asia'
const defaultApiKey = 'sk-QcG4uyr8zgufaZb30067Dc6eCf3e489f9f34185aC7D63538'

class Client {
  host: string
  apiKey: string

  constructor (host = defaultApiHost, apiKey = defaultApiKey) {
    this.host = host || defaultApiHost
    this.apiKey = apiKey || defaultApiKey
  }

  async askGPT (messages: OpenAIMessage[], options: { model?: string, temperature?: number, top_p?: number, stream?: boolean } = {}) {
    const { model = 'gpt-3.5-turbo', temperature = 0.3, top_p = 0.7, stream = false} = options
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

class FreeGptAsiaChatbotCore implements ChatbotEngine {
  client: Client
  constructor (options: {host?: string, apiKey?: string} = {}) {
    const { host, apiKey } = options
    this.client = new Client(host, apiKey)
  }
  init() {
    return new Promise<true>((r) =>r(true))
  }
  async ask (questionOrMessages: string | OpenAIMessage[], options: { context?: string, model?: string, temperature?: number, top_p?: number, stream?: boolean } = {}) {
    try {
      const messages = typeof questionOrMessages === 'string'
        ? questionContextToMessages(questionOrMessages, options?.context || '')
        : questionOrMessages
      const res = (await this.client.askGPT(messages, options))
      const answer = res.choices[0].message.content
      return { answer }
    } catch (err) {
      return { answer: '', error: str(err) }
    }
  }
  setup () {}
  kill () {}
}

// MODELS:
// gpt-3.5-turbo
// claude-2-web

export default FreeGptAsiaChatbotCore
export type { FreeGptAsiaChatbotCore }
