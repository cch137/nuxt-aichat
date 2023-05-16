<template>
  <div class="InputBox fixed pt-20 pb-4 px-4 w-screen">
    <el-form ref="inputForm" class="mx-auto mb-2 max-w-full" @submit.prevent>
      <el-form-item style="margin: 0;">
        <div class="flex gap-3 w-full">
          <el-button
            type="danger"
            size="large"
            class="DeleteButton"
            :icon="Delete"
            plain
            @click="clearMessages"
          />
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
import { Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import random from '~/utils/random'
import troll from '~/utils/troll'
import str from '~/utils/str'

const inputValue = ref('')
const context = ref('')
const messages = useState('messages', () => [] as Array<{ type: string, text: string, t: Date }>)

const f = () => $fetch
const { h: createHash } = troll
const conv = random.base64(8)
const model = useState('model')

if (process.client) {
  const loading = ElLoading.service()
  f()('/api/token/check', { method: 'POST' })
    .catch(() => ElMessage.error('Initialization Failed'))
    .finally(() => loading.close())
}

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

const clearMessages = () => {
  ElMessageBox.confirm(
    'Do you want to clear the current conversation?',
    'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
    .then(() => {
      context.value = ''
      messages.value = []
      ElMessage.success('Cleared current conversation')
    })
    .catch(() => {
      ElMessage.info('Clear canceled')
    })
    .finally(() => {
      focusInput()
    })
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
      // @ts-ignore
      if (!answer) {
        throw 'Please refresh the page.'
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
