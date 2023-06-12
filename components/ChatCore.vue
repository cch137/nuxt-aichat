<template>
  <ClientOnly>
    <div class="flex w-full">
      <div :style="`min-width: ${openSidebar ? '280px' : '0px'}; width: ${openSidebar ? '25%' : '0px'}; transition: .1s;`"></div>
      <div class="flex-1 flex-center" :style="`max-width: ${openSidebar ? 'calc(100% - 280px)' : '100%'}; transition: .1s;`">
        <div class="w-full mx-auto">
          <div class="Messages flex flex-col gap-2 pt-4 px-2 pb-10 mb-40 mx-auto">
            <div class="text-center my-4">
              <el-text type="info" size="large">{{ $t('chat.letsStart') }}</el-text>
            </div>
            <div
              v-for="message in messages"
              :key="message.A"
              class="px-1 flex flex-col gap-2"
            >
              <div class="flex MessageContainer pt-2">
                <div class="MessageLeft">
                  <div class="QMessageAvatar flex-center">
                    <el-icon size="larger" class="opacity-75">
                      <User />
                    </el-icon>
                  </div>
                </div>
                <div class="Message Q p-4 flex-1 gap-1 shadow rounded-lg" style="width: calc(100% - 32px - 4.5rem)">
                  <div>
                    <span>{{ message.Q }}</span>
                  </div>
                  <div v-if="message.done" class="flex mt-1 gap-2 -mb-2">
                    <div class="flex-1 flex gap-2">
                      <el-text type="info" size="small">
                        <span class="flex gap-2">
                          <span>
                            {{ formatDate(new Date(message.t.getTime() - (message.dt || 0)), 'yyyy/MM/dd HH:mm') }}
                          </span>
                        </span>
                      </el-text>
                    </div>
                    <div class="flex gap-2">
                      <ChatMessageDeleteButton :confirm="() => deleteMessage(message.id)" />
                      <el-tooltip
                        :content="$t('action.copy')"
                        placement="bottom"
                      >
                        <el-text
                          type="info"
                          class="MessageActionButton flex-center"
                          @click="useCopyToClipboard(message.Q)"
                        >
                          <el-icon size="large">
                            <CopyDocument />
                          </el-icon>
                        </el-text>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex MessageContainer">
                <div class="MessageLeft"></div>
                <div class="flex flex-1 flex-col gap-1" style="width: calc(100% - 32px - 4.5rem)">
                  <div v-if="message.queries && message.queries.length > 0">
                    <el-text class="flex flex-wrap justify-start items-center">
                      <el-icon size="larger">
                        <Search />
                      </el-icon>
                      <el-tag
                        v-for="query in message.queries"
                        class="ml-1"
                        style="color:
                        inherit"
                        type="info"
                        effect="plain"
                      >
                        <span>{{ query }}</span>
                      </el-tag>
                    </el-text>
                  </div>
                </div>
              </div>
              <div class="flex MessageContainer">
                <div class="MessageLeft">
                  <div class="AMessageAvatar flex-center">
                    <el-icon size="larger" class="opacity-75">
                      <Cpu />
                    </el-icon>
                  </div>
                </div>
                <div class="flex-1" style="width: calc(100% - 32px - 4.5rem)">
                  <div class="Message A p-4 shadow rounded-lg">
                    <div>
                      <el-text
                        v-if="message.done"
                        v-html="marked.parse(message.A)"
                        size="large"
                      />
                      <span v-else>
                        <el-text size="large">Thinking</el-text>
                        <el-text size="large">{{ loadingDots }}</el-text>
                      </span>
                    </div>
                    <div v-if="message.done" class="flex mt-1 gap-2 -mb-2">
                      <div class="flex-1 flex gap-2">
                        <el-text type="info" size="small">
                          <span class="flex gap-2">
                            <span>
                              {{ message.dt === undefined ? formatDate(message.t, 'yyyy/MM/dd HH:mm') : `Δt: ${Math.round(message.dt / 10) / 100}s` }}
                            </span>
                          </span>
                        </el-text>
                      </div>
                      <div class="flex gap-2">
                        <el-tooltip
                          v-if="message === messages.at(-1)"
                          :key="messages"
                          :content="$t('action.regenerate')"
                          placement="bottom"
                        >
                          <el-text
                            type="info"
                            class="MessageActionButton flex-center"
                            @click="regenerateMessage()"
                          >
                            <el-icon size="large">
                              <Refresh />
                            </el-icon>
                          </el-text>
                        </el-tooltip>
                        <el-tooltip
                          :content="$t('action.copy')"
                          placement="bottom"
                        >
                          <el-text
                            type="info"
                            class="MessageActionButton flex-center"
                            @click="useCopyToClipboard(message.A)"
                          >
                            <el-icon size="large">
                              <CopyDocument />
                            </el-icon>
                          </el-text>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                  <div v-if="message.urls && message.urls.length > 0" class="flex flex-col items-start pt-1 pl-2 w-full">
                    <el-link
                      v-for="url in message.urls"
                      :key="url"
                      type="info"
                      :href="url.split(' ').pop()"
                      target="_blank"
                      class="flex justify-start items-center"
                      style="font-size: small;"
                    >
                      <el-icon size="larger">
                        <Paperclip />
                      </el-icon>
                      <span class="ml-1">{{ url.split(' ').slice(0, url.split(' ').length - 1).join(' ') || url.split(' ')[0] }}</span>
                    </el-link>
                  </div>
                </div>
              </div>
              <div
                v-if="message === messages.at(-1) && message.more && message.more.length > 0"
                :key="message.more"
                class="flex flex-wrap items-center gap-2 pt-8"
              >
                <el-button size="x-large" class="MoreQuestionsButton shadow cursor-pointer" @click="(more.end >= message.more.length ? (more.reset(), message.more = random.shuffle(message.more)) : more.run(message.more.length))" :icon="ChatDotRound" style="padding: 0">
                </el-button>
                <el-button v-for="q in message.more.slice(more.start, more.end)" style="margin: 0;" class="shadow" @click="sendMessage(q)">
                  {{ q }}
                </el-button>
                <el-text type="info" class="select-none cursor-pointer" @click="more.run()">...</el-text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { marked } from 'marked'
