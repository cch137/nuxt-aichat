import qs from 'qs';
import type { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import createAxiosSession from '~/utils/createAxiosSession';
import languages from './languages';

// Reference from: https://www.npmjs.com/package/@saipulanuar/google-translate-api

const rpcids = 'MkEWBc'
const fSidKey = 'FdrFJe'
const bdKey = 'cfb2h'

interface TranslationResult {
  text: string;
  pronunciation: string;
  from: {
    language: {
      didYouMean: boolean;
      iso: string;
    };
    text: {
      autoCorrected: boolean;
      value: string;
      didYouMean: boolean;
    };
  };
  raw: string;
}

async function extract (key: string, res: AxiosResponse<string>): Promise<string> {
  const re = new RegExp(`"${key}":".*?"`);
  const result = re.exec(res.data);
  if (result !== null) {
    return result[0].replace(`"${key}":"`, '').slice(0, -1);
  }
  return '';
}

const origin = 'https://translate.google.com'

const [getApiUrl, getSession] = (() => {
  let lastUpdated = 0
  let session: AxiosInstance
  let apiUrl: string
  let bactchExecuteData: Record<string, string | number> = {}
  return [
    () => apiUrl,
    async function () {
      if (Date.now() > lastUpdated + 300000) {
        session = createAxiosSession({  })
        const res = await session.get(origin)
        bactchExecuteData = {
          'rpcids': rpcids,
          'source-path': '/',
          'f.sid': await extract(fSidKey, res),
          'bl': await extract(bdKey, res),
          'hl': 'en-US',
          'soc-app': 1,
          'soc-platform': 1,
          'soc-device': 1,
          '_reqid': 0,
          'rt': 'c',
        };
      }
      bactchExecuteData['_reqid'] = Math.floor(100000 + Math.random() * 900000)
      apiUrl = `${origin}/_/TranslateWebserverUi/data/batchexecute?${qs.stringify(bactchExecuteData)}`
      return session
    }
  ]
})()

async function translate(
  text: string,
  _opts: { from?: string; to?: string; autoCorrect?: boolean } = {},
  axiosOpts?: AxiosRequestConfig
): Promise<TranslationResult> {
  _opts = _opts || {}
  _opts.from = languages.getCode(_opts.from) || 'auto'
  _opts.to = languages.getCode(_opts.to) || 'en'
  _opts.autoCorrect = _opts.autoCorrect === undefined ? true : Boolean(_opts.autoCorrect);
  const opts = { ..._opts } as { from: string; to: string; autoCorrect: boolean };
  axiosOpts = axiosOpts || {};

  [opts.from, opts.to].forEach((lang) => {
    if (!languages.isSupported(lang)) {
      throw new Error(`The language '${lang}' is not supported`);
    }
  })

  const fReq = [[[rpcids, JSON.stringify([[text, opts.from, opts.to, opts.autoCorrect], [null]]), null, 'generic']]]
  const translatedData = await (await getSession()).post(
    getApiUrl(),
    `f.req=${fReq}&`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } }
  );
  let json = translatedData.data.slice(6);
  let length = '';

  const result: TranslationResult = {
    text: '',
    pronunciation: '',
    from: {
      language: {
        didYouMean: false,
        iso: ''
      },
      text: {
        autoCorrected: false,
        value: '',
        didYouMean: false
      }
    },
    raw: ''
  };

  try {
    length = /^\d+/.exec(json)![0];
    json = JSON.parse(json.slice(length.length, parseInt(length, 10) + length.length));
    json = JSON.parse(json[0][2]);
    result.raw = json;
  } catch (e) {
    return result;
  }

  if (json[1][0][0][5] === undefined || json[1][0][0][5] === null) {
    // translation not found, could be a hyperlink or gender-specific translation?
    result.text = json[1][0][0][0];
  } else {
    result.text = json[1][0][0][5]
      // @ts-ignore
      .map((obj) => obj[0])
      .filter(Boolean)
      // Google api seems to split text per sentences by <dot><space>
      // So we join text back with spaces.
      // See: https://github.com/vitalets/google-translate-api/issues/73
      .join(' ');
  }
  result.pronunciation = json[1][0][0][1];

  // From language
  if (json[0] && json[0][1] && json[0][1][1]) {
    result.from.language.didYouMean = true;
    result.from.language.iso = json[0][1][1][0];
  } else if (json[1][3] === 'auto') {
    result.from.language.iso = json[2];
  } else {
    result.from.language.iso = json[1][3];
  }

  // Did you mean & autocorrect
  if (json[0] && json[0][1] && json[0][1][0]) {
    var str = json[0][1][0][0][1];
    str = str.replace(/<b>(<i>)?/g, '[');
    str = str.replace(/(<\/i>)?<\/b>/g, ']');
    result.from.text.value = str;
    if (json[0][1][0][2] === 1) {
      result.from.text.autoCorrected = true;
    } else {
      result.from.text.didYouMean = true;
    }
  }

  return result;
}

translate.languages = translate

export default translate;
