import { defineEventHandler } from 'h3';
import { g as getDefaultExportFromNamespaceIfNotNamed, a as getDefaultExportFromCjs } from './rollup/_commonjsHelpers.mjs';
import * as querystring$1 from 'querystring';
import * as got$1 from 'got';

var googleTranslateApi = {exports: {}};

const require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(querystring$1);

const require$$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(got$1);

var languages$1 = {exports: {}};

var langs = {
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
    return false;
  }
  if (langs[desiredLang]) {
    return desiredLang;
  }
  var keys = Object.keys(langs).filter(function(key) {
    if (typeof langs[key] !== "string") {
      return false;
    }
    return langs[key].toLowerCase() === desiredLang.toLowerCase();
  });
  return keys[0] || false;
}
function isSupported(desiredLang) {
  return Boolean(getCode(desiredLang));
}
languages$1.exports = langs;
languages$1.exports.isSupported = isSupported;
languages$1.exports.getCode = getCode;

var languagesExports = languages$1.exports;

var querystring = require$$0;
var got = require$$1;
var languages = languagesExports;
function extract(key, res) {
  var re = new RegExp(`"${key}":".*?"`);
  var result = re.exec(res.body);
  if (result !== null) {
    return result[0].replace(`"${key}":"`, "").slice(0, -1);
  }
  return "";
}
function translate(text, opts, gotopts) {
  opts = opts || {};
  gotopts = gotopts || {};
  var e;
  [opts.from, opts.to].forEach(function(lang) {
    if (lang && !languages.isSupported(lang)) {
      e = new Error();
      e.code = 400;
      e.message = "The language '" + lang + "' is not supported";
    }
  });
  if (e) {
    return new Promise(function(resolve, reject) {
      reject(e);
    });
  }
  opts.from = opts.from || "auto";
  opts.to = opts.to || "en";
  opts.tld = opts.tld || "com";
  opts.autoCorrect = opts.autoCorrect === void 0 ? false : Boolean(opts.autoCorrect);
  opts.from = languages.getCode(opts.from);
  opts.to = languages.getCode(opts.to);
  var url = "https://translate.google." + opts.tld;
  var rpcids = "MkEWBc";
  return got(url, gotopts).then(function(res) {
    var data = {
      "rpcids": rpcids,
      "source-path": "/",
      "f.sid": extract("FdrFJe", res),
      "bl": extract("cfb2h", res),
      "hl": "en-US",
      "soc-app": 1,
      "soc-platform": 1,
      "soc-device": 1,
      "_reqid": Math.floor(1e3 + Math.random() * 9e3),
      "rt": "c"
    };
    return data;
  }).then(function(data) {
    url = url + "/_/TranslateWebserverUi/data/batchexecute?" + querystring.stringify(data);
    var freq = [[[rpcids, JSON.stringify([[text, opts.from, opts.to, opts.autoCorrect], [null]]), null, "generic"]]];
    gotopts.body = "f.req=" + encodeURIComponent(JSON.stringify(freq)) + "&";
    gotopts.headers["content-type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    return got.post(url, gotopts).then(function(res) {
      var json = res.body.slice(6);
      var length = "";
      var result = {
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
      } catch (e2) {
        return result;
      }
      if (json[1][0][0][5] === void 0 || json[1][0][0][5] === null) {
        result.text = json[1][0][0][0];
      } else {
        result.text = json[1][0][0][5].map(function(obj) {
          return obj[0];
        }).filter(Boolean).join(" ");
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
    }).catch(function(err) {
      err.message += `
Url: ${url}`;
      if (err.statusCode !== void 0 && err.statusCode !== 200) {
        err.code = "BAD_REQUEST";
      } else {
        err.code = "BAD_NETWORK";
      }
      throw err;
    });
  });
}
googleTranslateApi.exports = translate;
googleTranslateApi.exports.languages = languages;

var googleTranslateApiExports = googleTranslateApi.exports;
const translate$1 = /*@__PURE__*/getDefaultExportFromCjs(googleTranslateApiExports);

const test = defineEventHandler(async () => {
  return translate$1("Hi");
});

export { test as default };
//# sourceMappingURL=test.mjs.map
