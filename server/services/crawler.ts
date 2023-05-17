import googlethis from 'googlethis'
// import { load, extract } from '@node-rs/jieba'
import { translateZh2En } from '~/server/services/sogouTranslate'

// load()

const crawler = async (query: string) => {
  try {
    const englishQuery = (await translateZh2En(query.substring(0, 5000))).text
    // const extratedQuery = extract(englishQuery, 16).map(w => w.keyword).join(', ')
    // const [results1, results2] = await Promise.all([
    const [results1] = await Promise.all([
      googlethis.search(query.substring(0, 256)),
      // googlethis.search(extratedQuery)
    ])
    const summarize = [...new Set([
      ...results1.results.map((r) => `# ${r.title}\n${r.description}`),
      // ...results2.results.map((r) => `# ${r.title}\n${r.description}`)
    ])].join('\n\n')
    const report = `Here are references from the internet. Use only when necessary:\n${summarize}`
    return report
  } catch (err) {
    console.error(err)
    return ''
  }
}

export default crawler
