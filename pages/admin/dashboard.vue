<template>
  <div class="flex-col flex-center gap-2">
    <h1>Admin Dashboard | {{appName}}</h1>
    <h2>Discord Bot</h2>
    <el-switch
      v-model="dcBotConnected"
      @change="updateDcBotConnected()"
      :loading="dcBotConnectedIsLoading"
      size="large"
    >
    </el-switch>
    <h2>Search Engine</h2>
    <el-select
      v-model="searchEngine"
      placeholder="Select"
      @change="(value) => searchEngineOnchange(value)"
    >
      <el-option
        v-for="item in searchEngineOptions"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { AvailableSearchEngine } from '~/server/services/webBrowsing/search'

const dcBotConnectedIsLoading = ref(false)
const dcBotConnected = ref(false)
async function updateDcBotConnected () {
  dcBotConnectedIsLoading.value = true
  await $fetch('/api/admin/setting', { method: 'POST', body: { name: 'dcBot', value: dcBotConnected.value } })
  refreshDcBotConnected()
}
async function refreshDcBotConnected () {
  dcBotConnectedIsLoading.value = true
  dcBotConnected.value = (await $fetch('/api/discord', { method: 'GET' })).connected
  dcBotConnectedIsLoading.value = false
}
if (process.client) {
  refreshDcBotConnected()
}


const searchEngine = ref<AvailableSearchEngine>('google')
const searchEngineOptions = ref<AvailableSearchEngine[]>(['google', 'duckduckgo', 'all'])
if (process.client) {
  $fetch('/api/admin/search-engine', { method: 'GET' })
    .then((se) => {
      // @ts-ignore
      const { error, value } = se
      if (error) throw error
      searchEngine.value = value
    })
    .catch(() => {
      ElMessage.error('Fetching search engine failed.')
      // @ts-ignore
      searchEngine.value = ''
    })
}
function searchEngineOnchange (value: AvailableSearchEngine) {
  $fetch('/api/admin/search-engine', { method: 'POST', body: { value } })
    .then(() => ElMessage.success('Search engine has been changed.'))
    .catch(() => ElMessage.error('Search engine change failed.'))
}

const appName = useState('appName').value

useTitle(`Admin - ${appName}`)
definePageMeta({
  layout: 'default',
  middleware: ['only-admin-auth']
})
</script>
