const haveAccess = ref(false)
const adminPassword = ref('')
const adminPasswordCookieName = 'm'

const dcBotConnected = ref(false)
const mdbConnectMethod = ref('')

export default function () {
  const cookie = useUniCookie()
  adminPassword.value = cookie.get(adminPasswordCookieName) || ''
  const savePassword = () => {
    cookie.set(adminPasswordCookieName, adminPassword.value, {
      path: '/',
      secure: true,
      sameSite: true
    })
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