import formatDate from '~/utils/formatDate'
import random from '~/utils/random'
import { Refresh, CopyDocument, ChatDotRound, User, Cpu, Search, Paperclip } from '@element-plus/icons-vue'
import '~/assets/css/vsc-dark-plus.css'

const popoverVisibles = {
  map: new Map(),
  /** @returns {Ref<boolean>} */
  get (id = Date.now().toString()) {
    if (!popoverVisibles.map.has(id)) {
      popoverVisibles.map.set(id, ref(false))
    }
    return popoverVisibles.map.get(id)
  }
}

const { messages, openSidebar, sendMessage, deleteMessage, regenerateMessage } = useChat()

marked.setOptions({ headerIds: false, mangle: false })

const more = reactive({
  start: 0,
  end: 3,
  step: 3,
  run (maxLength = 8) {
    if (more.end >= maxLength) {
      more.reset()
    } else {
      more.start += more.step
      more.end += more.step
    }
  },
  reset () {
    more.start = 0
    more.end = more.step
  }
})

watch(messages, () => more.reset())

const loadingDots = ref('.')

setInterval(() => {
  if (loadingDots.value.length < 4) {
    loadingDots.value += '.'
  } else {
    loadingDots.value = '.'
  }
}, 500)
</script>

<style>
.MoreQuestionsButton {
  height: 2rem !important;
  width: 2rem !important;
}
.MoreQuestionsButton svg {
  transform: scale(1.25);
}
.Messages {
  width: 100%;
  max-width: 780px;
}
.Message a {
  word-break: break-all;
  text-decoration: underline;
}
.Messages code:not(pre code) {
  padding: .125rem .25rem;
  font-weight: bolder;
  opacity: .9;
}
.Messages code:not(pre code)::before, .Messages code:not(pre code)::after {
  content: '`';
}
.MessageLeft {
  width: 2rem;
}
.QMessageAvatar, .AMessageAvatar {
  height: 2rem;
  border-radius: .5rem;
}
.QMessageAvatar {
  background: hsl(246, 30%, 30%);
}
.AMessageAvatar {
  background: hsl(150, 30%, 30%);
}
.Message {
  backdrop-filter: blur(8px);
}
.Message .el-text {
  word-break: break-word;
}
.Message.Q {
  background: #60608240;
  /* white-space: pre-wrap; */
}
.Message.A {
  background: #60606240;
}
.MessageActionButton {
  height: 20px;
  width: 100%;
  transition: .1s;
  cursor: pointer;
}
.MessageActionButton svg {
  transform: scale(0.9);
}
.MessageActionButton:hover {
  color: var(--el-text-color-primary);
}
.MessageLeft {
  margin-right: .25rem;
}
.MessageContainer {
  gap: .35rem;
}
@media screen and (max-width: 600px) {
  .MessageContainer {
    gap: .25rem;
  }
}
.CodeBlockWrapper {
  margin: .5rem 0;
}
.CodeBlockHeader {
  width: 100%;
  color: var(--el-text-color-regular);
  background: #3b3b3b;
  padding: .25rem .75rem;
  border-radius: .75rem .75rem 0 0;
}
.CodeBlockWrapper pre {
  background: #1e1e1e;
  color: lightgrey;
  padding: .75rem;
  border-radius: 0 0 .75rem .75rem;
  line-height: 1.25rem;
  white-space: pre-wrap;
  word-break: break-all;
}
.CodeBlockWrapper pre:focus {
  outline: none;
}
.CopyCodeButton {
  padding: 0 .5rem;
  border: 1px solid grey;
  border-radius: .35rem;
  background: #ffffff0f;
  color: #ddd;
  transition: .1s;
  cursor: pointer;
  line-height: 1.2rem;
  user-select: none;
  font-size: small;
}
.CopyCodeButton:hover {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
</style>
