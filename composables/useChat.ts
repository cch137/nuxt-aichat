import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import {
  temperatureSuffix as temperatureSuffixCookieName,
  temperature as temperatureCookieName,
  webBrowsing as webBrowsingCookieName
} from '~/config/cookieNames'
import baseConverter from '~/utils/baseConverter'
import random from '~/utils/random'
import troll from '~/utils/troll'
import str from '~/utils/str'
import { getScrollTop } from '~/utils/client'
import type { ArchivedChatMessage, CurvaStandardResponse } from '~/server/services/chatbots/curva/types'
import useURLParams from './useURLParams'
import { customErrorCodes } from '~/config/customErrorCodes'
import { stringifyConvConfig } from '~/server/services/chatbots/curva/convConfig'
import { parseConvConfig } from '~/server/services/chatbots/curva/convConfig'
import type { NuxtApp } from 'nuxt/app'
import type { OpenAIMessage } from '~/server/services/chatbots/engines/cores/types'

// @ts-ignore
interface DisplayChatMessage extends ArchivedChatMessage {
  done: boolean;
  t: Date;
  id?: string;
  more?: string[];
}

let lastModifiedConv: string = ''

const focusInput = () => {
  try {
    (document.querySelector('.InputBox textarea') as HTMLElement).focus()
  } catch {}
}

const checkTokenAndGetConversations = () => {
  return new Promise((resolve, reject) => {
    $fetch('/api/curva/check', { method: 'POST' })
      .then((_conversations) => {
        const { list, saved } = _conversations
        conversations.value = list.sort().map((id) => ({
          id,
          name: saved[id]?.name,
          config: saved[id]?.config || '',
          mtime: saved[id]?.mtime || 0,
        })).sort((a, b) => a.mtime - b.mtime).reverse()
        resolve(true)
      })
      .catch((err) => {
        ElMessage.error('Initialization Failed')
        reject(err)
      })
  })
}

const _fetchHistory = (conv: string | null) => {
  return new Promise<DisplayChatMessage[]>(async (resolve, reject) => {
    if (conv === null || conv === undefined) {
      return resolve([])
    }
    // @ts-ignore
    const archived = await $fetch('/api/curva/history', {
      method: 'POST',
      body: { id: conv }
    }) as ArchivedChatMessage[]
    if (!archived || archived.length === 0) {
      navigateTo('/c/')
    }
    try {
      resolve(archived.map((msg) => reactive({
        ...msg,
        t: new Date(msg.t),
        done: Boolean(msg.A),
      })))
    } catch {
      navigateTo('/c/')
      resolve([])
    }
  })
}

const _fetchSuggestions = async function (question: string): Promise<string[]> {
  return []
  // @ts-ignore
  // return (await $fetch('/api/curva/suggestions', { method: 'POST', body: { question } })) as string[]
}

const _loadSuggestions = async () => {
  try {
    const lastMessage = messages.value.at(-1) as DisplayChatMessage
    const suggestions = await _fetchSuggestions(lastMessage.Q)
    const isAtBottom = getScrollTop() >= document.body.clientHeight
    lastMessage.more = suggestions
    if (isAtBottom) {
      useScrollToBottom()
    }
  } catch (err) {
    console.error(err)
  }
}

let nuxtApp: NuxtApp
const model = ref<string>('gpt4')
const contextMode = ref<boolean>(true)
const temperature = ref<number>(0.5)
const messages = ref<DisplayChatMessage[]>([])
const conversations = ref<Array<{ id: string, name?: string, config?: string }>>([])

const resetConvConfig = (showElMessage = false) => {
  model.value = 'gpt4'
  contextMode.value = true
  temperature.value = 0.5
  if (showElMessage) {
    ElMessage.success('Conversation settings have been reset.')
  }
}

resetConvConfig()

const openMenu = ref(false)
const openSidebar = ref(openMenu.value)
const openDrawer = ref(openMenu.value)

const inputValue = ref('')

