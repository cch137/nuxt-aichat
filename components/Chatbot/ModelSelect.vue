<template>
  <div>
    <el-select
      v-model="model"
      placeholder="Select model"
      class="ChatbotModelSelect"
    >
      <el-option
        v-for="model in models"
        :key="model.name"
        :label="model.name"
        :value="model.value"
        :disabled="model.permissionLevel > authlvl"
        @click="() => model.permissionLevel > authlvl ? authlvlAlert(model.permissionLevel) : null"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
const { model, models } = useChat()
const { authlvl } = useAuth()

function checkModelIsAllow() {
  const authlvlNeeded = models.find(m => m.value === model.value)?.permissionLevel || 0
  if (authlvlNeeded > authlvl.value) {
    model.value = ''
    for (const _model of models) {
      if (_model.permissionLevel <= authlvl.value) {
        model.value = _model.value
        break
      }
    }
  }
}

function authlvlAlert(neededAuthlvl: number) {
  switch (neededAuthlvl) {
    case 1:
      ElMessage.info('You are not logged in.')
      break
    default:
      ElMessage.info('This action requires higher permission levels.')
      break
  }
}

if (process.client) {
  checkModelIsAllow()
  watch(authlvl, () => checkModelIsAllow())
  watch(model, () => checkModelIsAllow())
}
</script>
