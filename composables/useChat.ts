import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import baseConverter from '~/utils/baseConverter'
import random from '~/utils/random'
import { hx as createHash } from '~/utils/troll'
import str from '~/utils/str'
import type { ArchivedChatMessage, CurvaStandardResponse } from '~/server/services/chatbots/curva/types'
import useURLParams from './useURLParams'
import { customErrorCodes } from '~/config/customErrorCodes'
import { stringifyConvConfig, parseConvConfig } from '~/server/services/chatbots/curva/convConfig'
import type { NuxtApp } from 'nuxt/app'
import type { OpenAIMessage } from '~/server/services/chatbots/engines/cores/types'
import models from '~/config/models'

// @ts-ignore
interface DisplayChatMessage extends ArchivedChatMessage {
  done: boolean;
  t: Date;
  id?: string;
  more?: string[];
}

let nuxtApp: NuxtApp
let lastModifiedConv: string = ''
const model = ref<string>('gpt4')
const contextMode = ref<boolean>(true)
const temperature = ref<number>(0.5)
const messages = ref<DisplayChatMessage[]>([])
const conversations = ref<Array<{ id: string, name: string, config: string, mtime: number }>>([])

const editingQuestion = ref<DisplayChatMessage>()
const isEditingQuestion = ref<boolean>(false)
const editingQuestionContent = ref<string>('')
function callEditQuestionDialog (message: DisplayChatMessage) {
  isEditingQuestion.value = true
  editingQuestion.value = message
  editingQuestionContent.value = message.Q
  setTimeout(() => _focusEditQuestionInput(), 0)
}
function _focusEditQuestionInput () {
  try {
    (document.querySelector('.EditQuestionInput textarea') as HTMLTextAreaElement).focus()
  } catch {}
}
watch(isEditingQuestion, (value) => !value ? focusInput() : null)

const editingAnswer = ref<DisplayChatMessage>()
const isEditingAnswer = ref<boolean>(false)
const editingAnswerContent = ref<string>('')
function callEditAnswerDialog (message: DisplayChatMessage) {
  isEditingAnswer.value = true
  editingAnswer.value = message
  editingAnswerContent.value = message.A
  setTimeout(() => _focusEditAnswerInput(), 0)
}
function _focusEditAnswerInput () {
  try {
    (document.querySelector('.EditAnswerInput textarea') as HTMLTextAreaElement).focus()
  } catch {}
}
watch(isEditingAnswer, (value) => !value ? focusInput() : null)

const focusInput = () => {
  try {
    if (process.client) {
      // 手機端不進行聚焦，因為觸屏已經很方便了
      if (useDevice().isMobileScreen) {
        return
      }
      const el = document.querySelector('.InputBox textarea') as HTMLElement
      el.click()
      el.focus()
    }
  } catch {}
}

const adjustConvesationListScroll = () => {
  try {
    const convParentEl = (document.getElementById(getCurrentConvId()) as HTMLElement).parentElement as HTMLElement
    const convListEl = document.querySelector('.ConversationList') as HTMLElement
    const maxScrollTop = convParentEl.offsetTop - convListEl.offsetTop - convParentEl.clientHeight / 2
    const minScrollTop = maxScrollTop - convListEl.clientHeight + convParentEl.clientHeight * 2
    if (convListEl.scrollTop > maxScrollTop) {
      convListEl.scrollTo({ left: 0, top: maxScrollTop, behavior: 'smooth' })
    }
    if (convListEl.scrollTop < minScrollTop) {
      convListEl.scrollTo({ left: 0, top: minScrollTop, behavior: 'smooth' })
    }
  } catch {}
}

