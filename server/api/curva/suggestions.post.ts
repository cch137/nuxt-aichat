// import { readBody } from 'h3'
// import evo from '~/server/services/evo'

export default defineEventHandler(async (event) => {
  return []
  // const body = await readBody(event) as any
  // const question = body?.question as string
  // const amout = body?.amout as number || undefined
  // if (typeof question !== 'string') {
  //   return { error: 1 }
  // }
  // return await evo.suggestions(question, amout)
})
