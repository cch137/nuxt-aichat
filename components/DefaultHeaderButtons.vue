<template>
  <div class="flex-center gap-2">
    <a href="https://discord.gg/5v49JKKmzJ" target="_blank">
      <el-button class="DefaultHeaderDCJoinButton" style="padding: 12px;">
        <DiscordIconSvg style="height: 24px; width: 24px;" />
        <span class="ml-2 DefaultHeaderDCJoinText">{{ $t('header.joinDc') }}</span>
      </el-button>
    </a>
    <AuthDropdown />
  </div>
</template>

<script setup>
</script>

<style>
@media screen and (max-width: 600px) {
  .DefaultHeaderDCJoinButton {
    padding: 12px 8px !important;
  }
  .DefaultHeaderDCJoinText {
    display: none;
  }
}
</style>
