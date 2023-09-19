import { readBody } from 'h3'
import { version } from '~/config/server'
import { log as logger } from '~/server/services/mongoose/index'
import { getUidByToken, getAuthlvlByToken } from '~/server/services/token'
import curva from '~/server/services/chatbots/curva'
import getIp from '~/server/services/getIp'
import str from '~/utils/str'
import { hx as createHash } from '~/utils/troll'
import baseConverter from '~/utils/baseConverter'
import random from '~/utils/random'
import estimateTokens from '~/server/services/chatbots/engines/utils/estimateTokens'
import type { OpenAIMessage } from '~/server/services/chatbots/engines/cores/types'
import type { CurvaStandardResponse } from '~/server/services/chatbots/curva/types'
import { messagesToQuestionContext } from '~/server/services/chatbots/engines/utils/openAiMessagesConverter'
import RateLimiter from '~/server/services/rate-limiter'
import models from '~/config/models'

function isHeadlessUserAgent(userAgent = '') {
  const pattern = /headless/i
  return pattern.test(userAgent)
}

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

const bannedIpSet = new Set<string>([]);

export default defineEventHandler(async (event) => {
  return { error: 'STAY TUNED' }
  if (!rateLimiterBundler.check(getIp(event.node.req))) {
    return await new Promise((r) => setTimeout(() => r({ error: rateLimiterBundler.getHint(getIp(event.node.req)) }), 10000))
  }
  const now = Date.now()
  const body = await readBody(event)
  if (!body) {
    return { error: 'INVALID BODY' }
  }
  const userAgent = event.node.req.headers['user-agent']
  if (isHeadlessUserAgent(userAgent)) {
    return { error: 'DEVELOPER MODE' }
  }
  const { conv, messages = [], model, temperature, t, tz = 0, id: _id, streamId } = body
  const id = _id ? baseConverter.convert(_id, '64', 16) : _id
  const tempId = id || random.base16(24)
  if (t > now + 300000 || t < now - 300000) {
    // 拒絕請求：時差大於 5 分鐘
    return { error: 'OUTDATED REQUEST', id: tempId }
  }
  if (!conv || messages?.length < 1 || !model || !t) {
    return { error: 'BODY INCOMPLETE', id: tempId }
  }
  const stdHash = createHash(messages, 'MD5', t)
  const hashFromClient = event?.node?.req?.headers?.hash
  const timestamp = Number(event?.node?.req?.headers?.timestamp)
  // Validate hash and timestamp
  if (stdHash !== hashFromClient || timestamp !== t) {
    return { error: 'VERIFICATION FAILED', id: tempId }
  }
  const uid = getUidByToken(event)
  // Validate token
  if (typeof uid !== 'string') {
    return { error: 'UNAUTHENTICATED', id: tempId }
  }
  const authlvl = getAuthlvlByToken(event)
  const neededAuthlvl = models.find(m => m.value === model)?.permissionLevel || 0
  if (authlvl < neededAuthlvl) {
    return { error: 'NO PERMISSION', id: tempId }
  }
  const ip = getIp(event.node.req)
  if ([...bannedIpSet].find((_ip) => ip.includes(_ip))) {
    return { error: 'Your actions are considered to be abusive.', id: tempId }
  }
  try {
    const lastQuestion = (messages as OpenAIMessage[]).findLast(i => i.role === 'user')?.content || ''
    if (lastQuestion.toUpperCase().includes('ONLY SAY HELLO')) {
      console.log('ONLY SAY HELLO', ip, event.node.req.headers)
      rateLimiterBundler.check(ip, 1000)
      return { answer: 'Hello.', id: tempId }
      // return { error: 'Your actions are considered to be abusive.', id: tempId }
    }
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
      while (estimateTokens(model, JSON.stringify(_messages)) > maxTokens && _messages.length > 1) {
        _messages.shift()
      }
      return _messages
    })()
    const response = await curva.ask(ip, uid, conv, model, temperature, croppedMessages, tz, id, streamId)
    //@ts-ignore
    response.id = typeof response.id === 'string'
    //@ts-ignore
      ? baseConverter.convert(response.id, 16, '64')
      : (id || tempId)
    if (response.error) {
      console.error((typeof response.error === 'string' && response.error.length) ? response.error.split('\n')[0] : response.error)
    }
    console.log(ip, uid, conv, model, '|', [...rateLimiterBundler].map((r) => `(${r.total}/${r.frequencyMin})`).join(' '))
    return { version, ...response } as CurvaStandardResponse
  } catch (err) {
    logger.create({ type: 'error.api.response', text: str(err) })
    return { error: 500, id: tempId }
  }
})
