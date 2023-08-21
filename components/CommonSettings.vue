<template>
  <div class="flex flex-col gap-2">
    <ClientOnly>
      <div class="flex flex-col gap-1">
        <div>
          <el-text size="large">{{ $t('settings.lang') }}</el-text>
        </div>
        <div>
          <ChatbotLanguageSelect />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <div>
          <el-text size="large">{{ $t('settings.theme') }}</el-text>
        </div>
        <div>
          <ColorModeSelect />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
</script>