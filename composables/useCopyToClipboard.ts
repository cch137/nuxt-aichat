import { ElMessage } from 'element-plus'
import { copyToClipboard } from '~/utils/client'

export default function (text: string) {
  copyToClipboard(text)
    .then(() => ElMessage.success('Copied!'))
    .catch(() => ElMessage.error('Copy failed.'))
}
