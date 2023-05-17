import googlethis from 'googlethis'
import { load, extract } from '@node-rs/jieba'
import { translateZh2En } from '~/server/services/sogouTranslate'

load()

const crawler = async (query: string) => {
  try {
    const englishQuery = (await translateZh2En(query.substring(0, 5000))).text
    const searchQuery = extract(englishQuery, 16).map(w => w.keyword).join(', ')
    const { results } = await googlethis.search(searchQuery)
    const summarize = results.map((result) => {
      return `# ${result.title}\n${result.description}\n`
    }).join('\n')
    const report = `Here are references from the web that you can analyze and use (optional):\n${summarize}`
    return report
  } catch (err) {
    console.error(err)
    return ''
  }
}

export default crawler
