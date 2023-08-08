<template>
  <div class="w-full grid-pattern-bg" style="min-height: calc(100vh - 56px);">
    <ChatbotConvMain />
  </div>
</template>

<script setup>
useTitle(`Chat - ${useState('appName').value}`)
definePageMeta({
  layout: 'chat',
  middleware: ['chat']
})
</script>
