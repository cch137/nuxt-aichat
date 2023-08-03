import { useLocalStorage } from "@vueuse/core"
import type { RemovableRef } from "@vueuse/core"
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import type { ChatbotUsageRecordItem } from '~/server/services/chatbots/curva/chatbotUsageRecord'

let adminStorage: RemovableRef<Record<string, any>>

const haveAccess = ref(false)
const adminPassword = ref('')
const adminStorageName = 'm'
const adminSettings = reactive({
  dcBotConnected: false
})

function savePassword () {
  adminStorage.value.k = adminPassword.value
}

function packAdminApiData (data: Record<string, any> = {}) {
  savePassword()
  return {
    passwd: adminPassword.value,
    ...data
  }
}

function saveSettings (settings: Record<string, any> | null) {
  if (null) {
    return
  }
  for (const key in settings) {
    // @ts-ignore
    adminSettings[key] = settings[key]
  }
}

async function checkAdminLogin () {
  const res = await $fetch('/api/admin/check', {
    method: 'POST',
    body: packAdminApiData()
  })
  if (res === null) {
    haveAccess.value = false
    ElMessage.error('Password incorrect')
  } else {
    haveAccess.value = true
    saveSettings(res)
    ElMessage.success('Logged in')
  }
}

async function changeSetting (name: string, value: any, loadingReactive?: Record<string, boolean>) {
  if (loadingReactive) {
    loadingReactive[name] = true
  }
  saveSettings(await $fetch('/api/admin/setting', {
    method: 'POST',
    body: packAdminApiData({ name, value })
  }))
  console.log(loadingReactive)
  if (loadingReactive) {
    loadingReactive[name] = false
  }
}

const curvaUsageList: ChatbotUsageRecordItem[] = reactive([])
async function updateCurvaUsageList () {
  const lastestList = await $fetch('/api/admin/data/curva-record', {
    method: 'POST',
    body: packAdminApiData()
  })
  if (!lastestList) {
    ElMessage.error('Curva usage record update failed')
    return
  }
  curvaUsageList.splice(0, curvaUsageList.length)
  curvaUsageList.push(...lastestList)
}

export default function () {
  adminStorage = useLocalStorage(adminStorageName, {})
  if (process.client) {
    adminPassword.value = adminStorage.value.k || ''
  }
  return {
    haveAccess,
    adminPassword,
    adminSettings,
    checkAdminLogin,
    changeSetting,
    curvaUsageList,
    updateCurvaUsageList,
  }
}
