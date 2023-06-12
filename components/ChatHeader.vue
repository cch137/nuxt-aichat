<template>
  <div class="fixed z-50 w-full flex">
    <div :style="`min-width: ${openSidebar ? '280px' : '0px'}; width: ${openSidebar ? '25%' : '0px'}; transition: .1s;`"></div>
    <ChatSidebar />
    <div class="ChatHeader px-4 gap-4 flex items-stretch flex-1">
      <div :style="openSidebar ? 'opacity: 0; pointer-events: none; width: 0px;' : ''" style="transition: .1s;">
        <el-button style="padding: 8px;" @click="openMenu = !openMenu">
          <MenuIcon />
        </el-button>
      </div>
      <HomeLink :style="openSidebar ? 'opacity: 0; pointer-events: none; width: 0px;' : ''" />
      <div class="flex-1 flex items-center justify-end gap-2"></div>
      <div>
        <a href="https://discord.gg/5v49JKKmzJ" target="_blank">
          <el-button class="ChatHeaderDCJoinButton" style="padding: 12px;">
            <DiscordIconSvg style="height: 24px; width: 24px;" />
            <span class="ml-2 ChatHeaderDCJoinText">{{ $t('header.joinDc') }}</span>
          </el-button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const { openMenu, openSidebar } = useChat()
openMenu.value = true
</script>

<style>
.ChatHeader {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  min-height: 56px;
}
.ChatHeaderMenuButton i {
  transform: scale(1.25);
}
.ChatHeader > * {
  display: flex;
  align-items: center;
}
@media screen and (max-width: 600px) {
  .ChatHeaderDCJoinButton {
    padding: 12px 8px !important;
  }
  .ChatHeaderDCJoinText {
    display: none;
  }
}
</style>
