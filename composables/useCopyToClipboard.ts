import { ElMessage } from 'element-plus'
import { copyToClipboard } from '~/utils/client'

export default function (text: string) {
  // @ts-ignore
  const _t = useLocale().t
  copyToClipboard(text)
    .then(() => ElMessage.success(_t('action.copySuccess')))
    .catch(() => ElMessage.error(_t('action.copyFailed')))
}
