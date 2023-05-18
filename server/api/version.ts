import { version } from '~/config/app'

export default defineEventHandler(async (event) => {
  return version
})
