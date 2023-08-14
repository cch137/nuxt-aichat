<template>
  <div class="fixed z-50 w-full flex">
    <div :style="`min-width: ${openSidebar ? '280px' : '0px'}; width: ${openSidebar ? '25%' : '0px'}; transition: .1s;`"></div>
    <ChatbotConvSidebar />
    <ChatbotEditMessageDialog />
    <div class="ChatbotConvHeader px-4 gap-4 flex items-stretch flex-1">
      <div :style="openSidebar ? 'opacity: 0; pointer-events: none; width: 0px;' : ''" style="transition: .1s;">
        <el-button style="padding: 8px;" @click="openMenu = !openMenu">
          <MenuIcon />
        </el-button>
      </div>
      <HomeLink :style="openSidebar ? 'opacity: 0; pointer-events: none; width: 0px;' : ''" />
      <div class="flex-1 flex items-center justify-end gap-2"></div>
      <DefaultHeaderButtons />
    </div>
  </div>
</template>

<script setup>
const { openMenu, openSidebar } = useChat()
openMenu.value = true
</script>

<style>
.ChatbotConvHeader {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  min-height: 56px;
}
.ChatbotConvHeaderMenuButton i {
  transform: scale(1.25);
}
.ChatbotConvHeader > * {
  display: flex;
  align-items: center;
}
</style>
