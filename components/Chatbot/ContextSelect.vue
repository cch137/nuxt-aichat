<template>
  <div style="max-height: 32px;" class="flex items-center">
    <el-switch
      v-model="contextMode"
      size="large"
      class="cursor-pointer"
      width="56"
      :disabled="!isEnabled"
    />
  </div>
</template>

<script setup lang="ts">
const { contextMode, model, models } = useChat()
const isEnabled = computed(() => Boolean(models.find(m => m.value === model.value)?.isContextOptional))
</script>
