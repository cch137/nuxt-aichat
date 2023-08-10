<template>
  <el-dialog v-model="isEditingMessage" title="Edit Question" width="80%" style="max-width: 600px;">
    <div class="px-2 pb-4 flex flex-col gap-4">
      <el-input
        v-model="editingMessageContent"
        :autosize="{ minRows: 4, maxRows: 16 }"
        type="textarea"
        size="large"
        class="EditMessageInput"
        :maxlength="inputMaxLength"
        :autofocus="true"
        @keydown="(evt) => keyboardSendMessage(evt as KeyboardEvent)"
      />
      <div class="flex items-center justify-end">
        <el-button @click="closeDialog()" :icon="Close">Cancel</el-button>
        <el-button @click="saveAndSubmit()" type="primary" :icon="Check">Save & Submit</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'
const { isEditingMessage, editingMessage, editingMessageContent, inputMaxLength,
  focusEditMessageInput, sendMessage } = useChat()

function closeDialog () {
  isEditingMessage.value = false
}

function keyboardSendMessage(evt: KeyboardEvent) {
  if (evt.key === 'Enter' && !evt.shiftKey) {
    saveAndSubmit()
    evt.preventDefault()
  }
}

async function saveAndSubmit () {
  if (editingMessage.value === undefined) {
    return
  }
  const resubmitQuestion = editingMessageContent.value.trim()
  try {
    if (resubmitQuestion === '') {
      await ElMessageBox.confirm('Do you want to continue generating answer based on the conversation history?')
    }
  } catch {
    closeDialog()
    return
  }
  const timeout = setTimeout(() => {
    if (editingMessage.value !== undefined) {
      editingMessage.value.Q = resubmitQuestion
    }
    closeDialog()
  }, 100)
  const success = await sendMessage(resubmitQuestion, editingMessage.value.id)
  if (success) {
    return
  }
  clearTimeout(timeout)
  focusEditMessageInput()
}
</script>

<style>
.EditMessageInput textarea {
  font-size: 1rem;
  resize: none;
}
</style>