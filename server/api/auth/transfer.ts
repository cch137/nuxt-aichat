import axios from 'axios'
import { serialize as serializeCookie } from 'cookie'

export default defineEventHandler(async function (event): Promise<{ error?: string, isLoggedIn?: boolean, user?: { username: string } }> {
  const { req, res } = event.node
  try {
    const passport = (((req.url||'').split('?')[1] || '').split('&').map(i => i.split('=').map(j => j.trim())).find(i => i[0] === 'passport') || ['', ''])[1]
    const tokenString = (await axios.post('https://cch137-api.onrender.com/lockers', { id: passport })).data
    res.statusCode = 302
    res.setHeader('Location', '/')
    res.setHeader('Set-Cookie', serializeCookie('token', tokenString, {
      path: '/',
      httpOnly: true,
      sameSite: true,
      secure: true
    }))
    return { isLoggedIn: true }
  } catch {
    return { isLoggedIn: false }
  }
})