import troll from "~/utils/troll"

const seed = 168813145203000

function generate (user: string, ip: string) {
  return pack({
    user,
    ip,
    checked: Date.now()
  })
}

function pack (tokenObj: any) {
  return troll.e(tokenObj, 1, seed)
}

function read (token: string) {
  try {
    const encrypted = troll.d(token, 1, seed)
    if (typeof encrypted === 'object' && encrypted !== null) {
      return encrypted as { user: string, ip: string, checked: number }
    }
  } catch {}
  return null
}

export {
  generate,
  pack,
  read
}
