import { defineEventHandler } from 'h3';
import md5$1 from 'crypto-js/md5.js';
import { c as createAxiosSession } from './createAxiosSession.mjs';
import qs from 'qs';
import 'axios';
import 'cookie';

const md5 = (text) => {
  return md5$1(text).toString();
};
const apiName = "SogouTrans";
let session;
let secretCode = null;
const sogouCrypto = (from, to, text) => md5(`${from}${to}${text}${secretCode}`);
let lastInit = 0;
const isOkToInit = () => Date.now() - lastInit > 1e3;
const init = () => new Promise((resolve, reject) => {
  session = createAxiosSession({
    "Referer": "https://fanyi.sogou.com/"
  });
  session.get("https://fanyi.sogou.com/text").then((res) => {
    const { data } = res;
    const regex = /\"secretCode\":(\d+),/;
    secretCode = (regex.exec(data) || [])[1] || 109984457;
    console.log(`${apiName} API is ready. (${secretCode})`);
    lastInit = Date.now();
    resolve(true);
  }).catch((e) => reject(e));
});
const translate$1 = (text, from = "auto", to = "en", rawData = false, retry = 0) => new Promise((resolve, reject) => {
  if (!text)
    return resolve({ text });
  const t0 = Date.now();
  const sCode = sogouCrypto(from, to, text);
  session.post("https://fanyi.sogou.com/api/transpc/text/result", {
    text,
    from,
    to,
    "client": "pc",
    "fr": "browser_pc",
    "needQc": 1,
    "s": sCode
  }).then((res) => {
    const { data = {} } = res.data;
    if (!data)
      return reject("no content");
    if (!(data == null ? void 0 : data.sentencesData))
      return reject("no content");
    const ts = Date.now();
    const apiResponse = {
      timeUsed: ts - t0,
      timestamp: ts,
      lang: data.detect.language,
      text: (data.sentencesData.trans_result || [{ trans_text: data.translate.dit }])[0].trans_text
    };
    if (+rawData) {
      apiResponse.data = data;
    }
    resolve(apiResponse);
  }).catch((err) => {
    if (!retry && isOkToInit()) {
      console.log(`${apiName} reload agent (${err})`);
      init().then(() => {
        translate$1(text, from, to, rawData, 1).then((res) => resolve(res)).catch((err2) => reject(err2));
      }).catch((err2) => reject(err2));
    } else {
      console.error(`${apiName} API error: ${err}`);
      reject(err);
    }
  });
});
init().catch((err) => {
  console.error(`${apiName} API connection failed.`, err);
});
const translateZh2En = async (text) => {
  try {
    return await translate$1(text, "zh-CHS", "en");
  } catch (err) {
    console.error(err);
    return { text };
  }
};

const translate = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const text = qs.parse((_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.url) == null ? void 0 : _c.split("?")[1]).text;
  return (await translateZh2En(text)).text;
});

export { translate as default };
//# sourceMappingURL=translate.mjs.map
