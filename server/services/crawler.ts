import googlethis from 'googlethis'
import { load, extract } from '@node-rs/jieba'

load()

const crawler = async (query: string) => {
  try {
    query = extract(query, 16).map(w => w.keyword).join(', ')
    const { results } = await googlethis.search(query)
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