const createRequest = (() => {
  const { h: createHash } = troll
  const getHashType = () => [77, 68, 53].map(c => String.fromCharCode(c)).join('') as 'MD5'

  const createHeaders = (messages: OpenAIMessage[], t: number) => ({
    hash: createHash(messages, getHashType(), t),
    timestamp: str(t)
  })

  const createBody = (messages: OpenAIMessage[], model: string, temperature: number, t: number, tz: number, regenerateId?: string) => {
    let conv = getCurrentConvId()
    if (!conv) {
      conv = random.base64(8)
      conversations.value.push({ id: conv, name: undefined })
      navigateTo(`/c/${conv}?feature=new`)
    }
    return { conv, messages, model, temperature, t, tz, id: regenerateId }
  }

  return async (message: DisplayChatMessage): Promise<CurvaStandardResponse> => {
    const date = new Date()
    const t = date.getTime()
    const tz = (date.getTimezoneOffset() / 60) * -1
    const formattedMessages = (() => {
      if (!contextMode.value) {
        return [{ role: 'user', content: message?.Q || '' }] as OpenAIMessage[]
      }
      const endIndex = (messages.value.lastIndexOf(message) + 1) || messages.value.length
      let _formattedMessages = messages.value.slice(0, endIndex)
      _formattedMessages = _formattedMessages.slice(_formattedMessages.length - 100)
      return _formattedMessages.map((message) => {
          return [
            { role: 'user', content: message.Q },
            { role: 'assistant', content: message.A }
          ].filter((m) => m.content) as OpenAIMessage[]
        }).flat()
    })()
    try {
      const body = createBody(formattedMessages, model.value, temperature.value, t, tz, message?.id)
      const headers = createHeaders(formattedMessages, t)
      // @ts-ignore
      return await $fetch('/api/curva/answer', { method: 'POST', headers, body })
    } catch {
      return { answer: '', error: 'Error while sending request.' }
    }
  }
})()

const createMessage = (Q = '', A = '', done = false) => {
  return reactive<DisplayChatMessage>({
    done,
    Q,
    A,
    queries: [] as string[],
    urls: [] as string[],
    dt: undefined as undefined | number,
    t: new Date(),
  })
}

const chatLoadings = new Set<Promise<any>>()

const clear = () => {
  conversations.value = []
  messages.value = []
  navigateTo('/c/')
  first = true
}

let first = true

function clearUrlParamsFeatureNew () {
  if (process.client) {
    const urlParams = useURLParams()
    if (urlParams.get('feature') === 'new') {
      urlParams.delete('feature')
      urlParams.save()
    }
  }
}

const downloadTextFile = (filename: string, content: string) => {
  const a = document.createElement('a')
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
  a.setAttribute('download', filename)
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const getCurrentConvId = () => {
  return nuxtApp._route?.params?.conv as string
}

const getCurrentConvName = () => {
  const currentConvId = getCurrentConvId()
  return conversations.value
    .filter((conv) => conv.id === currentConvId)[0]?.name || ''
}

async function updateConversation (id?: string, newname?: string) {
  return await $fetch('/api/curva/conv', {
    method: 'PUT',
    body: {
      id: id || getCurrentConvId(),
      name: newname || getCurrentConvName(),
      config: stringifyConvConfig({
        model: model.value,
        temperature: temperature.value,
        context: contextMode.value
      })
    }
  })
}

let isLoadingConvConfig = false

const loadConvConfig = (convId?: string | null) => {
  if (convId === undefined) {
    convId = getCurrentConvId()
  }
  if (convId === undefined || convId === null) {
    return
  }
  const config = parseConvConfig(conversations.value.filter((conv) => conv.id === convId)[0]?.config || '')
  const keys = Object.keys(config)
  if (keys.length === 0) {
    resetConvConfig()
  } else {
    isLoadingConvConfig = true
    try {
      for (const key of keys) {
        const value = config[key]
        switch (key) {
          case 'model':
            model.value = value
            break
          case 'temperature':
            temperature.value = value
            break
          case 'context':
            contextMode.value = value
            break
        }
      }
    } finally {
      isLoadingConvConfig = false
    }
  }
  ElMessage.info('Conversation settings have been loaded.')
}

setTimeout(() => {
  // Automatic update conversation config 自動更新對話設置
  let timeout: NodeJS.Timeout;
  [model, contextMode, temperature].forEach((variable) => {
    watch(variable, (newValue, oldValue) => {
      if (process.client && nuxtApp && (!isLoadingConvConfig) && newValue !== oldValue && chatLoadings.size === 0) {
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
          try {
            await updateConversation()
            ElMessage.info('Conversation settings have been saved.')
          } catch (err) {
            console.error(err)
            ElMessage.warning('Failed to save conversation settings.')
          } finally {
            clearTimeout(timeout)
          }
        }, typeof variable.value === 'number' ? 500 : 0)
      }
    })
  })
}, 1000)

