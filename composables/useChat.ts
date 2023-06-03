import { ElMessage, ElLoading } from 'element-plus'
import {
  webBrowsing as webBrowsingCookieName,
  temperatureSuffix as temperatureSuffixCookieName,
} from '~/config/cookieNames'
import baseConverter from '~/utils/baseConverter'

const CONTEXT_MAX_TOKENS = 1024
const CONTEXT_MAX_LENGTH = 2048

const contexts: string[] = []

const checkContext = () => {
  while (contexts.length > 1 && contexts.slice(1, contexts.length).join('').length > CONTEXT_MAX_LENGTH) {
    contexts.shift()
  }
}

const getContext = () => {
  if (!contextMode.value) {
    return ''
  }
  checkContext()
  const joinedContexts = contexts.join('\n---\n')
  if (joinedContexts.length === 0) {
    return ''
  }
  return `Conversation history\n===\n${joinedContexts}`
}

const addContext = (question = '', answer = '', check = true) => {
  contexts.push(`Question: ${question}\nAnswer: ${answer}`)
  if (check) {
    checkContext()
  }
}

const clearContext = () => {
  contexts.splice(0, contexts.length)
}

const allowedWebBrowsingModes: any[] = ['OFF', 'BASIC', 'ADVANCED']
// const allowedWebBrowsingModes: any[] = ['OFF', 'BASIC']
const DEFAULT_WEB_BROWSING_MODE = 'OFF'
const webBrowsingMode = ref(DEFAULT_WEB_BROWSING_MODE)

interface SavedChatMessage {
  Q: string;
  A: string;
  t: Date;
}

interface ChatMessage {
  type: string;
  text: string;
  t: Date;
}

const messages = ref<Array<ChatMessage>>([])

const conversations = ref<Array<{ id: string, name: string | undefined }>>([])

const context = {
  add: addContext,
  get: getContext,
  clear: clearContext
}
const currentConv = ref('')

const focusInput = () => {
  (document.querySelector('.InputBox textarea') as HTMLElement).focus()
}

const checkTokenAndGetConversations = () => {
  return new Promise((resolve, reject) => {
    $fetch('/api/token/check', { method: 'POST' })
      .then((_conversations) => {
        const { list, named } = _conversations
        conversations.value = list.sort().map((id) => ({ id, name: named[id] as string | undefined }))
        resolve(true)
      })
      .catch((err) => {
        ElMessage.error('Initialization Failed')
        reject(err)
      })
  })
}

const fetchHistory = (conv: string | null) => {
  return new Promise((resolve, reject) => {
    const convIdDemical = baseConverter.convert(conv as string, '64w', 10)
    currentConv.value = convIdDemical
    if (conv === undefined || conv === null) {
      context.clear()
      return resolve(true)
    }
    $fetch('/api/history', { method: 'POST', body: { id: conv } })
      .then((fetched) => {
        const records = fetched as Array<SavedChatMessage>
        if (records.length === 0) {
          navigateTo('/c/')
        }
        const _records = [] as Array<ChatMessage>
        for (const record of records) {
          const { Q, A, t: _t } = record
          const t = new Date(_t)
          _records.push({ type: 'Q', text: Q, t }, { type: 'A', text: A, t })
          context.add(Q, A, false)
        }
        messages.value.unshift(..._records)
        resolve(true)
      })
      .catch((err) => {
        ElMessage.error('There was an error loading the conversation.')
        reject(err)
      })
  })
}

const initPage = (conv: string | null, skipHistoryFetching = false) => {
  if (!skipHistoryFetching) {
    context.clear()
    const loading = ElLoading.service()
    Promise.all([
      conv === null ? null : checkTokenAndGetConversations(),
      fetchHistory(conv)
    ])
      .finally(() => {
        useScrollToBottom()
        if (loading !== null) {
          setTimeout(() => {
            loading.close()
          }, 500)
        }
      })
  }
}

const DEFAULT_TEMPERATURE = '_t05'
const temperatureSuffix = ref<'_t00'|'_t01'|'_t02'|'_t03'|'_t04'|'_t05'|'_t06'|'_t07'|'_t08'|'_t09'|'_t10'>(DEFAULT_TEMPERATURE)

const contextMode = ref(true)

const openSidebar = ref(true)

export default function () {
  const cookie = useUniCookie()
  const previousWebBrowsingMode = cookie.get(webBrowsingCookieName)
  if (allowedWebBrowsingModes.includes(previousWebBrowsingMode)) {
    webBrowsingMode.value = previousWebBrowsingMode as string
  }
  const previousTemperatureSuffix = cookie.get(temperatureSuffixCookieName) || ''
  if (/_t(?:0[0-9]|10)/.test(previousTemperatureSuffix)) {
    // @ts-ignore
    temperatureSuffix.value = previousTemperatureSuffix
  }
  watch(webBrowsingMode, (newValue) => {
    if (typeof newValue === 'string') {
      cookie.set(webBrowsingCookieName, newValue, {
        path: '/'
      })
    }
  })
  watch(temperatureSuffix, (newValue) => {
    cookie.set(temperatureSuffixCookieName, newValue, {
      path: '/'
    })
  })
  const nuxtApp = useNuxtApp()
  const getCurrentConvId = () => {
    return nuxtApp._route?.params?.conv
  }
  const getCurrentConvName = () => {
    const currentConvId = getCurrentConvId()
    return conversations.value
      .filter((conv) => conv.id === currentConvId)[0].name || ''
  }
  const goToChat = (conv: string | null, force = false, skipHistoryFetching = false) => {
    const currentConvId = getCurrentConvId()
    if (force || (currentConvId !== conv || conv === null)) {
      messages.value = []
      initPage(conv, skipHistoryFetching)
    }
    openSidebar.value = false
    focusInput()
  }
  return {
    conversations,
    messages,
    context,
    webBrowsingMode,
    temperatureSuffix,
    contextMode,
    openSidebar,
    getCurrentConvId,
    getCurrentConvName,
    checkTokenAndGetConversations,
    initPage,
    goToChat
  }
}
