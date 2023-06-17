import { serialize as serializeCookie } from 'cookie'

export default defineEventHandler(async function (event) {
  const { res } = event.node
  res.setHeader('Set-Cookie', serializeCookie('token', '', {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true
  }))
  return { status: true }
})