const deleteMessage = (base64MessageId: string) => {
  messages.value = messages.value.filter((msg) => msg.id !== base64MessageId)
  $fetch('/api/curva/answer', {
    method: 'DELETE',
    body: {
      conv: getCurrentConvId(),
      id: base64MessageId
    }
  })
    .then(() => ElMessage.info('The message has been deleted.'))
    .catch(() => ElMessage.error('An error occurred while deleting the message.'))
}

const exportAsMarkdown = () => {
  let i = 0
  const filename = `${baseConverter.convert(getCurrentConvId(), '64w', 10)}.md`
  const markdownContent = messages.value.map((message) => {
    i++
    try {
      return (message.t ? `${new Date(message.t.getTime() - (message.dt || 0)).toLocaleString()}${message.dt === undefined ? '' : ' (Δt: ' + message.dt.toString() + 'ms)'}\n\n` : '')
        + (message.Q ? `QUESTION ${i}:\n\n${message.Q.replaceAll('\n', '\n\n')}` : '')
        + (message.Q && message.A ? '\n\n' : '')
        + (message.A ? `ANSWER ${i}:\n\n${message.A}` : '')
    } catch {
      return '(Unknown message)'
    }
  }).join('\n\n---\n\n') + '\n\n---\n\n'
  downloadTextFile(filename, markdownContent)
}

const exportAsJson = () => {
  downloadTextFile(`${baseConverter.convert(getCurrentConvId(), '64w', 10)}.json`, JSON.stringify(messages.value.map((msg) => ({
    question: msg.Q,
    answer: msg.A,
    created: new Date(msg.t.getTime()).toUTCString(),
    timeUsed: msg.dt || undefined,
    queries: msg.queries || undefined,
    urls: msg.urls || undefined,
  })), null, 4))
}

