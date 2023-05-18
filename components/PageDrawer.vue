<template>
  <el-drawer
    v-model="openDrawer"
    :title="$t('menu.title')"
    direction="ltr"
    style="min-width: 320px; max-width: 100vw;"
  >
    <el-form class="pb-4" @submit.prevent>
      <div class="flex justify-stretch">
        <h3 class="flex-1 mt-0">{{ $t('settings.title') }}</h3>
        <div class="px-1">
          <el-text type="info" size="small" v-if="!versionPending">
            v{{ versionData }}
          </el-text>
        </div>
      </div>
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
    <div class="mt-2 border border-neutral-700 rounded">
      <div class="border-b border-neutral-700">
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
      <div class="max-h-[16rem] overflow-auto">
        <div v-for="conv in conversations">
          <NuxtLink :to="`/c/${conv}`" @click="goToChat(conv)">
            <el-button
              :type="conv === getCurrrentConvId() ? 'primary' : 'default'"
              :icon="ChatSquare"
              size="large"
              class="ConversationLink w-full"
              :plain="conv === getCurrrentConvId()"
              :class="conv === getCurrrentConvId() ? 'pointer-events-none brightness-125' : ''"
            >
              {{ baseConverter.convert(conv, '64w', 10) }}
            </el-button>
          </NuxtLink>
        </div>
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

const nuxtApp = useNuxtApp()

const getCurrrentConvId = () => {
  return nuxtApp._route?.params?.conv
}

const goToChat = (conv) => {
  const currentConvId = getCurrrentConvId()
  if (currentConvId !== conv || conv === null) {
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
    const convIdDemical = baseConverter.convert(conv, '64w', 10)
    currentConv.value = convIdDemical
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

if (process.client) {
  const conv = useNuxtApp()._route?.params?.conv
  initPage(conv)
}
</script>

<style scoped>
.ConversationLink {
  border: none;
  justify-content: start !important;
}
</style>
