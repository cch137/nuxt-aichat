import { readBody } from 'h3'
import { parse as parseCookie } from 'cookie'
import { version } from '~/package.json'
import { read as tokenReader } from '~/server/services/token'
import chat from '~/server/services/chat'
import getIp from '~/server/services/getIp'
import troll from '~/utils/troll'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // @ts-ignore
  if (!body) {
    return { error: 1 }
  }
  const { conv, prompt, context = '', model, web, t, tz = 0 } = body
  // @ts-ignore
  if (!conv || !prompt ||!model || !t) {
    return { error: 2 }
  }
  const stdHash = troll.h(prompt, 'MD5', t)
  const hashFromClient = event?.node?.req?.headers?.hash
  const timestamp = Number(event?.node?.req?.headers?.timestamp)
  // Validate hash and timestamp
  if (stdHash !== hashFromClient || timestamp !== t) {
    return { error: 3 }
  }
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const user = token?.user
  const ip = getIp(event.node.req)
  // Validate token
  if (token === null || typeof user !== 'string') {
    return { error: 4 }
  }
  let webBrowsing: boolean
  switch (web) {
    case 'OFF':
      webBrowsing = false
      break
    case 'ON':
    default:
      webBrowsing = true
  }
  try {
    const result = await chat.ask(user, conv, model, webBrowsing, prompt, context, tz)
    return {
      version,
      answer: result.answer,
      complete: result.complete
    }
  } catch (err) {
    console.error(err)
    return {
      error: 5
    }
  }
})
