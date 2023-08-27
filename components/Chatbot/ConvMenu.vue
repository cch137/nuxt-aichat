<template>
  <div class="h-full max-h-full flex flex-col">
    <el-form @submit.prevent>
      <div class="flex justify-stretch">
        <h4 class="flex-1 mt-0">{{ $t('settings.title') }}</h4>
        <div class="px-1">
          <el-text type="info" size="small" v-if="version">
            v{{ version }}
          </el-text>
        </div>
      </div>
      <div class="flex flex-col pr-1 gap-1">
        <div class="flex gap-1">
          <el-text class="flex-1">{{ $t('settings.model') }}</el-text>
          <ChatbotModelSelect class="flex-1" />
        </div>
        <div class="flex gap-1">
          <el-text class="flex-1">{{ $t('settings.context') }}</el-text>
          <ChatbotContextSelect class="flex-1" />
        </div>
        <div v-if="['gpt4', 'gpt3', 'gpt3-fga'].includes(model)" class="flex gap-1">
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
                    <el-text class="info">{{ $t('menu.tempInfo') }}</el-text>
                  </div>
                </template>
              </el-popover>
            </ClientOnly>
          </el-text>
          <div class="flex-1" style="width: calc(50% - 0.25rem)">
            <ChatbotTemperatureSelect class="w-full" />
          </div>
        </div>
        <div v-if="currentConvIdComputed" class="flex gap-1">
          <div class="flex flex-1">
            <div class="flex-1 text-right pr-2">
              <el-text size="small" type="info">{{ $t('action.more') }}</el-text>
            </div>
            <ChatbotMoreActions />
          </div>
        </div>
      </div>
    </el-form>
    <h4 class="mt-4 mb-0">{{ $t('chat.chats') }}</h4>
    <div class="ConversationListContainer mt-1 border rounded overflow-hidden" style="height: 45vh; border-color: var(--el-border-color);">
      <div class="border-b createNewChat-bg" style="border-color: var(--el-border-color);">
        <NuxtLink id="createNewChat" to="/c/" @click="focusInput">
          <el-button
            :icon="Plus"
            class="ConversationLink w-full"
            style="border: none; background: transparent !important;"
          >
            {{ $t('chat.newChat') }}
          </el-button>
        </NuxtLink>
      </div>
      <div class="ConversationList overflow-y-auto overflow-x-hidden flex-1" style="max-height: calc(100% - 32px);">
        <div
          v-for="conv in conversations"
          class="ConversationLink flex items-center"
          :class="conv.moreActionsExpanded ? 'MoreOptionsExpended' : ''"
          :active="conv.id === currentConvIdComputed"
        >
          <NuxtLink
            :id="conv.id"
            :to="`/c/${conv.id}`"
            class="justify-start items-center flex gap-1 py-1 px-4 w-full"
            :class="conv.id === currentConvIdComputed ? 'pointer-events-none' : ''"
          >
            <el-icon>
              <ChatSquare />
            </el-icon>
            <span class="text-ellipsis overflow-hidden max-w-full">{{ conv.name || baseConverter.convert(conv.id, '64w', 10) }}</span>
          </NuxtLink>
          <div class="ConversationLinkButtons px-1 flex-center">
            <el-text type="info" class="flex gap-2">
              <el-dropdown trigger="click" placement="bottom" @visible-change="(isVisible) => conv.moreActionsExpanded = isVisible">
                <el-text>
                  <el-icon class="cursor-pointer">
                    <More />
                  </el-icon>
                </el-text>
                <template #dropdown>
                  <el-dropdown-menu style="overflow: hidden;">
                    <div class="flex flex-col py-1 px-2 -m-2 -mx-3" style="margin-bottom: -10px;">
                      <div>
                        <el-button
                          class="MoreOptionButton"
                          :icon="EditPen"
                          @click="renameConversation(conv.id, conv.name)"
                        >
                          {{ $t('action.rename') }}
                        </el-button>
                      </div>
                      <div>
                        <el-button
                          type="danger"
                          class="MoreOptionButton"
                          :icon="Delete"
                          @click="deleteConversation(conv.id)"
                          plain
                        >
                          {{ $t('action.delete') }}
                        </el-button>
                      </div>
                    </div>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-text>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col mt-4 gap-1">
      <div>
        <el-link href="https://www.buymeacoffee.com/cch137" target="_blank" :icon="Coffee">
          <div class="pl-1"><el-text size="large" style="color: inherit">Buy me a coffee</el-text></div>
        </el-link>
      </div>
      <div>
        <el-link @click="openAboutMe()" target="_blank" :icon="Message">
          <div class="pl-1"><el-text size="large" style="color: inherit">About me</el-text></div>
        </el-link>
      </div>
      <div>
        <el-link @click="openFeedback()" target="_blank" :icon="ChatDotRound">
          <div class="pl-1"><el-text size="large" style="color: inherit">Feedback</el-text></div>
        </el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { InfoFilled, Plus, ChatSquare, More, EditPen, Delete,
  Coffee, Message, ChatDotRound } from '@element-plus/icons-vue'
