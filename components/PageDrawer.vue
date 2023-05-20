<template>
  <el-drawer
    v-model="openDrawer"
    :title="$t('menu.title')"
    direction="ltr"
    style="min-width: 320px; max-width: 100vw;"
  >
    <!-- <h3 class="mt-0">{{ $t('menu.about') }}</h3>
    <div>
      <el-text>{{ $t('menu.joinDcMessage') }}</el-text>
    </div> -->
    <el-form class="py-4" @submit.prevent>
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
        <NuxtLink id="createNewChat" :to="`/`" @click="goToChat(null)">
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
          <NuxtLink :id="conv" :to="`/c/${conv}`" @click="goToChat(conv)">
            <el-button
              :type="conv === getCurrentConvId() ? 'primary' : 'default'"
              :icon="ChatSquare"
              size="large"
              class="ConversationLink w-full"
              :plain="conv === getCurrentConvId()"
              :class="conv === getCurrentConvId() ? 'pointer-events-none brightness-125' : ''"
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
import { Plus, ChatSquare } from '@element-plus/icons-vue'
import baseConverter from '~/utils/baseConverter'

const openDrawer = useState('openDrawer', () => false)
const version = useState('version', () => '...')
const { conversations, goToChat, initPage, getCurrentConvId } = useChat()

const {
  data: versionData,
  pending: versionPending
} = useLazyFetch('/api/version', { method: 'POST' })

watch(versionData, (newValue) => {
  version.value = newValue
})

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
