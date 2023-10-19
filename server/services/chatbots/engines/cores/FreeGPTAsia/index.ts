import axios from 'axios'
import type { ChatbotEngine, OpenAIMessage } from '../types'
import str from '~/utils/str'
import { questionContextToMessages } from '../../utils/openAiMessagesConverter'
import streamManager, { Stream } from '~/utils/streamManager'

interface ChatResponseChoice {
  index: number,
  message: { role: "user" | "assistant", content: string },
  finish_reason: string | "stop"
}

interface ChatResponseChoiceDelta {
  index: number,
  delta: { role?: "user" | "assistant", content?: string },
  finish_reason: string | "stop"
}

interface ChatResponse {
  id: string,
  object: string,
  created: number, // unit: seconds
  model: string,
  choices: ChatResponseChoice[],
  usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number}
}

interface ChatResponseChunk {
  id: string,
  object: string,
  created: number,
  model: string,
  choices: ChatResponseChoiceDelta[]
}

async function createStreamRequest (streaming: Stream, url: string, data: any, headers: Record<string,string>) {
  return await new Promise<{ answer: string, error?: string }>(async (resolve, reject) => {
    let error: any = undefined
    try {
      const res = await axios.post(url, data, {
        headers, validateStatus: (_) => true,
        responseType: 'stream'
      })
      res.data.on('data', (buf: Buffer) => {
        const chunksString = buf.toString('utf8').split('data:').map(c => c.trim()).filter(c => c)
        for (const chunkString of chunksString) {
          try {
            const chunk = JSON.parse(chunkString) as ChatResponseChunk
            const content = chunk.choices[0]?.delta?.content
            if (content === undefined) continue
            streaming.write(content)
          } catch {}
        }
      })
      res.data.on('error', (e: any) => {
        error = e
        streaming.error(e)
      })
      res.data.on('end', () => {
        const answer = streaming.read()
        if (answer) {
          streaming.end()
          resolve({ answer })
        } else {
          reject(`${error || 'Oops! Something went wrong.'}`)
        }
      })
    } catch (err) {
      reject(`${error || 'Oops! Something went wrong.'}`)
    }
  })
}

// const defaultApiHost = 'https://api.spaxe.top'
// const defaultApiKey = 'sk-rPU7CXVoZYYhvnh3r3JnbxKJAEh9ZXVerv52icrPvUFoQCOe'
// const defaultApiHost = 'https://apx.spaxe.top'
// const defaultApiKey = 'sk-nWpqLgtXfIJRPav42146Bf4374A64c359aB77e810847CcBa'
// const defaultApiHost = 'https://api.freegpt.asia'
// const defaultApiKey = 'sk-g7kBtcXIBI6ihoin7223Df33910b4aF38631204e03FdF1B1'
const defaultApiHost = 'https://chat.mikumikumi.tk'
const defaultApiKey = 'sk-GUyvmlW1WqsBLT0u5bEb6d4cEfBd4b059f41870278E3Ab9a'

class Client {
  host: string
  apiKey: string

  constructor (host = defaultApiHost, apiKey = defaultApiKey) {
    this.host = host || defaultApiHost
    this.apiKey = apiKey || defaultApiKey
  }

  async askGPT (messages: OpenAIMessage[], options: { model?: string, temperature?: number, top_p?: number, stream?: boolean, streamId?: string, maxTries?: number  } = {}) {
    const { model = '', temperature = 0.3, top_p = 0.7, stream = true, streamId, maxTries = 5 } = options
    const url = `${this.host}/v1/chat/completions`
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` }
    const _data = {
      messages,
      model,
      temperature,
      top_p,
      stream
    }
    if (!stream) {
      try {
        const data = (await axios.post(url, _data, { headers, validateStatus: (_) => true })).data as ChatResponse
        const answer = data.choices[0].message.content
        return { answer }
      } catch (err) {
        return { error: `${err}`, answer: '' }
      }
    }
    const streaming = (streamId ? streamManager.get(streamId) : 0) || streamManager.create();
    let retries = 0
    while (true) {
      try {
        return await createStreamRequest(streaming, url, _data, headers)
      } catch (err) {
        if (retries++ < maxTries) {
          console.log('GPT stream retry.', err)
          continue
        } else {
          return { error: `${err}`, answer: '' }
        }
      }
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
  async ask (questionOrMessages: string | OpenAIMessage[], options: { context?: string, model?: string, temperature?: number, top_p?: number, stream?: boolean, streamId?: string } = {}) {
    try {
      const messages = typeof questionOrMessages === 'string'
        ? questionContextToMessages(questionOrMessages, options?.context || '')
        : questionOrMessages
      const res = await this.client.askGPT(messages, options)
      try {
        return res
      } catch {
        throw str(res)
      }
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
