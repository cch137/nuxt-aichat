import sha3 from 'crypto-js/sha3.js';
import md5 from 'crypto-js/md5.js';
import { s as str } from './str.mjs';
import { t as toSeed, r as random, b as baseConverter, s as safeStringify } from './random.mjs';

const { MT, shuffle, randInt } = random;
const { convert, getCharset } = baseConverter;
const maskingCharsetGenerator = (_charset, mt) => {
  const charset = shuffle(_charset, mt);
  return () => {
    charset.push(charset.shift());
    return charset;
  };
};
const mask = (_string, charset = 16, level = 1, seed) => {
  const charsetNum = Number.isNaN(+charset) ? 64 : +charset;
  const realCharset = getCharset(charset);
  const seed1 = toSeed(seed !== void 0 ? seed : randInt(0, charsetNum));
  const mt1 = MT(seed1);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1e6, mt1)));
  const characters = typeof _string === "string" ? _string.split("") : _string;
  const result = [
    seed !== void 0 ? realCharset[randInt(0, charsetNum)] : convert(seed1, 10, charset),
    ...characters.map((char) => generator()[realCharset.indexOf(char)])
  ];
  if (--level < 1) {
    return result.join("");
  }
  return mask(result, charset, level, seed);
};
const unmask = (string, charset = 16, level = 1, seed) => {
  const realCharset = getCharset(charset);
  const seed1 = toSeed(seed !== void 0 ? seed : +convert(string[0], charset, 10));
  const mt1 = MT(seed1);
  const generator = maskingCharsetGenerator(realCharset, MT(randInt(0, 1e6, mt1)));
  const characters = (typeof string === "string" ? string.split("") : string).slice(1, string.length);
  const result = characters.map((char) => realCharset[generator().indexOf(char)]);
  if (--level < 1) {
    return result.join("");
  }
  return unmask(result, charset, level, seed);
};

const { textToBase64, base64ToText, secureBase64 } = baseConverter;
function e(input, maskLevel = 1, seed) {
  if (typeof input === "object") {
    input = safeStringify(input);
  } else if (typeof input !== "string") {
    input = str(input);
  }
  return mask(secureBase64(textToBase64(input)), 64, maskLevel, seed);
}
function d(input, maskLevel = 1, seed, tryParseJSON = true) {
  input = base64ToText(unmask(input, 64, maskLevel, seed));
  if (!tryParseJSON) {
    return input;
  }
  try {
    return JSON.parse(input);
  } catch (err) {
    return input;
  }
}
function h(input, algorithm = 512, seed) {
  const encrypted = e(input, 1, seed).substring(1);
  if (algorithm === "MD5") {
    return md5(encrypted).toString();
  }
  return sha3(encrypted, { outputLength: algorithm }).toString();
}
const troll = { e, d, h };
const troll$1 = troll;

const seed = 168813145203e3;
function generate(uid, ip) {
  return pack({
    uid,
    ip,
    checked: Date.now()
  });
}
function pack(tokenObj) {
  return troll$1.e(tokenObj, 1, seed);
}
function read(token) {
  try {
    const encrypted = troll$1.d(token, 1, seed);
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

export { generate as g, mask as m, pack as p, read as r, troll$1 as t };
//# sourceMappingURL=token.mjs.map
