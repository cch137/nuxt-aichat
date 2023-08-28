<template>
  <div>
    <el-input-number
      v-if="isEnabled"
      v-model="temperature"
      :min="0"
      :max="1"
      :step="0.1"
      style="width: 100%"
    />
    <el-input-number
      v-else
      style="width: 100%"
      disabled
    />
  </div>
</template>

<script setup lang="ts">
const { temperature, model, models } = useChat()
const isEnabled = computed(() => Boolean(models.find(m => m.value === model.value)?.isTemperatureOptional))
</script>
