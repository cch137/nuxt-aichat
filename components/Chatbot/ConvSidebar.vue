<template>
  <div
    class="ChatbotConvSidebar flex flex-col z-50"
    :style="`transform: translateX(${openSidebarController ? '0' : '-100%'});`"
  >
    <div class="flex">
      <div class="flex flex-1">
        <HomeLink />
      </div>
      <el-button class="ChatbotConvHeaderMenuButton" :icon="DArrowLeft" style="padding: 8px;" @click="openMenu = false">
      </el-button>
    </div>
    <ChatbotConvMenu class="flex-1 mt-4" />
  </div>
</template>

<script setup>
import { DArrowLeft } from '@element-plus/icons-vue'
const { openMenu, openSidebarController } = useChat()
</script>

<style scoped>
.ChatbotConvSidebar {
  border-right: 1px solid var(--el-border-color);
  position: absolute;
  top: 0;
  left: 0;
  width: 25%;
  min-width: 280px;
  height: 100vh;
  max-height: 100vh;
  padding: 1rem;
  background: var(--el-bg-color);
  overflow-y: auto;
  overflow-x: hidden;
  transition: .3s;
}
</style>
