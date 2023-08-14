<template>
  <ClientOnly>
    <el-drawer
      v-model="openDrawer"
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
const { openMenu, openDrawer } = useChat()
if (process.client) {
  let winWidth = window.innerWidth
  window.onresize = () => {
    const currWinWidth = window.innerWidth
    if (currWinWidth === winWidth) {
      return
    }
    winWidth = currWinWidth
    openMenu.value = false
    if (!useDevice().isTouchScreen) {
      setTimeout(() => {
        openMenu.value = true
      }, 0)
    }
  }
}
</script>
