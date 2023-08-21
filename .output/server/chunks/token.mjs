import { t as troll } from './troll.mjs';

const seed = 168813145203e3;
function generate(uid, ip) {
  return pack({
    uid,
    ip,
    checked: Date.now()
  });
}
function pack(tokenObj) {
  return troll.e(tokenObj, 1, seed);
}
function read(token) {
  try {
    const encrypted = troll.d(token, 1, seed);
    if (typeof encrypted === "object" && encrypted !== null) {
      if ("user" in encrypted) {
        encrypted.uid = encrypted.user;
        delete encrypted["user"];
      }
      return encrypted;
    }
  } catch {
  }
  return null;
}

export { generate as g, pack as p, read as r };
//# sourceMappingURL=token.mjs.map
