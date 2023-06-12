import axios from 'axios';
import TurndownService from 'turndown';
import { gfm } from '@joplin/turndown-plugin-gfm';
import { load } from 'cheerio';
import googlethis from 'googlethis';
import { t as translate } from './sogouTranslate.mjs';
import './index3.mjs';
import { s as str } from './str.mjs';
import { model, Schema } from 'mongoose';

const logger = model("Log", new Schema({
  type: { type: String, required: true },
  refer: { type: String },
  text: { type: String, required: true }
}, {
  versionKey: false
}), "logs");

const trimText = (text) => {
  return text.split("\n").map((ln) => ln.replace(/[\s]+/g, " ").trim()).filter((ln) => ln).join("\n");
};
const scrape = async (url) => {
  var _a, _b, _c, _d;
  if (!(url.startsWith("http://") || url.startsWith("https://"))) {
    url = `http://${url}`;
  }
  try {
    const origin = new URL(url).origin;
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
      "Referer": origin,
      "Origin": origin,
      "Accept-Language": "en-US,en;q=0.9"
    };
    const res = await axios.get(url, { headers, timeout: 1e4 });
    const resContentType = str(res.headers["Content-Type"] || "");
    if (resContentType.startsWith("image")) {
      throw "This is an image";
    } else if (resContentType.startsWith("video")) {
      throw "This is a video";
    } else if (resContentType.startsWith("audio")) {
      throw "This is a audio";
    }
    if (typeof res.data !== "string") {
      res.data = JSON.stringify(res.data);
    }
    const $ = load(res.data);
    $("style").remove();
    $("script").remove();
    $("a").replaceWith(function() {
      return $("<span>").text($(this).prop("innerText") || $(this).text());
    });
    const td = new TurndownService();
    td.use(gfm);
    const markdown = td.turndown($("body").prop("innerHTML")).replaceAll("<br>", " ");
    const title = $("title").text() || ((_a = $('meta[name="title"]').attr()) == null ? void 0 : _a.content) || ((_b = $('meta[name="og:title"]').attr()) == null ? void 0 : _b.content);
    const description = ((_c = $('meta[name="description"]').attr()) == null ? void 0 : _c.content) || ((_d = $('meta[name="og:description"]').attr()) == null ? void 0 : _d.content);
    return {
      title: title || url,
      url,
      response: (title ? `title: ${title}
` : "") + (description ? `description: ${description.substring(0, 256)}
` : "") + "---\n" + trimText(markdown)
    };
  } catch (err) {
    let message = "";
    if (err instanceof Error) {
      message = `${err.name}: ${err.message}`;
    } else if (typeof err !== "string") {
      message = "Error: Unkonwn Error";
    }
    console.log(`SCRAPE FAILED (${message}): ${url}`);
    logger.create({ type: "error.crawler.scrape", refer: url, text: message });
    return {
      title: url,
      url,
      error: err || {},
      response: message
    };
  }
};
const getGoogleSearchResults = async (query) => {
  console.log("SEARCH:", query);
  const searched = await googlethis.search(query);
  return [...searched.results, ...searched.top_stories];
};
const search = async (query, translate$1 = true) => {
  try {
    query = query.replace(/[\s]+/g, " ").trim();
    const query1 = query.substring(0, 256);
    const searchings = [getGoogleSearchResults(query1)];
    if (translate$1) {
      const translateResult = await translate(query.substring(0, 5e3));
      if ((translateResult == null ? void 0 : translateResult.lang) !== "\u82F1\u8BED") {
        const query2 = translateResult.text.substring(0, 256);
        if (query1 === query2) {
          searchings.push(getGoogleSearchResults(query2));
        }
      }
    }
    return (await Promise.all(searchings)).flat();
  } catch (err) {
    err = str(err);
    console.log("SUMMARIZE FAILED:", err);
    logger.create({ type: "error.crawler.summarize", text: err });
    return [];
  }
};
const _search = async (query, translate = true) => {
  const results = await search(query, translate);
  return {
    pipe(showUrl) {
      return [
        ...new Set(results.map((r) => `${showUrl ? r.url : ""}
${r.title ? r.title : ""}
${r.description}`))
      ].join("\n\n");
    }
  };
};
const summarize = async (query, showUrl = false, translate = true) => {
  return (await _search(query, translate)).pipe(showUrl);
};
const crawler = {
  scrape,
  _search,
  search,
  summarize
};
const crawler$1 = crawler;

export { crawler$1 as c, logger as l };
//# sourceMappingURL=crawler.mjs.map