const checkTokenAndGetConversations = () => {
  return new Promise((resolve, reject) => {
    $fetch('/api/curva/check', { method: 'POST' })
      .then((_conversations) => {
        conversations.value = _conversations
        adjustConvesationListScroll()
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
        done: true,
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
    const isAtBottom = useScrollToBottom.isAtBottom()
    lastMessage.more = suggestions
    if (isAtBottom) useScrollToBottom();
  } catch (err) {
    console.error(err)
  }
}

const resetConvConfig = (showElMessage = false) => {
  model.value = 'gemini-pro'
  contextMode.value = true
  temperature.value = 0.5
  if (showElMessage) {
    ElMessage.success('Conversation settings have been reset.')
  }
}

resetConvConfig()

const openMenu = ref(false)
const openSidebarController = ref(openMenu.value)
const openDrawerController = ref(openMenu.value)
watch(openSidebarController, (value) => { openMenu.value = value })
watch(openDrawerController, (value) => { openMenu.value = value })
watch(openMenu, (value) => {
  const { isMobileScreen } = useDevice()
  openSidebarController.value = isMobileScreen ? false : value
  openDrawerController.value = isMobileScreen ? value : false
  setTimeout(() => focusInput(), 0)
})
if (process.client) {
  let reopenMenuTimeout: NodeJS.Timeout
  let menuType: 'drawer' | 'sidebar' = useDevice().isMobileScreen ? 'drawer' : 'sidebar'
  window.addEventListener('resize', () => {
    clearTimeout(reopenMenuTimeout)
    reopenMenuTimeout = setTimeout(() => {
      const currMenyType = useDevice().isMobileScreen ? 'drawer' : 'sidebar'
      if (openMenu.value && currMenyType != menuType) {
        openMenu.value = false
        setTimeout(() => { openMenu.value = true }, 0)
        menuType = currMenyType
      }
    }, 100)
  })
}

const inputValue = ref('')
const inputMaxLength = computed(() => (
  model.value.startsWith('claude')
    ? 640000
    : 128000
  )
)

const createRequest = (() => {
  const getHashType = () => [77, 68, 53].map(c => String.fromCharCode(c)).join('') as 'MD5'

  const createHeaders = (messages: OpenAIMessage[], t: number) => ({
    hash: createHash(messages, getHashType(), t),
    timestamp: str(t)
  })

  const createBody = (messages: OpenAIMessage[], model: string, temperature: number, t: number, tz: number, regenerateId?: string, streamId?: string) => {
    let conv = getCurrentConvId()
    if (!conv) {
      conv = random.base64(8)
      conversations.value.unshift({ id: conv, name: '', mtime: Date.now(), config: '' })
      navigateTo(`/c/${conv}?feature=new`)
      setCurrentConvId(conv)
    }
    return { conv, messages, model, temperature, t, tz, id: regenerateId, streamId }
  }

  return async (message: DisplayChatMessage, streamId?: string): Promise<CurvaStandardResponse> => {
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
      const body = createBody(formattedMessages, model.value, temperature.value, t, tz, message?.id, streamId)
      const headers = createHeaders(formattedMessages, t)
      // @ts-ignore
      return await $fetch('/api/curva/answer', { method: 'POST', headers, body })
    } catch (err) {
      return { answer: '', error: (err as Error)?.message || 'Error while sending request.' }
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
      updateConversation()
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

const [currentConvIdComputed, getCurrentConvId, setCurrentConvId] = (() => {
  const currentConvIdComputed = ref('')
  return [
    computed(() => currentConvIdComputed.value),
    () => currentConvIdComputed.value,
    (value?: string) => currentConvIdComputed.value = value === undefined ? nuxtApp._route?.params?.conv as string : value,
  ]
})()

const getCurrentConvName = () => {
  const currConvId = getCurrentConvId()
  return conversations.value.find((conv) => conv.id === currConvId)?.name || ''
}

async function updateConversation (id?: string, newname?: string): Promise<{ cancel?: boolean, error?: string }> {
  id = id || getCurrentConvId()
  if (!id) {
    return { cancel: true }
  }
  // @ts-ignore
  return await $fetch('/api/curva/conv', {
    method: 'PUT',
    body: {
      id,
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
  const config = parseConvConfig(conversations.value.find((conv) => conv.id === convId)?.config || '')
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
            const _redirectModel = models.find(m => m.value === value)?.redirectTo
            model.value = _redirectModel || value
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
            const { cancel = false } = await updateConversation()
            if (!cancel) {
              ElMessage.info('Conversation settings have been saved.')
            }
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

const updateMessage = (message: DisplayChatMessage, keyToBeCleared?: 'Q' | 'A') => {
  if (keyToBeCleared !== undefined) {
    message[keyToBeCleared] = ''
  }
  const { id: base64MessageId, Q, A } = message
  messages.value = messages.value.filter((msg) => msg.Q || msg.A)
  $fetch('/api/curva/message', {
    method: 'PUT',
    body: {
      conv: getCurrentConvId(),
      id: base64MessageId,
      Q, A,
    }
  })
    .then(() => ElMessage.info(`The message has been ${keyToBeCleared ? 'deleted' : 'saved'}.`))
    .catch(() => ElMessage.error(`An error occurred while ${keyToBeCleared ? 'deleting' : 'saving'} the message.`))
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
  const openAiFormatMessages = messages.value.map((msg) => [
    { role: 'user', content: msg.Q },
    { role: 'assistant', content: msg.A },
  ]).flat().filter(m => m.content)
  downloadTextFile(`${baseConverter.convert(getCurrentConvId(), '64w', 10)}.json`, JSON.stringify(openAiFormatMessages, null, 4))
}

const exportAsJsonDetailed = () => {
  const openAiFormatMessages = messages.value.map((msg) => [
    {
      role: 'user',
      content: msg.Q
    },
    {
      role: 'assistant',
      content: msg.A,
      queries: msg.queries?.length ? msg.queries : undefined,
      urls: msg.urls?.length ? msg.urls : undefined,
      createdAt: new Date(msg.t.getTime()).toUTCString(),
      timeUsed: msg.dt || undefined,
    },
  ]).flat().filter(m => m.content)
  downloadTextFile(`${baseConverter.convert(getCurrentConvId(), '64w', 10)}.json`, JSON.stringify(openAiFormatMessages, null, 4))
}

if (process.client) {
  document.addEventListener('keyup', (e) => {
    switch (e.key) {
      case '/':
      case 'Enter':
        focusInput()
        break
      case 'Escape':
        openMenu.value = !openMenu.value
        break
    }
  })
}

const showScrollToBottomButton = ref(false)

if (process.client) {
  document.addEventListener('scroll', () => {
    showScrollToBottomButton.value = !isScrolledToBottom()
  })
}

export default function () {
  const { authEventTarget } = useAuth()
  const appName = useState('appName').value
  const cookie = useUniCookie()
  // 清除舊 cookie -- START --
  ;['temperature-suffix', 'web-browsing', 'temperature']
    .forEach((oldCookieName) => {
      cookie.delete(oldCookieName, { path: '/' })
      cookie.delete(oldCookieName)
    });
  // 清除舊 cookie --  END  --
  nuxtApp = useNuxtApp()
  const refreshPageTitle = () => {
    setTimeout(() => {
      try {
        useTitle(`${getCurrentConvName() || _t('chat.title')} - ${appName}`)
      } catch (err) {
        useTitle(`${_t('chat.title')} - ${appName}`)
      }
    }, 0)
  }
  authEventTarget.addListener('login', clear)
  authEventTarget.addListener('logout', clear)
  const _loadChat = async (conv: string | null) => {
    setTimeout(() => { if (useDevice().isMobileScreen) openMenu.value = false }, 0)
    messages.value = []
    const loading = ElLoading.service({ text: _t('chat.ldConv') + '...', lock: true })
    try {
      const fetchingConvList = (conv === null && conversations.value.length > 0) ? null : checkTokenAndGetConversations()
      const displayChatMessages = conv === null ? null : await _fetchHistory(conv)
      if (displayChatMessages !== null && getCurrentConvId() === conv) {
        messages.value = displayChatMessages
        _loadSuggestions()
      }
      await Promise.all([fetchingConvList, useScrollToBottom(1000)])
      loadConvConfig(conv) // 加載對話設置必須在 ConvList 取得之後
      setTimeout(() => refreshPageTitle(), 1000)
    } finally {
      loading.close()
      await useScrollToBottom(500)
      focusInput()
      adjustConvesationListScroll()
      await useScrollToBottom(500)
    }
  }
  const loadChat = async (conv: string | null, isNew = false) => {
    setCurrentConvId(conv || '')
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
    // 如果 model 為空，拒絕提交請求
    if (!model.value) {
      ElMessage.info('Please select a model.')
      focusInput()
      return false
    }
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
    const previousAnswer = message.A || ''
    message.done = false
    message.Q = messageText
    message.A = ''
    message.urls = []
    message.queries = []
    if (message.dt) message.dt = undefined

    // 【已被暫時取消功能】獲取更多問題建議
    const suggestionsResponse = _fetchSuggestions(messageText)

    // 記錄一些對話狀態（在完成請求後使用）
    const isAtBottom = useScrollToBottom.isAtBottom()
    const convId = getCurrentConvId()

    // 發送請求前：(1) 滑到底部 (2) focus 輸入組件
    if (isAtBottom) useScrollToBottom();
    focusInput()

    // 建立 stream 通道
    const typewriterSpeed = 1
    let isDonePending = false
    const streamId = await new Promise<string|undefined>(async (resolve) => {
      if (!(models.find(m => m.value === model.value)?.isStreamAvailable)) {
        return resolve(undefined)
      }
      const typewriter: string[] = []
      const typewriterInterval = setInterval(() => {
        if (typewriter.length) {
          message.A += typewriter.shift()
          useScrollToBottom.keepAtBottom()
        }
        if (message.done) {
          clearInterval(typewriterInterval)
          controller.abort()
        }
      }, typewriterSpeed)
      const controller = new AbortController()
      const streamRes = await fetch('/api/curva/stream', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
        signal: controller.signal
      })
      const decoder = new TextDecoder()
      // @ts-ignore
      const reader = streamRes.body.getReader()
      let idIsResolved = false
      const readChunks = async () => {
        await reader.read().then(async ({ value, done }) => {
          if (done) {
            if (typewriter.length === 0) {
              message.done = true
              return
            }
            isDonePending = true
            const donePending = setInterval(() => {
              if (typewriter.length === 0) {
                message.done = true
                isDonePending = false
                clearInterval(donePending)
              }
            }, typewriterSpeed)
            return
          }
          const decodedValue = decoder.decode(value)
          if (idIsResolved) {
            typewriter.push(decodedValue)
          } else {
            resolve(decodedValue)
            idIsResolved = true
          }
          readChunks()
        })
      }
      readChunks()
    })

    // 發送請求
    const response = await createRequest(message, streamId)

    // 更新對話狀態
    clearUrlParamsFeatureNew()
    if (lastModifiedConv !== convId) {
      checkTokenAndGetConversations()
        .finally(() => { lastModifiedConv = getCurrentConvId() })
    }

    // 更新訊息狀態
    const { id, answer = '', error, urls = [], queries = [], dt = 0, version: _version } = response
    if (isDonePending) {
      const donePending = setInterval(() => {
        if (!isDonePending) {
          message.done = true
          if (message.A !== answer) message.A = answer || ''
          clearInterval(donePending)
        }
      }, typewriterSpeed)
    } else {
      message.done = true
      if (message.A !== answer) message.A = answer || ''
    }
    message.t = new Date()
    message.dt = dt || undefined
    message.id = id || undefined
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
          const restoreInput = () => {
            if (regenerateId) {
              message.A = previousAnswer
            } else {
              messages.value.pop()
              inputValue.value = messageText
            }
          }
          if (typeof error === 'string' && error.startsWith('You have tried too many times.')) { 
            restoreInput()
            return { type: 'warning', content: error }
          }
          if (typeof error === 'string' && error.startsWith('BSONError:')) {
            location.reload()
          }
          switch (error) {
            case 'THINKING':
              // 正在回答其它問題
              restoreInput()
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

    setTimeout(async () => {
      // // 回答結束後滑到底部
      // if (!regenerateId && isAtBottom) {
      //   await useScrollToBottom()
      // }

      // 檢查版本更新
      if (_version && _version !== version.value) {
        const reloadTimeout = setTimeout(() => location.reload(), 3000)
        ElMessageBox.confirm(_t('action.newVersion'), _t('message.notice'), {
          confirmButtonText: _t('message.ok'),
          cancelButtonText: _t('message.cancel'),
          type: 'warning'
        })
          .then(() => focusInput())
          .catch(() => focusInput())
          .finally(() => {
            clearTimeout(reloadTimeout)
            const loading = ElLoading.service({ text: 'Loading...', lock: true })
            location.reload()
            // setTimeout(() => loading.close(), 10000)
          })
      }
    }, 0);

    // 之後修復這裡的時候要注意，因為 sendMessage 可能由於修改以前的對話，這樣的情況不需要 suggestions
    suggestionsResponse
      .then((more) => {
        const isAtBottom = useScrollToBottom.isAtBottom()
        message.more = more
        if (isAtBottom) useScrollToBottom();
      })

    return isErrorExists
  }
  const regenerateMessage = async (message?: DisplayChatMessage) => {
    if (messages.value.length === 0) {
      return
    }
    const { Q, id } = message || messages.value.pop() as DisplayChatMessage
    sendMessage(Q || '', id)
  }
  const refreshConversation = () => {
    loadChat(getCurrentConvId())
      .finally(() => focusInput())
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
          refreshPageTitle()
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
    let nextConvId = 'createNewChat'
    // 【原本功能】在刪除對話後，跳轉到該對話的下一個或上一個
    // 【取消原因】刪除對話後，讓用戶自行選擇需要加載哪一個對話。
    // const _conversations = [...conversations.value]
    // let currentConvIndex = -1
    // for (let i = 0; i < _conversations.length; i++) {
    //   if (_conversations[i].id === id) {
    //     currentConvIndex = i
    //     break
    //   }
    // }
    // if (currentConvIndex !== -1) {
    //   const beforeConv = _conversations[currentConvIndex - 1]?.id
    //   const afterConv = _conversations[currentConvIndex + 1]?.id
    //   if (beforeConv !== undefined) {
    //     nextConvId = beforeConv 
    //   } else if (afterConv !== undefined) {
    //     nextConvId = afterConv
    //   }
    // }
    ElMessageBox.confirm(
      _t('message.deleteConvConfirm'),
      _t('message.warning'), {
        confirmButtonText: _t('message.ok'),
        cancelButtonText: _t('message.cancel'),
        type: 'warning'
      })
      .then(async () => {
        const loading = ElLoading.service({ text: _t('chat.dltConv') + '...', lock: true })
        try {
          await $fetch('/api/curva/conv', { method: 'DELETE', body: { id } })
        } catch {}
        loading.close()
        if (targetConvId === getCurrentConvId()) {
          document.getElementById(nextConvId)?.click()
        }
        conversations.value = conversations.value.filter((c) => c.id !== targetConvId)
        // checkTokenAndGetConversations()
      })
  }
  return {
    models,
    showScrollToBottomButton,
    // Edit Question
    isEditingQuestion,
    editingQuestion,
    editingQuestionContent,
    callEditQuestionDialog,
    // Edit Answer
    isEditingAnswer,
    editingAnswer,
    editingAnswerContent,
    callEditAnswerDialog,
    // ----------------
    model,
    conversations,
    messages,
    temperature,
    contextMode,
    openMenu,
    openSidebarController,
    openDrawerController,
    inputValue,
    inputMaxLength,
    currentConvIdComputed,
    getCurrentConvId,
    getCurrentConvName,
    checkTokenAndGetConversations,
    loadChat,
    sendMessage,
    updateMessage,
    regenerateMessage,
    focusInput,
    refreshConversation,
    renameConversation,
    deleteConversation,
    resetConvConfig,
    exportAsMarkdown,
    exportAsJson,
    exportAsJsonDetailed,
    clear,
  }
}
