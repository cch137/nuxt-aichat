<template>
  <ClientOnly>
    <div class="mx-auto Messages pt-4 px-4 pb-10 mb-40">
      <div class="text-center my-4">
        <el-text type="info" size="large">{{ $t('Let\'s start!') }}</el-text>
      </div>
      <div
        v-for="message in messages"
        :key="message.text"
        :class="message.type"
        class="Message flex p-1"
      >
        <el-tooltip
          effect="light"
          :content="formatDate(message.t, 'yyyy/MM/dd HH:mm')"
          :placement="message.type === 'Q' ? 'left' : 'right'"
        >
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
            <div v-if="message.type === 'A'" class="flex mt-2 justify-end">
              <el-button
                :icon="DocumentCopy"
                size="small"
                class="CopyAnswerButton"
                plain
                @click="useCopyToClipboard(message.text)"
              >{{ $t('action.copy') }}</el-button>
            </div>
          </div>
        </el-tooltip>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { marked } from 'marked'
import formatDate from '~/utils/formatDate'
import { DocumentCopy } from '@element-plus/icons-vue'

marked.setOptions({ headerIds: false, mangle: false })

const loadingDots = ref('.')

setInterval(() => {
  if (loadingDots.value.length < 4) {
    loadingDots.value += '.'
  } else {
    loadingDots.value = '.'
  }
}, 500)

const messages = useState('messages', () => [])
</script>

<style>
.Messages {
  width: 960px;
  max-width: 100%;
}
.InnerMessage {
  max-width: 75%;
  border-radius: 0.5rem;
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
.CopyAnswerButton {
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
  white-space: pre-wrap;
  background: #262626;
  color: lightgrey;
  padding: .75rem;
  border-radius: 0 0 .75rem .75rem;
  line-height: 1.25rem;
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
