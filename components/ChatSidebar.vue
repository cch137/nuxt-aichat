<template>
  <div
    class="ChatSidebar h-full z-50"
    :style="`transform: translateX(${openSidebar ? '0' : '-100%'});`"
  >
    <div class="flex">
      <div class="flex flex-1">
        <HomeLink />
      </div>
      <el-button class="ChatHeaderMenuButton" :icon="DArrowLeft" style="padding: 8px;" @click="openSidebar = false">
      </el-button>
    </div>
    <ChatMenu />
  </div>
</template>

<script setup>
import { DArrowLeft } from '@element-plus/icons-vue'
const { openSidebar } = useChat()
</script>

<style scoped>
.ChatSidebar {
  border-right: 1px solid var(--el-border-color);
  position: absolute;
  top: 0;
  left: 0;
  width: 25%;
  min-width: 280px;
  height: 100vh;
  padding: 1rem 1rem 4rem;
  background: var(--el-bg-color);
  overflow-y: auto;
  overflow-x: hidden;
  transition: .3s;
}
</style>
