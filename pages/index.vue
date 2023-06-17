<template>
  <ClientOnly>
    <div class="flex-col flex-center">
      <h1>Welcome to {{ appName }}</h1>
      <NuxtLink to="/c/">
        <el-button type="primary">
          New Chat
        </el-button>
      </NuxtLink>
    </div>
  </ClientOnly>
</template>

<script setup>
const appName = useState('appName').value
useTitle(`Home - ${appName}`)
definePageMeta({
  layout: 'default'
})
</script>
