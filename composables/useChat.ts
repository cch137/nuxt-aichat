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
import type { AchivedChatMessage } from '~/server/services/evo/getHistory'

const model = ref('gpt4')

const CONTEXT_MAX_LENGTH = 4000

const getContext = () => {
  if (!contextMode.value) {
    return ''
  }
  const contexts = messages.value.filter((msg) => msg.done)
    .map((message) => {
      return (message.Q ? `Question:\n${message.Q}` : '')
        + (message.Q && message.A ? '\n\n' : '')
        + (message.A ? `Answer:\n${message.A}` : '')
    })
  while (contexts.length > 1 && contexts.slice(1, contexts.length).join('').length > CONTEXT_MAX_LENGTH) {
    contexts.shift()
  }
  const joinedContexts = contexts.join('\n---\n')
  if (joinedContexts.length === 0) {
    return ''
  }
  contexts.push()
  return `Conversation History\n===\n${joinedContexts}`
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

const focusInput = () => {
  try {
    (document.querySelector('.InputBox textarea') as HTMLElement).focus()
  } catch {}
}

const checkTokenAndGetConversations = () => {
  return new Promise((resolve, reject) => {
    $fetch('/api/chat/check', { method: 'POST' })
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

const _fetchHistory = (conv: string | null) => {
  return new Promise<DisplayChatMessage[]>(async (resolve, reject) => {
    if (conv === null || conv === undefined) {
      return resolve([])
    }
    const archived = await $fetch('/api/chat/history', {
      method: 'POST',
      body: { id: conv }
    }) as AchivedChatMessage[]
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

const _fetchSuggestions = async function (question: string) {
  // @ts-ignore
  return (await $fetch('/api/chat/suggestions', { method: 'POST', body: { question } })) as string[]
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

const DEFAULT_TEMPERATURE = '_t05'
const temperatureSuffix = ref<'_t00'|'_t01'|'_t02'|'_t03'|'_t04'|'_t05'|'_t06'|'_t07'|'_t08'|'_t09'|'_t10'>(DEFAULT_TEMPERATURE)

const contextMode = ref(true)

const openMenu = ref(false)
const openSidebar = ref(openMenu.value)
const openDrawer = ref(openMenu.value)

const inputValue = ref('')

const createRequest = (() => {
  const { h: createHash } = troll
  const getModel = () => `${model.value}${temperatureSuffix.value}`
  const getWebBrowsing = () => webBrowsingMode.value as string
  const getHashType = () => [77, 68, 53].map(c => String.fromCharCode(c)).join('') as 'MD5'

  const createHeaders = (message: string, context: string, t: number) => ({
    hash: createHash(`${message}${context}`, getHashType(), t),
    timestamp: str(t)
  })

  const createBody = (message: string, model: string, web: string, t: number, tz: number, regenerateId?: string) => {
    let conv = useNuxtApp()._route?.params?.conv as string
    if (!conv) {
      conv = random.base64(8)
      conversations.value.push({ id: conv, name: undefined })
      navigateTo(`/c/${conv}?feature=new`)
    }
    return { conv, context: getContext(), prompt: message, model, web, t, tz, id: regenerateId }
  }

  return (message: string, regenerateId?: string) => {
    const date = new Date()
    const t = date.getTime()
    const tz = (date.getTimezoneOffset() / 60) * -1
    const body = createBody(message, getModel(), getWebBrowsing(), t, tz, regenerateId)
    const headers = createHeaders(message, body.context, t)
    return $fetch('/api/chat/answer', { method: 'POST', headers, body })
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

let chatLoadings = new Set<Promise<any>>()

const clear = () => {
  conversations.value = []
  messages.value = []
  navigateTo('/c/')
  first = true
}

let first = true

export default function () {
  const appName = useState('appName').value
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
    console.log(first, isNew)
    const chat = first && isNew
      ? new Promise((resolve) => resolve(navigateTo('/c/')))
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
  const sendMessage = (forceMessage?: string, regenerateId?: string): boolean => {
    const loadingMessagesAmount = document.querySelectorAll('.Message.T').length
    if (loadingMessagesAmount > 0) {
      ElMessage.info('Thinking too many questions.')
      return false
    }
    const _messageText = forceMessage === undefined ? inputValue.value : forceMessage
    const messageText = _messageText.trim()
    if (_messageText === inputValue.value) {
      inputValue.value = ''
      if (messageText === '') {
        return false
      }
    }
    const message = createMessage(messageText, '', false)
    messages.value.push(message)
    useScrollToBottom()
    setTimeout(() => {
      focusInput()
    }, 500)
    const more = _fetchSuggestions(messageText)
    createRequest(messageText, regenerateId)
      .then((res) => {
        const isAtBottom = getScrollTop() >= document.body.clientHeight
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
        if (isAtBottom) {
          useScrollToBottom()
        }
        more
          .then((more) => {
            const isAtBottom = getScrollTop() >= document.body.clientHeight
            message.more = more
            if (isAtBottom) {
              useScrollToBottom()
            }
          })
          .catch(() => {})
      })
      .catch((err) => {
        ElMessage.error(err || 'Oops! Something went wrong!' as string)
        message.A = 'Oops! Something went wrong!'
      })
      .finally(() => {
        message.done = true
        message.t = new Date()
      })
    return true
  }
  const regenerateMessage = async () => {
    const lastMessage = messages.value.pop()
    if (lastMessage === undefined) {
      return
    }
    if (!sendMessage(lastMessage.Q, lastMessage.id)) {
      messages.value.push(lastMessage)
    }
  }
  const deleteMessage = (base64MessageId: string) => {
    messages.value = messages.value.filter((msg) => msg.id !== base64MessageId)
    $fetch('/api/chat/answer', {
      method: 'DELETE',
      body: {
        conv: getCurrentConvId(),
        id: base64MessageId
      }
    })
      .then(() => ElMessage.info('The message has been deleted.'))
      .catch(() => ElMessage.error('An error occurred while deleting the message.'))
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
      .then(({ value: name }) => {
        $fetch('/api/chat/conv', { method: 'PUT', body: { id, name } })
          .then(async () => {
            ElMessage({
              type: 'success',
              message: _t('message.renameSuccess'),
            })
            await checkTokenAndGetConversations()
            try {
              useTitle(`${getCurrentConvName() || 'Chat'} - ${appName}`)
            } catch { useTitle(`Chat - ${appName}`) }
          })
          .catch(() => {
            ElMessage({
              type: 'error',
              message: 'Oops! Something went wrong!',
            })
          })
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
        $fetch('/api/chat/conv', {
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
  const downloadTextFile = (filename: string, content: string) => {
    const a = document.createElement('a')
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    a.setAttribute('download', filename)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
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
    loadChat,
    sendMessage,
    deleteMessage,
    regenerateMessage,
    focusInput,
    refreshConversation,
    renameConversation,
    deleteConversation,
    exportAsMarkdown,
    exportAsJson,
    clear
  }
}
