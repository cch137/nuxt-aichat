import { useLocalStorage } from "@vueuse/core"

const haveAccess = ref(false)
const adminPassword = ref('')
const adminStorageName = 'm'

const dcBotConnected = ref(false)
const mdbConnectMethod = ref('')

export default function () {
  const adminStorage = useLocalStorage(adminStorageName, {} as Record<string, any>)
  const savePassword = () => {
    adminStorage.value.k = adminPassword.value
  }
  if (process.client) {
    adminPassword.value = adminStorage.value.k || ''
  }
  const adminAction = (action: string, loading?: Ref) => {
    if (loading) {
      loading.value = true
    }
    savePassword()
    $fetch('/api/admin', {
      method: 'POST',
      body: {
        passwd: adminPassword.value,
        action
      }
    })
      .then((res) => {
        haveAccess.value = Boolean(res?.pass)
        if (res === null) { return }
        dcBotConnected.value = res.dcBotConnected
        mdbConnectMethod.value = res.mdbConnectMethod
      })
      .finally(() => {
        if (loading) {
          loading.value = false
        }
      })
  }
  return {
    haveAccess,
    dcBotConnected,
    mdbConnectMethod,
    adminAction,
    password: adminPassword
  }
}
