<template>
  <div style="max-height: 32px;" class="flex items-center">
    <el-switch
      v-model="contextMode"
      size="large"
      class="cursor-pointer"
      width="60"
      style="--el-switch-on-color: #3375b9; --el-switch-off-color: #854040;"
    />
  </div>
</template>

<script setup lang="ts">
const { contextMode } = useChat()
</script>
