import translate from '~/utils/google-translate'

export default defineEventHandler(async () => {
  return translate('你好先生')
})
