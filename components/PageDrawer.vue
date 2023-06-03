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
const { openSidebar, initPage } = useChat()
const openDrawer = ref(openSidebar.value)
watch(openSidebar, (newValue) => {
  openDrawer.value = useDevice().isMobileScreen ? newValue : false
})
watch(openDrawer, (newValue) => {
  if (openSidebar.value != newValue) {
    openSidebar.value = newValue
  }
})
if (process.client) {
  const conv = useNuxtApp()._route?.params?.conv
  initPage(conv)
}
</script>
