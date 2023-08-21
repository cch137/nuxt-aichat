import troll from "~/utils/troll"

const seed = 168813145203000

function generate (uid: string, ip: string) {
  return pack({
    uid,
    ip,
    checked: Date.now()
  })
}

function pack (tokenObj: any) {
  return troll.e(tokenObj, 1, seed)
}

interface TokenObject {
  uid: string;
  ip: string;
  checked: number;
}

function read (token: string) {
  try {
    const encrypted = troll.d(token, 1, seed)
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

export type {
  TokenObject
}

export {
  generate,
  pack,
  read
}
