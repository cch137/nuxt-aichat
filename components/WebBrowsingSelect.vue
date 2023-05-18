<template>
  <div>
    <el-select v-model="webBrowsingMode">
      <el-option :label="$t('settings.on')" value="ON" />
      <el-option :label="$t('settings.off')" value="OFF" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
const { webBrowsingMode } = useChat()
</script>
