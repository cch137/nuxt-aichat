<template>
  <div class="PageHeader z-50 fixed w-full px-4 gap-4 flex items-stretch">
    <div>
      <el-button style="padding: 8px;" @click="openSidebar = !openSidebar">
        <MenuIcon />
      </el-button>
    </div>
    <NuxtLink to="/" @click="goToChat(null, false, true)" class="text-2xl font-medium">
      <div class="flex-center">
        <CurvaLogoSvg class="pointer-events-none" style="height: 32px; margin-right: 8px;" src="~/assets/svg/Curva.svg" />
        <div>{{ appName }}</div>
      </div>
    </NuxtLink>
    <div class="flex-1 flex items-center justify-end gap-2">
      <ClientOnly>
        <el-dropdown v-if="getCurrentConvId()" trigger="click" placement="bottom-start">
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
                    :icon="EditPen"
                    @click="renameConversation"
                  >
                    {{ $t('action.renameConv') }}
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
                <div>
                  <el-button
                    class="w-full"
                    style="justify-content: start;"
                    :icon="RefreshRight"
                    @click="refreshChat"
                  >
                    {{ $t('action.refresh') }}
                  </el-button>
                </div>
                <div>
                  <el-button
                    type="danger"
                    class="w-full"
                    style="justify-content: start;"
                    :icon="Delete"
                    @click="deleteConversation"
                    plain
                  >
                    {{ $t('action.deleteConv') }}
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
        <el-button class="DCJoinButton" style="padding: 12px;">
          <DiscordIconSvg style="height: 24px; width: 24px;" />
          <span class="ml-2 DCJoinText">{{ $t('header.joinDc') }}</span>
        </el-button>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { EditPen, RefreshRight, Download, Delete, ArrowDown } from '@element-plus/icons-vue'
import baseConverter from '~/utils/baseConverter'
const appName = useState('appName')
const { conversations, messages, openSidebar, getCurrentConvId, getCurrentConvName, goToChat, checkTokenAndGetConversations } = useChat()
// @ts-ignore
const _t = useLocale().t

const refreshChat = () => {
  goToChat(getCurrentConvId(), true)
}

const renameConversation = () => {
  ElMessageBox.prompt(_t('message.renameConvHint'), _t('message.setting'), {
    confirmButtonText: _t('message.ok'),
    cancelButtonText: _t('message.cancel'),
    inputValue: getCurrentConvName()
  })
    .then(({ value: name }) => {
      $fetch('/api/renameConv', { method: 'POST', body: { id: getCurrentConvId(), name } })
        .then(() => {
          ElMessage({
            type: 'success',
            message: _t('message.renameSuccess'),
          })
          checkTokenAndGetConversations()
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

const deleteConversation = () => {
  const currentConvId = getCurrentConvId()
  const _conversations = [...conversations.value]
  let currentConvIndex = -1
  let nextConvId = 'createNewChat'
  for (let i = 0; i < _conversations.length; i++) {
    if (_conversations[i].id === currentConvId) {
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
@media screen and (max-width: 600px) {
  .DCJoinButton {
    padding: 12px 8px !important;
  }
  .DCJoinText {
    display: none;
  }
}
</style>
