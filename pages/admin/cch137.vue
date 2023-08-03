<template>
  <ClientOnly>
    <div class="flex-col flex-center gap-2">
      <h1>Admin Dashboard | {{appName}}</h1>
      <div class="flex gap-2">
        <NuxtLink to="/">
          <el-button size="small">Home</el-button>
        </NuxtLink>
        <el-input size="small" type="password" placeholder="Password" v-model="adminPassword"></el-input>
        <el-button size="small" type="primary" @click="goCheck" :loading="goIsLoading">GO</el-button>
      </div>
      <div v-if="haveAccess" class="w-full p-4">
        <h2 class="px-4">Settings</h2>
        <div class="grid grid-cols-2 gap-2 px-4" style="width: 320px">
          <div class="flex items-center">Discord Bot</div>
          <div>
            <el-switch
              size="large"
              v-model="adminSettings.dcBotConnected"
              :loading="loadings.dcBot"
              @change="(value) => changeSetting('dcBot', value, loadings)"
              style="height: 24px;"
            />
          </div>
        </div>
        <div class="px-4">
          <div class="flex items-end justify-end py-2">
            <h2 class="flex-1">Recent usage record</h2>
            <el-button
              @click="async () => { loadings.curvaUsageRecord = true; await updateCurvaUsageList(); loadings.curvaUsageRecord = false }"
              :icon="Refresh"
              :loading="loadings.curvaUsageRecord"
            >Refresh list</el-button>
          </div>
          <el-table :data="analysedCurvaUsageList" table-layout="auto">
            <el-table-column prop="user" label="user" width="180" />
            <el-table-column prop="times" label="times" width="90" />
          </el-table>
          <h3>Log</h3>
          <el-table :data="curvaUsageList" table-layout="auto">
            <el-table-column prop="t" label="t" :formatter="(item) => formatDate(new Date(item.t))" />
            <el-table-column prop="ip" label="ip" />
            <el-table-column prop="user" label="user" />
            <el-table-column prop="conv" label="conv" />
            <el-table-column prop="model" label="model" />
            <el-table-column prop="error" label="error" />
          </el-table>
        </div>
      </div>
      <div v-else>You do not have permission.</div>
      <div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'

const appName = useState('appName').value

const {
  haveAccess,
  adminPassword,
  adminSettings,
  checkAdminLogin,
  changeSetting,
  curvaUsageList,
  updateCurvaUsageList
} = useAdmin()

const loadings = reactive({
  curvaUsageRecord: false,
  dcBot: false,
})

const goIsLoading = ref(false)
const goCheck = async () => {
  goIsLoading.value = true
  await checkAdminLogin()
  goIsLoading.value = false
}


if (process.client) {
  (async () => {
    checkAdminLogin()
    updateCurvaUsageList()
  })()
}

const analysedCurvaUsageList: ({user: string, times: number})[] = reactive([])
watch(curvaUsageList, (value) => {
  analysedCurvaUsageList.splice(0, analysedCurvaUsageList.length)
  analysedCurvaUsageList.push(...[...new Set(value.map((item) => item.user))].map((user) => ({
    user,
    times: value.filter(i => i.user === user).length
  })))
})

useTitle(`Admin - ${appName}`)
definePageMeta({
  layout: 'default'
})
</script>
