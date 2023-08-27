import streamManager from '~/utils/streamManager'
import { getUidByToken } from '~/server/services/token'

export default defineEventHandler(async (event) => {
  if (!getUidByToken(event)) {
    return { error: 1 }
  }
  const res = event.node.res
  const stream = streamManager.create()
  res.writeHead(200, 'OK', {
    'Content-Type': 'text/event-stream',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  res.write(stream.id)
  stream.pipe({
    data: (chunk) => (res.write(chunk)),
    end: () => { res.end(), stream.destroy() }
  })
  return
})
