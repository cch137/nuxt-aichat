import { readBody } from 'h3'
import curva from '~/server/services/curva'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as any
  const question = body?.question as string
  const amout = body?.amout as number || undefined
  if (typeof question !== 'string') {
    return { error: 1 }
  }
  return await curva.suggestions(question, amout)
})
