import { serialize } from 'cookie'

export default defineEventHandler(async function (event) {
  event.node.res.setHeader('Set-Cookie', serialize('admin', '', {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: true
  }))
  return { isLoggedIn: false }
})
