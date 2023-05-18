import { version } from '~/package.json'

console.log('Version:', version)

export default defineEventHandler(async (event) => {
  return version
})
