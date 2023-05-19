<template>
  <el-affix>
    <div class="PageHeader w-full px-4 gap-4 flex items-stretch">
      <div>
        <el-button style="padding: 8px;" @click="openDrawer = true">
          <MenuIcon />
        </el-button>
      </div>
      <div class="text-2xl font-medium">
        {{ appName }}
      </div>
      <div class="flex-1"></div>
      <div class="flex-center gap-2">
        <ClientOnly>
          <el-dropdown v-if="getCurrentConvId()">
            <el-button>
              {{ $t('action.more') }}<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <div class="flex flex-col gap-2 py-1 px-2">
                  <div>
                    <el-button
                      class="w-full"
                      style="justify-content: start;"
                      :icon="Delete"
                      @click="deleteConversation"
                    >
                      {{ $t('action.deleteConv') }}
                    </el-button>
                  </div>
                  <div>
                    <el-button
                      class="w-full"
                      style="justify-content: start;"
                      :icon="Download"
                      @click="exportAsMarkdown"
                    >
                      {{ $t('action.exportAs') }} .MD
                    </el-button>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </ClientOnly>
      </div>
      <div>
        <a href="https://discord.gg/5v49JKKmzJ" target="_blank">
          <el-button style="padding: 12px;">
            <DiscordIconSvg style="height: 24px; width: 24px;" />
            <span class="ml-2 DCJoinText">{{ $t('header.joinDc') }}</span>
          </el-button>
        </a>
      </div>
    </div>
  </el-affix>
</template>

<script setup>
import { ElMessageBox, ElLoading } from 'element-plus'
import { Download, Delete, ArrowDown } from '@element-plus/icons-vue'
import baseConverter from '~/utils/baseConverter'
const openDrawer = useState('openDrawer', () => false)
const appName = useState('appName')
const { conversations, messages, getCurrentConvId } = useChat()
// @ts-ignore
const _t = useLocale().t

const deleteConversation = () => {
  const currentConvId = getCurrentConvId()
  const _conversations = [...conversations.value]
  let currentConvIndex = -1
  let nextConvId = 'createNewChat'
  for (let i = 0; i < _conversations.length; i++) {
    if (_conversations[i] === currentConvId) {
      currentConvIndex = i
      break
    }
  }
  if (currentConvIndex !== -1) {
    const beforeConv = _conversations[currentConvIndex - 1]
    const afterConv = _conversations[currentConvIndex + 1]
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
      $fetch('/api/deleteConv', {
        method: 'DELETE',
        body: { id: currentConvId }
      })
        .finally(() => {
          loading.close()
          document.getElementById(nextConvId).click()
        })
    })
}

const exportAsMarkdown = () => {
  let i = 1
  const markdownContent = messages.value.map((msg) => {
    if (msg.type === 'Q') {
      return `QUESTION ${i}:\n\n${msg.text.replaceAll('\n', '\n\n')}`
    }
    if (msg.type === 'A') {
      return `ANSWER ${i++}:\n\n${msg.text}`
    }
    return '(Unknown message)'
  }).join('\n\n---\n\n') + '\n\n---\n\n'
  const a = document.createElement('a')
  const filename = `${baseConverter.convert(getCurrentConvId(), '64w', 10)}.md`
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(markdownContent))
  a.setAttribute('download', filename)
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}
</script>

<style scoped>
.PageHeader {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  min-height: 56px;
}
.PageHeader > * {
  display: flex;
  align-items: center;
}
</style>
