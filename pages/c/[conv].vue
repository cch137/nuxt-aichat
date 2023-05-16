<template>
  <div>
    <ChatCore />
  </div>
</template>

<script setup>
useHead({
  title: `Chat - ${useState('appName').value}`
})
definePageMeta({
  layout: 'chat'
})
</script>
