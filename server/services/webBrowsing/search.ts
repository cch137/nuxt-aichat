import googlethis from 'googlethis'

interface SearcherResultItem {
  title?: string;
  description: string;
  url: string;
}

const googleSearch = async (...queries: string[]) => {
  const searchings = await Promise.all(queries.map((query) => googlethis.search(query)))
  return searchings.map((searching) => {
    return [...searching.results, ...searching.top_stories] as SearcherResultItem[]
  }).flat()
}

class WebSearcherResult {
  items: SearcherResultItem[]

  constructor (items: SearcherResultItem[]) {
    this.items = items
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
