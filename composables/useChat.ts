import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import {
  webBrowsing as webBrowsingCookieName,
  temperatureSuffix as temperatureSuffixCookieName,
} from '~/config/cookieNames'
import baseConverter from '~/utils/baseConverter'
import random from '~/utils/random'
import troll from '~/utils/troll'
import str from '~/utils/str'
import { getScrollTop } from '~/utils/client'
import type { AchivedChatMessage } from '~/server/services/curva/getHistory'

const model = ref('gpt4')

const CONTEXT_MAX_LENGTH = 3000

const getContext = () => {
  if (!contextMode.value) {
    return ''
  }
  const contexts = messages.value.filter((msg) => msg.done)
    .map((msg) => `Question: ${msg.Q}\nAnswer: ${msg.A}`)
  while (contexts.length > 1 && contexts.slice(1, contexts.length).join('').length > CONTEXT_MAX_LENGTH) {
    contexts.shift()
  }
  const joinedContexts = contexts.join('\n---\n')
  if (joinedContexts.length === 0) {
    return ''
  }
  contexts.push()
  return `Conversation history\n===\n${joinedContexts}`
}

const allowedWebBrowsingModes: any[] = ['OFF', 'BASIC', 'ADVANCED']
// const allowedWebBrowsingModes: any[] = ['OFF', 'BASIC']
const DEFAULT_WEB_BROWSING_MODE = 'OFF'
const webBrowsingMode = ref(DEFAULT_WEB_BROWSING_MODE)

// @ts-ignore
interface DisplayChatMessage extends AchivedChatMessage {
  done: boolean;
  t: Date;
  id?: string;
  more?: string[];
}

const messages = ref<DisplayChatMessage[]>([])

const conversations = ref<Array<{ id: string, name: string | undefined }>>([])

const currentConv = ref('')

const focusInput = () => {
  (document.querySelector('.InputBox textarea') as HTMLElement).focus()
}

const getQuestionSuggestions = async function (question: string) {
  // @ts-ignore
  return (await $fetch('/api/chat/suggestions', { method: 'POST', body: { question } })) as string[]
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
      return resolve(true)
    }
    $fetch('/api/chat/history', { method: 'POST', body: { id: conv } })
      .then(async (fetched) => {
        // @ts-ignore
        const archived = fetched as AchivedChatMessage[]
        if (!archived || archived.length === 0) {
          navigateTo('/c/')
        }
        messages.value.unshift(...archived.map((msg) => reactive({
          ...msg,
          t: new Date(msg.t),
          done: Boolean(msg.A),
        })))
        resolve(true)
        const lastMessage = messages.value.at(-1) as DisplayChatMessage
        getQuestionSuggestions(lastMessage.Q)
          .then((more) => {
            const isAtBottom = getScrollTop() >= document.body.clientHeight
            lastMessage.more = more
            if (isAtBottom) {
              useScrollToBottom()
            }
          })
      })
      .catch((err) => {
        ElMessage.error('There was an error loading the conversation.')
        reject(err)
      })
  })
}

const initPage = (conv: string | null, skipHistoryFetching = false) => {
  if (!skipHistoryFetching) {
    const loading = ElLoading.service()
    Promise.all([
      conv === null ? null : checkTokenAndGetConversations(),
      fetchHistory(conv)
    ])
      .finally(() => {
        useScrollToBottom()
        if (loading !== null) {
          useScrollToBottom(500)
            .finally(() => loading.close())
        }
      })
  }
}

const DEFAULT_TEMPERATURE = '_t05'
const temperatureSuffix = ref<'_t00'|'_t01'|'_t02'|'_t03'|'_t04'|'_t05'|'_t06'|'_t07'|'_t08'|'_t09'|'_t10'>(DEFAULT_TEMPERATURE)

const contextMode = ref(true)

const openMenu = ref(false)
const openSidebar = ref(openMenu.value)
const openDrawer = ref(openMenu.value)

const inputValue = ref('')

