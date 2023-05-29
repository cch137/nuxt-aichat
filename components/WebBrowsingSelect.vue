<template>
  <div>
    <el-select v-model="webBrowsingMode" style="width: 96%;">
      <el-option :label="$t('settings.off')" value="OFF" />
      <el-option :label="$t('settings.basic')" value="BASIC" />
      <el-option :label="$t('settings.advanced')" value="ADVANCED" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
const { webBrowsingMode } = useChat()
</script>
