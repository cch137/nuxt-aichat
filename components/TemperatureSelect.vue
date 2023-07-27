<template>
  <div>
    <el-input-number
      v-model="temperature"
      :min="0"
      :max="1"
      :step="0.1"
      style="width: 100%"
    />
  </div>
</template>

<script setup lang="ts">
const { temperature } = useChat()
</script>
