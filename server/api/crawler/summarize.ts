import qs from 'qs'
import { readBody } from 'h3'
import crawler from '~/server/services/crawler'

export default defineEventHandler(async (event) => {
  const query = qs.parse(event?.node?.req?.url?.split('?')[1] as string)?.query
    || (event.node.req.method === 'POST' ? (await readBody(event))?.query : '')
  if (query) {
    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    return await crawler.summarize(query)
  }
})
