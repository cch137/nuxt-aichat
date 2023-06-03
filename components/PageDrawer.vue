<template>
  <el-drawer
    v-model="openDrawer"
    :title="$t('menu.title')"
    direction="ltr"
    style="min-width: 320px; max-width: 100vw;"
  >
    <ChatMenu />
  </el-drawer>
</template>

<script setup>
const { openDrawer } = useChat()
if (process.client) {
  if (!useDevice().isMobileScreen) {
    openDrawer.value = true
  }
}
</script>
