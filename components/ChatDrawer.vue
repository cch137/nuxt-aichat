<template>
  <ClientOnly>
    <el-drawer
      v-model="openDrawer"
      :title="$t('menu.title')"
      direction="ltr"
      style="min-width: 320px; max-width: 100vw;"
    >
      <div style="margin-top: -1.5rem; height: calc(100% + 2.5rem);">
        <ChatMenu />
      </div>
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
    if (!useDevice().isTouchScreen) {
      setTimeout(() => {
        openMenu.value = true
      }, 0)
    }
  }
}
</script>
