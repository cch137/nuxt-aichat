<template>
  <ClientOnly>
    <div class="flex-col flex-center gap-2">
      <h1>Curva Bot Control</h1>
      <div class="flex gap-2 my-8">
        <el-input type="password" placeholder="Password" v-model="passwd"></el-input>
        <el-button type="primary" @click="checkPasswd">GO</el-button>
      </div>
      <div v-if="haveAccess">
        <el-switch style="margin-top:8rem;transform:scale(4)" size="large" v-model="connected" :loading="isLoading" @click="dcBotSwitch"/>
      </div>
      <div v-else>You do not have permission.</div>
    </div>
  </ClientOnly>
</template>

<script setup>
const passwd = ref('')
const isLoading = ref(false)
useTitle(`DC Bot - ${useState('appName').value}`)
let haveAccess = ref(false)
const connected = ref(false)
const dcBotSwitch = () => {
  isLoading.value = true
  setTimeout(() => {
    $fetch('/api/discord', {
      method: 'POST',
      body: {
        passwd: passwd.value,
        action: connected.value ? 'CONN1' : 'CONN0'
      }
    })
      .then((res) => {
        haveAccess.value = res.pass
        connected.value = res.connected
      })
      .finally(() => {
        isLoading.value = false
      })
  }, 100)
}
const checkPasswd = () => {
  $fetch('/api/discord', {
    method: 'POST',
    body: { passwd: passwd.value }
  })
    .then((res) => {
      haveAccess.value = res.pass
      connected.value = res.connected
    })
}
definePageMeta({
  layout: 'default'
})
</script>
