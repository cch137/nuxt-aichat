<template>
  <div class="w-full">
    <ChatCore />
  </div>
</template>

<script setup>
useTitle(`Chat - ${useState('appName').value}`)
definePageMeta({
  layout: 'chat'
})
</script>
