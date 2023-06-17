<template>
  <div class="fixed z-50 w-full flex">
    <div class="DefaultHeader px-4 gap-4 flex items-stretch flex-1">
      <HomeLink />
      <div class="flex-1 flex items-center justify-end gap-2"></div>
      <div>
        <a href="https://discord.gg/5v49JKKmzJ" target="_blank">
          <el-button class="DefaultHeaderDCJoinButton" style="padding: 12px;">
            <DiscordIconSvg style="height: 24px; width: 24px;" />
            <span class="ml-2 DefaultHeaderDCJoinText">{{ $t('header.joinDc') }}</span>
          </el-button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const { openMenu } = useChat()
openMenu.value = true
</script>

<style>
.DefaultHeader {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  min-height: 56px;
}
.DefaultHeader > * {
  display: flex;
  align-items: center;
}
@media screen and (max-width: 600px) {
  .DefaultHeaderDCJoinButton {
    padding: 12px 8px !important;
  }
  .DefaultHeaderDCJoinText {
    display: none;
  }
}
</style>
