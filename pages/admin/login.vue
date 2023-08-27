<template>
  <ClientOnly>
    <div class="flex-col flex-center gap-2">
      <h1>Admin Login | {{appName}}</h1>
      <div class="w-full max-w-xs">
        <el-input size="large" type="password" placeholder="Password" v-model="adminPassword" show-password></el-input>
        <div class="m-4" />
        <el-button size="large" type="primary" @click="goCheck" :loading="goIsLoading">LOGIN</el-button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const appName = useState('appName').value

const adminPassword = ref('')

const { checkIsLoggedIn } = useAdmin()

const goIsLoading = ref(false)
const goCheck = async () => {
  goIsLoading.value = true
  try {
    if (await checkIsLoggedIn(adminPassword.value)) {
      await useNuxtApp().$router.push('./dashboard')
    }
  } catch (err) {
    console.error(err)
  } finally {
    goIsLoading.value = false
  }
}

if (process.client) {
  goCheck()
}

useTitle(`Admin - ${appName}`)
definePageMeta({
  layout: 'default'
})
</script>
