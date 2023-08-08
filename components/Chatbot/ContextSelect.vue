<template>
  <div style="max-height: 32px;" class="flex items-center">
    <el-switch
      v-model="contextMode"
      size="large"
      class="cursor-pointer"
      width="56"
    />
  </div>
</template>

<script setup lang="ts">
const { contextMode } = useChat()
</script>
