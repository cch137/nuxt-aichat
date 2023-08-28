import type { H3Event } from 'h3'
import { parse as parseCookie } from 'cookie'
import { d as trollDecrypt, e as trollEncrypt } from "~/utils/troll"

const seed = 168813145203000

function generate (uid: string, ip: string) {
  return {
    uid,
    ip,
    checked: Date.now()
  }
}

function generateString (uid: string, ip: string) {
  return pack(generate(uid, ip))
}

function pack (tokenObj: any) {
  return trollEncrypt(tokenObj, 1, seed)
}

interface TokenObject {
  uid: string;
  ip: string;
  checked: number;
  authlvl?: number;
}

function read (token: string) {
  try {
    const encrypted = trollDecrypt(token, 1, seed)
    if (typeof encrypted === 'object' && encrypted !== null) {
      if ('user' in encrypted) {
        encrypted.uid = encrypted.user
        delete encrypted['user']
      }
      return encrypted as TokenObject
    }
  } catch {}
  return null
}

function getUidByToken (event: H3Event) {
  const cookieString = event?.node?.req?.headers?.cookie || ''
  const token = read(parseCookie(cookieString).token)
  return token?.uid
}

function getAuthlvlByToken (event: H3Event) {
  const cookieString = event?.node?.req?.headers?.cookie || ''
  const token = read(parseCookie(cookieString).token)
  return token?.authlvl || 0
}

export type {
  TokenObject
}

export {
  generate,
  generateString,
  pack,
  read,
  getUidByToken,
  getAuthlvlByToken,
}
