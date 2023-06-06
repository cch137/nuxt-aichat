<template>
  <ClientOnly>
    <ChatHeader />
  </ClientOnly>
  <div style="padding-top: 56px;" class="w-full">
    <slot />
    <ClientOnly>
      <ChatInputBox />
      <ChatDrawer />
    </ClientOnly>
  </div>
</template>

<script setup>
</script>
