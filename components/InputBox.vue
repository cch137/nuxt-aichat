<template>
  <div class="InputBox fixed pt-20 pb-4 px-4 w-screen">
    <el-form ref="inputForm" class="mx-auto mb-2 max-w-full" @submit.prevent>
      <el-form-item style="margin: 0;">
        <div class="flex gap-3 w-full">
          <el-input
            v-model="inputValue"
            :autosize="{ minRows: 2, maxRows: 16 }"
            type="textarea"
            size="large"
            :maxlength="model === 'gpt4' ? 4096 : 2048"
            :autofocus="true"
            @keydown="keyboardSendMessage"
          />
          <el-button
            type="primary"
            size="large"
            @click="clickSendMessage"
          >
            {{ $t('chat.send') }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="text-center">
      <el-text type="info">
        {{ $t('footer.patient') }}
      </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import random from '~/utils/random'
import troll from '~/utils/troll'
import str from '~/utils/str'

const inputValue = ref('')
const { messages, context, webBrowsingMode } = useChat()
const conversations = useState('conversations', () => [] as string[])

// @ts-ignore
const _t = useLocale().t

const f = () => $fetch
const { h: createHash } = troll
const model = useState('model', () => 'gpt4')
const version = useState('version')

const apiPath = '/api/chat'

const getModel = () => {
  return model.value as string
}

const getWebBrowsing = () => {
  return webBrowsingMode.value as string
}

const getHashType = () => {
  return [77, 68, 53].map(c => String.fromCharCode(c)).join('') as 'MD5'
}

const createHeaders = (message: string, t: number) => {
  const hash = createHash(message, getHashType(), t)
  const timestamp = str(t)
  return { hash, timestamp }
}

const createBody = (message: string, model: string, web: string, t: number, tz: number) => {
  let conv = useNuxtApp()._route?.params?.conv as string
  if (!conv) {
    conv = random.base64(8)
    conversations.value.push(conv)
    navigateTo(`/c/${conv}`)
  }
  return { conv, context: context.get(), prompt: message, model, web, t, tz }
}

const focusInput = () => {
  (document.querySelector('.InputBox textarea') as any).focus()
}

const keyboardSendMessage = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    sendMessage()
    e.preventDefault()
    focusInput()
  }
}

const clickSendMessage = () => {
  sendMessage()
  focusInput()
}

const countLoadingMessages = () => document.querySelectorAll('.Message.T').length

const createRequestOptions = (message: string) => {
  const date = new Date()
  const t = date.getTime()
  const tz = (date.getTimezoneOffset() / 60) * -1
  const method = 'POST'
  const headers = createHeaders(message, t)
  const body = createBody(message, getModel(), getWebBrowsing(), t, tz)
  return { method, headers, body }
}

const createRequest = (message: string) => {
  return f()(apiPath, createRequestOptions(message) as any)
}

const createMessage = (type = 'T', text = '') => {
  return reactive({ type, text, t: new Date() })
}

const sendMessage = (): boolean => {
  if (countLoadingMessages() > 1) {
    ElMessage.info('Thinking too many questions.')
    return false
  }
  const message = inputValue.value.trim()
  inputValue.value = ''
  if (message === '') {
    return false
  }
  const answerMessage = createMessage()
  messages.value.push(createMessage('Q', message))
  messages.value.push(answerMessage)
  useScrollToBottom()
  createRequest(message)
    .then((res) => {
      const answer = (res as any).answer as string
      const isQuestionComplete = (res as any).complete as boolean
      const _version = (res as any).version as string
      // @ts-ignore
      if (!answer) {
        throw _t('error.plzRefresh')
      }
      if (_version !== version.value) {
        ElMessageBox.confirm(
          _t('action.newVersion'),
          _t('message.notice'), {
            confirmButtonText: _t('message.ok'),
            cancelButtonText: _t('message.cancel'),
            type: 'warning'
          })
          .then(() => {
            location.reload()
          })
          .finally(() => {
            focusInput()
          })
      }
      answerMessage.text = answer
      context.add(answer)
      if (!isQuestionComplete) {
        ElMessage.warning(_t('error.qTooLong'))
      }
    })
    .catch((err) => {
      ElMessage.error(err || 'Oops! Something went wrong!' as string)
      answerMessage.text = 'Oops! Something went wrong!'
    })
    .finally(() => {
      answerMessage.type = 'A'
      answerMessage.t = new Date()
    })
  return true
}
</script>

<style>
.InputBox {
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  background: linear-gradient(180deg, transparent, var(--el-bg-color) 58.85%);
}
.InputBox form {
  width: 960px;
}
.InputBox textarea {
  font-size: 1rem;
  resize: none;
}
.DeleteButton {
  padding: 12px !important;
}
.DeleteButton i {
  transform: scale(1.25);
}
</style>
