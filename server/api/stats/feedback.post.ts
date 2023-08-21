import { readBody } from 'h3'
import mailer from '~/server/services/mailer'
import { read as tokenReader } from '~/server/services/token'
import { parse as parseCookie } from 'cookie'
import { appName } from '~/config/app'

export default defineEventHandler(async function (event) {
  // Validate token
  const rawCookie = event?.node?.req?.headers?.cookie
  const token = tokenReader(parseCookie(typeof rawCookie === 'string' ? rawCookie : '').token)
  const user = token?.uid
  if (token === null || typeof user !== 'string') {
    return { error: 0 }
  }
  const body = await readBody(event)
  if (!body) {
    return { error: 1 }
  }
  let { name, feedback } = body
  name = (name || '').trim()
  feedback = (feedback || '').trim()
  if (!name || !feedback) {
    return { error: 2 }
  }
  mailer.sendText(
    process.env.NODEMAILER_EMAIL as string,
    `Feedback from ${appName}`,
    `Name: ${name}\n\nFeedback:\n${feedback}`
  )
  return {}
})
