import { version } from '~/config/server'

export default defineEventHandler(async (event) => {
  return (await version) || ''
})
