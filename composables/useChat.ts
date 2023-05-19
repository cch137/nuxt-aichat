import { webBrowsing as webBrowsingCookieName } from '~/config/cookieNames'

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

interface ChatMessage {
  type: string;
  text: string;
  t: Date;
}

const messages = ref<Array<ChatMessage>>([])

const context = {
  add: addContext,
  get: getContext,
  clear: clearContext
}

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
  return {
    messages,
    context,
    webBrowsingMode
  }
}
