<template>
  <div class="w-full grid-pattern-bg" style="min-height: calc(100vh - 56px);">
    <ChatbotConvMain />
  </div>
</template>

<script setup>
const i18n = useLocale()
const _t = i18n.t
useTitle(`${_t('chat.newChat')} - ${useState('appName').value}`)
definePageMeta({
  layout: 'chat',
  middleware: ['auto-redirector', 'chat']
})
</script>
