import { getUidByToken } from '~/server/services/token'
import { mask } from '~/utils/masker'

export default defineEventHandler(async (event) => {
  const uid = getUidByToken(event)
  return mask(uid || '', '64w', 1, 4896).substring(1)
})
