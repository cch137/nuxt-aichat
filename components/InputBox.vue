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
            maxlength="3000"
            :autofocus="true"
            @keydown="keyboardSendMessage"
          />
          <el-button
            type="primary"
            size="large"
            @click="clickSendMessage"
          >
            Send
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="text-center">
      <el-text type="info">
        Please be patient, this may take a few minutes.
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
const context = useState('context', () => '')
const messages = useState('messages', () => [] as Array<{ type: string, text: string, t: Date }>)
const conversations = useState('conversations', () => [] as string[])

const f = () => $fetch
const { h: createHash } = troll
const model = useState('model')
const version = useState('version')

const apiPath = '/api/chat'

const getModel = () => {
  return model.value as string
}

const getHashType = () => {
  return [77, 68, 53].map(c => String.fromCharCode(c)).join('') as 'MD5'
}

const createHeaders = (message: string, t: number) => {
  const hash = createHash(message, getHashType(), t)
  const timestamp = str(t)
  return { hash, timestamp }
}

const createBody = (message: string, model: string, t: number) => {
  let conv = useNuxtApp()._route?.params?.conv as string
  if (!conv) {
    conv = random.base64(8)
    conversations.value.push(conv)
    navigateTo(`/c/${conv}`)
  }
  return { conv, context: context.value, prompt: message, model, t }
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
  const t = Date.now()
  const method = 'POST'
  const headers = createHeaders(message, t)
  const body = createBody(message, getModel(), t)
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
      const _version = (res as any).version as string
      // @ts-ignore
      if (!answer) {
        throw 'Please refresh the page.'
      }
      if (_version !== version.value) {
        ElMessageBox.confirm(
          'A new version has been released! Do you want to reload the page?',
          'Notice', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
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
      context.value = answer
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