export default function () {
  const appName = useState('appName').value
  const cookie = useUniCookie()
  const previousTemperature = +(cookie.has(temperatureCookieName) ? cookie.get(temperatureCookieName) as string : 0.5)
  cookie.delete(webBrowsingCookieName, { path: '/' })
  cookie.delete(webBrowsingCookieName)
  cookie.delete(temperatureSuffixCookieName, { path: '/' })
  cookie.delete(temperatureSuffixCookieName)
  if (previousTemperature >= 0 && previousTemperature <= 1) {
    temperature.value = previousTemperature
  }
  watch(temperature, (newValue) => {
    temperature.value = Math.round(newValue * 10) / 10
    cookie.set(temperatureCookieName, `${newValue}`, {
      path: '/'
    })
  })
  nuxtApp = useNuxtApp()
  watch(openMenu, (value) => {
    if (useDevice().isMobileScreen) {
      openSidebar.value = false
      if (openDrawer.value !== value) {
        openDrawer.value = value
      }
    } else {
      openDrawer.value = false
      if (openSidebar.value !== value) {
        openSidebar.value = value
      }
    }
    setTimeout(() => {
      try {
        focusInput()
      } catch {}
    }, 0)
  })
  watch(openDrawer, (value) => {openMenu.value = value})
  watch(openSidebar, (value) => {openMenu.value = value})
  const _loadChat = async (conv: string | null) => {
    if (useDevice().isMobileScreen) {
      openMenu.value = false
    }
    messages.value = []
    const loading = ElLoading.service()
    try {
      const archived = await Promise.all([
        (conv === null && conversations.value.length > 0) ? null : checkTokenAndGetConversations(),
        (conv === null) ? null : _fetchHistory(conv)
      ])
      loadConvConfig(conv)
      const displayChatMessages = archived[1]
      if (displayChatMessages !== null && getCurrentConvId() === conv) {
        messages.value = displayChatMessages
        _loadSuggestions()
      }
    } finally {
      try {
        useTitle(`${getCurrentConvName() || 'Chat'} - ${appName}`)
      } catch {
        useTitle(`Chat - ${appName}`)
      }
      useScrollToBottom()
      if (loading !== null) {
        try {
          await useScrollToBottom(500)
        } finally {
          loading.close()
          try {
            await useScrollToBottom(500)
          } finally {}
        }
      }
    }
    setTimeout(() => focusInput(), 500)
  }
  const loadChat = async (conv: string | null, isNew = false) => {
    const promise = Promise.all([...chatLoadings])
    const chat = first && isNew
      ? new Promise(async (resolve) => {
          await _loadChat(conv)
          clearUrlParamsFeatureNew()
          resolve(null)
        })
      : isNew
        ? new Promise((resolve) => resolve(null))
        : _loadChat(conv)
    first = false
    chatLoadings.add(chat)
    try {
      await promise
    } catch {}
    try {
      await chat
    } finally {
      chatLoadings.delete(chat)
    }
  }
  // @ts-ignore
  const _t = useLocale().t
  const version = useState('version')
  const sendMessage = async (forceMessage?: string, regenerateId?: string): Promise<boolean> => {
    // 如果頁面中有其它問題正在回答，拒絕提交請求
    const loadingMessagesAmount = document.querySelectorAll('.Message.T').length
    if (loadingMessagesAmount > 0) {
      ElMessage.info('Please wait for the completion of the previous question.')
      focusInput()
      return false
    }
    
    // 整理 (trim) 訊息文字
    const messageText = (forceMessage !== undefined ? forceMessage : inputValue.value).trim()
    // 由當訊息文字由用戶輸入時：
    if (forceMessage === undefined) {
      // (1) 清空輸入組件
      inputValue.value = ''
      // (2) 輸入為空時拒絕提交請求
      if (messageText === '') {
        focusInput()
        return false
      }
    }

    // 創建 message 對象，並添加到 messages
    const message = (regenerateId
      ? messages.value.filter((msg) => msg.id === regenerateId).at(-1)
      : undefined) || createMessage(messageText, '', false)
    if (!messages.value.includes(message)){
      messages.value.push(message)
    }
    message.done = false
    message.A = ''
    message.urls = []
    message.queries = []

    // 優化用戶體驗：(1) 滑到底部 (2) focus 輸入組件
    useScrollToBottom()
    setTimeout(() => focusInput(), 500)

    // 【已被暫時取消功能】獲取更多問題建議
    const suggestionsResponse = _fetchSuggestions(messageText)

    // 記錄一些對話狀態（在完成請求後使用）
    const isAtBottom = getScrollTop() >= document.body.clientHeight
    const convId = getCurrentConvId()

    // 發送請求
    const response = await createRequest(message)

    // 更新對話狀態
    clearUrlParamsFeatureNew()
    if (lastModifiedConv !== convId) {
      lastModifiedConv = convId
      checkTokenAndGetConversations()
        .then(() => {
          try {
            (document.querySelector('.ConversationList') as Element).scrollTop = 0
          } catch {}
        })
    }

    // 更新訊息狀態
    const { id, answer = '', error, urls = [], queries = [], dt = 0, version: _version } = response
    message.done = true
    message.t = new Date()
    message.dt = dt || undefined
    message.id = id || undefined
    message.A = answer || ''
    message.urls = urls || []
    message.queries = queries || [];

    // 檢查錯誤
    const isErrorExists = ((errorMessage?: { content?: string, type?: string }) => {
      if (errorMessage) {
        if (errorMessage.type === 'warning') {
          ElMessage.warning(errorMessage.content)
        } else {
          ElMessage.error(errorMessage.content)
        }
        message.A = 'Oops! Something went wrong!'
        return true
      }
      return false
    })((() => {
      if (answer === '') {
        if (error) {
          const msgIndex = messages.value.indexOf(message)
          switch (error) {
            case 'THINKING':
              // 正在回答其它問題
              messages.value.splice(msgIndex, 1)
              inputValue.value = messageText
              return { type: 'warning', content: customErrorCodes.get(error) }
            default:
              // 其他錯誤
              return { type: 'error', content: error }
          }
        }
        // 未知錯誤
        return { type: 'error', content: _t('error.plzRefresh') }
      }
    })());

    setTimeout(() => {
      // 優化用戶體驗：滑到底部，選取輸入框
      if (isAtBottom) {
        useScrollToBottom()
          .finally(() => focusInput())
      }
      // 檢查版本更新
      if (_version && _version !== version.value) {
        ElMessageBox.confirm(_t('action.newVersion'), _t('message.notice'), {
          confirmButtonText: _t('message.ok'),
          cancelButtonText: _t('message.cancel'),
          type: 'warning'
        })
          .then(() => {
            const loading = ElLoading.service()
            location.reload()
            setTimeout(() => loading.close(), 3000)
          })
          .catch(() => focusInput())
      }
    }, 0);

    suggestionsResponse
      .then((more) => {
        const isAtBottom = getScrollTop() >= document.body.clientHeight
        message.more = more
        if (isAtBottom) {
          useScrollToBottom()
        }
      })

    return isErrorExists
  }
  const regenerateMessage = async (message?: DisplayChatMessage) => {
    if (messages.value.length === 0) {
      return
    }
    const { Q, id } = message || messages.value.at(-1) as DisplayChatMessage
    sendMessage(Q || '', id)
  }
  const refreshConversation = () => {
    loadChat(getCurrentConvId())
  }
  const renameConversation = (id?: string, defaultName = '') => {
    if (!id) {
      id = getCurrentConvId()
      defaultName = getCurrentConvName()
    }
    ElMessageBox.prompt(_t('message.renameConvHint'), _t('message.setting'), {
      confirmButtonText: _t('message.ok'),
      cancelButtonText: _t('message.cancel'),
      inputValue: defaultName,
      inputPlaceholder: baseConverter.convert(id, '64w', 10)
    })
      .then(async ({ value: name }) => {
        try {
          await updateConversation(id, name)
          ElMessage({
            type: 'success',
            message: _t('message.renameSuccess'),
          })
          await checkTokenAndGetConversations()
          try {
            useTitle(`${getCurrentConvName() || 'Chat'} - ${appName}`)
          } catch { useTitle(`Chat - ${appName}`) }
        } catch {
          ElMessage({
            type: 'error',
            message: 'Oops! Something went wrong!',
          })
        }
      })
      .catch(() => {})
  }
  const deleteConversation = (targetConvId?: string) => {
    const id = targetConvId ? targetConvId : getCurrentConvId()
    const _conversations = [...conversations.value]
    let currentConvIndex = -1
    let nextConvId = 'createNewChat'
    for (let i = 0; i < _conversations.length; i++) {
      if (_conversations[i].id === id) {
        currentConvIndex = i
        break
      }
    }
    if (currentConvIndex !== -1) {
      const beforeConv = _conversations[currentConvIndex - 1]?.id
      const afterConv = _conversations[currentConvIndex + 1]?.id
      if (beforeConv !== undefined) {
        nextConvId = beforeConv 
      } else if (afterConv !== undefined) {
        nextConvId = afterConv
      }
    }
    ElMessageBox.confirm(
      _t('message.deleteConvConfirm'),
      _t('message.warning'), {
        confirmButtonText: _t('message.ok'),
        cancelButtonText: _t('message.cancel'),
        type: 'warning'
      })
      .then(() => {
        const loading = ElLoading.service()
        $fetch('/api/curva/conv', {
          method: 'DELETE',
          body: { id }
        })
          .finally(async () => {
            loading.close()
            if (targetConvId === getCurrentConvId()) {
              document.getElementById(nextConvId)?.click()
            } else {
              await checkTokenAndGetConversations()
            }
          })
      })
  }
  return {
    model,
    conversations,
    messages,
    temperature,
    contextMode,
    openMenu,
    openSidebar,
    openDrawer,
    inputValue,
    getCurrentConvId,
    getCurrentConvName,
    checkTokenAndGetConversations,
    loadChat,
    sendMessage,
    deleteMessage,
    regenerateMessage,
    focusInput,
    refreshConversation,
    renameConversation,
    deleteConversation,
    resetConvConfig,
    exportAsMarkdown,
    exportAsJson,
    clear
  }
}
