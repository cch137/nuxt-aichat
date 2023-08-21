<template>
  <ClientOnly>
    <el-drawer
      v-model="openDrawerController"
      :title="$t('menu.title')"
      direction="ltr"
      style="min-width: 320px; max-width: 100vw;"
    >
      <div style="margin-top: -1.5rem; height: calc(100% + 1.5rem);">
        <ChatbotConvMenu />
      </div>
    </el-drawer>
  </ClientOnly>
</template>

<script setup>
const { openDrawerController } = useChat()
</script>
