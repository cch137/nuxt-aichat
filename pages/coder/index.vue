<template>
  <div class="w-full" style="height: calc(100vh - 56px);">
    <ClientOnly>
      <CoderMainPanel />
    </ClientOnly>
  </div>
</template>

<script setup>
useTitle(`Home - ${useState('appName').value}`)
definePageMeta({
  layout: 'default',
  middleware: ['auto-redirector']
})
</script>
