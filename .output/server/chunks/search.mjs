import googlethis from 'googlethis';
import axios from 'axios';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const ddgSearch = async (...queries) => {
  return (await Promise.all(queries.map(async (query) => {
    try {
      const searching = (await axios.get(`https://ddg-api.herokuapp.com/search?query=${query}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50"
        }
      })).data;
      return searching.map((p) => ({ title: p.title || "", url: p.link || "", description: p.snippet || "" }));
    } catch {
      return [];
    }
  }))).flat();
};
const googleSearch = async (...queries) => {
  return (await Promise.all(queries.map(async (query) => {
    try {
      const searching = await googlethis.search(query);
      return [...searching.results, ...searching.top_stories];
    } catch {
      return [];
    }
  }))).flat();
};
class WebSearcherResult {
  constructor(items) {
    __publicField(this, "items");
    const pages = /* @__PURE__ */ new Map();
    items.forEach((value) => pages.set(value.url, value));
    this.items = [...pages.values()];
  }
  summary(showUrl = true) {
    return [
      ...new Set(this.items.map((r) => `${showUrl ? r.url : ""}
${r.title ? r.title : ""}
${r.description}`))
    ].join("\n\n");
  }
}
async function googleSearchResult(...queries) {
  return new WebSearcherResult(await googleSearch(...queries));
}
async function ddgSearchResult(...queries) {
  return new WebSearcherResult(await ddgSearch(...queries));
}
async function search(...queries) {
  switch (search.engine) {
    case "all":
      return new WebSearcherResult([...await googleSearch(...queries), ...await ddgSearch(...queries)]);
    case "duckduckgo":
      return await ddgSearchResult(...queries);
    case "google":
    default:
      return await googleSearchResult(...queries);
  }
}
search.engine = "google";
search.googleSearchResult = googleSearchResult;
search.ddgSearchResult = ddgSearchResult;

export { search as s };
//# sourceMappingURL=search.mjs.map
