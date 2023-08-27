<template>
  <el-dialog v-model="isEditingQuestion" :title="$t('chat.editQues')" width="80%" style="max-width: 600px;">
    <div class="px-2 pb-4 flex flex-col gap-4">
      <el-input
        v-model="editingQuestionContent"
        :autosize="{ minRows: 4, maxRows: 16 }"
        type="textarea"
        size="large"
        class="EditQuestionInput"
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
import { Check, Close } from '@element-plus/icons-vue'
const { isEditingQuestion, editingQuestion, editingQuestionContent, inputMaxLength, updateMessage } = useChat()

function closeDialog () {
  isEditingQuestion.value = false
}

function keyboardSendMessage(evt: KeyboardEvent) {
  if (evt.key === 'Enter' && !evt.shiftKey) {
    saveAndSubmit()
    evt.preventDefault()
  }
}

async function saveAndSubmit () {
  if (editingQuestion.value === undefined) return;
  const inputContent = editingQuestionContent.value.trim()
  if (editingQuestion.value.Q !== inputContent) {
    editingQuestion.value.Q = inputContent
    updateMessage(editingQuestion.value)
  }
  setTimeout(() => closeDialog(), 0)
}
</script>

<style>
.EditQuestionInput textarea {
  font-size: 1rem;
  resize: none;
}
</style>