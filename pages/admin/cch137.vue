<template>
  <ClientOnly>
    <div class="flex-col flex-center gap-2">
      <h1>Admin Dashboard | {{appName}}</h1>
      <div class="flex gap-2 my-8">
        <el-input type="password" placeholder="Password" v-model="password"></el-input>
        <el-button type="primary" @click="adminAction">GO</el-button>
      </div>
      <div v-if="haveAccess" class="grid grid-cols-2 gap-2 p-4">
        <div class="flex items-center">Discord Bot</div>
        <div><el-switch size="large" v-model="dcBotConnected" :loading="dcBotIsLoading" @click="dcBotSwitch"/></div>
        <div class="flex items-center">MindsDB Connect Method</div>
        <el-select v-model="mdbConnectMethod" :loading="mdbIsLoading" @change="mdbConnMethodChanged">
          <el-option label="SQL" value="SQL" />
          <el-option label="WEB" value="WEB" />
        </el-select>
        <div class="flex items-center">Restart Clients</div>
        <div class="flex items-center">
          <el-button
            :loading="restartIsLoading"
            @click="restartClients"
            class="w-full"
          >RESTART</el-button>
        </div>
      </div>
      <div v-else>You do not have permission.</div>
      <div>
        <NuxtLink to="/">
          <el-button>
            Back to Home
          </el-button>
        </NuxtLink>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
const appName = useState('appName').value

const { haveAccess, password, dcBotConnected, mdbConnectMethod, adminAction } = useAdmin()

const dcBotIsLoading = ref(false)
const mdbIsLoading = ref(false)
const restartIsLoading = ref(false)

const dcBotSwitch = () => {
  adminAction(dcBotConnected.value ? 'DC1' : 'DC0', dcBotIsLoading)
}

const mdbConnMethodChanged = (value) => {
  adminAction(value === 'WEB' ? 'WEBCONN' : 'SQLCONN', mdbIsLoading)
}

const restartClients = () => {
  adminAction('RESTART', restartIsLoading)
}

useTitle(`Admin - ${appName}`)
definePageMeta({
  layout: 'default'
})
</script>