import baseConverter from '~/utils/baseConverter'

const version = useState('version', () => '')
const { conversations, model, currentConvIdComputed, focusInput, renameConversation, deleteConversation } = useChat()

if (process.client && version.value === '') {
  $fetch('/api/version', { method: 'POST' })
    .then((res) => {
      version.value = res.version
    })
    .catch(() => {})
}

const openAboutMe = () => {
  ElMessageBox({
    title: 'Aboute Me',
    message: () => h('div', [
      h('div', 'I\'m a web developer, and I can create a great website that suits your needs perfectly! Feel free to reach out to me to learn more.'),
      h('br', ''),
      h('div', [h('strong', 'Email: '), h('span', '137emailservice@gmail.com')]),
    ])
  })
}

const openFeedback = () => {
  ElMessageBox.prompt('Your name:', 'What should we call you?')
    .then(({ value: name }) => {
      name = name.trim()
      if (!name) {
        throw 'Name cannot be empty'
      }
      ElMessageBox.prompt('What would you like to tell us?', 'We value your feedback, thank you!')
        .then(async ({ value: feedback }) => {
          feedback = feedback.trim()
          if (!feedback) {
            throw 'Feedback cannot be empty'
          }
          const res = await $fetch('/api/stats/feedback', {
            method: 'POST',
            body: { name, feedback }
          })
          if (!res || 'error' in res) {
            ElMessage.error('Feedback submission failed.')
          } else {
            ElMessage.success('Feedback submitted successfully')
          }
        })
        .catch(() => {
          ElMessage.info('Feedback has been cancelled.')
        })
    })
    .catch(() => {
      ElMessage.info('Feedback has been cancelled.')
    })
}
</script>

<style scoped>
.ConversationList::-webkit-scrollbar {
  height: 10px;
  width: 10px;
}
.ConversationListContainer {
  background: var(--el-bg-color-page);
}
.ConversationLink {
  justify-content: start !important;
  color: var(--el-text-color-regular);
  font-weight: 400;
  font-size: 14px;
  transition: .3s ease;
}
.ConversationLink:hover,
.ConversationLink[active="true"],
.ConversationLink.MoreOptionsExpended {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
html.light .ConversationListContainer {
  background: #FAFAFC;
}
html.light .ConversationLink:hover,
html.light .ConversationLink[active="true"],
html.light .ConversationLink.MoreOptionsExpended {
  color: #2a598a;
}
html.light .ConversationLink:hover,
html.light .ConversationLink.MoreOptionsExpended {
  background: var(--el-color-primary-light-8);
}
html.light .ConversationLink[active="true"] {
  background: var(--el-color-primary-light-7) !important;
  filter: brightness(1);
}
.ConversationLink[active="true"] {
  font-weight: 500;
  filter: brightness(1.35);
}
.ConversationLink > a {
  max-width: calc(100% - 24px);
}
.ConversationLinkButtons {
  opacity: 0;
  transition: .3s ease;
}
.ConversationLink:hover > .ConversationLinkButtons {
  opacity: 1;
}
.info {
  word-break: break-word !important;
  text-align: left !important;
}

.MoreOptionButton {
  width: 100%;
  justify-content: start;
  border: none;
  border-radius: 0;
}
</style>
