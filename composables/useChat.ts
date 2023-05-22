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
  checkContext()
  const joinedContexts = [...contexts].reverse().join('\n---\n')
  if (joinedContexts.length === 0) {
    return ''
  }
  return `Here are your replies, from newest to oldest:\n${joinedContexts}`.substring(0, CONTEXT_MAX_LENGTH)
}

const addContext = (...texts: string[]) => {
  contexts.push(...texts)
  checkContext()
}

const clearContext = () => {
  contexts.splice(0, contexts.length)
}

const allowedWebBrowsingModes: any[] = ['OFF', 'BASIC', 'ADVANCED']
const DEFAULT_WEB_BROWSING_MODE = 'BASIC'
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
          navigateTo('/')
        }
        const _records = [] as Array<ChatMessage>
        context.add(...records.map((record) => {
          const { Q, A, t: _t } = record
          const t = new Date(_t)
          _records.push({ type: 'Q', text: Q, t }, { type: 'A', text: A, t })
          return A
        }))
        messages.value.unshift(..._records)
        resolve(true)
      })
      .catch((err) => {
        ElMessage.error('There was an error loading the conversation.')
        reject(err)
      })
  })
}

const initPage = (conv: string | null) => {
  const loading = ElLoading.service()
  Promise.all([
    conv === null ? null : checkTokenAndGetConversations(),
    fetchHistory(conv)
  ])
    .finally(() => {
      useScrollToBottom()
      setTimeout(() => {
        loading.close()
      }, 500)
    })
}

const DEFAULT_TEMPERATURE = '_05'
const temperatureSuffix = ref<'_00'|'_01'|'_02'|'_03'|'_04'|'_05'|'_06'|'_07'|'_08'|'_09'|'_10'>(DEFAULT_TEMPERATURE)

export default function () {
  const cookie = useUniCookie()
  const previousWebBrowsingMode = cookie.get(webBrowsingCookieName)
  if (allowedWebBrowsingModes.includes(previousWebBrowsingMode)) {
    webBrowsingMode.value = previousWebBrowsingMode as string
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
  const openDrawer = useState('openDrawer', () => false)
  const goToChat = (conv: string | null, force = false) => {
    const currentConvId = getCurrentConvId()
    if (force || (currentConvId !== conv || conv === null)) {
      messages.value = []
      initPage(conv)
    }
    openDrawer.value = false
    focusInput()
  }
  return {
    conversations,
    messages,
    context,
    webBrowsingMode,
    temperatureSuffix,
    getCurrentConvId,
    getCurrentConvName,
    checkTokenAndGetConversations,
    initPage,
    goToChat
  }
}
