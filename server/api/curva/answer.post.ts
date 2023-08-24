import { readBody } from 'h3'
import { parse as parseCookie } from 'cookie'
import iplocation from 'iplocation'
import { version } from '~/config/server'
import { log as logger } from '~/server/services/mongoose/index'
import { read as tokenReader } from '~/server/services/token'
import curva from '~/server/services/chatbots/curva'
import getIp from '~/server/services/getIp'
import str from '~/utils/str'
import { hx as createHash } from '~/utils/troll'
import baseConverter from '~/utils/baseConverter'
import estimateTokens from '~/server/services/chatbots/engines/utils/estimateTokens'
import type { OpenAIMessage } from '~/server/services/chatbots/engines/cores/types'
import type { CurvaStandardResponse } from '~/server/services/chatbots/curva/types'
import { messagesToQuestionContext } from '~/server/services/chatbots/engines/utils/openAiMessagesConverter'
import RateLimiter from '~/server/services/rate-limiter'

const rateLimiterBundler = RateLimiter.bundle([
  // Every 1 minutes 10 times
  new RateLimiter(10, 1 * 60 * 1000),
  // Every 1*60 minutes 100 times
  new RateLimiter(100, 1 * 3600 * 1000),
  // Every 4*60 minutes 200 times
  new RateLimiter(200, 4 * 3600 * 1000),
  // Every 24*60 minutes 500 times
  new RateLimiter(500, 24 * 3600 * 1000),
])

const bannedPrompt = /提示词生成/;
const bannedIpSet = new Set<string>([
  '81.169.221.94', '212.53.217.119', '95.180.183.152', '209.79.65.132', '144.49.99.214',
  '190.110.35.227', '147.124.215.199', '144.49.99.170',
  '106.40.15.110', '36.102.154.131', '123.178.34.190', '123.178.40.253'
]);
const isZuki = (prompt: string) => {
  return prompt.toUpperCase().includes('ONLY SAY HELLO')
}

export default defineEventHandler(async (event) => {
  if (!rateLimiterBundler.check(getIp(event.node.req))) {
    return { error: rateLimiterBundler.getHint(getIp(event.node.req)) }
  }
  const now = Date.now()
  const body = await readBody(event)
  if (!body) {
    return { error: 'CH4 API ERROR 01' }
  }
  const { conv, messages = [], model, temperature, t, tz = 0, id } = body
  if (t > now + 300000 || t < now - 300000) {
    // 拒絕請求：時差大於 5 分鐘
    return { error: 'CH4 API ERROR 12', id }
  }
  const _id = id ? baseConverter.convert(id, '64', 16) : id
  if (!conv || messages?.length < 1 || !model || !t) {
    return { error: 'CH4 API ERROR 11', id }
  }
  const stdHash = createHash(messages, 'MD5', t)
  const hashFromClient = event?.node?.req?.headers?.hash
  const timestamp = Number(event?.node?.req?.headers?.timestamp)
  // Validate hash and timestamp
  if (stdHash !== hashFromClient || timestamp !== t) {
    return { error: 'CH4 API ERROR 32', id }
  }
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const uid = token?.uid
  // Validate token
  if (token === null || typeof uid !== 'string') {
    return { error: 'CH4 API ERROR 31', id }
  }
  const ip = getIp(event.node.req)
  if ([...bannedIpSet].find((_ip) => ip.includes(_ip))) {
    return { answer: 'Hello.' }
    // return { error: 'Your actions are considered to be abusive.', id }
  }
  const qqq = messagesToQuestionContext(messages).question
  if (isZuki(qqq)) {
    console.log('Hello.', ip, event.node.req.headers)
    bannedIpSet.add(ip)
    console.log([...bannedIpSet])
    return { answer: 'Hello.' }
    // return { error: 'Your actions are considered to be abusive.', id }
  }
  if (bannedPrompt.test(qqq)) {
    return { error: 'Your actions are considered to be abusive.', id }
  }
  try {
    const croppedMessages = (() => {
      let _messages = messages as OpenAIMessage[]
      const maxTokens = model === 'gpt4'
        ? 6000
        : model.startsWith('gpt3')
          ? 3000
          : model === 'gpt-web'
            ? 4000
            : model === 'claude-2-web'
              ? 80000
              : 4000
      while (estimateTokens(JSON.stringify(_messages)) > maxTokens && _messages.length > 1) {
        _messages.shift()
      }
      return _messages
    })()
    const response = await curva.ask(ip, uid, conv, model, temperature, croppedMessages, tz, _id)
    //@ts-ignore
    response.id = typeof response.id === 'string'
    //@ts-ignore
      ? baseConverter.convert(response.id, 16, '64w')
      : id
    if ((response as any)?.error) {
      console.error((response as any)?.error)
    }
    console.log(ip, uid, conv, '|', [...rateLimiterBundler].map((r) => `(${r.total}/${r.frequencyMin})`).join(' '))
    return { version, ...response } as CurvaStandardResponse
  } catch (err) {
    logger.create({ type: 'error.api.response', text: str(err) })
    return { error: 500, id }
  }
})
