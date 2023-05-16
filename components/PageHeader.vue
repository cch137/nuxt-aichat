<template>
  <el-affix>
    <div class="PageHeader w-full px-4 gap-4 flex items-stretch">
      <div>
        <el-button style="padding: 8px;" @click="openDrawer = true">
          <MenuIcon />
        </el-button>
      </div>
      <div class="text-2xl font-medium">
        {{ appName }}
      </div>
      <div class="flex-1"></div>
      <ModelSelect />
      <div>
        <a href="https://discord.gg/5v49JKKmzJ" target="_blank">
          <el-button class="DiscordButton">
            <DiscordIconSvg style="height: 24px; width: 24px;" />
            <span class="ml-2 DCJoinText">Join</span>
          </el-button>
        </a>
      </div>
    </div>
  </el-affix>
</template>

<script setup>
const openDrawer = useState('openDrawer', () => false)
const appName = useState('appName')
</script>

<style scoped>
.PageHeader {
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  min-height: 56px;
}
.PageHeader > * {
  display: flex;
  align-items: center;
}
.DiscordButton {
  padding: 8px !important;
}
@media screen and (max-width: 500px) {
  .DCJoinText {
    display: none;
  }
}
</style>
