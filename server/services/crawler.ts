import googlethis from 'googlethis'
import { load, extract } from '@node-rs/jieba'
import { translateZh2En } from '~/server/services/sogouTranslate'

load()

const search = async (query: string) => {
  try {
    const queryInEnglish = (await translateZh2En(query.substring(0, 5000))).text
    const searchQueries = [
      extract(queryInEnglish, 16).map(w => w.keyword).join(', '),
      query.substring(0, 256),
    ]
    const [results1, results2] = await Promise.all(searchQueries.map((query) => {
      return googlethis.search(query)
    }))
    console.log('SEARCH:', searchQueries)
    const summarize = [...new Set([
      ...results1.results,
      ...results2.results
    ].map((r) => `# ${r.title}\n${r.description}`))].join('\n\n')
    return `Here are references from the internet. Use only when necessary:\n${summarize}`
  } catch (err) {
    console.error(err)
    return ''
  }
}

const crawler = {
  search
}

export default crawler
