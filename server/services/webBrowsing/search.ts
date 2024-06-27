import googlethis from "googlethis";
import axios from "axios";

interface SearcherResultItem {
  title?: string;
  description: string;
  url: string;
}

const ddgSearch = async (...queries: string[]) => {
  return (
    await Promise.all(
      queries.map(async (query) => {
        try {
          const searching = (
            await axios.get(
              `https://ddg-api.herokuapp.com/search?query=${query}`,
              {
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
                },
              }
            )
          ).data as { title: string; link: string; snippet: string }[];
          return searching.map((p) => ({
            title: p.title || "",
            url: p.link || "",
            description: p.snippet || "",
          })) as SearcherResultItem[];
        } catch {
          return [];
        }
      })
    )
  ).flat();
};

const googleSearch = async (...queries: string[]) => {
  return (
    await Promise.all(
      queries.map(async (query) => {
        try {
          const searching = await googlethis.search(query);
          return [
            ...searching.results,
            ...searching.top_stories,
          ] as SearcherResultItem[];
        } catch {
          return [];
        }
      })
    )
  ).flat();
};

class WebSearcherResult {
  items: SearcherResultItem[];

  constructor(items: SearcherResultItem[]) {
    const pages = new Map<string, SearcherResultItem>();
    items.forEach((value) => pages.set(value.url, value));
    this.items = [...pages.values()];
  }

  summary(showUrl: boolean = true) {
    return [
      ...new Set(
        this.items.map(
          (r) =>
            `${showUrl ? r.url : ""}\n${r.title ? r.title : ""}\n${
              r.description
            }`
        )
      ),
    ].join("\n\n");
  }
}

async function googleSearchResult(...queries: string[]) {
  return new WebSearcherResult(await googleSearch(...queries));
}

async function ddgSearchResult(...queries: string[]) {
  return new WebSearcherResult(await ddgSearch(...queries));
}

async function search(...queries: string[]) {
  switch (search.engine) {
    case "all": // 小心有可能會超出 tokens
      return new WebSearcherResult([
        ...(await googleSearch(...queries)),
        ...(await ddgSearch(...queries)),
      ]);
    case "duckduckgo":
      return await ddgSearchResult(...queries);
    case "google":
    default:
      return await googleSearchResult(...queries);
  }
}

type AvailableSearchEngine = "all" | "google" | "duckduckgo";

search.engine = "google" as AvailableSearchEngine;
search.googleSearchResult = googleSearchResult;
search.ddgSearchResult = ddgSearchResult;

export default search;
export type { WebSearcherResult, AvailableSearchEngine };
