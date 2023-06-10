<template>
  <div>
    <el-select v-model="contextMode">
      <el-option :label="$t('settings.enable')" :value="true" />
      <el-option :label="$t('settings.disable')" :value="false" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
const { contextMode } = useChat()
</script>
