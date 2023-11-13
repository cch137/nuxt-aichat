import { analyzeLanguage } from '~/utils/analyzeLanguages'

export default defineEventHandler(async (event) => {
  return analyzeLanguage('笑死我')
})
