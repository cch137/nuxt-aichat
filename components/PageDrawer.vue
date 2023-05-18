<template>
  <el-drawer
    v-model="openDrawer"
    :title="$t('menu.title')"
    direction="ltr"
    style="min-width: 320px; max-width: 100vw;"
  >
    <div>
      <el-text type="info" v-if="!versionPending">{{ $t('menu.version') }}{{ versionData }}</el-text>
    </div>
    <div>
      <el-text type="info" v-if="currentConv != 0">{{ $t('menu.currentChat') }}{{ currentConv }}</el-text>
    </div>
    <el-form class="py-4" @submit.prevent>
      <h3>{{ $t('settings.title') }}</h3>
      <div class="flex flex-col gap-1">
        <div class="flex gap-1">
          <el-text class="flex-1">{{ $t('settings.model') }}</el-text>
          <ModelSelect class="flex-1" />
        </div>
        <div class="flex gap-1">
          <el-text class="flex-1">{{ $t('settings.webBrowsing') }}</el-text>
          <div class="flex-1">
            <WebBrowsingSelect />
          </div>
        </div>
        <div class="flex gap-1">
          <el-text class="flex-1">{{ $t('settings.lang') }}</el-text>
          <div class="flex-1">
            <LanguageSelect />
          </div>
        </div>
      </div>
    </el-form>
    <h3>{{ $t('chat.chats') }}</h3>
    <div class="mt-2">
      <div>
        <NuxtLink :to="`/`" @click="goToChat(null)">
          <el-button
            :icon="Plus"
            size="large"
            class="ConversationLink w-full"
          >
            {{ $t('chat.newChat') }}
          </el-button>
        </NuxtLink>
      </div>
      <div class="Divider" />
      <div v-for="conv in conversations">
        <NuxtLink :to="`/c/${conv}`" @click="goToChat(conv)">
          <el-button
            :icon="ChatSquare"
            size="large"
            class="ConversationLink w-full"
          >
            {{ baseConverter.convert(conv, '64w', 10) }}
          </el-button>
        </NuxtLink>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ElMessage, ElLoading } from 'element-plus'
import { Plus, ChatSquare } from '@element-plus/icons-vue'
import baseConverter from '~/utils/baseConverter'

const openDrawer = useState('openDrawer', () => false)
const conversations = useState('conversations', () => [])
const version = useState('version', () => '...')
const { messages, context } = useChat()
const currentConv = ref('')

const focusInput = () => {
  document.querySelector('.InputBox textarea').focus()
}

const goToChat = (conv) => {
  const currentConv = useNuxtApp()._route?.params?.conv
  if (currentConv !== conv || conv === null) {
    messages.value = []
    initPage(conv)
  }
  openDrawer.value = false
  focusInput()
}

const {
  data: versionData,
  pending: versionPending
} = useLazyFetch('/api/version', { method: 'POST' })

watch(versionData, (newValue) => {
  version.value = newValue
})

const checkTokenAndGetConversations = () => {
  return new Promise((resolve, reject) => {
    $fetch('/api/token/check', { method: 'POST' })
      .then((_conversations) => {
        conversations.value = _conversations.sort()
        resolve()
      })
      .catch((err) => {
        ElMessage.error('Initialization Failed')
        reject(err)
      })
  })
}

const fetchHistory = (conv) => {
  return new Promise((resolve, reject) => {
    currentConv.value = baseConverter.convert(conv, '64w', 10)
    if (conv === undefined || conv === null) {
      context.clear()
      return resolve()
    }
    $fetch('/api/history', { method: 'POST', body: { id: conv } })
      .then((records) => {
        if (records.length === 0) {
          navigateTo('/')
        }
        const _records = []
        context.add(...records.map((record) => {
          const { Q, A, t: _t } = record
          const t = new Date(_t)
          _records.push({ type: 'Q', text: Q, t }, { type: 'A', text: A, t })
          return A
        }))
        messages.value.unshift(..._records)
        resolve()
      })
      .catch((err) => {
        ElMessage.error('There was an error loading the conversation.')
        reject(err)
      })
  })
}

const initPage = (conv) => {
  const loading = ElLoading.service()
  Promise.all([
    checkTokenAndGetConversations(),
    fetchHistory(conv)
  ])
    .finally(() => {
      useScrollToBottom()
      setTimeout(() => {
        loading.close()
      }, 500)
    })
}

if (process.client) {
  const conv = useNuxtApp()._route?.params?.conv
  initPage(conv)
}
</script>

<style scoped>
.Divider {
  margin: 0.5rem 0;
  border-bottom: 1px solid grey;
}
.ConversationLink {
  border: none;
  justify-content: start !important;
}
</style>
