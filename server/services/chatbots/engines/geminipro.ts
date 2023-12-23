import FreeGptAsiaChatbotCore from './cores/FreeGPTAsia'
import formatUserCurrentTime from './utils/formatUserCurrentTime'
import type { OpenAIMessage } from './cores/types'
import { messagesToQuestionContext } from './utils/openAiMessagesConverter'
import streamManager from '~/utils/streamManager'
import type { InputContent, Part } from '@google/generative-ai'
import { GoogleGenerativeAI } from '@google/generative-ai'

const convertPartsToText = (parts: string | (Part | string)[]) => {
  if (typeof parts === 'string') return parts
  const texts: string[] = []
  for (const part of parts) {
    if (typeof part === 'string') texts.push(part)
    else texts.push(part?.text || '')
  }
  return texts.join('')
}

const geminiPro = (() => {
  // BaseUrl: https://generativelanguage.googleapis.com
  const apiKey = 'AIzaSyDfGoWenCyM53XsN-AB6dci5dpNxFR-WXg'
  const genAI = new GoogleGenerativeAI(apiKey)
  const ask = async (newMessage = 'Hi', history: InputContent[] = [], streamId?: string) => {
    const stream = (streamId === undefined ? null : streamManager.get(streamId)) || streamManager.create()
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: convertPartsToText(msg.parts),
      })),
      generationConfig: {
        maxOutputTokens: 8000,
      },
    })
    let globalError: Error | undefined = undefined
    const req = await chat.sendMessageStream(newMessage)
    try {
      while (true) {
        const chunk = await req.stream.next()
        if (chunk.done) break;
        const { candidates, promptFeedback } = chunk.value
        if (promptFeedback?.blockReason) {
          globalError = new Error(`Model refused to respond. (Ratings: ${promptFeedback.safetyRatings.map(r => `${r.probability} ${r.category}`).join(', ')})`)
          throw globalError
        }
        if (candidates === undefined) continue
        for (const candidate of candidates) {
          for (const part of candidate.content.parts) {
            stream.write(part?.text || '')
          }
        }
      }
    } catch (e) {
      stream.error()
    } finally {
      stream.end()
    }
    if (globalError) throw globalError
    return stream
  }
  return {
    ask
  }
})();

class HackedGeminiProChatbot {
  constructor () {
  }
  async ask (messages: OpenAIMessage[], options: { timezone?: number, context?: string, streamId?: string, temperature?: number } = {}) {
    const { timezone = 0, streamId, temperature } = options
    const { question = '', context = '', isContinueGenerate } = messagesToQuestionContext(messages)
    if (messages.at(-1)?.content === question) messages.pop()
    try {
      const stream = await geminiPro.ask(question, messages.map(m => ({ parts: m.content, role: m.role === 'user' ? 'user' : 'model' })), streamId)
      const answer = await new Promise<string>((resolve, reject) => {
        stream.addEventListener('end', () => resolve(stream.read()))
        stream.addEventListener('error', () => reject())
        if (stream.isError) reject()
        else if (stream.isEnd) resolve(stream.read())
      })
      return {
        answer,
        question,
        isContinueGenerate,
      }
    } catch (error) {
      return {
        answer: '',
        error: error instanceof Error ? error.message : error,
        question,
        isContinueGenerate
      }
    }
  }
}

export default HackedGeminiProChatbot
