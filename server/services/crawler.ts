import googlethis from 'googlethis'

const crawler = async (query: string) => {
  try {
    const { results } = await googlethis.search(query)
    const summarize = results.map((result) => {
      return `# ${result.title}\n${result.description}\n`
    }).join('\n')
    const report = `Here are the web crawler search results, which you can refer to appropriately:\n${summarize}`
    return report
  } catch (err) {
    console.error(err)
    return ''
  }
}

export default crawler
