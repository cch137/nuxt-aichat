import { defineEventHandler } from 'h3';
import qs from 'qs';
import { c as createAxiosSession } from './createAxiosSession.mjs';
import 'axios';
import 'cookie';

const supportedLanguages = {
  "auto": "Automatic",
  "af": "Afrikaans",
  "sq": "Albanian",
  "am": "Amharic",
  "ar": "Arabic",
  "hy": "Armenian",
  "az": "Azerbaijani",
  "eu": "Basque",
  "be": "Belarusian",
  "bn": "Bengali",
  "bs": "Bosnian",
  "bg": "Bulgarian",
  "ca": "Catalan",
  "ceb": "Cebuano",
  "ny": "Chichewa",
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  "co": "Corsican",
  "hr": "Croatian",
  "cs": "Czech",
  "da": "Danish",
  "nl": "Dutch",
  "en": "English",
  "eo": "Esperanto",
  "et": "Estonian",
  "tl": "Filipino",
  "fi": "Finnish",
  "fr": "French",
  "fy": "Frisian",
  "gl": "Galician",
  "ka": "Georgian",
  "de": "German",
  "el": "Greek",
  "gu": "Gujarati",
  "ht": "Haitian Creole",
  "ha": "Hausa",
  "haw": "Hawaiian",
  "he": "Hebrew",
  "iw": "Hebrew",
  "hi": "Hindi",
  "hmn": "Hmong",
  "hu": "Hungarian",
  "is": "Icelandic",
  "ig": "Igbo",
  "id": "Indonesian",
  "ga": "Irish",
  "it": "Italian",
  "ja": "Japanese",
  "jw": "Javanese",
  "kn": "Kannada",
  "kk": "Kazakh",
  "km": "Khmer",
  "ko": "Korean",
  "ku": "Kurdish (Kurmanji)",
  "ky": "Kyrgyz",
  "lo": "Lao",
  "la": "Latin",
  "lv": "Latvian",
  "lt": "Lithuanian",
  "lb": "Luxembourgish",
  "mk": "Macedonian",
  "mg": "Malagasy",
  "ms": "Malay",
  "ml": "Malayalam",
  "mt": "Maltese",
  "mi": "Maori",
  "mr": "Marathi",
  "mn": "Mongolian",
  "my": "Myanmar (Burmese)",
  "ne": "Nepali",
  "no": "Norwegian",
  "ps": "Pashto",
  "fa": "Persian",
  "pl": "Polish",
  "pt": "Portuguese",
  "pa": "Punjabi",
  "ro": "Romanian",
  "ru": "Russian",
  "sm": "Samoan",
  "gd": "Scots Gaelic",
  "sr": "Serbian",
  "st": "Sesotho",
  "sn": "Shona",
  "sd": "Sindhi",
  "si": "Sinhala",
  "sk": "Slovak",
  "sl": "Slovenian",
  "so": "Somali",
  "es": "Spanish",
  "su": "Sundanese",
  "sw": "Swahili",
  "sv": "Swedish",
  "tg": "Tajik",
  "ta": "Tamil",
  "te": "Telugu",
  "th": "Thai",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "ur": "Urdu",
  "uz": "Uzbek",
  "vi": "Vietnamese",
  "cy": "Welsh",
  "xh": "Xhosa",
  "yi": "Yiddish",
  "yo": "Yoruba",
  "zu": "Zulu"
};
function getCode(desiredLang) {
  if (!desiredLang) {
    return void 0;
  }
  if (desiredLang in supportedLanguages) {
    return desiredLang;
  }
  const lowerCaseDesiredLang = desiredLang.toLowerCase();
  for (const langCode in supportedLanguages) {
    const langName = supportedLanguages[langCode];
    if (typeof langName !== "string")
      continue;
    if (langName.toLowerCase() === lowerCaseDesiredLang)
      return langCode;
  }
  return void 0;
}
function isSupported(desiredLang) {
  return desiredLang in supportedLanguages;
}
const languages = {
  ...supportedLanguages,
  getCode,
  isSupported
};

