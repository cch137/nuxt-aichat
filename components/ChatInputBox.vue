<template>
  <div class="InputBoxOuter flex fixed w-full">
    <div :style="`min-width: ${openSidebar ? '280px' : '0px'}; width: ${openSidebar ? '25%' : '0px'}; transition: .3s;`"></div>
    <div class="InputBox pt-20 pb-2 px-4 flex-1">
      <el-form ref="inputForm" class="mx-auto mb-2 max-w-full" @submit.prevent>
        <el-form-item style="margin: 0;">
          <div class="flex gap-3 w-full">
            <div class="w-full">
              <el-input
                v-model="inputValue"
                :autosize="{ minRows: 2, maxRows: 16 }"
                type="textarea"
                size="large"
                :maxlength="model === 'gpt4' ? 4096 : 2048"
                :autofocus="true"
                @keydown="(evt) => keyboardSendMessage(evt as KeyboardEvent)"
              />
            </div>
            <div class="InputBoxActionButtonGroup flex flex-col gap-1">
              <el-button
                type="primary"
                size="large"
                @click="clickSendMessage"
              >
                {{ $t('chat.send') }}
              </el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-text type="info">
          {{ $t('footer.patient') }}
        </el-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { model, sendMessage, focusInput, openSidebar, inputValue } = useChat()

const keyboardSendMessage = (evt: KeyboardEvent) => {
  if (evt.key === 'Enter' && !evt.shiftKey) {
    sendMessage()
    evt.preventDefault()
    focusInput()
  }
}

const clickSendMessage = () => {
  sendMessage()
  focusInput()
}
</script>

<style>
.InputBoxOuter {
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
.InputBox {
  background: linear-gradient(180deg, transparent, var(--el-bg-color) 58.85%);
}
.InputBox form {
  width: 100%;
}
.InputBox textarea {
  font-size: 1rem;
  resize: none;
}
.DeleteButton {
  padding: 12px !important;
}
.DeleteButton i {
  transform: scale(1.25);
}
.InputBoxActionButtonGroup {
  max-height: 1px;
  overflow: visible;
}
@media screen and (max-width: 600px) {
  .InputBoxActionButtonGroup {
    max-height: fit-content;
  }
}
</style>
