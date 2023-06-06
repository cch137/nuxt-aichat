<template>
  <div class="InputBoxOuter flex fixed w-full">
    <div :style="`min-width: ${openSidebar ? '280px' : '0px'}; width: ${openSidebar ? '25%' : '0px'}; transition: .3s;`"></div>
    <div class="InputBox pt-20 pb-2 px-4 flex-1">
      <el-form ref="inputForm" class="mx-auto mb-2 max-w-full" @submit.prevent>
        <el-form-item style="margin: 0;">
          <div class="flex gap-3 w-full">
            <div class="w-full">
              <el-input
                v-model="inputValue"
                :autosize="{ minRows: 2, maxRows: 16 }"
                type="textarea"
                size="large"
                :maxlength="model === 'gpt4' ? 4096 : 2048"
                :autofocus="true"
                @keydown="(evt) => keyboardSendMessage(evt as KeyboardEvent)"
              />
            </div>
            <div class="InputBoxActionButtonGroup flex flex-col gap-1">
              <el-button
                type="primary"
                size="large"
                @click="clickSendMessage"
              >
                {{ $t('chat.send') }}
              </el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-text type="info">
          {{ $t('footer.patient') }}
        </el-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import random from '~/utils/random'
import troll from '~/utils/troll'
import str from '~/utils/str'

const inputValue = ref('')
const { conversations, messages, context, openSidebar, webBrowsingMode, temperatureSuffix } = useChat()

// @ts-ignore
const _t = useLocale().t

const f = () => $fetch
const { h: createHash } = troll
const model = useState('model', () => 'gpt4')
const version = useState('version')

const apiPath = '/api/chat'

const getModel = () => {
  return `${model.value}${temperatureSuffix.value}`
}

const getWebBrowsing = () => {
  return webBrowsingMode.value as string
}

const getHashType = () => {
  return [77, 68, 53].map(c => String.fromCharCode(c)).join('') as 'MD5'
}

const createHeaders = (message: string, context: string, t: number) => {
  const hash = createHash(`${message}${context}`, getHashType(), t)
  const timestamp = str(t)
  return { hash, timestamp }
}

const createBody = (message: string, model: string, web: string, t: number, tz: number) => {
  let conv = useNuxtApp()._route?.params?.conv as string
  if (!conv) {
    conv = random.base64(8)
    conversations.value.push({ id: conv, name: undefined })
    navigateTo(`/c/${conv}`)
  }
  return { conv, context: context.get(), prompt: message, model, web, t, tz }
}

const focusInput = () => {
  (document.querySelector('.InputBox textarea') as any).focus()
}

const keyboardSendMessage = (evt: KeyboardEvent) => {
  if (evt.key === 'Enter' && !evt.shiftKey) {
    sendMessage()
    evt.preventDefault()
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
  const body = createBody(message, getModel(), getWebBrowsing(), t, tz)
  const headers = createHeaders(message, body.context, t)
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
      const isQuestionComplete = 'complete' in (res as any)
        ? (res as any).complete
        : true
      const _version = (res as any).version as string
      if (!isQuestionComplete) {
        ElMessage.warning(_t('error.qTooLong'))
      }
      // @ts-ignore
      if (!answer) {
        throw _t('error.plzRefresh')
      }
      answerMessage.text = answer
      context.add(message, answer)
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
.InputBoxOuter {
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
.InputBox {
  background: linear-gradient(180deg, transparent, var(--el-bg-color) 58.85%);
}
.InputBox form {
  width: 100%;
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
.InputBoxActionButtonGroup {
  max-height: 1px;
  overflow: visible;
}
@media screen and (max-width: 600px) {
  .InputBoxActionButtonGroup {
    max-height: fit-content;
  }
}
</style>
