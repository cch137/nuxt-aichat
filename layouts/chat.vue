<template>
  <ClientOnly>
    <ChatbotConvHeader />
  </ClientOnly>
  <div style="padding-top: 56px;" class="w-full">
    <slot />
    <ClientOnly>
      <ChatbotInputBox />
      <ChatbotConvDrawer />
    </ClientOnly>
  </div>
</template>

<script setup>
</script>
