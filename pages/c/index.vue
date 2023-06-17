<template>
  <div class="w-full">
    <ChatCore />
  </div>
</template>

<script setup>
useTitle(`New Chat - ${useState('appName').value}`)
definePageMeta({
  layout: 'chat',
  middleware: ['chat']
})
</script>
