<template>
  <el-dialog v-model="openSettings" :title="$t('settings.title')" width="80%" style="max-width: 600px;">
    <div class="px-2 pb-4">
      <CommonSettings />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
const { openSettings } = useSettings()
</script>