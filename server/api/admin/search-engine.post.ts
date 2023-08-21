import checkPassword from '~/server/services/admin/checkPassword'
import admin from '~/server/services/admin'
import { readBody } from 'h3'
import type { AvailableSearchEngine } from '~/server/services/webBrowsing/search'

export default defineEventHandler(async function (event) {
  let isLoggedIn = await checkPassword(event)
  if (!isLoggedIn) {
    return { error: 'Not Logged In' }
  }
  try {
    admin.searchEngineConfig.value = (await readBody(event))?.value as AvailableSearchEngine
    return {}
  } catch (error) {
    return { error }
  }
})
