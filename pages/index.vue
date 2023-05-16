<template>
  <ClientOnly>
    <div class="mx-auto Messages pt-4 px-4 pb-20 mb-20">
      <div class="text-center my-4">
        <el-text type="info" size="large">Let's start!</el-text>
      </div>
      <div
        v-for="message in messages"
        :key="message.text"
        :class="message.type"
        class="Message flex p-1"
      >
        <el-tooltip
          effect="light"
          :content="formatDate(message.t, 'HH:mm')"
          :placement="message.type === 'Q' ? 'left' : 'right'"
        >
          <div class="InnerMessage p-2">
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
        </el-tooltip>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { marked } from 'marked'
import formatDate from '~/utils/formatDate'

const loadingDots = ref('.')

setInterval(() => {
  if (loadingDots.value.length < 4) {
    loadingDots.value += '.'
  } else {
    loadingDots.value = '.'
  }
}, 500)

const messages = useState('messages', () => [])

useHead({
  title: `Chat - ${useState('appName').value}`
})
definePageMeta({
  layout: 'chat'
})
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
.Message.Q {
  justify-content: right;
}
.Message.Q .InnerMessage {
  background-color: #2A375B;
}
.Message.T,.Message.A {
  justify-content: left;
}
.Message.T .InnerMessage,.Message.A .InnerMessage {
  background-color: #3E3E3E;
}
.Message pre {
  white-space: pre-wrap;
  background: #0000004f;
  color: lightgrey;
  padding: .25rem .5rem;
  border-radius: .5rem;
}
</style>
