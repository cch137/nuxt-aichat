import { translateZh2En } from '~/server/services/sogouTranslate'
import qs from 'qs'

export default defineEventHandler(async (event) => {
  const text = qs.parse(event?.node?.req?.url?.split('?')[1] as string).text as string
  return (await translateZh2En(text)).text
})
