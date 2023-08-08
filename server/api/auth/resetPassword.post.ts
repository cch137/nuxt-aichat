import auth from '~/server/services/auth'
import { readBody } from 'h3'

export default defineEventHandler(async function (event) {
  const body = await readBody(event)
  if (!body) {
    return { error: 'No form' }
  }
  const { email, password, code } = body
  if (!email || !password || !code) {
    return { error: 'Form incomplete.' }
  }
  try {
    try {
      if (!auth.verifyEmail(email, code)) {
        throw 'Incorrect verification code.'
      }
    } catch (err) {
      return { error: typeof err === 'string' ? err : 'Incorrect verification code.' }
    }
    await auth.resetPassword(email, password)
    return { error: false }
  } catch (err) {
    return { error: typeof err === 'string' ? err : 'User creation failed.' }
  }
})
