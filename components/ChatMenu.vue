<template>
  <div class="h-full max-h-full flex flex-col">
    <el-form class="flex-1" @submit.prevent>
      <div class="flex justify-stretch">
        <h4 class="flex-1 mt-0">{{ $t('settings.title') }}</h4>
        <div class="px-1">
          <el-text type="info" size="small" v-if="!versionPending">
            v{{ versionData?.version }}
          </el-text>
        </div>
      </div>
      <div class="flex flex-col pr-1 gap-1">
        <div class="flex gap-1">
          <el-text class="flex-1">{{ $t('settings.model') }}</el-text>
          <ModelSelect class="flex-1" />
        </div>
        <div class="flex gap-1">
          <el-text class="flex flex-1 items-center">
            <span class="mr-2">{{ $t('settings.webBrowsing') }}</span>
            <ClientOnly>
              <el-popover
                placement="bottom"
                :width="240"
                trigger="click"
              >
                <template #reference>
                  <el-icon color="#409EFF" class="cursor-pointer" size="large">
                    <InfoFilled />
                  </el-icon>
                </template>
                <template #default>
                  <div>
                    <div class="info">
                      <el-text>
                        <strong>{{ $t('menu.webInfo1') }}</strong>
                        <span>{{ $t('menu.webInfo2') }}</span>
                      </el-text>
                      <el-text type="warning" class="info">{{ $t('menu.expFeat1') }}</el-text>
                    </div>
                    <el-divider style="margin: .25rem 0;" />
                    <div class="info">
                      <el-text>
                        <strong>{{ $t('menu.webInfo3') }}</strong>
                        <span>{{ $t('menu.webInfo4') }}</span>
                      </el-text>
                      <el-text type="warning" class="info">{{ $t('menu.expFeat2') }}</el-text>
                    </div>
                  </div>
                </template>
              </el-popover>
            </ClientOnly>
          </el-text>
          <div class="flex-1">
            <WebBrowsingSelect />
          </div>
        </div>
        <div class="flex gap-1">
          <el-text class="flex flex-1 items-center">
            <span class="mr-2">Temperature</span>
            <ClientOnly>
              <el-popover
                placement="bottom"
                :width="240"
                trigger="click"
              >
                <template #reference>
                  <el-icon color="#409EFF" class="cursor-pointer" size="large">
                    <InfoFilled />
                  </el-icon>
                </template>
                <template #default>
                  <div class="info">
                    <el-text>{{ $t('menu.tempInfo') }}</el-text>
                  </div>
                </template>
              </el-popover>
            </ClientOnly>
          </el-text>
          <div class="flex-1" style="width: calc(50% - 0.25rem)">
            <TemperatureSelect class="w-full" />
          </div>
        </div>
        <div class="flex gap-1">
          <el-text class="flex-1">{{ $t('settings.context') }}</el-text>
          <ContextSelect class="flex-1" />
        </div>
        <div class="flex gap-1">
          <el-text class="flex-1">{{ $t('settings.lang') }}</el-text>
          <div class="flex-1">
            <LanguageSelect />
          </div>
        </div>
        <div v-if="getCurrentConvId()" class="flex gap-1">
          <div class="flex-1"></div>
          <div class="flex flex-1">
            <div class="flex-1 text-right pr-2">
              <el-text size="small" type="info">{{ $t('action.more') }}</el-text>
            </div>
            <ChatMoreActions />
          </div>
        </div>
      </div>
    </el-form>
    <h4 class="m-0">{{ $t('chat.chats') }}</h4>
    <div class="mt-1 border border-neutral-700 rounded overflow-hidden" style="height: 50vh;">
      <div class="border-b border-neutral-700">
        <NuxtLink id="createNewChat" to="/c/" @click="goToChat(null)">
          <el-button
            :icon="Plus"
            class="ConversationLink w-full"
          >
            {{ $t('chat.newChat') }}
          </el-button>
        </NuxtLink>
      </div>
      <div class="ConversationList overflow-y-auto overflow-x-hidden flex-1" style="max-height: calc(100% - 32px);">
        <div v-for="conv in conversations">
          <NuxtLink :id="conv.id" :to="`/c/${conv.id}`" @click="goToChat(conv.id)">
            <el-button
              :type="conv.id === getCurrentConvId() ? 'primary' : 'default'"
              :icon="ChatSquare"
              class="ConversationLink w-full"
              :plain="conv.id === getCurrentConvId()"
              :class="conv.id === getCurrentConvId() ? 'pointer-events-none brightness-125' : ''"
            >
              {{ conv.name || baseConverter.convert(conv.id, '64w', 10) }}
            </el-button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElLoading, ElMessageBox } from 'element-plus'
import { InfoFilled, Plus, ChatSquare } from '@element-plus/icons-vue'
import baseConverter from '~/utils/baseConverter'
import { unmask } from '~/utils/masker'

const version = useState('version', () => '')
const { conversations, goToChat, getCurrentConvId } = useChat()
// @ts-ignore
const _t = useLocale().t

const {
  data: versionData,
  pending: versionPending
} = useLazyFetch('/api/version', { method: 'POST' })

watch(versionData, (newValue) => {
  version.value = newValue.version
})

const viewUserId = () => {
  const loading = ElLoading.service()
  $fetch('/api/user', {
    method: 'POST'
  })
    .then((encryptedUid) => {
      loading.close()
      ElMessageBox.alert(unmask(`0${encryptedUid}`, '64w', 1, 4896), _t('auth.uid'), {
        confirmButtonText: _t('message.ok'),
      })
    })
    .catch(() => {
      loading.close()
    })
}
</script>

<style scoped>
.ConversationList::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.ConversationList::-webkit-scrollbar-corner {
  background: #4448;
}
.ConversationList::-webkit-scrollbar-track {
  background: #0000;
  border-left: 1px solid #4444;
}
.ConversationList::-webkit-scrollbar-thumb {
  background: #8888;
  border-radius: 12px;
}
.ConversationList::-webkit-scrollbar-thumb:hover {
  background: #aaa8;
}
.ConversationLink {
  border: none;
  border-radius: 0 !important;
  justify-content: start !important;
}
.info {
  word-break: break-word !important;
  text-align: left !important;
}
</style>
