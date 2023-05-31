<template>
  <ClientOnly>
    <div class="flex-col flex-center">
      <h1>Welcome to Curva!</h1>
      <NuxtLink to="/c/">
        <el-button type="primary">
          New Chat
        </el-button>
      </NuxtLink>
    </div>
  </ClientOnly>
</template>

<script setup>
useTitle(`Home - ${useState('appName').value}`)
definePageMeta({
  layout: 'default'
})
</script>
