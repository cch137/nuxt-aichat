import auth from '~/server/services/auth'
import { readBody } from 'h3'

export default defineEventHandler(async function (event) {
  const body = await readBody(event)
  if (!body) {
    return { error: 'No form' }
  }
  const { email } = body
  if (!email) {
    return { error: 'Form incomplete' }
  }
  try {
    await auth.resendVerificationCode(email)
    return { error: false }
  } catch (err) {
    return { error: typeof err === 'string' ? err : 'Resend failed.' }
  }
})
