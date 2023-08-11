import translate from '~/utils/google-translate-api'

export default defineEventHandler(async () => {
  return translate('Hi')
})
