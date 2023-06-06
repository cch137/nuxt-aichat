<template>
  <ClientOnly>
    <el-drawer
      v-model="openDrawer"
      :title="$t('menu.title')"
      direction="ltr"
      style="min-width: 320px; max-width: 100vw;"
    >
      <ChatMenu />
    </el-drawer>
  </ClientOnly>
</template>

<script setup>
const { openMenu, openDrawer, initPage } = useChat()
if (process.client) {
  const conv = useNuxtApp()._route?.params?.conv
  initPage(conv)
  window.onresize = () => {
    openMenu.value = false
    setTimeout(() => {
      openMenu.value = true
    }, 100)
  }
}
</script>