const rpcids = "MkEWBc";
const fSidKey = "FdrFJe";
const bdKey = "cfb2h";
async function extract(key, res) {
  const re = new RegExp(`"${key}":".*?"`);
  const result = re.exec(res.data);
  if (result !== null) {
    return result[0].replace(`"${key}":"`, "").slice(0, -1);
  }
  return "";
}
const origin = "https://translate.google.com";
const [getApiUrl, getSession] = (() => {
  let lastUpdated = 0;
  let session;
  let apiUrl;
  let bactchExecuteData = {};
  return [
    () => apiUrl,
    async function() {
      if (Date.now() > lastUpdated + 3e5) {
        session = createAxiosSession({});
        const res = await session.get(origin);
        bactchExecuteData = {
          "rpcids": rpcids,
          "source-path": "/",
          "f.sid": await extract(fSidKey, res),
          "bl": await extract(bdKey, res),
          "hl": "en-US",
          "soc-app": 1,
          "soc-platform": 1,
          "soc-device": 1,
          "_reqid": 0,
          "rt": "c"
        };
      }
      bactchExecuteData["_reqid"] = Math.floor(1e5 + Math.random() * 9e5);
      apiUrl = `${origin}/_/TranslateWebserverUi/data/batchexecute?${qs.stringify(bactchExecuteData)}`;
      return session;
    }
  ];
})();
async function translate(text, _opts = {}, axiosOpts) {
  _opts = _opts || {};
  _opts.from = languages.getCode(_opts.from) || "auto";
  _opts.to = languages.getCode(_opts.to) || "en";
  _opts.autoCorrect = _opts.autoCorrect === void 0 ? true : Boolean(_opts.autoCorrect);
  const opts = { ..._opts };
  [opts.from, opts.to].forEach((lang) => {
    if (!languages.isSupported(lang)) {
      throw new Error(`The language '${lang}' is not supported`);
    }
  });
  const fReq = [[[rpcids, JSON.stringify([[text, opts.from, opts.to, opts.autoCorrect], [null]]), null, "generic"]]];
  const translatedData = await (await getSession()).post(
    getApiUrl(),
    `f.req=${fReq}&`,
    { headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" } }
  );
  let json = translatedData.data.slice(6);
  let length = "";
  const result = {
    text: "",
    pronunciation: "",
    from: {
      language: {
        didYouMean: false,
        iso: ""
      },
      text: {
        autoCorrected: false,
        value: "",
        didYouMean: false
      }
    },
    raw: ""
  };
  try {
    length = /^\d+/.exec(json)[0];
    json = JSON.parse(json.slice(length.length, parseInt(length, 10) + length.length));
    json = JSON.parse(json[0][2]);
    result.raw = json;
  } catch (e) {
    return result;
  }
  if (json[1][0][0][5] === void 0 || json[1][0][0][5] === null) {
    result.text = json[1][0][0][0];
  } else {
    result.text = json[1][0][0][5].map((obj) => obj[0]).filter(Boolean).join(" ");
  }
  result.pronunciation = json[1][0][0][1];
  if (json[0] && json[0][1] && json[0][1][1]) {
    result.from.language.didYouMean = true;
    result.from.language.iso = json[0][1][1][0];
  } else if (json[1][3] === "auto") {
    result.from.language.iso = json[2];
  } else {
    result.from.language.iso = json[1][3];
  }
  if (json[0] && json[0][1] && json[0][1][0]) {
    var str = json[0][1][0][0][1];
    str = str.replace(/<b>(<i>)?/g, "[");
    str = str.replace(/(<\/i>)?<\/b>/g, "]");
    result.from.text.value = str;
    if (json[0][1][0][2] === 1) {
      result.from.text.autoCorrected = true;
    } else {
      result.from.text.didYouMean = true;
    }
  }
  return result;
}
translate.languages = translate;

const test = defineEventHandler(async () => {
  return translate("\u4F60\u597D\u5148\u751F");
});

export { test as default };
//# sourceMappingURL=test.mjs.map
