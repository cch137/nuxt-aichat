<template>
  <div class="fixed z-50 w-full flex">
    <div class="DefaultHeader px-4 gap-2 flex items-stretch flex-1">
      <HomeLink />
      <div class="flex-1 flex items-center justify-end gap-2"></div>
      <DefaultHeaderButtons />
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
</style>
