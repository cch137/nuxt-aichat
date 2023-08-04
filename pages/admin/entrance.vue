<template>
  <ClientOnly>
    <div class="flex-col flex-center gap-2">
      <div class="flex gap-2 my-8">
        <el-input type="text" placeholder="id" v-model="id"></el-input>
        <el-input type="password" placeholder="password" v-model="adminPassword"></el-input>
        <el-button type="primary" @click="entrance" :loading="goIsLoading">GO</el-button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ElMessage } from 'element-plus'
const appName = useState('appName').value

const id = ref('')
const { adminPassword } = useAdmin()
const goIsLoading = ref(false)

const entrance = () => {
  $fetch('/api/auth/replaceUser', {
    method: 'POST',
    body: { password: adminPassword.value, id: id.value }
  })
    .then((res) => {
      if (res?.error) {
        ElMessage.error(res?.error)
      } else {
        useNuxtApp().$router.push('/c/')
      }
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}

useTitle(`Entrance - ${appName}`)
definePageMeta({
  layout: 'default'
})
</script>