const { h: createHash } = troll

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
  return { conv, context: getContext(), prompt: message, model, web, t, tz }
}

const createRequest = (message: string) => {
  const date = new Date()
  const t = date.getTime()
  const tz = (date.getTimezoneOffset() / 60) * -1
  const body = createBody(message, getModel(), getWebBrowsing(), t, tz)
  const headers = createHeaders(message, body.context, t)
  return $fetch('/api/chat/answer', { method: 'POST', headers, body })
}

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
    return nuxtApp._route?.params?.conv as string
  }
  const getCurrentConvName = () => {
    const currentConvId = getCurrentConvId()
    return conversations.value
      .filter((conv) => conv.id === currentConvId)[0].name || ''
  }
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
  })
  watch(openDrawer, (value) => {openMenu.value = value})
  watch(openSidebar, (value) => {openMenu.value = value})
  const goToChat = (conv: string | null, force = false, skipHistoryFetching = false) => {
    const currentConvId = getCurrentConvId()
    if (force || (currentConvId !== conv || conv === null)) {
      messages.value = []
      initPage(conv, skipHistoryFetching)
    }
    if (useDevice().isMobileScreen) {
      openMenu.value = false
    }
    focusInput()
  }
  // @ts-ignore
  const _t = useLocale().t
  const version = useState('version')
  const sendMessage = (forceMessage?: string): boolean => {
    const loadingMessagesAmount = document.querySelectorAll('.Message.T').length
    if (loadingMessagesAmount > 1) {
      ElMessage.info('Thinking too many questions.')
      return false
    }
    const _messageText = forceMessage ? forceMessage : inputValue.value
    const messageText = _messageText.trim()
    if (_messageText === inputValue.value) {
      inputValue.value = ''
    }
    if (messageText === '') {
      return false
    }
    const message = createMessage(messageText, '', false)
    messages.value.push(message)
    useScrollToBottom()
    createRequest(messageText)
      .then((res) => {
        const id = (res as any).id as string
        const answer = (res as any).answer as string
        const urls = (res as any).urls as string[]
        const queries = (res as any).queries as string[]
        const dt = (res as any).dt as number
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
        message.id = id
        message.A = answer
        message.urls = urls || []
        message.queries = queries || []
        message.dt = dt || undefined
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
        message.A = 'Oops! Something went wrong!'
      })
      .finally(() => {
        message.done = true
        message.t = new Date()
      })
    getQuestionSuggestions(messageText)
      .then((more) => {
        const isAtBottom = getScrollTop() >= document.body.clientHeight
        message.more = more
        if (isAtBottom) {
          useScrollToBottom()
        }
      })
      .catch(() => {})
    return true
  }
  const exportAsMarkdown = () => {
    ElMessage.info('This feature is not available yet.')
    // let i = 1
    // const markdownContent = messages.value.map((msg) => {
    //   if (msg.type === 'Q') {
    //     return `QUESTION ${i}:\n\n${msg.text.replaceAll('\n', '\n\n')}`
    //   }
    //   if (msg.type === 'A') {
    //     return `ANSWER ${i++}:\n\n${msg.text}`
    //   }
    //   return '(Unknown message)'
    // }).join('\n\n---\n\n') + '\n\n---\n\n'
    // const a = document.createElement('a')
    // const filename = `${baseConverter.convert(getCurrentConvId(), '64w', 10)}.md`
    // a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(markdownContent))
    // a.setAttribute('download', filename)
    // a.style.display = 'none'
    // document.body.appendChild(a)
    // a.click()
    // a.remove()
  }
  return {
    model,
    conversations,
    messages,
    webBrowsingMode,
    temperatureSuffix,
    contextMode,
    openMenu,
    openSidebar,
    openDrawer,
    inputValue,
    getCurrentConvId,
    getCurrentConvName,
    checkTokenAndGetConversations,
    initPage,
    goToChat,
    sendMessage,
    focusInput,
    exportAsMarkdown,
  }
}
