import qs from 'qs'
import formatBytes from '~/utils/formatBytes'

export default defineEventHandler(async (event) => {
  const format = qs.parse(event?.node?.req?.url?.split('?')[1] as string).format as string
  const memory = process.memoryUsage() as any
  if (format === 'json') {
    return memory
  }
  if (format === 'table') {
    const result = []
    for (const i in memory) {
      result.push(`<tr><td>${i}</td><td>${formatBytes(memory[i])}</td></tr>`)
    }
    return `<pre><table>${result.join('')}</table></pre>`
  }
})
