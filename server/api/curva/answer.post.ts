import { readBody } from 'h3'
import { parse as parseCookie } from 'cookie'
import { version } from '~/config/server'
import { log as logger } from '~/server/services/mongoose/index'
import { read as tokenReader } from '~/server/services/token'
import curva from '~/server/services/chatbots/curva'
// import getIp from '~/server/services/getIp'
import str from '~/utils/str'
import troll from '~/utils/troll'
import baseConverter from '~/utils/baseConverter'
import estimateTokens from '~/server/services/chatbots/engines/utils/estimateTokens'
import type { OpenAIMessage } from '~/server/services/chatbots/engines/cores/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // @ts-ignore
  if (!body) {
    return { error: 1 }
  }
  const { conv, messages = [], model, temperature, t, tz = 0, id } = body
  const _id = id ? baseConverter.convert(id, '64w', 16) : id
  // @ts-ignore
  if (!conv || messages?.length < 1 || !model || !t) {
    return { error: 2, id: _id }
  }
  const stdHash = troll.h(messages, 'MD5', t)
  const hashFromClient = event?.node?.req?.headers?.hash
  const timestamp = Number(event?.node?.req?.headers?.timestamp)
  // Validate hash and timestamp
  if (stdHash !== hashFromClient || timestamp !== t) {
    return { error: 3, id: _id }
  }
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const user = token?.user
  // const ip = getIp(event.node.req)
  // Validate token
  if (token === null || typeof user !== 'string') {
    return { error: 4, id: _id }
  }
  try {
    const croppedMessages = (() => {
      let _messages = messages as OpenAIMessage[]
      const maxTokens = model.value === 'gpt4'
        ? 6000
        : model.value === 'gpt3'
          ? 3000
          : model.value === 'gpt-web'
            ? 4000
            : 4000
      while (estimateTokens(JSON.stringify(_messages)) > maxTokens) {
        _messages.shift()
      }
      return _messages
    })()
    const response = await curva.ask(user, conv, model, temperature, croppedMessages, tz, _id)
    //@ts-ignore
    response.id = typeof response.id === 'string'
    //@ts-ignore
      ? baseConverter.convert(response.id, 16, '64w')
      : _id
    if ((response as any)?.error) {
      console.error((response as any)?.error)
    }
    return { version, ...response }
  } catch (err) {
    logger.create({ type: 'error.api.response', text: str(err) })
    return { error: 5, id: _id }
  }
})