<template>
  <el-dialog v-model="isEditingAnswer" :title="$t('chat.editAns')" width="80%" style="max-width: 600px;">
    <div class="px-2 pb-4 flex flex-col gap-4">
      <el-input
        v-model="editingAnswerContent"
        :autosize="{ minRows: 4, maxRows: 16 }"
        type="textarea"
        size="large"
        class="EditAnswerInput"
        :maxlength="inputMaxLength"
        :autofocus="true"
        @keydown="(evt) => keyboardSendMessage(evt as KeyboardEvent)"
      />
      <div class="flex items-center justify-end">
        <el-button @click="closeDialog()" :icon="Close">{{ $t('message.cancel') }}</el-button>
        <el-button @click="saveAndSubmit()" type="primary" :icon="Check">{{ $t('action.save') }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'
const { isEditingAnswer, editingAnswer, editingAnswerContent, inputMaxLength, updateMessage } = useChat()

function closeDialog () {
  isEditingAnswer.value = false
}

function keyboardSendMessage(evt: KeyboardEvent) {
  if (evt.key === 'Enter' && !evt.shiftKey) {
    saveAndSubmit()
    evt.preventDefault()
  }
}

async function saveAndSubmit () {
  if (editingAnswer.value === undefined) return;
  const inputContent = editingAnswerContent.value.trim()
  editingAnswer.value.A = inputContent
  updateMessage(editingAnswer.value)
  setTimeout(() => closeDialog(), 0)
}
</script>

<style>
.EditAnswerInput textarea {
  font-size: 1rem;
  resize: none;
}
</style>