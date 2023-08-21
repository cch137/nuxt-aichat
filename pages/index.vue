<template>
  <div class="flex-col flex-center">
    <h1>{{ $t('chat.welcomeTo') }} {{ appName }}</h1>
    <NuxtLink to="/c/" class="m-8">
      <el-button type="primary">
        {{ $t('chat.newChat') }}
      </el-button>
    </NuxtLink>
  </div>
</template>

<script setup>
const appName = useState('appName').value
useTitle(`Home - ${appName}`)
definePageMeta({
  layout: 'default'
})
</script>
