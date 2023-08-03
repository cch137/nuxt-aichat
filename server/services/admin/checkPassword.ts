import type { H3Event } from 'h3'
import { readBody } from 'h3'

export default async function (event: H3Event) {
  const body = await readBody(event)
  const password = body?.passwd as string | undefined
  return password === process.env.ADMIN_PASSWORD
}
