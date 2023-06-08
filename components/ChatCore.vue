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
              <el-text class="flex justify-start items-center">
                <el-icon size="large" style="transform: scale(0.9);">
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
                <div v-if="message.type === 'A'" class="flex mt-2 gap-4">
                  <div class="flex-1">
                    <el-text type="info" size="small" class="opacity-75">
                      {{ formatDate(message.t, 'yyyy/MM/dd HH:mm') }}
                    </el-text>
                  </div>
                  <el-button
                    :icon="DocumentCopy"
                    size="small"
                    class="MessageActionButton"
                    plain
                    @click="useCopyToClipboard(message.text)"
                  >{{ $t('action.copy') }}</el-button>
                </div>
              </div>
            </div>
            <div v-if="message.urls && message.urls.length > 0" class="mt-1 flex flex-col items-start px-2">
              <el-link v-for="url in message.urls" type="info" :href="url.split(' ').pop()" target="_blank" class="flex justify-start items-center">
                <el-icon size="large" style="transform: scale(0.9);">
                  <Paperclip />
                </el-icon>
                <span class="ml-1">{{ url.split(' ').slice(0, url.split(' ').length - 1).join(' ') || url.split(' ')[0] }}</span>
              </el-link>
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
import { DocumentCopy, Search, Paperclip } from '@element-plus/icons-vue'

const { messages, openSidebar } = useChat()

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
