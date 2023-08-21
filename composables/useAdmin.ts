import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

export default function () {
  async function checkIsLoggedIn (passwd = '') {
    return (await $fetch('/api/admin/check', {
      method: 'POST',
      body: { passwd }
    })).isLoggedIn
  }

  async function adminLogout () {
    await $fetch('/api/admin/check', {
      method: 'DELETE',
    })
    navigateTo('/')
  }

  return {
    checkIsLoggedIn,
    adminLogout
  }
}
