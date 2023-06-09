import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import {
  webBrowsing as webBrowsingCookieName,
  temperatureSuffix as temperatureSuffixCookieName,
} from '~/config/cookieNames'
import baseConverter from '~/utils/baseConverter'
import random from '~/utils/random'
import troll from '~/utils/troll'
import str from '~/utils/str'

const model = ref('gpt4')

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
  queries?: string[];
  urls?: string[];
  dt?: number;
  more?: string[];
}

interface ChatMessage {
  type: string;
  text: string;
  t: Date;
  queries?: string[];
  urls?: string[];
  dt?: number;
  more?: string[];
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

const predictMoreQuestions = async function (question: string) {
  // @ts-ignore
  return (await $fetch('/api/more', { method: 'POST', body: { question } })) as string[]
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
      .then(async (fetched) => {
        // @ts-ignore
        const records = fetched as Array<SavedChatMessage>
        if (records.length === 0) {
          navigateTo('/c/')
        }
        const _records = [] as Array<ChatMessage>
        for (const record of records) {
          const { Q, A, urls, queries, dt, t: _t } = record
          const t = new Date(_t)
          _records.push({ type: 'Q', text: Q, t }, { type: 'A', text: A, urls, queries, dt, t })
          context.add(Q, A, false)
        }
        messages.value.unshift(..._records)
        resolve(true)
        const lastQuestion = messages.value.at(-2) as ChatMessage
        const lastAnswer = messages.value.at(-1) as ChatMessage
        lastAnswer.more = await predictMoreQuestions(lastQuestion.text)
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
  return { conv, context: context.get(), prompt: message, model, web, t, tz }
}

const createRequest = (message: string) => {
  const date = new Date()
  const t = date.getTime()
  const tz = (date.getTimezoneOffset() / 60) * -1
  const body = createBody(message, getModel(), getWebBrowsing(), t, tz)
  const headers = createHeaders(message, body.context, t)
  return $fetch('/api/chat', { method: 'POST', headers, body })
}

const createMessage = (type = 'T', text = '') => {
  return reactive<ChatMessage>({
    type,
    text,
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
    return nuxtApp._route?.params?.conv
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
    const _message = forceMessage ? forceMessage : inputValue.value
    const message = _message.trim()
    if (_message === inputValue.value) {
      inputValue.value = ''
    }
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
        answerMessage.text = answer
        answerMessage.urls = urls || []
        answerMessage.queries = queries || []
        answerMessage.dt = dt || undefined
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
    predictMoreQuestions(message)
      .then((more) => {
        answerMessage.more = more
      })
      .catch(() => {})
    return true
  }
  return {
    model,
    conversations,
    messages,
    context,
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
    predictMoreQuestions
  }
}
