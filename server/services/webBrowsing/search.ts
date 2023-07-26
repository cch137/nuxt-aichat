import googlethis from 'googlethis'

interface SearcherResultItem {
  title?: string;
  description: string;
  url: string;
}

const googleSearch = async (...queries: string[]) => {
  return (await Promise.all(queries.map(async (query) => {
    try {
      const searching = await googlethis.search(query)
      return [...searching.results, ...searching.top_stories] as SearcherResultItem[]
    } catch {
      return []
    }
  }))).flat()
}

class WebSearcherResult {
  items: SearcherResultItem[]

  constructor (items: SearcherResultItem[]) {
    const pages = new Map<string, SearcherResultItem>()
    items.forEach((value) => pages.set(value.url, value))
    this.items = [...pages.values()]
  }

  summary (showUrl: boolean = true) {
    return [...new Set(this.items
      .map((r) => `${showUrl ? r.url : ''}\n${r.title ? r.title : ''}\n${r.description}`))
    ].join('\n\n')
  }
}

async function search (...queries: string[]) {
  return new WebSearcherResult(await googleSearch(...queries))
}

export default search
export type { WebSearcherResult }
