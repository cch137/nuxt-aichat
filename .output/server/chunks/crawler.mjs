import axios from 'axios';
import TurndownService from 'turndown';
import { gfm } from '@joplin/turndown-plugin-gfm';
import { load } from 'cheerio';
import googlethis from 'googlethis';
import { t as translate } from './sogouTranslate.mjs';
import './index.mjs';
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
  try {
    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
      url = `http://${url}`;
    }
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
    return (title ? `title: ${title}
` : "") + (description ? `description: ${description.substring(0, 256)}
` : "") + "---\n" + trimText(markdown);
  } catch (err) {
    if (err instanceof Error) {
      err = `${err.name}: ${err.message}`;
    } else if (typeof err !== "string") {
      err = "Error: Unkonwn Error";
    }
    console.log(`SCRAPE FAILED (${err}): ${url}`);
    logger.create({ type: "error.crawler.scrape", refer: url, text: str(err) });
    return err;
  }
};
const summarize = async (query, showUrl = false, translate$1 = true) => {
  try {
    query = query.replace(/[\s]+/g, " ").trim();
    const searchQueries = /* @__PURE__ */ new Set([query.substring(0, 256)]);
    if (translate$1) {
      const translateResult = await translate(query.substring(0, 5e3));
      if ((translateResult == null ? void 0 : translateResult.lang) !== "\u82F1\u8BED") {
        const queryInEnglish = translateResult.text;
        searchQueries.add(queryInEnglish);
      }
    }
    const searcheds = await Promise.all([...searchQueries].map((query2) => {
      console.log("SEARCH:", query2);
      return googlethis.search(query2);
    }));
    const results = [];
    for (const searched of searcheds) {
      results.push(...searched.results);
      results.push(...searched.top_stories);
    }
    const summarize2 = [
      ...new Set(results.map((r) => `${showUrl ? decodeURIComponent(r.url) + "\n" : ""}${r.title ? "# " + r.title : ""}
${r.description}`))
    ].join("\n\n");
    return summarize2;
  } catch (err) {
    err = str(err);
    console.log("SUMMARIZE FAILED:", err);
    logger.create({ type: "error.crawler.summarize", text: err });
    return "";
  }
};
const crawler = {
  scrape,
  summarize
};
const crawler$1 = crawler;

export { crawler$1 as c, logger as l };
//# sourceMappingURL=crawler.mjs.map
