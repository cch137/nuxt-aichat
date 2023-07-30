<template>
  <div class="InputBoxOuter flex fixed w-full z-40">
    <div :style="`min-width: ${openSidebar ? '280px' : '0px'}; width: ${openSidebar ? '25%' : '0px'}; transition: .1s;`"></div>
    <div class="InputBox pt-20 pb-1 px-2 flex-1">
      <el-form ref="inputForm" class="mx-auto max-w-full" @submit.prevent>
        <el-form-item style="margin: 0;">
          <div class="flex gap-3 w-full mx-auto justify-center px-2" style="max-width: 900px;">
            <div class="w-full">
              <el-input
                v-model="inputValue"
                :autosize="{ minRows: 2, maxRows: 16 }"
                type="textarea"
                size="large"
                :maxlength="model === 'gpt4' ? 4000 : 2000"
                :autofocus="true"
                @keydown="(evt) => keyboardSendMessage(evt as KeyboardEvent)"
              />
            </div>
            <div class="InputBoxActionButtonGroup flex flex-col gap-1">
              <el-button
                type="primary"
                @click="clickSendMessage"
                style="padding: 12px;"
                size="large"
              >
                <el-icon>
                  <Position />
                </el-icon>
                <span style="margin-left: .25rem;">
                  {{ $t('chat.send') }}
                </span>
              </el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="text-center mt-1" style="line-height: 1em;">
        <el-text type="info" size="small">
          {{ $t('footer.patient') }}
        </el-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Position } from '@element-plus/icons-vue'
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
html.light .InputBox {
  padding-top: 3rem !important;
  /* background: linear-gradient(180deg, transparent, transparent, rgba(255, 255, 255, 1), rgba(255, 255, 255)); */
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
