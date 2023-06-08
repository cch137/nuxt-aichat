<template>
  <ClientOnly>
    <div class="flex w-full">
      <div :style="`min-width: ${openSidebar ? '280px' : '0px'}; width: ${openSidebar ? '25%' : '0px'}; transition: .3s;`"></div>
      <div class="flex-1 flex-center" :style="`max-width: ${openSidebar ? '75%' : '100%'}; transition: .3s;`">
        <div class="Messages pt-4 px-4 pb-10 mb-40">
          <div class="text-center my-4">
            <el-text type="info" size="large">{{ $t('chat.letsStart') }}</el-text>
          </div>
          <div
            v-for="message in messages"
            :key="message.text"
            class="p-1"
          >
            <div v-if="message.queries && message.queries.length > 0" class="mb-1 px-2">
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
            <div class="Message flex" :class="message.type">
              <div class="InnerMessage p-2">
                <div>
                  <span v-if="message.type === 'T'">
                    <span>Thinking</span>
                    <span>{{ loadingDots }}</span>
                  </span>
                  <span
                    v-else-if="message.type === 'A'"
                    v-html="marked.parse(message.text)"
                  />
                  <span v-else>{{ message.text }}</span>
                </div>
                <div v-if="message.type === 'A'" class="flex mt-2 gap-2">
                  <div class="flex-1 flex gap-2">
                    <el-text type="info" size="small">
                      <span class="flex gap-2">
                        <span>
                          {{ formatDate(message.t, 'yyyy/MM/dd HH:mm') }}
                        </span>
                        <span>
                          {{ message.dt === undefined ? '' : `Δt: ${Math.round(message.dt / 100) / 10}s` }}
                        </span>
                      </span>
                    </el-text>
                  </div>
                  <el-button-group class="ml-4">
                    <el-button
                      :icon="DocumentCopy"
                      size="small"
                      class="MessageActionButton"
                      plain
                      @click="useCopyToClipboard(message.text)"
                    >
                      {{ $t('action.copy') }}
                    </el-button>
                  </el-button-group>
                </div>
              </div>
            </div>
            <div v-if="message.urls && message.urls.length > 0" class="mt-1 flex flex-col items-start px-2">
              <el-link
              v-for="url in message.urls"
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
            <div v-if="message === messages.at(-1) && message.type === 'A' && message.more && message.more.length > 0" :key="message.more" class="flex flex-wrap items-center gap-2 mt-4">
              <el-icon size="x-large">
                <ChatDotRound />
              </el-icon>
              <el-button v-for="q in message.more" style="margin: 0;" @click="sendMessage(q)">
                {{ q }}
              </el-button>
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
import { DocumentCopy, ChatDotRound, Search, Paperclip } from '@element-plus/icons-vue'

const { messages, openSidebar, sendMessage } = useChat()

marked.setOptions({ headerIds: false, mangle: false })

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
.Messages {
  width: 100%;
  max-width: 960px;
}
.InnerMessage {
  max-width: 78%;
  border-radius: 0.5rem;
}
.InnerMessage a {
  word-break: break-all;
  text-decoration: underline;
}
.Messages code:not(pre code) {
  padding: .125rem .25rem;
  font-weight: bolder;
  opacity: .75;
}
.Messages code:not(pre code)::before,
.Messages code:not(pre code)::after {
  content: '`';
}
.Message.Q {
  justify-content: right;
}
.Message.Q .InnerMessage {
  background-color: #2A375B;
}
.Message.T,.Message.A {
  justify-content: left;
}
.Message.T .InnerMessage, .Message.A .InnerMessage {
  background-color: #3E3E3E;
}
.Message.Q .InnerMessage {
  white-space: pre-wrap;
}
.MessageActionButton {
  background: #ffffff0f !important;
}
.CodeBlockWrapper {
  margin: .5rem 0;
}
.CodeBlockHeader {
  width: 100%;
  background: #4f4f4f;
  opacity: 0.75;
  padding: .25rem .75rem;
  border-radius: .75rem .75rem 0 0;
}
.CodeBlockWrapper pre {
  background: #262626;
  color: lightgrey;
  padding: .75rem;
  border-radius: 0 0 .75rem .75rem;
  line-height: 1.25rem;
  white-space: pre-wrap;
  word-break: break-all;
}
.CopyCodeButton {
  padding: 0 .5rem;
  border: 1px solid grey;
  border-radius: .35rem;
  background: #787878;
  transition: .3s;
  cursor: pointer;
  line-height: 1.35rem;
  user-select: none;
}
.CopyCodeButton:hover {
  filter: brightness(1.125);
}
</style>
