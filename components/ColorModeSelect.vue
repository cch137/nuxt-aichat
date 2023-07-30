<template>
  <div>
    <el-switch
      v-model="isDark"
      inline-prompt
      :inactive-icon="Sunny"
      :active-icon="Moon"
      inactive-color="#afafaf"
      active-color="#3f3f3f"
    />
  </div>
</template>

<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'

const { $themes } = useNuxtApp()
const { isDark } = $themes

</script>
